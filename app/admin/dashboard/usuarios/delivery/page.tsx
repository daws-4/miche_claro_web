'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardBody, Input, Button, Checkbox, Select, SelectItem, addToast, Link } from '@heroui/react';
import { EyeFilledIcon, EyeSlashFilledIcon } from "@/components/icons"; // Asume que tienes estos iconos
import axios from 'axios';

// --- Constantes para los Selectores ---
const tiposDeVehiculo = ['Moto', 'Bicicleta', 'Carro', 'Otro'].map(v => ({ key: v, label: v }));
const estadosDeVenezuela = [
    "Amazonas", "Anzoátegui", "Apure", "Aragua", "Barinas", "Bolívar", "Carabobo",
    "Cojedes", "Delta Amacuro", "Falcón", "Guárico", "Lara", "Mérida", "Miranda",
    "Monagas", "Nueva Esparta", "Portuguesa", "Sucre", "Táchira", "Trujillo",
    "Vargas", "Yaracuy", "Zulia", "Distrito Capital"
].map(estado => ({ key: estado, label: estado }));


// --- Tipos de Datos para Delivery ---
type VehiculoForm = {
    tipo: string;
    marca?: string;
    modelo?: string;
    placa?: string;
    color?: string;
};

type UsuarioDeliveryForm = {
    _id?: string;
    nombre: string;
    apellido: string;
    cedula: string;
    telefono: string;
    email: string;
    password?: string;
    direccion: string;
    estado: string;
    fecha_nacimiento: string;
    vehiculo: VehiculoForm;
    activo: boolean;
};

type UsuarioDeliveryStored = {
    _id: string;
    nombre: string;
    apellido: string;
    cedula: string;
    telefono: string;
    email: string;
    direccion: string;
    estado: string;
    fecha_nacimiento: string;
    vehiculo: {
        tipo: string;
        marca: string;
        modelo: string;
        placa: string;
        color: string;
    };
    estado_operativo: string;
    activo: boolean;
    createdAt: string;
};

type DeliveryFormModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: UsuarioDeliveryForm) => void;
    usuario: UsuarioDeliveryForm | null;
    isEditMode: boolean;
};

// --- Componente del Formulario Modal para Delivery ---
const DeliveryUserFormModal = ({ isOpen, onClose, onSubmit, usuario, isEditMode }: DeliveryFormModalProps) => {
    const [formData, setFormData] = useState<UsuarioDeliveryForm>({
        nombre: '', apellido: '', cedula: '', telefono: '', email: '', direccion: '',
        estado: '', fecha_nacimiento: '', activo: false,
        vehiculo: { tipo: 'Moto', marca: '', modelo: '', placa: '', color: '' },
    });

    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    useEffect(() => {
        if (isOpen) {
            const initialState = isEditMode && usuario ? usuario : {
                nombre: '', apellido: '', cedula: '', telefono: '', email: '', direccion: '',
                estado: '', fecha_nacimiento: '', activo: false,
                vehiculo: { tipo: 'Moto', marca: '', modelo: '', placa: '', color: '' },
            };
            setFormData(initialState);
        }
    }, [isOpen, isEditMode, usuario]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        const valueToUpdate = type === 'checkbox' ? checked : value;

        setFormData(prev => {
            const newFormData = { ...prev };
            if (name.includes('.')) {
                const [parentKey, childKey] = name.split('.');
                if (parentKey === 'vehiculo') {
                    newFormData.vehiculo = { ...newFormData.vehiculo, [childKey]: valueToUpdate };
                }
            } else {
                (newFormData as any)[name] = valueToUpdate;
            }
            return newFormData;
        });
    };

    const handleSelectChange = (name: string, value: string) => {
        if (name === 'estado') {
            setFormData(prev => ({ ...prev, estado: value }));
        } else if (name === 'vehiculo_tipo') {
            setFormData(prev => ({ ...prev, vehiculo: { ...prev.vehiculo, tipo: value } }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">{isEditMode ? 'Editar Repartidor' : 'Añadir Nuevo Repartidor'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <fieldset className="p-4 border rounded-lg">
                        <legend className="font-semibold px-2">Información Personal</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre" required />
                            <Input name="apellido" value={formData.apellido} onChange={handleChange} placeholder="Apellido" required />
                            <Input name="cedula" value={formData.cedula} onChange={handleChange} minLength={6}  placeholder="Cédula" required />
                            <Input name="telefono" value={formData.telefono} onChange={handleChange} placeholder="Teléfono" required />
                            <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" className="md:col-span-2" required />
                            <Input
                                name="password"
                                type={isVisible ? "text" : "password"}
                                minLength={6}
                                onChange={handleChange}
                                placeholder={isEditMode ? "Nueva Contraseña (opcional)" : "Contraseña"}
                                className="w-full md:col-span-2"
                                required={!isEditMode}
                                endContent={<button type="button" onClick={toggleVisibility} className="focus:outline-none">{isVisible ? <EyeSlashFilledIcon /> : <EyeFilledIcon />}</button>}
                            />
                            <Select label="Estado de Residencia" placeholder="Selecciona un estado" selectedKeys={formData.estado ? [formData.estado] : []} onSelectionChange={(keys) => handleSelectChange('estado', Array.from(keys)[0] as string)} isRequired>
                                {estadosDeVenezuela.map(e => <SelectItem key={e.key}>{e.label}</SelectItem>)}
                            </Select>
                            <Input name="direccion" value={formData.direccion} onChange={handleChange} placeholder="Dirección" required />
                            <Input name="fecha_nacimiento" value={formData.fecha_nacimiento} onChange={handleChange} type="date" label="Fecha de Nacimiento" className="md:col-span-2" required />
                        </div>
                    </fieldset>

                    <fieldset className="p-4 border rounded-lg">
                        <legend className="font-semibold px-2">Datos del Vehículo</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Select label="Tipo de Vehículo" placeholder="Selecciona un tipo" selectedKeys={[formData.vehiculo.tipo]} onSelectionChange={(keys) => handleSelectChange('vehiculo_tipo', Array.from(keys)[0] as string)} isRequired>
                                {tiposDeVehiculo.map(v => <SelectItem key={v.key}>{v.label}</SelectItem>)}
                            </Select>
                            <Input name="vehiculo.placa" value={formData.vehiculo.placa || ''} onChange={handleChange} placeholder="Placa" required={formData.vehiculo.tipo !== 'Bicicleta'} />
                            <Input name="vehiculo.marca" value={formData.vehiculo.marca || ''} onChange={handleChange} placeholder="Marca" />
                            <Input name="vehiculo.modelo" value={formData.vehiculo.modelo || ''} onChange={handleChange} placeholder="Modelo" />
                            <Input name="vehiculo.color" value={formData.vehiculo.color || ''} onChange={handleChange} placeholder="Color" />
                        </div>
                    </fieldset>

                    <fieldset className="p-4 border rounded-lg">
                        <legend className="font-semibold px-2">Estatus de la Cuenta</legend>
                        <div className="flex items-center space-x-2 pt-2">
                            <Checkbox id="activo" isSelected={formData.activo} onValueChange={(v) => setFormData(p => ({ ...p, activo: v }))} />
                            <label htmlFor="activo" className="text-sm font-medium text-gray-700">Cuenta Activada por Administrador</label>
                        </div>
                    </fieldset>

                    <div className="flex justify-end gap-4 mt-6">
                        <Button type="button" onPress={onClose} className="bg-gray-200">Cancelar</Button>
                        <Button type="submit" className="bg-[#007D8A] text-white">{isEditMode ? 'Guardar Cambios' : 'Añadir Repartidor'}</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Componente Principal de la Página ---
export default function GestionDeliveryPage() {
    const [admin, setAdmin] = useState<{ rol: number; estado: string } | null>(null);
    const [isAdminLoading, setIsAdminLoading] = useState(true);
    const [deliveryUsers, setDeliveryUsers] = useState<UsuarioDeliveryStored[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('Todos');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<UsuarioDeliveryForm | null>(null);

    // --- Obtener datos del admin y de los repartidores ---
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // Primero, verificar el estado de autenticación del admin
                const authResponse = await axios.get('/api/admin/auth-status');
                if (authResponse.data.success) {
                    const currentAdmin = authResponse.data.data;
                    setAdmin(currentAdmin);

                    // Aplicar el filtro de estado basado en el rol
                    if (currentAdmin.rol < 5) {
                        setFiltroEstado(currentAdmin.estado);
                    }
                }
            } catch (error) {
                console.error("No autenticado o error de sesión:", error);
                addToast({ title: "Error de Sesión", description: "No se pudo verificar su sesión.", color: "danger" });
            } finally {
                setIsAdminLoading(false);
            }

            // Luego, obtener la lista de repartidores
            try {
                const usersResponse = await axios.get('/api/admin/dashboard/usuarios/delivery');
                if (usersResponse.data.success) {
                    setDeliveryUsers(usersResponse.data.data);
                }
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status === 404) {
                    setDeliveryUsers([]);
                } else {
                    console.error("Error al obtener repartidores:", error);
                    addToast({ title: "Error", description: "No se pudieron cargar los repartidores.", color: "danger" });
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    const estadosDisponibles = useMemo(() => {
        // El super admin ve todos los estados, el admin regional solo ve el suyo
        if (admin && admin.rol < 5) {
            return [admin.estado];
        }
        return ['Todos', ...new Set(deliveryUsers.map(u => u.estado))].sort();
    }, [deliveryUsers, admin]);

    const usuariosFiltrados = useMemo(() =>
        deliveryUsers.filter(u =>
            (filtroEstado === 'Todos' || u.estado === filtroEstado) &&
            (u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.cedula.includes(searchTerm))
        ), [deliveryUsers, searchTerm, filtroEstado]
    );

    const handleAñadir = () => {
        setIsEditMode(false);
        setUsuarioSeleccionado(null);
        setIsModalOpen(true);
    };

    const handleEditar = (usuario: UsuarioDeliveryStored) => {
        setIsEditMode(true);
        setUsuarioSeleccionado(usuario);
        setIsModalOpen(true);
    };

    const handleEliminar = async (id: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar a este repartidor?')) {
            try {
                await axios.delete(`/api/admin/dashboard/usuarios/delivery?id=${id}`);
                addToast({ title: "Éxito", description: "Repartidor eliminado correctamente." });
                // Refrescar la lista después de eliminar
                const response = await axios.get('/api/admin/dashboard/usuarios/delivery');
                if (response.data.success) setDeliveryUsers(response.data.data);

            } catch (error) {
                console.error("Error al eliminar repartidor:", error);
                addToast({ title: "Error", description: "No se pudo eliminar al repartidor.", color: "danger" });
            }
        }
    };

    const handleFormSubmit = async (formData: UsuarioDeliveryForm) => {
        const processedData = { ...formData };
        if (!processedData.password) {
            delete processedData.password;
        }

        try {
            if (isEditMode && processedData._id) {
                await axios.put(`/api/admin/dashboard/usuarios/delivery?id=${processedData._id}`, processedData);
                addToast({ title: "Éxito", description: "Repartidor actualizado correctamente." });
            } else {
                await axios.post('/api/admin/dashboard/usuarios/delivery', processedData);
                addToast({ title: "Éxito", description: "Repartidor creado correctamente." });
            }
            // Refrescar la lista después de guardar
            const response = await axios.get('/api/admin/dashboard/usuarios/delivery');
            if (response.data.success) setDeliveryUsers(response.data.data);
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error al guardar el repartidor:", error);
            const errorMsg = axios.isAxiosError(error) ? error.response?.data?.error : "No se pudo guardar.";
            addToast({ title: "Error", description: errorMsg, color: "danger" });
        }
    };

    if (isLoading || isAdminLoading) {
        return <div className="p-6 text-center text-gray-500">Cargando...</div>
    }

    return (
        <>
            <DeliveryUserFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleFormSubmit}
                usuario={usuarioSeleccionado}
                isEditMode={isEditMode}
            />
            <div className="p-4 md:p-6 space-y-6 bg-white min-h-screen text-black">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <h1 className="text-2xl font-bold">Gestión de Repartidores</h1>
                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <Input type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full sm:w-auto" />
                        <select
                            value={filtroEstado}
                            onChange={(e) => setFiltroEstado(e.target.value)}
                            className="p-2 rounded-lg border border-gray-300 bg-white w-full sm:w-auto"
                            disabled={admin !== null && admin.rol < 5}
                            title={admin && admin.rol < 5 ? `Solo tienes acceso a la región de ${admin.estado}` : 'Selecciona una región'}
                        >
                            {estadosDisponibles.map(estado => <option key={estado} value={estado}>{estado}</option>)}
                        </select>
                        <Button onPress={handleAñadir} className="bg-[#007D8A] text-white font-semibold whitespace-nowrap">Añadir Repartidor</Button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {usuariosFiltrados.map(usuario => (
                        <Card key={usuario._id} className="border rounded-xl shadow-sm flex flex-col">
                            <CardBody className="p-4 space-y-2 flex-grow">
                                <div className="flex justify-between items-start">
                                    <Link key={usuario._id} href={`/admin/dashboard/usuarios/delivery/${usuario._id}`}>
                                        <h2 className="text-lg font-bold hover:underline">{usuario.nombre} {usuario.apellido}</h2>
                                    </Link>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${usuario.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {usuario.activo ? 'Activado' : 'Inactivo'}
                                    </span>
                                </div>
                                <p className="text-sm font-semibold text-gray-700">{usuario.estado}</p>
                                <p className="text-sm text-gray-600">{usuario.email}</p>
                                <p className="text-sm text-gray-500">Vehículo: {usuario.vehiculo.tipo} ({usuario.vehiculo.placa || 'N/A'})</p>
                            </CardBody>
                            <div className="p-4 border-t flex justify-end gap-2">
                                <Button onPress={() => handleEditar(usuario)} className="text-sm bg-orange-500 text-white">Editar</Button>
                                <Button onPress={() => handleEliminar(usuario._id)} className="text-sm bg-red-600 text-white">Eliminar</Button>
                            </div>
                        </Card>
                    ))}
                </div>
                {usuariosFiltrados.length === 0 && !isLoading && (
                    <div className="text-center py-10">
                        <p className="text-gray-500">No se encontraron repartidores.</p>
                    </div>
                )}
            </div>
        </>
    );
}
