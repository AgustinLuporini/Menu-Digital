"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

// --- TIPOS ---
type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_id: string;
  is_active: boolean;
};

type Category = {
  id: string;
  name: string;
};

type ModalType = 'PRODUCT' | 'CATEGORY' | 'WIFI'; // Agregamos WIFI

export default function AdminContent({ initialProducts, categories: initialCategories }: { initialProducts: Product[], categories: Category[] }) {
  const router = useRouter();
  
  // --- ESTADOS ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(initialCategories);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType>('PRODUCT');
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados de Edición
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
  const [currentCategory, setCurrentCategory] = useState<Partial<Category>>({});
  const [isEditing, setIsEditing] = useState(false);

  // Estado WiFi
  const [wifiSettings, setWifiSettings] = useState({ ssid: '', password: '' });
  const [settingsId, setSettingsId] = useState<string | null>(null); // <--- NUEVO: Para guardar el UUID

  // Imágenes
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // --- SEGURIDAD Y CARGA INICIAL ---
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) router.push("/login");
      else setIsAuthenticated(true);
    };
    checkUser();
    
    // Cargar configuración de WiFi al iniciar
    const fetchSettings = async () => {
        // Buscamos la PRIMERA fila que encontremos (limit 1)
        const { data } = await supabase.from('restaurant_settings').select('*').limit(1).single();
        
        if (data) {
            setWifiSettings({ ssid: data.wifi_ssid || '', password: data.wifi_password || '' });
            setSettingsId(data.id); // <--- Guardamos el UUID para saber que ya existe
        }
    };
    fetchSettings();

  }, [router]);

  if (!isAuthenticated) return null;

  // --- LÓGICA DE DATOS ---
  const refreshData = async () => {
    const { data: pData } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    const { data: cData } = await supabase.from('categories').select('*').order('sort_order', { ascending: true });
    
    if (pData) setProducts(pData as Product[]);
    if (cData) setCategories(cData as Category[]);
    router.refresh();
  };

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategoryId ? p.category_id === selectedCategoryId : true;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleToggleActive = async (product: Product) => {
    const newStatus = !product.is_active;
    setProducts(products.map(p => p.id === product.id ? { ...p, is_active: newStatus } : p));
    await supabase.from('products').update({ is_active: newStatus }).eq('id', product.id);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("¿Borrar este producto?")) return;
    setProducts(products.filter(p => p.id !== id));
    await supabase.from('products').delete().eq('id', id);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  // --- IMÁGENES ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setSelectedImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from('menu-images').upload(fileName, file);
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from('menu-images').getPublicUrl(fileName);
    return data.publicUrl;
  };

  // --- APERTURA DE MODALES ---
  const openProductModal = (product?: Product) => {
    setModalType('PRODUCT');
    setSelectedImageFile(null);
    if (product) {
      setIsEditing(true);
      setCurrentProduct(product);
      setImagePreview(product.image_url);
    } else {
      setIsEditing(false);
      setCurrentProduct({ name: "", description: "", price: 0, image_url: "", category_id: selectedCategoryId || categories[0]?.id || "", is_active: true });
      setImagePreview(null);
    }
    setIsModalOpen(true);
  };

  const openCategoryModal = () => {
    setModalType('CATEGORY');
    setIsEditing(false);
    setCurrentCategory({ name: "" });
    setIsModalOpen(true);
  };

  const openWifiModal = () => {
    setModalType('WIFI');
    // Ya tenemos el estado wifiSettings cargado del useEffect, no hace falta resetearlo
    setIsModalOpen(true);
  };

  // --- GUARDAR (SAVE) ---
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
        if (modalType === 'PRODUCT') {
            // Lógica Producto
            if (selectedImageFile && selectedImageFile.size > 10 * 1024 * 1024) { 
                alert("Imagen muy pesada (Max 10MB)"); setIsLoading(false); return; 
            }
            let finalImageUrl = currentProduct.image_url;
            if (selectedImageFile) {
                try { finalImageUrl = await uploadImage(selectedImageFile); } 
                catch { alert("Error al subir imagen"); setIsLoading(false); return; }
            }
            if (!finalImageUrl) finalImageUrl = "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=300&q=80";

            if (isEditing && currentProduct.id) {
                await supabase.from('products').update({ ...currentProduct, image_url: finalImageUrl }).eq('id', currentProduct.id);
            } else {
                await supabase.from('products').insert([{ ...currentProduct, image_url: finalImageUrl, is_active: true }]);
            }
        } else if (modalType === 'CATEGORY') {
            // Lógica Categoría
            await supabase.from('categories').insert([{ name: currentCategory.name, slug: currentCategory.name?.toLowerCase().replace(/ /g, '-'), sort_order: categories.length + 1 }]);
        } else if (modalType === 'WIFI') {
            // Lógica WiFi (Actualizamos siempre la fila con ID 1, o la primera que encuentre)
            // Nota: En la tabla SQL creamos una fila inicial, así que usamos UPDATE.
            // Para hacerlo robusto, hacemos un update general ya que solo hay 1 fila.
            // O mejor, buscamos el ID 1.
if (settingsId) {
                // CASO 1: YA EXISTE -> ACTUALIZAMOS usando el UUID guardado
                const { error } = await supabase
                    .from('restaurant_settings')
                    .update({ 
                        wifi_ssid: wifiSettings.ssid, 
                        wifi_password: wifiSettings.password 
                    })
                    .eq('id', settingsId); // Usamos el UUID real, no un 1 hardcodeado
                if (error) throw error;
            } else {
                // CASO 2: NO EXISTE -> CREAMOS (Insert)
                const { data, error } = await supabase
                    .from('restaurant_settings')
                    .insert([{ 
                        wifi_ssid: wifiSettings.ssid, 
                        wifi_password: wifiSettings.password 
                    }])
                    .select()
                    .single(); // Pedimos que nos devuelva el dato creado
                
                if (error) throw error;
                
                // Guardamos el nuevo ID por si el usuario quiere editar de nuevo sin recargar
                if (data) setSettingsId(data.id);
            }
        }

        await refreshData();
        setIsModalOpen(false);
    } catch (error) {
        console.error(error);
        alert("Error al guardar");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col min-h-screen bg-[#0f0f0f] text-white font-display pb-20 md:pb-0">
      
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-4 md:px-8 py-4 md:py-6 border-b border-white/5 bg-[#1A1A1A]/50 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="bg-primary size-8 md:size-10 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-white text-xl md:text-2xl font-bold">nightlife</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg md:text-xl font-black leading-none tracking-tight">CLUB CHEKA</h1>
            <p className="text-[10px] md:text-xs text-slate-400 font-medium uppercase tracking-widest mt-1">Admin Panel</p>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
            <button onClick={handleLogout} className="md:hidden size-10 flex items-center justify-center bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors">
                <span className="material-symbols-outlined">logout</span>
            </button>
            <button onClick={handleLogout} className="hidden md:flex items-center gap-3 p-2 pr-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all group">
                <div className="size-8 rounded-full bg-cover bg-center bg-slate-700" style={{backgroundImage: "url('https://ui-avatars.com/api/?name=Admin&background=137fec&color=fff')"}}></div>
                <span className="text-sm font-bold text-slate-300 group-hover:text-white">Cerrar Sesión</span>
                <span className="material-symbols-outlined text-slate-400 text-xl group-hover:text-red-400">logout</span>
            </button>
        </div>
      </nav>

      <main className="flex-1 flex flex-col px-4 md:px-8 pb-12 w-full max-w-7xl mx-auto mt-4 md:mt-8">
        
        {/* HEADER RESPONSIVE */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6 mb-6 md:mb-10">
          <div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">Productos</h2>
            <p className="text-slate-400 text-sm md:text-lg mt-1 md:mt-2">Administra tu carta digital.</p>
          </div>
          
          <div className="flex gap-2 md:gap-3">
            
            {/* BOTÓN WIFI */}
            {/* En Móvil: Solo ícono (cuadrado). En Desktop: Rectángulo con texto */}
            <button 
                onClick={openWifiModal} 
                className="flex items-center justify-center gap-2 px-3 md:px-4 py-3 bg-[#1A1A1A] border border-white/10 text-white rounded-xl md:rounded-full font-bold text-sm hover:bg-white/5 transition-all text-slate-300 hover:text-primary"
                title="Configurar WiFi"
            >
                <span className="material-symbols-outlined text-lg">wifi</span>
                <span className="hidden md:inline whitespace-nowrap">WiFi</span>
            </button>

            {/* BOTÓN NUEVA CATEGORÍA */}
            <button onClick={openCategoryModal} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-[#1A1A1A] border border-white/10 text-white rounded-xl md:rounded-full font-bold text-sm hover:bg-white/5 transition-all">
                <span className="material-symbols-outlined text-lg">add</span>
                <span className="whitespace-nowrap">Categoría</span>
            </button>
            
            {/* BOTÓN NUEVO PRODUCTO */}
            <button onClick={() => openProductModal()} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl md:rounded-full font-bold shadow-xl shadow-primary/30 text-sm hover:scale-105 transition-all">
                <span className="material-symbols-outlined text-lg">add</span>
                <span>Nuevo</span>
            </button>
          </div>
        </header>

        {/* BÚSQUEDA Y FILTROS */}
        <section className="flex flex-col gap-4 md:gap-8 mb-6 md:mb-10 w-full">
          <div className="w-full relative group">
             <span className="absolute inset-y-0 left-0 flex items-center pl-4 md:pl-5 text-slate-500">
                <span className="material-symbols-outlined text-xl md:text-2xl">search</span>
             </span>
             <input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#1A1A1A] border-none rounded-2xl md:rounded-3xl py-3 md:py-5 pl-12 md:pl-14 pr-6 focus:ring-2 focus:ring-primary text-sm md:text-base text-white placeholder:text-slate-500 transition-all" 
                placeholder="Buscar productos..." 
                type="text"
             />
          </div>

          <div className="flex gap-2 md:gap-4 overflow-x-auto pb-2 hide-scrollbar">
            <button onClick={() => setSelectedCategoryId(null)} className={`px-4 md:px-8 py-2 md:py-3 rounded-full text-xs md:text-sm font-bold whitespace-nowrap transition-all border ${selectedCategoryId === null ? "bg-primary border-primary text-white" : "bg-transparent border-white/10 text-slate-400"}`}>Todos</button>
            {categories.map(cat => (
                <button key={cat.id} onClick={() => setSelectedCategoryId(cat.id)} className={`px-4 md:px-8 py-2 md:py-3 rounded-full text-xs md:text-sm font-bold whitespace-nowrap transition-all border ${selectedCategoryId === cat.id ? "bg-primary border-primary text-white" : "bg-transparent border-white/10 text-slate-400"}`}>{cat.name}</button>
            ))}
          </div>
        </section>

        {/* LISTA DE PRODUCTOS */}
        <div className="flex flex-col gap-3 md:gap-4 w-full">
          {filteredProducts.map((product) => (
             <div key={product.id}>
                {/* VISTA MÓVIL */}
                <div className={`md:hidden flex items-stretch gap-3 bg-[#1A1A1A] p-3 rounded-xl border transition-all ${product.is_active ? 'border-white/5' : 'border-red-900/30 opacity-60'}`}>
                    <div className="w-20 h-20 rounded-lg bg-cover bg-center shrink-0 border border-white/10 bg-slate-800" style={{ backgroundImage: `url('${product.image_url}')` }}></div>
                    <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5">
                        <div>
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-white text-sm truncate pr-2">{product.name}</h3>
                                <p className="text-primary font-bold text-sm whitespace-nowrap">${product.price.toLocaleString("es-AR")}</p>
                            </div>
                            <p className="text-[10px] text-slate-500 line-clamp-2 leading-tight mt-0.5">{product.description}</p>
                        </div>
                        <div className="flex items-center justify-end gap-3 mt-2">
                             <button onClick={() => handleToggleActive(product)} className={`text-[10px] font-bold uppercase tracking-wide ${product.is_active ? 'text-green-400' : 'text-slate-500'}`}>{product.is_active ? 'Activo' : 'Inactivo'}</button>
                             <div className="w-px h-3 bg-white/10"></div>
                             <button onClick={() => openProductModal(product)} className="text-slate-400 hover:text-white"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                             <button onClick={() => handleDeleteProduct(product.id)} className="text-slate-400 hover:text-red-400"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                        </div>
                    </div>
                </div>

                {/* VISTA DESKTOP */}
                <div className="hidden md:flex group flex-row items-center bg-[#1A1A1A] p-6 rounded-[2rem] border border-transparent hover:border-primary/30 transition-all shadow-md">
                    <div className={`flex items-center gap-6 flex-1 ${!product.is_active ? 'opacity-50 grayscale' : ''}`}>
                        <div className="size-24 rounded-2xl bg-cover bg-center shrink-0 shadow-lg bg-slate-800" style={{ backgroundImage: `url('${product.image_url}')` }}></div>
                        <div className="flex flex-col min-w-0">
                            <h3 className="text-2xl font-black tracking-tight truncate">{product.name}</h3>
                            <div className="flex items-center gap-3 mt-2">
                                <span className="px-4 py-1 bg-white/5 rounded-full text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    {categories.find(c => c.id === product.category_id)?.name || "Sin cat"}
                                </span>
                                <span className="text-slate-600">•</span>
                                <span className="text-xl font-black text-primary">${product.price.toLocaleString("es-AR")}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-end gap-8 px-8 border-l border-white/5">
                        <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => handleToggleActive(product)}>
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${product.is_active ? 'text-slate-400' : 'text-red-500'}`}>{product.is_active ? 'Visible' : 'Pausado'}</span>
                            <div className={`relative w-11 h-6 rounded-full transition-colors ${product.is_active ? 'bg-slate-700' : 'bg-slate-800'}`}>
                                <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform shadow-sm ${product.is_active ? 'translate-x-5 bg-primary' : 'translate-x-0 opacity-50'}`}></div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={() => openProductModal(product)} className="size-12 flex items-center justify-center rounded-2xl bg-white/5 text-slate-500 hover:text-primary hover:bg-primary/10 transition-all"><span className="material-symbols-outlined text-2xl">edit</span></button>
                            <button onClick={() => handleDeleteProduct(product.id)} className="size-12 flex items-center justify-center rounded-2xl bg-white/5 text-slate-500 hover:text-red-500 hover:bg-red-500/10 transition-all"><span className="material-symbols-outlined text-2xl">delete</span></button>
                        </div>
                    </div>
                </div>
             </div>
          ))}
          {filteredProducts.length === 0 && <p className="text-center text-slate-500 py-10">No hay productos.</p>}
        </div>

      </main>

      {/* --- MODAL UNIVERSAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#1A1A1A] w-full max-w-md rounded-[2rem] border border-white/10 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
             
             {/* Header Modal */}
             <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#151515]">
               <h3 className="font-bold text-white tracking-wide text-lg">
                {modalType === 'PRODUCT' ? (isEditing ? 'Editar' : 'Nuevo') 
                : modalType === 'CATEGORY' ? 'Nueva Categoría' 
                : 'Configurar WiFi'}
               </h3>
               <button onClick={() => setIsModalOpen(false)}><span className="material-symbols-outlined text-slate-500 hover:text-white">close</span></button>
             </div>

             <form onSubmit={handleSave} className="p-8 overflow-y-auto space-y-6">
                
                {/* FORMULARIO PRODUCTO */}
                {modalType === 'PRODUCT' && (
                  <>
                     <div className="flex gap-4 items-center">
                        <div className="size-24 rounded-2xl bg-cover bg-center shrink-0 border border-white/10 bg-black/30 flex items-center justify-center overflow-hidden" style={imagePreview ? { backgroundImage: `url('${imagePreview}')` } : {}} onClick={() => document.getElementById('modal-file-input')?.click()}>
                           {!imagePreview && <span className="material-symbols-outlined text-slate-500 text-3xl">image</span>}
                        </div>
                        <div className="flex-1">
                           <input id="modal-file-input" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                           <button type="button" onClick={() => document.getElementById('modal-file-input')?.click()} className="w-full py-3 px-4 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white hover:bg-white/10">{imagePreview ? 'Cambiar Foto' : 'Cargar Foto'}</button>
                        </div>
                     </div>
                     <input type="text" value={currentProduct.name} onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})} className="w-full bg-black/30 border-transparent rounded-xl p-4 text-white" placeholder="Nombre del producto" required />
                     <div className="grid grid-cols-2 gap-4">
                        <select value={currentProduct.category_id} onChange={e => setCurrentProduct({...currentProduct, category_id: e.target.value})} className="w-full bg-black/30 border-transparent rounded-xl p-4 text-white appearance-none">{categories.map(c => (<option key={c.id} value={c.id} className="bg-[#1A1A1A]">{c.name}</option>))}</select>
                        <input type="number" value={currentProduct.price} onChange={e => setCurrentProduct({...currentProduct, price: Number(e.target.value)})} className="w-full bg-black/30 border-transparent rounded-xl p-4 text-white" placeholder="Precio" required />
                     </div>
                     <textarea value={currentProduct.description || ""} onChange={e => setCurrentProduct({...currentProduct, description: e.target.value})} className="w-full bg-black/30 border-transparent rounded-xl p-4 text-white h-24 resize-none" placeholder="Descripción" />
                  </>
                )}

                {/* FORMULARIO CATEGORÍA */}
                {modalType === 'CATEGORY' && (
                  <input type="text" value={currentCategory.name || ''} onChange={e => setCurrentCategory({...currentCategory, name: e.target.value})} placeholder="Nombre Categoría" className="w-full bg-black/30 border-transparent rounded-xl p-4 text-white" required />
                )}

                {/* FORMULARIO WIFI */}
                {modalType === 'WIFI' && (
                  <div className="space-y-4">
                    <p className="text-sm text-slate-400 mb-4">Ingresá los datos de tu red. Si los dejas vacíos, el botón de "Pedir WiFi" no aparecerá en el menú.</p>
                    
                    <div>
                        <label className="text-xs uppercase font-bold text-slate-500 tracking-wider mb-2 block">Nombre de la Red (SSID)</label>
                        <input type="text" value={wifiSettings.ssid} onChange={e => setWifiSettings({...wifiSettings, ssid: e.target.value})} placeholder="Ej: WiFi Club Cheka" className="w-full bg-black/30 border-transparent rounded-xl p-4 text-white focus:ring-2 focus:ring-primary/50 transition-all" />
                    </div>

                    <div>
                        <label className="text-xs uppercase font-bold text-slate-500 tracking-wider mb-2 block">Contraseña</label>
                        <input type="text" value={wifiSettings.password} onChange={e => setWifiSettings({...wifiSettings, password: e.target.value})} placeholder="Ej: clubcheka2024" className="w-full bg-black/30 border-transparent rounded-xl p-4 text-white focus:ring-2 focus:ring-primary/50 transition-all" />
                    </div>
                  </div>
                )}

                <button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20">{isLoading ? 'Guardando...' : 'Guardar'}</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}