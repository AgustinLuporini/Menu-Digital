"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";

// --- TIPOS ---
type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_id: string;
  is_active: boolean;
  restaurant_id: string;
};

type Category = {
  id: string;
  name: string;
  restaurant_id: string;
};

type ModalType = 'PRODUCT' | 'CATEGORY' | 'WIFI';

export default function AdminContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const restaurantIdParam = searchParams.get('id'); // ¿Vengo del Reseller con un ID específico?

  // --- ESTADOS ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // DATOS DEL RESTAURANTE ACTUAL
  const [currentRestaurant, setCurrentRestaurant] = useState<{ id: string, name: string, slug: string } | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [wifiSettings, setWifiSettings] = useState({ ssid: '', password: '' });
  const [settingsId, setSettingsId] = useState<string | null>(null);

  // UI
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType>('PRODUCT');

  // EDICIÓN
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
  const [currentCategory, setCurrentCategory] = useState<Partial<Category>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // --- 1. CARGA INICIAL (Lógica Corregida) ---
  useEffect(() => {
    const init = async () => {
      // Check Login
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      setIsAuthenticated(true);

      let targetId = restaurantIdParam;

      // --- CORRECCIÓN AQUÍ ---
      // Si NO hay ID en la URL, buscamos el restaurante DEL USUARIO ACTUAL.
      // Antes buscabas 'limit(1)', lo que traía cualquiera.
      if (!targetId) {
          const { data } = await supabase
            .from('restaurants')
            .select('id')
            .eq('owner_id', session.user.id) // <--- Filtramos por el dueño logueado
            .single();
          
          if (data) targetId = data.id;
      }

      if (targetId) {
          // 1. Cargar info del restaurante
          const { data: rest } = await supabase.from('restaurants').select('*').eq('id', targetId).single();
          if (rest) {
              setCurrentRestaurant(rest);
              // 2. Cargar sus datos
              await loadData(targetId);
          } else {
             // Si targetId existe pero no devuelve datos (ej: ID inválido o sin permiso)
             setIsLoading(false);
          }
      } else {
          // Si no hay targetId (ni por URL ni por dueño), terminamos carga
          setIsLoading(false);
      }
    };
    init();
  }, [router, restaurantIdParam]);

  // --- 2. FUNCIÓN PARA CARGAR PRODUCTOS/CATS/WIFI ---
  const loadData = async (restId: string) => {
      // Productos
      const { data: p } = await supabase
        .from('products')
        .select('*')
        .eq('restaurant_id', restId)
        .order('created_at', { ascending: false });
      
      // Categorías
      const { data: c } = await supabase
        .from('categories')
        .select('*')
        .eq('restaurant_id', restId)
        .order('sort_order', { ascending: true });
      
      // WiFi
      const { data: w } = await supabase
        .from('restaurant_settings')
        .select('*')
        .eq('restaurant_id', restId)
        .single();

      setProducts(p as Product[] || []);
      setCategories(c as Category[] || []);
      
      if (w) {
          setWifiSettings({ ssid: w.wifi_ssid || '', password: w.wifi_password || '' });
          setSettingsId(w.id);
      } else {
          setWifiSettings({ ssid: '', password: '' });
          setSettingsId(null);
      }
      setIsLoading(false); // Terminamos de cargar datos
  };

  // --- ACTIONS ---

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

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

  // Imágenes
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
    const { error } = await supabase.storage.from('menu-images').upload(fileName, file);
    if (error) throw error;
    const { data } = supabase.storage.from('menu-images').getPublicUrl(fileName);
    return data.publicUrl;
  };

  // Modales
  const openProductModal = (product?: Product) => {
    setModalType('PRODUCT');
    setSelectedImageFile(null);
    if (product) {
      setIsEditing(true);
      setCurrentProduct(product);
      setImagePreview(product.image_url);
    } else {
      setIsEditing(false);
      setCurrentProduct({ name: "", price: 0, image_url: "", category_id: selectedCategoryId || categories[0]?.id || "", is_active: true });
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
    setIsModalOpen(true);
  };

  // --- SAVE ---
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentRestaurant) return;
    setIsLoading(true);

    try {
        if (modalType === 'PRODUCT') {
            let finalImageUrl = currentProduct.image_url;
            if (selectedImageFile) {
                finalImageUrl = await uploadImage(selectedImageFile);
            }
            if (!finalImageUrl) finalImageUrl = "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=300&q=80";

            const payload = {
                ...currentProduct,
                image_url: finalImageUrl,
                restaurant_id: currentRestaurant.id
            };

            if (isEditing && currentProduct.id) {
                await supabase.from('products').update(payload).eq('id', currentProduct.id);
            } else {
                await supabase.from('products').insert([{ ...payload, is_active: true }]);
            }
        } 
        else if (modalType === 'CATEGORY') {
            await supabase.from('categories').insert([{
                name: currentCategory.name,
                slug: currentCategory.name?.toLowerCase().replace(/ /g, '-'),
                sort_order: categories.length + 1,
                restaurant_id: currentRestaurant.id
            }]);
        } 
        else if (modalType === 'WIFI') {
            const payload = {
                wifi_ssid: wifiSettings.ssid,
                wifi_password: wifiSettings.password,
                restaurant_id: currentRestaurant.id
            };
            if (settingsId) {
                await supabase.from('restaurant_settings').update(payload).eq('id', settingsId);
            } else {
                await supabase.from('restaurant_settings').insert([payload]);
            }
        }

        await loadData(currentRestaurant.id);
        setIsModalOpen(false);

    } catch (error: any) {
        alert("Error: " + error.message);
    } finally {
        setIsLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  // Estado de carga o SIN RESTAURANTE
  if (isLoading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white"><div className="animate-spin size-8 border-4 border-primary border-t-transparent rounded-full"></div></div>;

  if (!currentRestaurant) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white p-4 text-center">
        <h2 className="text-2xl font-bold mb-2">No tenés restaurantes asignados</h2>
        <p className="text-slate-400 mb-6">Parece que tu usuario no es dueño de ningún local todavía.</p>
        <button onClick={handleLogout} className="px-6 py-3 bg-white/10 rounded-full hover:bg-white/20 transition-all">Cerrar Sesión</button>
    </div>
  );

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategoryId ? p.category_id === selectedCategoryId : true;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full flex flex-col min-h-screen bg-[#0f0f0f] text-white font-display pb-20 md:pb-0">
      
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-4 md:px-8 py-4 md:py-6 border-b border-white/5 bg-[#1A1A1A]/50 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-4">
            <div className="bg-primary size-10 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
                <span className="material-symbols-outlined text-white text-xl font-bold">storefront</span>
            </div>
            
            <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Gestionando:</span>
                <h1 className="text-lg font-black leading-none">{currentRestaurant?.name || 'Cargando...'}</h1>
            </div>

            {/* BOTÓN VOLVER (Solo si hay ID en URL, o sea, si soy Reseller) */}
            {restaurantIdParam && (
                 <button onClick={() => router.push('/reseller')} className="hidden md:flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-white border border-white/10 px-3 py-1.5 rounded-full hover:bg-white/5 transition-all ml-4">
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Volver a mis Clientes
                 </button>
            )}
        </div>

        <div className="flex items-center gap-2 md:gap-4">
            <button onClick={handleLogout} className="flex items-center gap-3 p-2 pr-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all group">
                <div className="size-8 rounded-full bg-cover bg-center bg-slate-700" style={{backgroundImage: "url('https://ui-avatars.com/api/?name=Admin&background=137fec&color=fff')"}}></div>
                <span className="text-sm font-bold text-slate-300 group-hover:text-white hidden md:block">Salir</span>
                <span className="material-symbols-outlined text-slate-400 text-xl group-hover:text-red-400">logout</span>
            </button>
        </div>
      </nav>

      <main className="flex-1 flex flex-col px-4 md:px-8 pb-12 w-full max-w-7xl mx-auto mt-4 md:mt-8">
        
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6 mb-6 md:mb-10">
          <div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">Productos</h2>
            <div className="flex items-center gap-2 mt-2">
                <p className="text-slate-400 text-sm">Gestioná la carta digital.</p>
                {currentRestaurant && (
                    <a href={`/${currentRestaurant.slug}`} target="_blank" className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded ml-2 hover:bg-primary/30 transition-colors flex items-center gap-1">
                        Ver Menú <span className="material-symbols-outlined text-[10px]">open_in_new</span>
                    </a>
                )}
            </div>
          </div>
          
          <div className="flex gap-2 md:gap-3">
            <button onClick={openWifiModal} className="flex items-center justify-center gap-2 px-3 md:px-4 py-3 bg-[#1A1A1A] border border-white/10 text-white rounded-xl md:rounded-full font-bold text-sm hover:bg-white/5 transition-all text-slate-300 hover:text-primary">
                <span className="material-symbols-outlined text-lg">wifi</span>
                <span className="hidden md:inline">WiFi</span>
            </button>
            <button onClick={openCategoryModal} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-[#1A1A1A] border border-white/10 text-white rounded-xl md:rounded-full font-bold text-sm hover:bg-white/5 transition-all">
                <span className="material-symbols-outlined text-lg">add</span>
                <span className="whitespace-nowrap">Categoría</span>
            </button>
            <button onClick={() => openProductModal()} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl md:rounded-full font-bold shadow-xl shadow-primary/30 text-sm hover:scale-105 transition-all">
                <span className="material-symbols-outlined text-lg">add</span>
                <span>Nuevo</span>
            </button>
          </div>
        </header>

        {/* FILTROS */}
        <section className="flex flex-col gap-4 md:gap-8 mb-6 md:mb-10 w-full">
          <div className="w-full relative group">
             <span className="absolute inset-y-0 left-0 flex items-center pl-4 md:pl-5 text-slate-500">
                <span className="material-symbols-outlined text-xl md:text-2xl">search</span>
             </span>
             <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-[#1A1A1A] border-none rounded-2xl md:rounded-3xl py-3 md:py-5 pl-12 md:pl-14 pr-6 focus:ring-2 focus:ring-primary text-sm md:text-base text-white placeholder:text-slate-500 transition-all" placeholder="Buscar productos..." type="text" />
          </div>

          <div className="flex gap-2 md:gap-4 overflow-x-auto pb-2 hide-scrollbar">
            <button onClick={() => setSelectedCategoryId(null)} className={`px-4 md:px-8 py-2 md:py-3 rounded-full text-xs md:text-sm font-bold whitespace-nowrap transition-all border ${selectedCategoryId === null ? "bg-primary border-primary text-white" : "bg-transparent border-white/10 text-slate-400"}`}>Todos</button>
            {categories.map(cat => (
                <button key={cat.id} onClick={() => setSelectedCategoryId(cat.id)} className={`px-4 md:px-8 py-2 md:py-3 rounded-full text-xs md:text-sm font-bold whitespace-nowrap transition-all border ${selectedCategoryId === cat.id ? "bg-primary border-primary text-white" : "bg-transparent border-white/10 text-slate-400"}`}>{cat.name}</button>
            ))}
          </div>
        </section>

        {/* LISTADO */}
        {isLoading ? (
            <div className="flex justify-center py-20"><div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
        ) : (
            <div className="flex flex-col gap-3 md:gap-4 w-full">
            {filteredProducts.map((product) => (
                <div key={product.id}>
                    {/* MOBILE CARD */}
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
                    {/* DESKTOP CARD */}
                    <div className="hidden md:flex group flex-row items-center bg-[#1A1A1A] p-6 rounded-[2rem] border border-transparent hover:border-primary/30 transition-all shadow-md">
                        <div className={`flex items-center gap-6 flex-1 ${!product.is_active ? 'opacity-50 grayscale' : ''}`}>
                            <div className="size-24 rounded-2xl bg-cover bg-center shrink-0 shadow-lg bg-slate-800" style={{ backgroundImage: `url('${product.image_url}')` }}></div>
                            <div className="flex flex-col min-w-0">
                                <h3 className="text-2xl font-black tracking-tight truncate">{product.name}</h3>
                                <div className="flex items-center gap-3 mt-2">
                                    <span className="px-4 py-1 bg-white/5 rounded-full text-[11px] font-bold uppercase tracking-wider text-slate-400">{categories.find(c => c.id === product.category_id)?.name || "Sin cat"}</span>
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
            {filteredProducts.length === 0 && <p className="text-center text-slate-500 py-10">No hay productos aquí.</p>}
            </div>
        )}

      </main>

      {/* --- MODALES --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#1A1A1A] w-full max-w-md rounded-[2rem] border border-white/10 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
             
             {/* Header */}
             <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#151515]">
               <h3 className="font-bold text-white tracking-wide text-lg">
                {modalType === 'PRODUCT' ? (isEditing ? 'Editar Producto' : 'Nuevo Producto') 
                 : modalType === 'CATEGORY' ? 'Nueva Categoría' 
                 : 'Configurar WiFi'}
               </h3>
               <button onClick={() => setIsModalOpen(false)}><span className="material-symbols-outlined text-slate-500 hover:text-white">close</span></button>
             </div>

             <form onSubmit={handleSave} className="p-8 overflow-y-auto space-y-6">
                
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
                        <select value={currentProduct.category_id} onChange={e => setCurrentProduct({...currentProduct, category_id: e.target.value})} className="w-full bg-black/30 border-transparent rounded-xl p-4 text-white appearance-none">
                            {categories.map(c => (<option key={c.id} value={c.id} className="bg-[#1A1A1A]">{c.name}</option>))}
                            {categories.length === 0 && <option>¡Creá una categoría primero!</option>}
                        </select>
                        <input type="number" value={currentProduct.price} onChange={e => setCurrentProduct({...currentProduct, price: Number(e.target.value)})} className="w-full bg-black/30 border-transparent rounded-xl p-4 text-white" placeholder="Precio" required />
                     </div>
                     <textarea value={currentProduct.description || ""} onChange={e => setCurrentProduct({...currentProduct, description: e.target.value})} className="w-full bg-black/30 border-transparent rounded-xl p-4 text-white h-24 resize-none" placeholder="Descripción" />
                  </>
                )}

                {modalType === 'CATEGORY' && (
                  <input type="text" value={currentCategory.name || ''} onChange={e => setCurrentCategory({...currentCategory, name: e.target.value})} placeholder="Nombre Categoría" className="w-full bg-black/30 border-transparent rounded-xl p-4 text-white" required />
                )}

                {modalType === 'WIFI' && (
                  <div className="space-y-4">
                    <p className="text-sm text-slate-400 mb-4">Datos WiFi para <strong>{currentRestaurant?.name}</strong>.</p>
                    <input type="text" value={wifiSettings.ssid} onChange={e => setWifiSettings({...wifiSettings, ssid: e.target.value})} placeholder="Red (SSID)" className="w-full bg-black/30 border-transparent rounded-xl p-4 text-white" />
                    <input type="text" value={wifiSettings.password} onChange={e => setWifiSettings({...wifiSettings, password: e.target.value})} placeholder="Contraseña" className="w-full bg-black/30 border-transparent rounded-xl p-4 text-white" />
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