'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardBody } from '@heroui/react';

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

const estadosVenezuela = [
    'Amazonas', 'Anzoátegui', 'Apure', 'Aragua', 'Barinas', 'Bolívar',
    'Carabobo', 'Cojedes', 'Delta Amacuro', 'Falcón', 'Guárico', 'Lara',
    'Mérida', 'Miranda', 'Monagas', 'Nueva Esparta', 'Portuguesa', 'Sucre',
    'Táchira', 'Trujillo', 'Vargas', 'Yaracuy', 'Zulia', 'Distrito Capital',
];

const vendedores: UsuarioVendedor[] = [
    { id: 'v1', nombre: 'Ana Pérez', ubicacion: 'Distrito Capital', ventas: 150, dineroGenerado: 12000 },
    { id: 'v2', nombre: 'Luis Gómez', ubicacion: 'Zulia', ventas: 140, dineroGenerado: 11500 },
    { id: 'v3', nombre: 'Marta Díaz', ubicacion: 'Carabobo', ventas: 130, dineroGenerado: 11000 },
    { id: 'v4', nombre: 'Carlos Ruiz', ubicacion: 'Lara', ventas: 125, dineroGenerado: 10800 },
    { id: 'v5', nombre: 'Sofía Torres', ubicacion: 'Monagas', ventas: 120, dineroGenerado: 10500 },
    { id: 'v6', nombre: 'Jorge Ramírez', ubicacion: 'Bolívar', ventas: 115, dineroGenerado: 10000 },
    { id: 'v7', nombre: 'Lucía Fernández', ubicacion: 'Aragua', ventas: 110, dineroGenerado: 9800 },
    { id: 'v8', nombre: 'Andrés Morales', ubicacion: 'Táchira', ventas: 105, dineroGenerado: 9500 },
    { id: 'v9', nombre: 'Paola Jiménez', ubicacion: 'Sucre', ventas: 100, dineroGenerado: 9200 },
    { id: 'v10', nombre: 'Diego Sánchez', ubicacion: 'Nueva Esparta', ventas: 95, dineroGenerado: 9000 },
    { id: 'v11', nombre: 'Karen Blanco', ubicacion: 'Trujillo', ventas: 90, dineroGenerado: 8700 },
    { id: 'v12', nombre: 'Ricardo Vega', ubicacion: 'Falcón', ventas: 85, dineroGenerado: 8500 },
];

const deliverys: UsuarioDelivery[] = [
    { id: 'd1', nombre: 'Juan Pérez', ubicacion: 'Distrito Capital', servicios: 300, dineroGenerado: 15000 },
    { id: 'd2', nombre: 'Maria López', ubicacion: 'Zulia', servicios: 290, dineroGenerado: 14500 },
    { id: 'd3', nombre: 'Pedro Fernández', ubicacion: 'Carabobo', servicios: 280, dineroGenerado: 14200 },
    { id: 'd4', nombre: 'Ana Gómez', ubicacion: 'Lara', servicios: 270, dineroGenerado: 13800 },
    { id: 'd5', nombre: 'Luis Torres', ubicacion: 'Monagas', servicios: 260, dineroGenerado: 13500 },
    { id: 'd6', nombre: 'Sofía Ramírez', ubicacion: 'Bolívar', servicios: 250, dineroGenerado: 13200 },
    { id: 'd7', nombre: 'Carlos Morales', ubicacion: 'Aragua', servicios: 240, dineroGenerado: 13000 },
    { id: 'd8', nombre: 'Paola Jiménez', ubicacion: 'Táchira', servicios: 230, dineroGenerado: 12500 },
    { id: 'd9', nombre: 'Diego Sánchez', ubicacion: 'Sucre', servicios: 220, dineroGenerado: 12300 },
    { id: 'd10', nombre: 'Karen Blanco', ubicacion: 'Nueva Esparta', servicios: 210, dineroGenerado: 12000 },
    { id: 'd11', nombre: 'Ricardo Vega', ubicacion: 'Trujillo', servicios: 200, dineroGenerado: 11800 },
    { id: 'd12', nombre: 'Lucía Fernández', ubicacion: 'Falcón', servicios: 190, dineroGenerado: 11500 },
];

export default function UsuariosPage() {
    const router = useRouter();
    const [filtroEstado, setFiltroEstado] = useState<string>('Todas');

    const vendedoresFiltrados = useMemo(() => {
        if (filtroEstado === 'Todas') return vendedores;
        return vendedores.filter((v) => v.ubicacion === filtroEstado);
    }, [filtroEstado]);

    const deliveryFiltrados = useMemo(() => {
        if (filtroEstado === 'Todas') return deliverys;
        return deliverys.filter((d) => d.ubicacion === filtroEstado);
    }, [filtroEstado]);

    const topVendedores = vendedoresFiltrados.slice(0, 10);
    const topDeliverys = deliveryFiltrados.slice(0, 10);

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
                        <option value="Todas">Todas</option>
                        {estadosVenezuela.map((estado) => (
                            <option key={estado} value={estado}>{estado}</option>
                        ))}
                    </select>
                </div>
                <div className="flex gap-4">
                    <Link href="/admin/dashboard/usuarios/vendedores">
                        <button className="bg-[#007D8A] text-white px-4 py-2 rounded hover:bg-[#005f62]">
                            Ver todos los Vendedores
                        </button>
                    </Link>
                    <Link href="/admin/dashboard/usuarios/delivery">
                        <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
                            Ver todos los Delivery
                        </button>
                    </Link>
                </div>
            </div>

            {/* Listas lado a lado responsive */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Vendedores */}
                <section>
                    <h2 className="text-xl font-bold mb-4">Usuarios Vendedores</h2>
                    <Card className="bg-[#007D8A] text-white max-h-[600px] overflow-y-auto">
                        <CardBody>
                            {topVendedores.length === 0 ? (
                                <p className="text-center py-4">No hay usuarios para mostrar.</p>
                            ) : (
                                topVendedores.map((user) => (
                                    <Link
                                        key={user.id}
                                        href={`/admin/dashboard/usuarios/vendedores/${user.id}`}
                                        className="block py-2 border-b last:border-none hover:bg-[#00686f] rounded-md"
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

                            {vendedoresFiltrados.length > 10 && (
                                <button
                                    onClick={() => router.push('/admin/dashboard/usuarios/vendedores')}
                                    className="mt-4 bg-white text-[#007D8A] font-semibold px-4 py-2 rounded hover:bg-gray-100 w-full"
                                >
                                    Mostrar más
                                </button>
                            )}
                        </CardBody>
                    </Card>
                </section>

                {/* Delivery */}
                <section>
                    <h2 className="text-xl font-bold mb-4">Usuarios Delivery</h2>
                    <Card className="bg-orange-500 text-white max-h-[600px] overflow-y-auto">
                        <CardBody>
                            {topDeliverys.length === 0 ? (
                                <p className="text-center py-4">No hay usuarios para mostrar.</p>
                            ) : (
                                topDeliverys.map((user) => (
                                    <Link
                                        key={user.id}
                                        href={`/admin/dashboard/usuarios/delivery/${user.id}`}
                                        className="block py-2 border-b last:border-none hover:bg-orange-600 rounded-md"
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

                            {deliveryFiltrados.length > 10 && (
                                <button
                                    onClick={() => router.push('/admin/dashboard/usuarios/delivery')}
                                    className="mt-4 bg-white text-orange-500 font-semibold px-4 py-2 rounded hover:bg-gray-100 w-full"
                                >
                                    Mostrar más
                                </button>
                            )}
                        </CardBody>
                    </Card>
                </section>
            </div>
        </div>
    );
}
