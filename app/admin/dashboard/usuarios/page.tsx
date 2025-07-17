'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardBody, addToast, Button } from '@heroui/react';
import axios from 'axios';

// --- Tipos de Datos ---
type UsuarioVendedor = {
    id: string;
    nombre: string;
    ubicacion: string;
    ventas: number;
    dineroGenerado: number;
};

type UsuarioDelivery = {
    id: string;
    nombre: string;
    ubicacion: string;
    servicios: number;
    dineroGenerado: number;
};

export default function UsuariosPage() {
    const router = useRouter();
    // --- Estados para datos dinámicos y carga ---
    const [vendedores, setVendedores] = useState<UsuarioVendedor[]>([]);
    const [deliverys, setDeliverys] = useState<UsuarioDelivery[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filtroEstado, setFiltroEstado] = useState<string>('Todas');

    // --- Función para obtener datos del dashboard desde la API ---
    const fetchDashboardData = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get('/api/admin/dashboard/usuarios');
            if (response.data.success) {
                setVendedores(response.data.data.vendedores);
                setDeliverys(response.data.data.deliverys);
            }
        } catch (error) {
            console.error("Error al obtener los datos del dashboard:", error);
            addToast({ title: "Error", description: "No se pudieron cargar los datos de los usuarios.", color: "danger" });
        } finally {
            setIsLoading(false);
        }
    };

    // --- Cargar datos cuando el componente se monta ---
    useEffect(() => {
        fetchDashboardData();
    }, []);

    // --- Genera dinámicamente la lista de estados disponibles ---
    const estadosDisponibles = useMemo(() => {
        const estadosVendedores = vendedores.map(v => v.ubicacion);
        const estadosDeliverys = deliverys.map(d => d.ubicacion);
        // Combina, elimina duplicados y ordena los estados
        const todosLosEstados = [...new Set([...estadosVendedores, ...estadosDeliverys])].sort();
        return ['Todas', ...todosLosEstados];
    }, [vendedores, deliverys]);

    const vendedoresFiltrados = useMemo(() => {
        if (filtroEstado === 'Todas') return vendedores;
        return vendedores.filter((v) => v.ubicacion === filtroEstado);
    }, [filtroEstado, vendedores]);

    const deliveryFiltrados = useMemo(() => {
        if (filtroEstado === 'Todas') return deliverys;
        // Asumiendo que la ubicación del delivery puede ser una dirección completa
        return deliverys.filter((d) => d.ubicacion.includes(filtroEstado));
    }, [filtroEstado, deliverys]);

    const topVendedores = vendedoresFiltrados.slice(0, 10);
    const topDeliverys = deliveryFiltrados.slice(0, 10);

    // --- Renderizado condicional mientras se cargan los datos ---
    if (isLoading) {
        return (
            <div className="p-6 text-center text-gray-500">
                Cargando datos del dashboard...
            </div>
        );
    }

    return (
        <div className="p-4 bg-white min-h-screen text-black space-y-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <label htmlFor="filtroEstado" className="font-semibold mr-2">Filtrar por Estado:</label>
                    <select
                        id="filtroEstado"
                        className="border border-gray-300 rounded p-2"
                        value={filtroEstado}
                        onChange={(e) => setFiltroEstado(e.target.value)}
                    >
                        {/* El select ahora usa la lista dinámica de estados */}
                        {estadosDisponibles.map((estado) => (
                            <option key={estado} value={estado}>{estado}</option>
                        ))}
                    </select>
                </div>
                <div className="flex gap-4">
                    <Link href="/admin/dashboard/usuarios/vendedores">
                        <Button className="bg-[#007D8A] text-white hover:bg-[#005f62]">
                            Gestionar Vendedores
                        </Button>
                    </Link>
                    <Link href="/admin/dashboard/usuarios/delivery">
                        <Button className="bg-orange-500 text-white hover:bg-orange-600">
                            Gestionar Delivery
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Vendedores */}
                <section>
                    <h2 className="text-xl font-bold mb-4">Top 10 Vendedores</h2>
                    <Card className="bg-[#007D8A] text-white max-h-[600px] overflow-y-auto">
                        <CardBody>
                            {topVendedores.length === 0 ? (
                                <p className="text-center py-4">No hay vendedores para mostrar.</p>
                            ) : (
                                topVendedores.map((user) => (
                                    <Link
                                        key={user.id}
                                        href={`/admin/dashboard/usuarios/vendedores`}
                                        className="block py-2 px-3 border-b border-white/20 last:border-none hover:bg-[#00686f] rounded-md transition-colors"
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-semibold">{user.nombre}</p>
                                                <p className="text-sm opacity-80">{user.ubicacion}</p>
                                            </div>
                                            <div className="text-right">
                                                <p>Ventas: {user.ventas}</p>
                                                <p>Dinero: ${user.dineroGenerado.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </CardBody>
                    </Card>
                </section>

                {/* Delivery */}
                <section>
                    <h2 className="text-xl font-bold mb-4">Top 10 Delivery</h2>
                    <Card className="bg-orange-500 text-white max-h-[600px] overflow-y-auto">
                        <CardBody>
                            {topDeliverys.length === 0 ? (
                                <p className="text-center py-4">No hay repartidores para mostrar.</p>
                            ) : (
                                topDeliverys.map((user) => (
                                    <Link
                                        key={user.id}
                                        href={`/admin/dashboard/usuarios/delivery`}
                                        className="block py-2 px-3 border-b border-white/20 last:border-none hover:bg-orange-600 rounded-md transition-colors"
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-semibold">{user.nombre}</p>
                                                <p className="text-sm opacity-80">{user.ubicacion}</p>
                                            </div>
                                            <div className="text-right">
                                                <p>Servicios: {user.servicios}</p>
                                                <p>Dinero: ${user.dineroGenerado.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </CardBody>
                    </Card>
                </section>
            </div>
        </div>
    );
}
