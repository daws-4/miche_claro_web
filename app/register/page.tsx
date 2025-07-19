'use client';

import React, { useState } from 'react';
import { Input, Button, Select, SelectItem, addToast } from '@heroui/react';
import { EyeFilledIcon, EyeSlashFilledIcon } from "@/components/icons"; // Asume que tienes estos iconos
import axios from 'axios';
import { useRouter } from 'next/navigation';

// --- Constantes para los Selectores ---
const estadosDeVenezuela = [
    "Amazonas", "Anzoátegui", "Apure", "Aragua", "Barinas", "Bolívar", "Carabobo",
    "Cojedes", "Delta Amacuro", "Falcón", "Guárico", "Lara", "Mérida", "Miranda",
    "Monagas", "Nueva Esparta", "Portuguesa", "Sucre", "Táchira", "Trujillo",
    "Vargas", "Yaracuy", "Zulia", "Distrito Capital"
].map(estado => ({ key: estado, label: estado }));

const bancosDeVenezuela = [
    "Banco de Venezuela", "Banesco", "Banco Mercantil", "BBVA Provincial",
    "Banco Nacional de Crédito (BNC)", "Banco del Tesoro", "BOD (Banco Occidental de Descuento)",
    "Bancamiga", "Banco Venezolano de Crédito", "Banco Exterior", "Banco Bicentenario",
    "Banco Activo", "Bancaribe", "Banplus", "Banco Fondo Común (BFC)",
    "Banco Caroní", "Banco Plaza"
].map(banco => ({ key: banco, label: banco }));

const tiposDeCuenta = [
    { key: "Ahorros", label: "Ahorros" },
    { key: "Corriente", label: "Corriente" },
];


// --- Tipos de Datos ---
type DatosPagoMovil = { cedula_rif: string; telefono: string; banco: string; };
type DatosBancolombia = { nequi?: string; numero_cuenta?: string; tipo_cuenta?: string; };
type DatosPropietario = { nombre: string; apellido: string; cedula: string; telefono: string; email: string; direccion: string; };
type UsuarioVendedorForm = {
    email: string;
    password?: string;
    nombre: string;
    estado: string;
    direccion: string;
    telefono1: string;
    telefono2?: string;
    datosPagoMovil: DatosPagoMovil;
    datosBancolombia?: DatosBancolombia;
    datosZelle?: string;
    datosPropietario: DatosPropietario;
};

// --- Componente Principal de la Página de Registro ---
export default function RegistroVendedorPage() {
    const router = useRouter();
    const [formData, setFormData] = useState<UsuarioVendedorForm>({
        email: '', password: '', nombre: '', estado: '', direccion: '', telefono1: '', telefono2: '',
        datosPagoMovil: { cedula_rif: '', telefono: '', banco: '' },
        datosBancolombia: { nequi: '', numero_cuenta: '', tipo_cuenta: '' },
        datosZelle: '',
        datosPropietario: { nombre: '', apellido: '', cedula: '', telefono: '', email: '', direccion: '' },
    });
    const [isSaving, setIsSaving] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newFormData = { ...prev };
            if (name.includes('.')) {
                const [parentKey, childKey] = name.split('.');
                if (parentKey === 'datosPagoMovil' || parentKey === 'datosBancolombia' || parentKey === 'datosPropietario') {
                    const nestedObject = { ...newFormData[parentKey] };
                    (nestedObject as any)[childKey] = value;
                    (newFormData as any)[parentKey] = nestedObject;
                }
            } else {
                (newFormData as any)[name] = value;
            }
            return newFormData;
        });
    };

    const handleSelectChange = (name: string, value: string) => {
        if (name === 'estado') {
            setFormData(prev => ({ ...prev, estado: value }));
        } else if (name === 'banco') {
            setFormData(prev => ({ ...prev, datosPagoMovil: { ...prev.datosPagoMovil, banco: value } }));
        } else if (name === 'tipo_cuenta') {
            setFormData(prev => ({
                ...prev,
                datosBancolombia: { ...prev.datosBancolombia, tipo_cuenta: value }
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const response = await axios.post('/api/register', formData);
            if (response.data.success) {
                addToast({ title: "¡Solicitud Enviada!", description: response.data.message, color: "success" });
                router.push('/');
            }
        } catch (error: any) {
            console.error("Error en el registro:", error);
            const errorMsg = error.response?.data?.error || "No se pudo completar el registro.";
            addToast({ title: "Error de Registro", description: errorMsg, color: "danger" });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg p-6 md:p-8 space-y-6">

                {/* Sección Explicativa */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800">Conviértete en Vendedor</h1>
                    <p className="mt-2 text-gray-600">Completa el formulario para iniciar tu proceso de afiliación.</p>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 rounded-md" role="alert">
                    <p className="font-bold">Proceso de Registro y Afiliación</p>
                    <p className="mt-2 text-sm">
                        Para completar tu registro y activar tu cuenta como vendedor, se requiere una <strong>cuota única de afiliación de $50</strong>.
                        Una vez que envíes este formulario, nuestro equipo técnico revisará tus datos y se pondrá en contacto contigo para coordinar el pago y finalizar el proceso de activación.
                    </p>
                </div>

                {/* Formulario de Registro */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <fieldset className="p-4 border rounded-lg border-gray-300">
                        <legend className="font-semibold px-2 text-gray-700">Datos del Negocio</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input name="nombre" value={formData.nombre} onChange={handleChange} label="Nombre del Negocio" required />
                            <Select label="Estado" placeholder="Selecciona un estado" selectedKeys={formData.estado ? [formData.estado] : []} onSelectionChange={(keys) => handleSelectChange('estado', Array.from(keys)[0] as string)} isRequired>
                                {estadosDeVenezuela.map((estado) => <SelectItem key={estado.key}>{estado.label}</SelectItem>)}
                            </Select>
                            <Input name="email" type="email" value={formData.email} onChange={handleChange} label="Email de Acceso" className="md:col-span-2" required />
                            <Input
                                name="password"
                                type={isVisible ? "text" : "password"}
                                value={formData.password}
                                onChange={handleChange}
                                label="Contraseña"
                                className="md:col-span-2"
                                required
                                endContent={<button type="button" onClick={toggleVisibility} className="focus:outline-none">{isVisible ? <EyeSlashFilledIcon /> : <EyeFilledIcon />}</button>}
                            />
                            <Input name="direccion" value={formData.direccion} onChange={handleChange} label="Dirección del Negocio" className="md:col-span-2" required />
                            <Input name="telefono1" value={formData.telefono1} onChange={handleChange} label="Teléfono Principal" required />
                            <Input name="telefono2" value={formData.telefono2 || ''} onChange={handleChange} label="Teléfono Secundario (Opcional)" />
                        </div>
                    </fieldset>

                    <fieldset className="p-4 border rounded-lg border-gray-300">
                        <legend className="font-semibold px-2 text-gray-700">Datos del Propietario</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input name="datosPropietario.nombre" value={formData.datosPropietario.nombre} onChange={handleChange} label="Nombre del Propietario" required />
                            <Input name="datosPropietario.apellido" value={formData.datosPropietario.apellido} onChange={handleChange} label="Apellido" required />
                            <Input name="datosPropietario.cedula" value={formData.datosPropietario.cedula} onChange={handleChange} label="Cédula" required />
                            <Input name="datosPropietario.telefono" value={formData.datosPropietario.telefono} onChange={handleChange} label="Teléfono" required />
                            <Input name="datosPropietario.email" value={formData.datosPropietario.email} onChange={handleChange} label="Email" className="md:col-span-2" required />
                            <Input name="datosPropietario.direccion" value={formData.datosPropietario.direccion} onChange={handleChange} label="Dirección" className="md:col-span-2" required />
                        </div>
                    </fieldset>

                    <fieldset className="p-4 border rounded-lg border-gray-300">
                        <legend className="font-semibold px-2 text-gray-700">Métodos de Pago (para recibir tus ganancias)</legend>
                        <h3 className="font-medium mb-2 text-sm text-gray-600">Pago Móvil</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <Input name="datosPagoMovil.cedula_rif" value={formData.datosPagoMovil.cedula_rif} onChange={handleChange} label="Cédula/RIF" required />
                            <Input name="datosPagoMovil.telefono" value={formData.datosPagoMovil.telefono} onChange={handleChange} label="Teléfono" required />
                            <Select label="Banco" placeholder="Selecciona un banco" selectedKeys={formData.datosPagoMovil.banco ? [formData.datosPagoMovil.banco] : []} onSelectionChange={(keys) => handleSelectChange('banco', Array.from(keys)[0] as string)} isRequired>
                                {bancosDeVenezuela.map((banco) => <SelectItem key={banco.key}>{banco.label}</SelectItem>)}
                            </Select>
                        </div>
                        <h3 className="font-medium mb-2 text-sm text-gray-600">Otros (Opcional)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input name="datosBancolombia.nequi" value={formData.datosBancolombia?.nequi || ''} onChange={handleChange} label="Nequi" />
                            <Input name="datosBancolombia.numero_cuenta" value={formData.datosBancolombia?.numero_cuenta || ''} onChange={handleChange} label="Cuenta Bancolombia" />
                            <Select
                                label="Tipo de Cuenta"
                                placeholder="Selecciona"
                                selectedKeys={formData.datosBancolombia?.tipo_cuenta ? [formData.datosBancolombia.tipo_cuenta] : []}
                                onSelectionChange={(keys) => handleSelectChange('tipo_cuenta', Array.from(keys)[0] as string)}
                                className="w-full"
                            >
                                {tiposDeCuenta.map((cuenta) => (
                                    <SelectItem key={cuenta.key}>{cuenta.label}</SelectItem>
                                ))}
                            </Select>
                            <Input name="datosZelle" value={formData.datosZelle || ''} onChange={handleChange} label="Email Zelle" className="md:col-span-2" />
                        </div>
                    </fieldset>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" className="bg-[#007D8A] text-white w-full md:w-auto" isLoading={isSaving}>
                            {isSaving ? "Enviando Solicitud..." : "Enviar Solicitud de Registro"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
