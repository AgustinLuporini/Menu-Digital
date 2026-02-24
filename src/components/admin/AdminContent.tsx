"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react"; // Importamos la librería

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

// Agregamos 'QR' a los tipos de modal
type ModalType = 'PRODUCT' | 'CATEGORY' | 'WIFI' | 'QR';

export default function AdminContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const restaurantIdParam = searchParams.get('id');

  // --- ESTADOS ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // DATOS
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

  // REF para el QR (Para poder descargarlo)
  const qrRef = useRef<SVGSVGElement>(null);

  // --- 1. CARGA INICIAL ---
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      setIsAuthenticated(true);

      let targetId = restaurantIdParam;

      if (!targetId) {
          const { data } = await supabase
            .from('restaurants')
            .select('id')
            .eq('owner_id', session.user.id)
            .single();
          
          if (data) targetId = data.id;
      }

      if (targetId) {
          const { data: rest } = await supabase.from('restaurants').select('*').eq('id', targetId).single();
          if (rest) {
              setCurrentRestaurant(rest);
              await loadData(targetId);
          } else {
              setIsLoading(false);
          }
      } else {
          setIsLoading(false);
      }
    };
    init();
  }, [router, restaurantIdParam]);

  // --- 2. CARGAR DATOS ---
  const loadData = async (restId: string) => {
      const { data: p } = await supabase.from('products').select('*').eq('restaurant_id', restId).order('created_at', { ascending: false });
      const { data: c } = await supabase.from('categories').select('*').eq('restaurant_id', restId).order('sort_order', { ascending: true });
      const { data: w } = await supabase.from('restaurant_settings').select('*').eq('restaurant_id', restId).single();

      setProducts(p as Product[] || []);
      setCategories(c as Category[] || []);
      
      if (w) {
          setWifiSettings({ ssid: w.wifi_ssid || '', password: w.wifi_password || '' });
          setSettingsId(w.id);
      } else {
          setWifiSettings({ ssid: '', password: '' });
          setSettingsId(null);
      }
      setIsLoading(false);
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

  // --- FUNCIONES DE MODALES ---
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

  // NUEVO: Modal de QR
  const openQRModal = () => {
    setModalType('QR');
    setIsModalOpen(true);
  };

  // NUEVO: Función para descargar QR
  const downloadQR = () => {
    const svg = qrRef.current;
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if(ctx) {
          ctx.drawImage(img, 0, 0);
          const pngFile = canvas.toDataURL("image/png");
          const downloadLink = document.createElement("a");
          downloadLink.download = `QR-${currentRestaurant?.name || 'Menu'}.png`;
          downloadLink.href = pngFile;
          downloadLink.click();
      }
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

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

  if (isLoading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white"><div className="animate-spin size-8 border-4 border-orange-500 border-t-transparent rounded-full"></div></div>;

  if (!currentRestaurant) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white p-4 text-center selection:bg-orange-500/30">
        <h2 className="text-2xl font-bold mb-2">No tenés restaurantes asignados</h2>
        <p className="text-slate-400 mb-6">Parece que tu usuario no es dueño de ningún local todavía.</p>
        <button onClick={handleLogout} className="px-6 py-3 bg-white/10 rounded-full hover:bg-white/20 transition-all font-bold">Cerrar Sesión</button>
    </div>
  );

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategoryId ? p.category_id === selectedCategoryId : true;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full flex flex-col min-h-screen bg-[#050505] text-white font-sans pb-20 md:pb-0 selection:bg-orange-500/30">
      
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-4 md:px-8 py-4 md:py-6 border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-orange-500 to-red-600 size-10 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 shrink-0">
                <span className="material-symbols-outlined text-white text-xl font-bold">storefront</span>
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] text-orange-500 font-bold uppercase tracking-widest">Panel de Control</span>
                <h1 className="text-lg font-black leading-none tracking-tight">{currentRestaurant?.name}</h1>
            </div>
            {restaurantIdParam && (
                 <button onClick={() => router.push('/reseller')} className="hidden md:flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-white border border-white/10 px-3 py-1.5 rounded-full hover:bg-white/5 transition-all ml-4 group">
                    <span className="material-symbols-outlined text-sm group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
                    Volver
                 </button>
            )}
        </div>
        <div className="flex items-center gap-2 md:gap-4">
            <button onClick={handleLogout} className="flex items-center gap-3 p-2 pr-4 bg-white/5 rounded-full hover:bg-white/10 transition-all group border border-white/5 hover:border-white/10">
                <div className="size-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center">
                    <span className="font-bold text-xs">AD</span>
                </div>
                <span className="text-sm font-bold text-slate-300 group-hover:text-white hidden md:block">Salir</span>
                <span className="material-symbols-outlined text-slate-400 text-xl group-hover:text-red-400 transition-colors">logout</span>
            </button>
        </div>
      </nav>

      <main className="flex-1 flex flex-col px-4 md:px-8 pb-12 w-full max-w-7xl mx-auto mt-6 md:mt-10">
        
        {/* HEADER DE SECCIÓN */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6 mb-8 md:mb-12">
          <div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-2">Productos</h2>
            <div className="flex items-center gap-2">
                <p className="text-slate-400 text-sm">Gestioná tu carta digital en tiempo real.</p>
                {currentRestaurant && (
                    <a href={`/${currentRestaurant.slug}`} target="_blank" className="text-xs bg-orange-500/10 text-orange-500 px-2 py-0.5 rounded border border-orange-500/20 hover:bg-orange-500/20 transition-colors flex items-center gap-1 font-bold">
                        Ver Menú <span className="material-symbols-outlined text-[10px]">open_in_new</span>
                    </a>
                )}
            </div>
          </div>
          
          <div className="flex gap-2 md:gap-3 flex-wrap">
            {/* BOTÓN NUEVO: QR DEL MENÚ */}
            <button onClick={openQRModal} className="flex items-center justify-center gap-2 px-3 md:px-4 py-3 bg-[#1A1A1A] border border-white/10 text-slate-300 rounded-xl md:rounded-full font-bold text-sm hover:bg-white/5 hover:text-white transition-all hover:border-white/20">
                <span className="material-symbols-outlined text-lg">qr_code_2</span>
                <span className="hidden md:inline">QR Menú</span>
            </button>

            <button onClick={openWifiModal} className="flex items-center justify-center gap-2 px-3 md:px-4 py-3 bg-[#1A1A1A] border border-white/10 text-slate-300 rounded-xl md:rounded-full font-bold text-sm hover:bg-white/5 hover:text-white transition-all hover:border-white/20">
                <span className="material-symbols-outlined text-lg">wifi</span>
                <span className="hidden md:inline">WiFi</span>
            </button>
            <button onClick={openCategoryModal} className="flex items-center justify-center gap-2 px-4 py-3 bg-[#1A1A1A] border border-white/10 text-white rounded-xl md:rounded-full font-bold text-sm hover:bg-white/5 transition-all hover:border-white/20">
                <span className="material-symbols-outlined text-lg">category</span>
                <span className="whitespace-nowrap">Categoría</span>
            </button>
            <button onClick={() => openProductModal()} className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl md:rounded-full font-bold shadow-lg shadow-orange-500/20 text-sm hover:scale-105 transition-all">
                <span className="material-symbols-outlined text-lg">add</span>
                <span>Nuevo</span>
            </button>
          </div>
        </header>

        {/* ... (SECCIÓN DE FILTROS Y LISTADO IGUAL QUE ANTES) ... */}
        {/* FILTROS */}
        <section className="flex flex-col gap-4 md:gap-8 mb-8 w-full">
          <div className="w-full relative group">
             <span className="absolute inset-y-0 left-0 flex items-center pl-4 md:pl-5 text-slate-500 group-focus-within:text-orange-500 transition-colors">
                <span className="material-symbols-outlined text-xl md:text-2xl">search</span>
             </span>
             <input 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="w-full bg-[#111] border border-white/5 rounded-2xl md:rounded-3xl py-3 md:py-4 pl-12 md:pl-14 pr-6 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 text-sm md:text-base text-white placeholder:text-slate-600 transition-all shadow-inner" 
                placeholder="Buscar por nombre..." 
                type="text" 
             />
          </div>

          <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 hide-scrollbar">
            <button onClick={() => setSelectedCategoryId(null)} className={`px-5 py-2.5 rounded-full text-xs md:text-sm font-bold whitespace-nowrap transition-all border ${selectedCategoryId === null ? "bg-white text-black border-white shadow-lg shadow-white/10" : "bg-transparent border-white/10 text-slate-500 hover:text-white hover:border-white/30"}`}>Todos</button>
            {categories.map(cat => (
                <button key={cat.id} onClick={() => setSelectedCategoryId(cat.id)} className={`px-5 py-2.5 rounded-full text-xs md:text-sm font-bold whitespace-nowrap transition-all border ${selectedCategoryId === cat.id ? "bg-white text-black border-white shadow-lg shadow-white/10" : "bg-transparent border-white/10 text-slate-500 hover:text-white hover:border-white/30"}`}>{cat.name}</button>
            ))}
          </div>
        </section>

        {/* LISTADO DE PRODUCTOS */}
        {isLoading ? (
            <div className="flex justify-center py-20"><div className="size-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div>
        ) : (
            <div className="flex flex-col gap-3 md:gap-4 w-full">
            {filteredProducts.map((product) => (
                <div key={product.id} className="group/card">
                    
                    {/* MOBILE CARD (Con Toggle Visual) */}
                    <div className={`md:hidden flex items-stretch gap-3 bg-[#111] p-3 rounded-2xl border transition-all ${product.is_active ? 'border-white/5' : 'border-red-900/20 opacity-75'}`}>
                        <div className="w-20 h-20 rounded-xl bg-cover bg-center shrink-0 border border-white/5 bg-slate-800" style={{ backgroundImage: `url('${product.image_url}')` }}></div>
                        <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5">
                            <div>
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-white text-sm truncate pr-2">{product.name}</h3>
                                    <p className="text-orange-500 font-bold text-sm whitespace-nowrap">${product.price.toLocaleString("es-AR")}</p>
                                </div>
                                <p className="text-[10px] text-slate-500 line-clamp-2 leading-tight mt-1">{product.description}</p>
                            </div>
                            
                            <div className="flex items-center justify-end gap-3 mt-2">
                                <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleToggleActive(product)}>
                                    <span className={`text-[9px] font-bold uppercase tracking-wider ${product.is_active ? 'text-orange-500' : 'text-slate-600'}`}>
                                        {product.is_active ? 'Visible' : 'Oculto'}
                                    </span>
                                    <div className={`relative w-8 h-5 rounded-full transition-colors duration-300 ${product.is_active ? 'bg-orange-500/20 border border-orange-500/50' : 'bg-slate-800 border border-white/5'}`}>
                                        <div className={`absolute top-0.5 left-0.5 bg-white w-3.5 h-3.5 rounded-full transition-all duration-300 shadow-sm ${product.is_active ? 'translate-x-3 bg-orange-500' : 'translate-x-0 opacity-50'}`}></div>
                                    </div>
                                </div>
                                <div className="w-px h-3 bg-white/10"></div>
                                <button onClick={() => openProductModal(product)} className="text-slate-400 hover:text-white"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                                <button onClick={() => handleDeleteProduct(product.id)} className="text-slate-400 hover:text-red-500"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                            </div>
                        </div>
                    </div>

                    {/* DESKTOP CARD (Full) */}
                    <div className="hidden md:flex flex-row items-center bg-[#111] p-4 pr-8 rounded-[1.5rem] border border-white/5 hover:border-white/10 transition-all shadow-sm hover:shadow-md group-hover/card:bg-[#161616]">
                        <div className="px-4 text-slate-700 cursor-grab active:cursor-grabbing"><span className="material-symbols-outlined">drag_indicator</span></div>
                        <div className={`flex items-center gap-6 flex-1 ${!product.is_active ? 'opacity-50 grayscale' : ''}`}>
                            <div className="size-20 rounded-2xl bg-cover bg-center shrink-0 shadow-lg border border-white/5 bg-slate-800" style={{ backgroundImage: `url('${product.image_url}')` }}></div>
                            <div className="flex flex-col min-w-0 py-1">
                                <h3 className="text-xl font-bold tracking-tight text-white mb-1">{product.name}</h3>
                                <p className="text-sm text-slate-500 line-clamp-1 max-w-md">{product.description}</p>
                                <div className="flex items-center gap-3 mt-2">
                                    <span className="px-3 py-0.5 bg-white/5 rounded-md text-[10px] font-bold uppercase tracking-wider text-slate-400 border border-white/5">{categories.find(c => c.id === product.category_id)?.name || "Sin cat"}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-10">
                            <span className="text-xl font-bold text-orange-500 min-w-[80px] text-right">${product.price.toLocaleString("es-AR")}</span>
                            <div className="flex flex-col items-center gap-1 cursor-pointer group/toggle" onClick={() => handleToggleActive(product)}>
                                <div className={`relative w-12 h-7 rounded-full transition-colors duration-300 ${product.is_active ? 'bg-orange-500/20 border border-orange-500/50' : 'bg-slate-800 border border-white/5'}`}>
                                    <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-all duration-300 shadow-sm ${product.is_active ? 'translate-x-5 bg-orange-500' : 'translate-x-0 opacity-50'}`}></div>
                                </div>
                                <span className={`text-[9px] font-bold uppercase tracking-widest ${product.is_active ? 'text-orange-500' : 'text-slate-600'}`}>{product.is_active ? 'Visible' : 'Oculto'}</span>
                            </div>
                            <div className="flex items-center gap-2 border-l border-white/5 pl-6">
                                <button onClick={() => openProductModal(product)} className="size-10 flex items-center justify-center rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all" title="Editar"><span className="material-symbols-outlined text-[20px]">edit</span></button>
                                <button onClick={() => handleDeleteProduct(product.id)} className="size-10 flex items-center justify-center rounded-xl bg-white/5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all" title="Borrar"><span className="material-symbols-outlined text-[20px]">delete</span></button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            </div>
        )}

      </main>

      {/* --- MODALES --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="bg-[#111] w-full max-w-lg rounded-[2rem] border border-white/10 shadow-2xl shadow-black flex flex-col max-h-[90vh] overflow-hidden">
              
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#151515]">
                <h3 className="font-bold text-white tracking-tight text-xl">
                 {modalType === 'PRODUCT' ? (isEditing ? 'Editar Producto' : 'Nuevo Producto') 
                  : modalType === 'CATEGORY' ? 'Nueva Categoría' 
                  : modalType === 'QR' ? 'Código QR del Menú'
                  : 'Configurar WiFi'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="size-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all"><span className="material-symbols-outlined text-slate-400 hover:text-white text-sm">close</span></button>
              </div>

              {/* CONTENIDO DEL FORM / MODAL */}
              {modalType === 'QR' ? (
                  // --- CONTENIDO MODAL QR ---
                  <div className="p-8 flex flex-col items-center text-center space-y-6">
                      <div className="bg-white p-4 rounded-3xl">
                          {/* QR GENERATOR */}
                          {currentRestaurant && (
                              <QRCodeSVG 
                                ref={qrRef}
                                value={`${window.location.origin}/${currentRestaurant.slug}`} 
                                size={250}
                                level="H"
                                includeMargin={true}
                              />
                          )}
                      </div>
                      <div className="space-y-2">
                          <p className="text-white font-bold text-lg">¡Listo para imprimir!</p>
                          <p className="text-slate-400 text-sm max-w-xs mx-auto">Este código lleva a tus clientes directamente a tu carta digital.</p>
                      </div>
                      <div className="flex gap-3 w-full">
                          <button onClick={downloadQR} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2">
                              <span className="material-symbols-outlined">download</span> Descargar PNG
                          </button>
                      </div>
                  </div>
              ) : (
                  // --- CONTENIDO OTROS FORMULARIOS ---
                  <form onSubmit={handleSave} className="p-8 overflow-y-auto space-y-6">
                    
                    {modalType === 'PRODUCT' && (
                      <>
                          {/* (El resto de campos de productos se mantiene igual) */}
                          <div className="flex gap-5 items-center">
                             <div className="size-28 rounded-2xl bg-cover bg-center shrink-0 border-2 border-dashed border-white/10 bg-[#0a0a0a] flex items-center justify-center overflow-hidden cursor-pointer hover:border-orange-500/50 transition-colors group" style={imagePreview ? { backgroundImage: `url('${imagePreview}')`, borderStyle: 'solid' } : {}} onClick={() => document.getElementById('modal-file-input')?.click()}>
                                {!imagePreview && <div className="flex flex-col items-center gap-1"><span className="material-symbols-outlined text-slate-600 group-hover:text-orange-500 text-3xl">add_a_photo</span></div>}
                             </div>
                             <div className="flex-1">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Imagen del plato</label>
                                <input id="modal-file-input" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                <button type="button" onClick={() => document.getElementById('modal-file-input')?.click()} className="py-2.5 px-4 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-all w-full text-left flex justify-between items-center">
                                    {imagePreview ? 'Cambiar imagen' : 'Seleccionar archivo'}
                                    <span className="material-symbols-outlined text-base">upload</span>
                                </button>
                             </div>
                          </div>

                          <div className="space-y-4">
                              <div>
                                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Nombre</label>
                                  <input type="text" value={currentProduct.name} onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-4 text-white focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 outline-none transition-all placeholder:text-slate-700" placeholder="Ej: Burger Doble Cheddar" required />
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                  <div>
                                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Categoría</label>
                                      <div className="relative">
                                          <select value={currentProduct.category_id} onChange={e => setCurrentProduct({...currentProduct, category_id: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-4 text-white appearance-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 outline-none transition-all">
                                              {categories.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
                                              {categories.length === 0 && <option>¡Creá una categoría!</option>}
                                          </select>
                                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none material-symbols-outlined">expand_more</span>
                                      </div>
                                  </div>
                                  
                                  <div className="flex flex-col gap-3">
                                      <div>
                                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Precio Final</label>
                                          <div className="relative">
                                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                                              <input 
                                                  type="number" 
                                                  value={currentProduct.price} 
                                                  onChange={e => {
                                                      const newPrice = Number(e.target.value);
                                                      // Calcula el precio sin IVA (21%) automáticamente y lo redondea
                                                      const newPriceWithoutTax = newPrice > 0 ? Number((newPrice / 1.21).toFixed(2)) : 0;
                                                      
                                                      setCurrentProduct({
                                                          ...currentProduct, 
                                                          price: newPrice,
                                                          price_without_tax: newPriceWithoutTax // Actualiza el nuevo campo
                                                      });
                                                  }} 
                                                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-4 pl-8 text-white focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 outline-none transition-all font-bold" 
                                                  placeholder="0" 
                                                  required 
                                              />
                                          </div>
                                      </div>

                                      {/* NUEVO INPUT: Precio Sin Impuestos */}
                                      <div>
                                          <label className="block text-xs font-bold text-orange-500/80 uppercase tracking-wider mb-1.5 ml-1 flex items-center justify-between">
                                              <span>Precio s/ imp.</span>
                                              <span className="text-[10px] text-slate-500 font-normal normal-case">(Editable)</span>
                                          </label>
                                          <div className="relative">
                                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                                              <input 
                                                  type="number" 
                                                  step="0.01" 
                                                  value={currentProduct.price_without_tax || ''} 
                                                  onChange={e => setCurrentProduct({...currentProduct, price_without_tax: Number(e.target.value)})} 
                                                  className="w-full bg-[#111] border border-orange-500/20 rounded-xl p-3 pl-8 text-orange-100/80 focus:border-orange-500/50 outline-none transition-all text-sm" 
                                                  placeholder="Calculado auto." 
                                              />
                                          </div>
                                      </div>
                                  </div>
                              </div>
                              
                              <div>
                                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Descripción</label>
                                  <textarea value={currentProduct.description || ""} onChange={e => setCurrentProduct({...currentProduct, description: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-4 text-white h-24 resize-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 outline-none transition-all placeholder:text-slate-700 text-sm" placeholder="Ingredientes, detalles, etc." />
                              </div>
                          </div>
                      </>
                    )}

                    {modalType === 'CATEGORY' && (
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Nombre de la Categoría</label>
                          <input type="text" value={currentCategory.name || ''} onChange={e => setCurrentCategory({...currentCategory, name: e.target.value})} placeholder="Ej: Entradas, Postres..." className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-4 text-white focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 outline-none transition-all text-lg font-bold" required />
                      </div>
                    )}

                    {modalType === 'WIFI' && (
                      <div className="space-y-5">
                        <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl flex gap-3">
                            <span className="material-symbols-outlined text-orange-500">info</span>
                            <div>
                                <p className="text-white font-bold text-sm mb-1">Código QR de Conexión</p>
                                <p className="text-xs text-orange-200/80 leading-relaxed">
                                    Esta configuración genera un <strong>código QR especial solo para WiFi</strong>. Cuando el cliente lo escanee, se conectará a tu red automáticamente sin escribir la contraseña.
                                </p>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Nombre de la Red (SSID)</label>
                            <input type="text" value={wifiSettings.ssid} onChange={e => setWifiSettings({...wifiSettings, ssid: e.target.value})} placeholder="Ej: WiFi Clientes" className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-4 text-white focus:border-orange-500/50 outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Contraseña</label>
                            <input type="text" value={wifiSettings.password} onChange={e => setWifiSettings({...wifiSettings, password: e.target.value})} placeholder="Ej: 12345678" className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-4 text-white focus:border-orange-500/50 outline-none font-mono" />
                        </div>
                      </div>
                    )}

                    <button type="submit" disabled={isLoading} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 mt-4">
                        {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                 </form>
              )}
          </div>
        </div>
      )}
    </div>
  );
}