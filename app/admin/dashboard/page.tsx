'use client';

import { useState, useMemo } from 'react';
import { Card, CardBody } from '@heroui/react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const ventas = [
    {
        mes: 'Enero',
        region: 'Zulia',
        totalVentas: 100,
        pagado: 70,
        porPagar: 30,
        pedidosFinalizados: 80,
        pedidosCancelados: 20,
        montoFinalizados: 8000,
        montoCancelados: 2000,
    },
    {
        mes: 'Febrero',
        region: 'Zulia',
        totalVentas: 150,
        pagado: 90,
        porPagar: 60,
        pedidosFinalizados: 100,
        pedidosCancelados: 50,
        montoFinalizados: 10000,
        montoCancelados: 3000,
    },
    {
        mes: 'Enero',
        region: 'Lara',
        totalVentas: 70,
        pagado: 50,
        porPagar: 20,
        pedidosFinalizados: 60,
        pedidosCancelados: 10,
        montoFinalizados: 6000,
        montoCancelados: 1000,
    },
];

const usuariosPorRegion = [
    { region: 'Zulia', mes: 'Enero', vendedores: 5, consumidores: 12, delivery: 3 },
    { region: 'Zulia', mes: 'Febrero', vendedores: 6, consumidores: 15, delivery: 2 },
    { region: 'Lara', mes: 'Enero', vendedores: 3, consumidores: 10, delivery: 1 },
    { region: 'Lara', mes: 'Febrero', vendedores: 4, consumidores: 8, delivery: 1 },
    { region: 'Todas', mes: 'Enero', vendedores: 8, consumidores: 22, delivery: 4 }, // para asegurar compatibilidad
];

const mesesDisponibles = [...new Set(ventas.map(v => v.mes))];
const regionesDisponibles = ['Todas', ...new Set(ventas.map(v => v.region))];

const metricas = [
    { key: 'totalVentas', label: 'Total de Ventas', color: 'bg-[#007D8A]', prefix: '' },
    { key: 'pagado', label: 'Dinero Pagado', color: 'bg-orange-500', prefix: '$' },
    { key: 'porPagar', label: 'Dinero por Pagar', color: 'bg-[#007D8A]', prefix: '$' },
    { key: 'recaudado', label: 'Total Recaudado', color: 'bg-orange-500', prefix: '$' },
    { key: 'vendedores', label: 'Usuarios Vendedores', color: 'bg-[#007D8A]', prefix: '' },
    { key: 'consumidores', label: 'Usuarios Consumidores', color: 'bg-orange-500', prefix: '' },
    { key: 'delivery', label: 'Usuarios Delivery', color: 'bg-[#007D8A]', prefix: '' },
    { key: 'totalUsuarios', label: 'Total Usuarios', color: 'bg-orange-500', prefix: '' },
    { key: 'pedidosFinalizados', label: 'Pedidos Finalizados', color: 'bg-[#007D8A]', prefix: '', extraKey: 'montoFinalizados' },
    { key: 'pedidosCancelados', label: 'Pedidos Cancelados', color: 'bg-orange-500', prefix: '', extraKey: 'montoCancelados' },
    { key: 'totalPedidos', label: 'Total de Pedidos', color: 'bg-[#007D8A]', prefix: '' },
];

export default function Dashboard() {
    const [mesSeleccionado, setMesSeleccionado] = useState('Enero');
    const [regionSeleccionada, setRegionSeleccionada] = useState('Zulia');

    const datosFiltrados = useMemo(() => (
        ventas.filter(v =>
            v.mes === mesSeleccionado &&
            (regionSeleccionada === 'Todas' || v.region === regionSeleccionada)
        )
    ), [mesSeleccionado, regionSeleccionada]);

    const usuariosFiltrados = useMemo(() => {
        const filtrados = usuariosPorRegion.filter(u =>
            u.mes === mesSeleccionado &&
            (regionSeleccionada === 'Todas' || u.region === regionSeleccionada)
        );
        return filtrados.reduce((acc, u) => ({
            vendedores: acc.vendedores + u.vendedores,
            consumidores: acc.consumidores + u.consumidores,
            delivery: acc.delivery + u.delivery,
        }), { vendedores: 0, consumidores: 0, delivery: 0 });
    }, [mesSeleccionado, regionSeleccionada]);

    const resumen:Record<string, number> = useMemo(() => {
        const acumulado = datosFiltrados.reduce((acc, v) => ({
            totalVentas: acc.totalVentas + v.totalVentas,
            pagado: acc.pagado + v.pagado,
            porPagar: acc.porPagar + v.porPagar,
            recaudado: acc.recaudado + v.pagado + v.porPagar,
            pedidosFinalizados: acc.pedidosFinalizados + v.pedidosFinalizados,
            montoFinalizados: acc.montoFinalizados + v.montoFinalizados,
            pedidosCancelados: acc.pedidosCancelados + v.pedidosCancelados,
            montoCancelados: acc.montoCancelados + v.montoCancelados,
        }), {
            totalVentas: 0, pagado: 0, porPagar: 0, recaudado: 0,
            pedidosFinalizados: 0, montoFinalizados: 0,
            pedidosCancelados: 0, montoCancelados: 0,
        });

        const totalUsuarios = usuariosFiltrados.vendedores + usuariosFiltrados.consumidores + usuariosFiltrados.delivery;
        const totalPedidos = acumulado.pedidosFinalizados + acumulado.pedidosCancelados;

        return {
            ...acumulado,
            ...usuariosFiltrados,
            totalUsuarios,
            totalPedidos
        };
    }, [datosFiltrados, usuariosFiltrados]);

    const datosParaGrafico = useMemo(() => {
        if (regionSeleccionada !== 'Todas') {
            return datosFiltrados;
        }

        const dataMes = ventas.filter(v => v.mes === mesSeleccionado);
        const suma = dataMes.reduce(
            (acc, curr) => ({
                mes: mesSeleccionado,
                pagado: acc.pagado + curr.pagado,
                porPagar: acc.porPagar + curr.porPagar,
            }),
            { mes: mesSeleccionado, pagado: 0, porPagar: 0 }
        );

        return [suma]; 
    }, [regionSeleccionada, mesSeleccionado]);

    const datosUsuariosParaGrafico = useMemo(() => {
        const filtrados = usuariosPorRegion.filter(u =>
            u.mes === mesSeleccionado &&
            (regionSeleccionada === 'Todas' || u.region === regionSeleccionada)
        );
        if (!filtrados.length) return [];
        const acumulado = filtrados.reduce((acc, curr) => ({
            mes: curr.mes,
            vendedores: acc.vendedores + curr.vendedores,
            consumidores: acc.consumidores + curr.consumidores,
            delivery: acc.delivery + curr.delivery,
        }), { mes: mesSeleccionado, vendedores: 0, consumidores: 0, delivery: 0 });
        return [acumulado];
    }, [mesSeleccionado, regionSeleccionada]);

    const renderGrafico = (titulo: string, data: any[], barras: { key: string; fill: string; name: string }[]) => (
        <div className="bg-white rounded-xl border mt-6 p-4">
            <h3 className="text-lg font-semibold text-black mb-2">{titulo}</h3>
            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data}>
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    {barras.map(bar => (
                        <Bar key={bar.key} dataKey={bar.key} fill={bar.fill} name={bar.name} />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );

    return (
        <div className="p-4 space-y-6 bg-white min-h-screen text-black">
            <div className="flex flex-col md:flex-row gap-4">
                <select value={mesSeleccionado} onChange={(e) => setMesSeleccionado(e.target.value)} className="p-2 rounded-lg border border-gray-300">
                    {mesesDisponibles.map(mes => <option key={mes} value={mes}>{mes}</option>)}
                </select>
                <select value={regionSeleccionada} onChange={(e) => setRegionSeleccionada(e.target.value)} className="p-2 rounded-lg border border-gray-300">
                    {regionesDisponibles.map(region => <option key={region} value={region}>{region}</option>)}
                </select>
            </div>

            {/* MÉTRICAS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {metricas.map(({ key, label, color, prefix, extraKey }) => (
                    <Card key={key} className={`${color} text-white`}>
                        <CardBody>
                            <p className="text-sm">{label}</p>
                            <h2 className="text-2xl font-bold">{prefix}{resumen[key]}</h2>
                            {extraKey && (
                                <p className="text-sm mt-1">Total: ${resumen[extraKey]}</p>
                            )}
                        </CardBody>
                    </Card>
                ))}
            </div>

            {/* GRÁFICOS */}
            {renderGrafico("Gráfico de Ventas", datosParaGrafico, [
                { key: 'pagado', fill: '#007D8A', name: 'Pagado' },
                { key: 'porPagar', fill: '#FFA500', name: 'Por Pagar' },
            ])}

            {renderGrafico("Gráfico de Usuarios por Mes", datosUsuariosParaGrafico, [
                { key: 'vendedores', fill: '#007D8A', name: 'Vendedores' },
                { key: 'consumidores', fill: '#FFA500', name: 'Consumidores' },
                { key: 'delivery', fill: '#333333', name: 'Delivery' },
            ])}
        </div>
    );
}