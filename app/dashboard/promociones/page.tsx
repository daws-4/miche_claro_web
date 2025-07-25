// Ruta: app/dashboard/ofertas/page.tsx

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardBody, Input, Button, Select, SelectItem, addToast, Switch } from '@heroui/react';
import { TrashIcon, PencilIcon, XMarkIcon } from "@/components/icons";
import axios from 'axios';

// --- Constantes y Tipos (sin cambios) ---
const tiposOferta = [{ key: 'PORCENTAJE', label: 'Porcentaje (%)' }, { key: 'MONTO_FIJO', label: 'Monto Fijo ($)' }];
const todasLasCategorias = [
    "Cerveza", "Ron", "Whisky", "Vodka", "Tequila", "Ginebra", "Vino Tinto", "Vino Blanco",
    "Vino Rosado", "Aguardiente / Anisados", "Sangría / Cocteles Preparados", "Brandy / Coñac",
    "Licores / Cremas", "Champagne / Espumosos", "Bebidas sin Alcohol", "Hamburguesas",
    "Perros Calientes (Hot Dogs)", "Pizzas", "Salchipapas / Papas Fritas", "Pepitos", "Empanadas",
    "Tacos / Burritos", "Tequeños / Dedos de Queso", "Shawarmas / Döner Kebab",
    "Alitas de Pollo / Costillas", "Parrilla / Pinchos", "Pastelitos", "Mazorcas / Elotes",
    "Dulces / Postres", "Snacks / Pasapalos"
];

interface OfertaForm {
    _id?: string;
    nombre: string;
    tipo: string;
    valor: number | string;
    productos_aplicables: string[];
    categorias_aplicables: string[];
    fecha_inicio: string;
    fecha_fin: string;
    activo: boolean;
}

interface OfertaStored extends OfertaForm { _id: string; createdAt: string; }
interface ProductoSimple { _id: string; nombre: string; }

interface OfertaFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: OfertaForm) => void;
    oferta: OfertaForm | null;
    isEditMode: boolean;
}

const initialState: OfertaForm = {
    nombre: '', tipo: 'PORCENTAJE', valor: '', productos_aplicables: [],
    categorias_aplicables: [], fecha_inicio: '', fecha_fin: '', activo: true,
};

// --- Componente del Formulario Modal (ACTUALIZADO) ---
const OfertaFormModal: React.FC<OfertaFormModalProps> = ({ isOpen, onClose, onSubmit, oferta, isEditMode }) => {
    const [formData, setFormData] = useState<OfertaForm>(initialState);
    const [productosVendedor, setProductosVendedor] = useState<ProductoSimple[]>([]);

    const [busquedaCategoria, setBusquedaCategoria] = useState('');
    const [busquedaProducto, setBusquedaProducto] = useState('');
    const [isCategoriaListOpen, setIsCategoriaListOpen] = useState(false);
    const [isProductoListOpen, setIsProductoListOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            axios.get('/api/dashboard/productos')
                .then(res => setProductosVendedor(res.data.data))
                .catch(() => addToast({ title: "Error", description: "No se pudieron cargar tus productos.", color: "danger" }));
        }
    }, [isOpen]);

    const formatDateForInput = (dateString: string | undefined): string => {
        if (!dateString) return '';
        try { return new Date(dateString).toISOString().split('T')[0]; } catch (e) { return ''; }
    };

    useEffect(() => {
        if (isOpen) {
            const initialFormState = isEditMode && oferta ? {
                ...oferta,
                fecha_inicio: formatDateForInput(oferta.fecha_inicio),
                fecha_fin: formatDateForInput(oferta.fecha_fin),
            } : initialState;
            setFormData(initialFormState);
            setBusquedaCategoria('');
            setBusquedaProducto('');
        }
    }, [isOpen, isEditMode, oferta]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) || '' : value }));
    };

    const handleSingleSelectChange = (keys: unknown) => {
        const keySet = keys as Set<React.Key>;
        const tipo = Array.from(keySet)[0];
        if (tipo) setFormData(p => ({ ...p, tipo: String(tipo) }));
    }

    const handleSelectCategoria = (categoria: string) => {
        if (!formData.categorias_aplicables.includes(categoria)) {
            setFormData(prev => ({ ...prev, categorias_aplicables: [...prev.categorias_aplicables, categoria] }));
        }
        setBusquedaCategoria('');
        setIsCategoriaListOpen(false);
    }
    const handleDeselectCategoria = (categoria: string) => {
        setFormData(prev => ({ ...prev, categorias_aplicables: prev.categorias_aplicables.filter(c => c !== categoria) }));
    }

    const handleSelectProducto = (productoId: string) => {
        if (!formData.productos_aplicables.includes(productoId)) {
            setFormData(prev => ({ ...prev, productos_aplicables: [...prev.productos_aplicables, productoId] }));
        }
        setBusquedaProducto('');
        setIsProductoListOpen(false);
    }
    const handleDeselectProducto = (productoId: string) => {
        setFormData(prev => ({ ...prev, productos_aplicables: prev.productos_aplicables.filter(p => p !== productoId) }));
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (formData.productos_aplicables.length === 0 && formData.categorias_aplicables.length === 0) {
            addToast({ title: "Validación fallida", description: "Debes seleccionar al menos una categoría o un producto.", color: "warning" });
            return;
        }
        onSubmit(formData);
    };

    const categoriasFiltradas = todasLasCategorias.filter(c => c.toLowerCase().includes(busquedaCategoria.toLowerCase()) && !formData.categorias_aplicables.includes(c));
    const productosFiltrados = productosVendedor.filter(p => p.nombre.toLowerCase().includes(busquedaProducto.toLowerCase()) && !formData.productos_aplicables.includes(p._id));

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6">{isEditMode ? 'Editar Oferta' : 'Crear Nueva Oferta'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input name="nombre" value={formData.nombre} onChange={handleChange} label="Nombre de la Oferta" required />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Select label="Tipo de Descuento" selectedKeys={[formData.tipo]} onSelectionChange={handleSingleSelectChange} isRequired>
                            {tiposOferta.map(t => <SelectItem key={t.key}>{t.label}</SelectItem>)}
                        </Select>
                        <Input name="valor" type="number" value={String(formData.valor)} onChange={handleChange} label="Valor del Descuento" required />
                    </div>

                    <div className="relative">
                        <Input
                            label="Categorías Aplicables"
                            placeholder="Busca una categoría..."
                            value={busquedaCategoria}
                            onChange={(e) => setBusquedaCategoria(e.target.value)}
                            onFocus={() => setIsCategoriaListOpen(true)}
                            onBlur={() => setTimeout(() => setIsCategoriaListOpen(false), 150)}
                        />
                        {isCategoriaListOpen && busquedaCategoria && categoriasFiltradas.length > 0 && (
                            // ---- CAMBIO AQUÍ ----
                            <ul className="absolute z-30 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto shadow-lg">
                                {categoriasFiltradas.map(c => <li key={c} onMouseDown={() => handleSelectCategoria(c)} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">{c}</li>)}
                            </ul>
                        )}
                        <div className="flex flex-wrap gap-2 mt-2">
                            {formData.categorias_aplicables.map(c => <div key={c} className="flex items-center bg-gray-200 rounded-full px-3 py-1 text-sm">{c} <button type="button" onClick={() => handleDeselectCategoria(c)} className="ml-2 text-gray-600 hover:text-black"><XMarkIcon className="h-4 w-4 hover:cursor-pointer" /></button></div>)}
                        </div>
                    </div>

                    <div className="relative">
                        <Input
                            label="Productos Específicos Aplicables"
                            placeholder="Busca un producto..."
                            value={busquedaProducto}
                            onChange={(e) => setBusquedaProducto(e.target.value)}
                            onFocus={() => setIsProductoListOpen(true)}
                            onBlur={() => setTimeout(() => setIsProductoListOpen(false), 150)}
                        />
                        {isProductoListOpen && busquedaProducto && productosFiltrados.length > 0 && (
                            // ---- Y CAMBIO AQUÍ ----
                            <ul className="absolute z-30 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto shadow-lg">
                                {productosFiltrados.map(p => <li key={p._id} onMouseDown={() => handleSelectProducto(p._id)} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">{p.nombre}</li>)}
                            </ul>
                        )}
                        <div className="flex flex-wrap gap-2 mt-2">
                            {formData.productos_aplicables.map(pId => {
                                const producto = productosVendedor.find(p => p._id === pId);
                                return (<div key={pId} className="flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm">{producto?.nombre || '...'} <button type="button" onClick={() => handleDeselectProducto(pId)} className="ml-2 text-blue-600 hover:text-black"><XMarkIcon className="h-4 w-4 hover:cursor-pointer" /></button></div>)
                            })}
                        </div>
                    </div>

                    <p className="text-xs text-gray-500 -mt-2">Debes seleccionar al menos una categoría o un producto.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input name="fecha_inicio" type="date" value={formData.fecha_inicio} onChange={handleChange} label="Fecha de Inicio" required />
                        <Input name="fecha_fin" type="date" value={formData.fecha_fin} onChange={handleChange} label="Fecha de Fin (opcional)" />
                    </div>
                    <div className="flex items-center space-x-2 pt-2">
                        <Switch isSelected={formData.activo} onValueChange={(v) => setFormData(p => ({ ...p, activo: v }))} />
                        <label className="text-sm font-medium">Oferta Activa</label>
                    </div>
                    <div className="flex justify-end gap-4 mt-8">
                        <Button type="button" onPress={onClose} className="bg-gray-200">Cancelar</Button>
                        <Button type="submit" className="bg-[#007D8A] text-white">{isEditMode ? 'Guardar Cambios' : 'Crear Oferta'}</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- El componente principal de la página no necesita cambios ---
export default function GestionOfertasPage() {
    // ... (El resto del componente es idéntico al anterior)
    const [ofertas, setOfertas] = useState<OfertaStored[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [ofertaSeleccionada, setOfertaSeleccionada] = useState<OfertaForm | null>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('/api/dashboard/promociones');
            if (response.data.success) setOfertas(response.data.data);
        } catch (error) {
            addToast({ title: "Error", description: "No se pudieron cargar las ofertas.", color: "danger" });
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchData() }, [fetchData]);

    const handleAñadir = () => {
        setIsEditMode(false);
        setOfertaSeleccionada(null);
        setIsModalOpen(true);
    };

    const handleEditar = (oferta: OfertaStored) => {
        setIsEditMode(true);
        setOfertaSeleccionada(oferta);
        setIsModalOpen(true);
    };

    const handleEliminar = async (id: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta oferta?')) {
            try {
                await axios.delete(`/api/dashboard/promociones?id=${id}`);
                addToast({ title: "Éxito", description: "Oferta eliminada correctamente." });
                fetchData();
            } catch (error) {
                addToast({ title: "Error", description: "No se pudo eliminar la oferta.", color: "danger" });
            }
        }
    };

    const handleFormSubmit = async (formData: OfertaForm) => {
        try {
            if (isEditMode && formData._id) {
                await axios.put(`/api/dashboard/promociones?id=${formData._id}`, formData);
                addToast({ title: "Éxito", description: "Oferta actualizada." });
            } else {
                await axios.post('/api/dashboard/promociones', formData);
                addToast({ title: "Éxito", description: "Oferta creada." });
            }
            fetchData();
            setIsModalOpen(false);
        } catch (error: any) {
            const errorMsg = error.response?.data?.error || "No se pudo guardar la oferta.";
            addToast({ title: "Error", description: errorMsg, color: "danger" });
        }
    };

    if (isLoading) return <div className="p-6 text-center">Cargando ofertas...</div>

    return (
        <>
            <OfertaFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleFormSubmit} oferta={ofertaSeleccionada} isEditMode={isEditMode} />
            <div className="p-4 md:p-6 space-y-6 bg-white min-h-screen text-black">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <h1 className="text-2xl font-bold">Gestión de Ofertas</h1>
                    <Button onPress={handleAñadir} className="bg-[#007D8A] text-white font-semibold">Añadir Oferta</Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ofertas.map(oferta => (
                        <Card key={oferta._id} className="shadow-lg">
                            <CardBody className="p-5 flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg">{oferta.nombre}</h3>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${oferta.activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{oferta.activo ? 'Activa' : 'Inactiva'}</span>
                                </div>
                                <p className="text-blue-600 font-semibold">{oferta.tipo === 'PORCENTAJE' ? `${oferta.valor}% de descuento` : `$${oferta.valor} de descuento`}</p>
                                <div className="text-sm text-gray-500 mt-3">
                                    <p>Aplica a: {oferta.categorias_aplicables?.length > 0 ? `${oferta.categorias_aplicables.join(', ')}` : oferta.productos_aplicables?.length > 0 ? `${oferta.productos_aplicables.length} producto(s)` : 'Toda la tienda'}</p>
                                    <p>Válida desde: {new Date(oferta.fecha_inicio).toLocaleDateString()}</p>
                                    {oferta.fecha_fin && <p>Hasta: {new Date(oferta.fecha_fin).toLocaleDateString()}</p>}
                                </div>
                                <div className="mt-auto pt-4 flex justify-end gap-2">
                                    <Button onPress={() => handleEditar(oferta)} size="sm" isIconOnly className="bg-orange-500 text-white"><PencilIcon className="h-4 w-4" /></Button>
                                    <Button onPress={() => handleEliminar(oferta._id)} size="sm" isIconOnly className="bg-red-600 text-white"><TrashIcon className="h-4 w-4" /></Button>
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
                {ofertas.length === 0 && !isLoading && (
                    <div className="text-center py-16 border-2 border-dashed rounded-xl">
                        <p className="text-gray-500">Aún no has creado ninguna oferta.</p>
                        <Button onPress={handleAñadir} className="mt-4 bg-[#007D8A] text-white">Crear mi primera oferta</Button>
                    </div>
                )}
            </div>
        </>
    );
}