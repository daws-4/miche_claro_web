'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Card, CardBody, Input, Button, Select, SelectItem, addToast, Switch } from '@heroui/react';
import { TrashIcon } from "@/components/icons"; // Asume que tienes un icono de basura
import axios from 'axios';

// --- Constantes y Tipos ---

// Listas de categorías extraídas del Schema para usar en el frontend
const categoriasBebida = [
    "Cerveza", "Ron", "Whisky", "Vodka", "Tequila", "Ginebra", "Vino Tinto", "Vino Blanco",
    "Vino Rosado", "Aguardiente / Anisados", "Sangría / Cocteles Preparados", "Brandy / Coñac",
    "Licores / Cremas", "Champagne / Espumosos", "Bebidas sin Alcohol"
];
const categoriasComida = [
    "Hamburguesas", "Perros Calientes (Hot Dogs)", "Pizzas", "Salchipapas / Papas Fritas",
    "Pepitos", "Empanadas", "Tacos / Burritos", "Tequeños / Dedos de Queso",
    "Shawarmas / Döner Kebab", "Alitas de Pollo / Costillas", "Parrilla / Pinchos",
    "Pastelitos", "Mazorcas / Elotes", "Dulces / Postres", "Snacks / Pasapalos"
];

const tiposProducto = ["bebida", "comida", "otro"].map(t => ({ key: t, label: t.charAt(0).toUpperCase() + t.slice(1) }));
const unidadesContenido = ['ml', 'L', 'g', 'kg', 'unidades'].map(u => ({ key: u, label: u }));

type ProductoForm = {
    _id?: string;
    nombre: string;
    descripcion?: string;
    marca?: string;
    tipo: string;
    categoria: string;
    subcategoria?: string;
    contenido: {
        valor: number | string;
        unidad: string;
    };
    precio: number | string;
    stock: number | string;
    imagenes: string[];
    publicado: boolean;
};

type ProductoStored = ProductoForm & { _id: string; createdAt: string; };

type ProductoFormModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: ProductoForm) => void;
    producto: ProductoForm | null;
    isEditMode: boolean;
};

const initialStateForm: ProductoForm = {
    nombre: '', descripcion: '', marca: '', tipo: 'bebida', categoria: '', subcategoria: '',
    contenido: { valor: '', unidad: 'ml' },
    precio: '', stock: 0, imagenes: [], publicado: true,
};

// --- Componente del Formulario Modal ---
const ProductoFormModal = ({ isOpen, onClose, onSubmit, producto, isEditMode }: ProductoFormModalProps) => {
    const [formData, setFormData] = useState<ProductoForm>(initialStateForm);

    useEffect(() => {
        if (isOpen) {
            const initialState = isEditMode && producto ? producto : initialStateForm;
            setFormData(initialState);
        }
    }, [isOpen, isEditMode, producto]);

    // Filtra las categorías disponibles según el tipo de producto seleccionado
    const categoriasDisponibles = useMemo(() => {
        if (formData.tipo === 'bebida') return categoriasBebida;
        if (formData.tipo === 'comida') return categoriasComida;
        return []; // No hay categorías para "otro"
    }, [formData.tipo]);

    // Resetea la categoría si el tipo cambia y la categoría actual ya no es válida
    useEffect(() => {
        if (!categoriasDisponibles.includes(formData.categoria)) {
            setFormData(prev => ({ ...prev, categoria: '' }));
        }
    }, [categoriasDisponibles, formData.categoria]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        const valueToUpdate = type === 'number' ? parseFloat(value) || '' : value;

        setFormData(prev => {
            const newFormData = { ...prev };
            if (name.includes('.')) {
                const [parentKey, childKey] = name.split('.');
                if (parentKey === 'contenido') {
                    newFormData.contenido = { ...newFormData.contenido, [childKey]: valueToUpdate };
                }
            } else {
                (newFormData as any)[name] = valueToUpdate;
            }
            return newFormData;
        });
    };

    const handleSelectChange = (name: string, value: string | null) => {
        if (value === null) return; // No hacer nada si se deselecciona
        setFormData(prev => ({
            ...prev,
            ...(name === 'tipo' && { tipo: value }),
            ...(name === 'categoria' && { categoria: value }),
            ...(name === 'contenido.unidad' && { contenido: { ...prev.contenido, unidad: value } })
        }));
    };

    // Simulación de subida de imágenes
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const fileUrls = Array.from(e.target.files).map(file => URL.createObjectURL(file));
            setFormData(prev => ({ ...prev, imagenes: [...prev.imagenes, ...fileUrls] }));
        }
    };

    const handleRemoveImage = (index: number) => {
        setFormData(prev => ({ ...prev, imagenes: prev.imagenes.filter((_, i) => i !== index) }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">{isEditMode ? 'Editar Producto' : 'Crear Nuevo Producto'}</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Fieldset: Información Básica */}
                    <fieldset className="p-4 border rounded-lg">
                        <legend className="font-semibold px-2">Información Básica</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input name="nombre" value={formData.nombre} onChange={handleChange} label="Nombre del Producto" required />
                            <Input name="marca" value={formData.marca || ''} onChange={handleChange} label="Marca" />
                            <Input name="descripcion" value={formData.descripcion || ''} onChange={handleChange} label="Descripción" className="md:col-span-2" />
                        </div>
                    </fieldset>

                    {/* Fieldset: Categorización (ACTUALIZADO) */}
                    <fieldset className="p-4 border rounded-lg">
                        <legend className="font-semibold px-2">Categorización</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Select label="Tipo" selectedKeys={[formData.tipo]} onSelectionChange={(keys) => handleSelectChange('tipo', Array.from(keys)[0] as string)} isRequired>
                                {tiposProducto.map(t => <SelectItem key={t.key}>{t.label}</SelectItem>)}
                            </Select>

                            <Select label="Categoría" selectedKeys={formData.categoria ? [formData.categoria] : []} onSelectionChange={(keys) => handleSelectChange('categoria', Array.from(keys)[0] as string)} isRequired isDisabled={categoriasDisponibles.length === 0}>
                                {categoriasDisponibles.map(c => <SelectItem key={c}>{c}</SelectItem>)}
                            </Select>

                            <Input name="subcategoria" value={formData.subcategoria || ''} onChange={handleChange} label="Sub-categoría (Opcional)" className="md:col-span-2" />
                        </div>
                    </fieldset>

                    {/* Fieldset: Precio e Inventario */}
                    <fieldset className="p-4 border rounded-lg">
                        <legend className="font-semibold px-2">Precio e Inventario</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input name="precio" type="number" value={String(formData.precio)} onChange={handleChange} label="Precio ($)" required />
                            <Input name="stock" type="number" value={String(formData.stock)} onChange={handleChange} label="Cantidad en Stock" required />
                            <div className="flex items-center space-x-2 pt-5 md:col-span-2">
                                <Switch isSelected={formData.publicado} onValueChange={(v) => setFormData(p => ({ ...p, publicado: v }))} />
                                <label className="text-sm font-medium">Publicado</label>
                            </div>
                        </div>
                    </fieldset>

                    {/* Fieldset: Detalles Físicos */}
                    <fieldset className="p-4 border rounded-lg">
                        <legend className="font-semibold px-2">Detalles Físicos</legend>
                        <div className="flex gap-4">
                            <Input name="contenido.valor" type="number" value={String(formData.contenido.valor)} onChange={handleChange} label="Contenido" required />
                            <Select label="Unidad" selectedKeys={[formData.contenido.unidad]} onSelectionChange={(keys) => handleSelectChange('contenido.unidad', Array.from(keys)[0] as string)} isRequired>
                                {unidadesContenido.map(u => <SelectItem key={u.key}>{u.label}</SelectItem>)}
                            </Select>
                        </div>
                    </fieldset>

                    {/* Fieldset: Imágenes del Producto */}
                    <fieldset className="p-4 border rounded-lg">
                        <legend className="font-semibold px-2">Imágenes del Producto</legend>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {formData.imagenes.map((imgUrl, index) => (
                                <div key={index} className="relative group">
                                    <img src={imgUrl} alt={`Imagen ${index + 1}`} className="w-full h-32 object-cover rounded-md" />
                                    <Button isIconOnly color="danger" size="sm" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100" onPress={() => handleRemoveImage(index)}>
                                        <TrashIcon />
                                    </Button>
                                </div>
                            ))}
                            <label className="w-full h-32 border-2 border-dashed rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-50">
                                <span className="text-gray-500">+ Añadir</span>
                                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                            </label>
                        </div>
                    </fieldset>

                    <div className="flex justify-end gap-4 mt-6">
                        <Button type="button" onPress={onClose} className="bg-gray-200">Cancelar</Button>
                        <Button type="submit" className="bg-[#007D8A] text-white">{isEditMode ? 'Guardar Cambios' : 'Crear Producto'}</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// --- Componente Principal de la Página ---
export default function GestionProductosPage() {
    const [productos, setProductos] = useState<ProductoStored[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState<ProductoForm | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [tipoFiltro, setTipoFiltro] = useState('Todos');
    const [currentPage, setCurrentPage] = useState(1);
    const productosPorPagina = 12;

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('/api/dashboard/productos');
            if (response.data.success) {
                setProductos(response.data.data);
            }
        } catch (error) {
            addToast({ title: "Error", description: "No se pudieron cargar los productos.", color: "danger" });
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const productosFiltrados = useMemo(() => {
        return productos
            .filter(p => tipoFiltro === 'Todos' || p.tipo === tipoFiltro)
            .filter(p => {
                const term = searchTerm.toLowerCase();
                return (
                    p.nombre.toLowerCase().includes(term) ||
                    (p.marca || '').toLowerCase().includes(term) ||
                    p.categoria.toLowerCase().includes(term)
                );
            });
    }, [productos, searchTerm, tipoFiltro]);

    const paginasTotales = Math.ceil(productosFiltrados.length / productosPorPagina);
    const productosPaginados = useMemo(() => {
        const inicio = (currentPage - 1) * productosPorPagina;
        return productosFiltrados.slice(inicio, inicio + productosPorPagina);
    }, [currentPage, productosFiltrados]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, tipoFiltro]);

    const handleAñadir = () => {
        setIsEditMode(false);
        setProductoSeleccionado(null);
        setIsModalOpen(true);
    };

    const handleEditar = (producto: ProductoStored) => {
        setIsEditMode(true);
        setProductoSeleccionado(producto);
        setIsModalOpen(true);
    };

    const handleEliminar = async (id: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            try {
                await axios.delete(`/api/dashboard/productos?id=${id}`);
                addToast({ title: "Éxito", description: "Producto eliminado correctamente." });
                fetchData();
            } catch (error) {
                addToast({ title: "Error", description: "No se pudo eliminar el producto.", color: "danger" });
            }
        }
    };

    const handleFormSubmit = async (formData: ProductoForm) => {
        try {
            if (isEditMode && formData._id) {
                await axios.put(`/api/dashboard/productos?id=${formData._id}`, formData);
                addToast({ title: "Éxito", description: "Producto actualizado correctamente." });
            } else {
                await axios.post('/api/dashboard/productos', formData);
                addToast({ title: "Éxito", description: "Producto creado correctamente." });
            }
            fetchData();
            setIsModalOpen(false);
        } catch (error: any) {
            const errorMsg = error.response?.data?.error || "No se pudo guardar el producto.";
            addToast({ title: "Error", description: errorMsg, color: "danger" });
        }
    };

    if (isLoading) {
        return <div className="p-6 text-center text-gray-500">Cargando productos...</div>
    }

    const filtroTipoOptions = [{ key: 'Todos', label: 'Todos los tipos' }, ...tiposProducto];

    return (
        <>
            <ProductoFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleFormSubmit}
                producto={productoSeleccionado}
                isEditMode={isEditMode}
            />
            <div className="p-4 md:p-6 space-y-6 bg-white min-h-screen text-black">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <h1 className="text-2xl font-bold">Gestión de Productos</h1>
                    <Button onPress={handleAñadir} className="bg-[#007D8A] text-white font-semibold">Añadir Producto</Button>
                </div>

                {/* Filtros */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <Input
                        type="text"
                        placeholder="Buscar por nombre, marca o categoría..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                    />
                    <Select
                        placeholder="Filtrar por tipo"
                        selectedKeys={tipoFiltro !== 'Todos' ? [tipoFiltro] : []}
                        onSelectionChange={(keys) => setTipoFiltro(Array.from(keys)[0] as string || 'Todos')}
                        className="w-full sm:max-w-xs"
                    >
                        {filtroTipoOptions.map(t => <SelectItem key={t.key}>{t.label}</SelectItem>)}
                    </Select>
                </div>

                {/* Grid de Productos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {productosPaginados.map(producto => (
                        <Card key={producto._id} className="shadow-lg flex flex-col">
                            <img src={producto.imagenes[0] || 'https://placehold.co/600x400/EEE/31343C?text=Sin+Imagen'} alt={producto.nombre} className="w-full h-40 object-cover rounded-t-xl" />
                            <CardBody className="p-4 flex flex-col flex-grow">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-lg">{producto.nombre}</h3>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${producto.publicado ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {producto.publicado ? 'Publicado' : 'Oculto'}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">{producto.marca}</p>
                                <p className="text-lg font-semibold mt-2">${Number(producto.precio).toLocaleString()}</p>
                                <p className="text-sm text-gray-600">Stock: {producto.stock}</p>
                                <div className="mt-auto pt-4 flex justify-end gap-2">
                                    <Button onPress={() => handleEditar(producto)} size="sm" className="text-sm bg-orange-500 text-white">Editar</Button>
                                    <Button onPress={() => handleEliminar(producto._id)} size="sm" className="text-sm bg-red-600 text-white">
                                        <TrashIcon className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>

                {/* Paginación */}
                {paginasTotales > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-8">
                        <Button onPress={() => setCurrentPage(p => p - 1)} isDisabled={currentPage === 1}>
                            Anterior
                        </Button>
                        <span className="text-gray-700">
                            Página {currentPage} de {paginasTotales}
                        </span>
                        <Button onPress={() => setCurrentPage(p => p + 1)} isDisabled={currentPage === paginasTotales}>
                            Siguiente
                        </Button>
                    </div>
                )}

                {/* Mensaje de no resultados */}
                {productosFiltrados.length === 0 && !isLoading && (
                    <div className="text-center py-16 border-2 border-dashed rounded-xl">
                        <p className="text-gray-500">No se encontraron productos con los filtros actuales.</p>
                    </div>
                )}
            </div>
        </>
    );
}