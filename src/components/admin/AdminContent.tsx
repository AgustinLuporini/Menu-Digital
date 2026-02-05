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

// Tipo de Modal (¿Qué estamos creando/editando?)
type ModalType = 'PRODUCT' | 'CATEGORY';

export default function AdminContent({ initialProducts, categories: initialCategories }: { initialProducts: Product[], categories: Category[] }) {
  const router = useRouter();
  
  // Seguridad
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Datos
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(initialCategories);
  
  // Filtros (Tabs)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType>('PRODUCT'); // ¿Qué formulario mostramos?
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados de Edición
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
  const [currentCategory, setCurrentCategory] = useState<Partial<Category>>({});
  const [isEditing, setIsEditing] = useState(false);

  // --- 1. SEGURIDAD ---
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) router.push("/login");
      else setIsAuthenticated(true);
    };
    checkUser();
  }, [router]);

  if (!isAuthenticated) return null; // Pantalla negra mientras carga

  // --- 2. LÓGICA DE DATOS ---

  // Refrescar todo
  const refreshData = async () => {
    const { data: pData } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    const { data: cData } = await supabase.from('categories').select('*').order('sort_order', { ascending: true });
    
    if (pData) setProducts(pData as Product[]);
    if (cData) setCategories(cData as Category[]);
    router.refresh();
  };

  // Filtrado de productos según la Tab seleccionada
  const filteredProducts = selectedCategoryId 
    ? products.filter(p => p.category_id === selectedCategoryId)
    : products;

  // Toggle Activo/Inactivo
  const handleToggleActive = async (product: Product) => {
    const newStatus = !product.is_active;
    // UI Optimista
    setProducts(products.map(p => p.id === product.id ? { ...p, is_active: newStatus } : p));
    await supabase.from('products').update({ is_active: newStatus }).eq('id', product.id);
  };

  // Eliminar Producto
  const handleDeleteProduct = async (id: string) => {
    if (!confirm("¿Borrar este producto?")) return;
    setProducts(products.filter(p => p.id !== id));
    await supabase.from('products').delete().eq('id', id);
  };

  // --- 3. MANEJO DEL MODAL ---

  // ABRIR PARA PRODUCTO
  const openProductModal = (product?: Product) => {
    setModalType('PRODUCT');
    if (product) {
      setIsEditing(true);
      setCurrentProduct(product);
    } else {
      setIsEditing(false);
      // Valores por defecto
      setCurrentProduct({ 
        name: "", 
        description: "", 
        price: 0, 
        image_url: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=300&q=80",
        category_id: selectedCategoryId || categories[0]?.id || "", // Si está en una tab, pre-seleccionar esa categoría
        is_active: true 
      });
    }
    setIsModalOpen(true);
  };

  // ABRIR PARA CATEGORÍA
  const openCategoryModal = () => {
    setModalType('CATEGORY');
    setIsEditing(false); // Por ahora solo crear
    setCurrentCategory({ name: "" });
    setIsModalOpen(true);
  };

  // GUARDAR (Router central de guardado)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (modalType === 'PRODUCT') {
        // --- LOGICA PRODUCTO ---
        if (isEditing && currentProduct.id) {
            await supabase.from('products').update({
                name: currentProduct.name,
                description: currentProduct.description,
                price: currentProduct.price,
                image_url: currentProduct.image_url,
                category_id: currentProduct.category_id,
            }).eq('id', currentProduct.id);
        } else {
            await supabase.from('products').insert([{
                ...currentProduct,
                is_active: true
            }]);
        }
      } else {
        // --- LOGICA CATEGORÍA ---
        // Insertamos simple (sin slug ni orden por ahora para no complicar)
        await supabase.from('categories').insert([{
            name: currentCategory.name,
            slug: currentCategory.name?.toLowerCase().replace(/ /g, '-'), // Slug automático básico
            sort_order: categories.length + 1 // Lo ponemos al final
        }]);
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="w-full min-h-screen bg-[#050505] text-white font-display pb-20 animate-fade-in">
      
      {/* HEADER FIJO */}
      <header className="sticky top-0 z-30 bg-[#101922]/95 backdrop-blur-md border-b border-white/5 px-4 py-4 space-y-4">
        
        {/* Fila 1: Título y Logout */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-black tracking-widest uppercase bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              ADMIN
            </h1>
            <button onClick={handleLogout} className="text-slate-500 hover:text-red-400 transition-colors">
                <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          </div>
        </div>

        {/* Fila 2: Botones de Acción (Doble botonera) */}
        <div className="grid grid-cols-2 gap-3">
            <button 
                onClick={() => openProductModal()}
                className="bg-primary hover:bg-blue-600 text-white py-2.5 rounded-xl text-xs font-bold tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20"
            >
                <span className="material-symbols-outlined text-sm">lunch_dining</span>
                NUEVO PLATO
            </button>

            <button 
                onClick={openCategoryModal}
                className="bg-[#1A1A1A] border border-white/10 hover:border-white/30 text-white py-2.5 rounded-xl text-xs font-bold tracking-wider flex items-center justify-center gap-2 transition-all"
            >
                <span className="material-symbols-outlined text-sm">category</span>
                NUEVA CAT.
            </button>
        </div>

        {/* Fila 3: Tabs de Categorías (Scroll horizontal) */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
            <button
                onClick={() => setSelectedCategoryId(null)}
                className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide border whitespace-nowrap transition-all ${
                    selectedCategoryId === null 
                    ? "bg-white text-black border-white" 
                    : "bg-transparent text-slate-500 border-white/10 hover:border-white/30"
                }`}
            >
                Todos
            </button>
            {categories.map(cat => (
                <button
                    key={cat.id}
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide border whitespace-nowrap transition-all ${
                        selectedCategoryId === cat.id
                        ? "bg-white text-black border-white" 
                        : "bg-transparent text-slate-500 border-white/10 hover:border-white/30"
                    }`}
                >
                    {cat.name}
                </button>
            ))}
        </div>
      </header>

      {/* LISTA DE PRODUCTOS */}
      <div className="max-w-4xl mx-auto p-4 grid gap-3">
        {filteredProducts.map((product) => (
          <div 
            key={product.id} 
            className={`flex items-stretch gap-3 bg-[#101922] p-3 rounded-xl border transition-all ${product.is_active ? 'border-white/5' : 'border-red-900/30 opacity-60'}`}
          >
            {/* FIX IMAGEN: 
               1. shrink-0: Evita que se aplaste.
               2. w-20 h-20: Tamaño fijo cuadrado.
               3. object-cover: Recorta la imagen para llenar el cuadrado sin deformar.
            */}
            <div 
              className="w-20 h-20 rounded-lg bg-cover bg-center shrink-0 border border-white/10 bg-slate-800"
              style={{ backgroundImage: `url('${product.image_url}')` }}
            ></div>

            {/* Contenido (min-w-0 es CLAVE para que el texto trunque y no rompa el ancho) */}
            <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5">
              <div>
                <div className="flex justify-between items-start">
                    <h3 className="font-bold text-white text-sm truncate pr-2">{product.name}</h3>
                    <p className="text-accent font-bold text-sm whitespace-nowrap">${product.price.toLocaleString("es-AR")}</p>
                </div>
                <p className="text-[10px] text-slate-500 line-clamp-2 leading-tight mt-0.5">{product.description}</p>
              </div>
              
              {/* Botonera interna */}
              <div className="flex items-center justify-end gap-3 mt-2">
                 <button onClick={() => handleToggleActive(product)} className={`text-[10px] font-bold uppercase tracking-wide ${product.is_active ? 'text-green-400' : 'text-slate-500'}`}>
                    {product.is_active ? 'Activo' : 'Inactivo'}
                 </button>
                 <div className="w-px h-3 bg-white/10"></div>
                 <button onClick={() => openProductModal(product)} className="text-slate-400 hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                 </button>
                 <button onClick={() => handleDeleteProduct(product.id)} className="text-slate-400 hover:text-red-400 transition-colors">
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                 </button>
              </div>
            </div>
          </div>
        ))}

        {filteredProducts.length === 0 && (
            <div className="text-center py-10 opacity-50">
                <p className="text-sm">No hay productos en esta categoría.</p>
            </div>
        )}
      </div>

      {/* --- MODAL UNIFICADO --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in sm:p-4">
          <div className="bg-[#101922] w-full max-w-md rounded-t-2xl sm:rounded-2xl border-t sm:border border-white/10 shadow-2xl flex flex-col max-h-[90vh]">
            
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#0a1016]">
              <h3 className="font-bold text-white tracking-wider text-sm">
                {modalType === 'PRODUCT' 
                    ? (isEditing ? 'EDITAR PLATO' : 'NUEVO PLATO') 
                    : 'NUEVA CATEGORÍA'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4">
              
              {/* FORMULARIO DE PRODUCTO */}
              {modalType === 'PRODUCT' && (
                  <>
                    <div>
                        <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Nombre</label>
                        <input 
                        type="text" 
                        value={currentProduct.name} 
                        onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})}
                        className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none mt-1"
                        required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                        <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Categoría</label>
                        <select 
                            value={currentProduct.category_id} 
                            onChange={e => setCurrentProduct({...currentProduct, category_id: e.target.value})}
                            className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none mt-1 appearance-none"
                        >
                            {categories.map(c => (
                            <option key={c.id} value={c.id} className="bg-[#101922]">{c.name}</option>
                            ))}
                        </select>
                        </div>
                        <div>
                        <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Precio ($)</label>
                        <input 
                            type="number" 
                            value={currentProduct.price} 
                            onChange={e => setCurrentProduct({...currentProduct, price: Number(e.target.value)})}
                            className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none mt-1"
                            required
                        />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Descripción</label>
                        <textarea 
                        value={currentProduct.description || ""} 
                        onChange={e => setCurrentProduct({...currentProduct, description: e.target.value})}
                        className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none mt-1 h-20 resize-none"
                        />
                    </div>

                    <div>
                        <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">URL Imagen</label>
                        <input 
                        type="text" 
                        value={currentProduct.image_url || ""} 
                        onChange={e => setCurrentProduct({...currentProduct, image_url: e.target.value})}
                        placeholder="https://..."
                        className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white text-xs focus:border-primary outline-none mt-1"
                        />
                    </div>
                  </>
              )}

              {/* FORMULARIO DE CATEGORÍA */}
              {modalType === 'CATEGORY' && (
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Nombre de Categoría</label>
                    <input 
                      type="text" 
                      value={currentCategory.name || ''} 
                      onChange={e => setCurrentCategory({...currentCategory, name: e.target.value})}
                      placeholder="Ej: Postres, Vinos..."
                      className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none mt-1"
                      required
                    />
                    <p className="text-[10px] text-slate-600 mt-2">Se creará automáticamente al final de la lista.</p>
                  </div>
              )}

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? 'Guardando...' : 'GUARDAR'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}