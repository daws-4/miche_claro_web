import { NextResponse } from "next/server";
import { Types } from "mongoose"; 
import {connectDB} from "@/lib/db";
import UsuariosVendedores from "@/models/usuariosVendedores";
import UsuariosDelivery from "@/models/usuariosDelivery";


// Definimos tipos simples para los objetos que devuelve .lean() para ayudar a TypeScript
type LeanVendedor = {
  _id: Types.ObjectId;
  nombre: string;
  estado: string;
  pagos?: { monto_cancelado?: number }[];
};

type LeanDelivery = {
  _id: Types.ObjectId;
  nombre: string;
  apellido: string;
  estado: string; // Corregido: Usamos 'estado' en lugar de 'direccion'
  historial_entregas?: any[];
};

export async function GET() {
  try {
    await connectDB();

    // --- Obtener y procesar datos de Vendedores ---
    const vendedores = await UsuariosVendedores.find({})
      .select('nombre estado pagos')
      .lean<LeanVendedor[]>(); 

    const topVendedores = vendedores.map(v => ({
      id: v._id.toString(),
      nombre: v.nombre,
      ubicacion: v.estado, // Correcto: la ubicación es el estado
      ventas: v.pagos?.length || 0,
      dineroGenerado: v.pagos?.reduce((acc, pago) => acc + (pago.monto_cancelado || 0), 0) || 0,
    })).sort((a, b) => b.dineroGenerado - a.dineroGenerado);

    // --- Obtener y procesar datos de Delivery ---
    const deliverys = await UsuariosDelivery.find({})
      .select('nombre apellido estado historial_entregas') // Corregido: Seleccionamos 'estado'
      .lean<LeanDelivery[]>();

    const topDeliverys = deliverys.map(d => ({
      id: d._id.toString(),
      nombre: `${d.nombre} ${d.apellido}`,
      ubicacion: d.estado, // Corregido: la ubicación es el estado
      servicios: d.historial_entregas?.length || 0,
      dineroGenerado: (d.historial_entregas?.length || 0) * (Math.floor(Math.random() * 50) + 20),
    })).sort((a, b) => b.dineroGenerado - a.dineroGenerado);

    const responseData = {
      vendedores: topVendedores,
      deliverys: topDeliverys,
    };

    return NextResponse.json({ success: true, data: responseData }, { status: 200 });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
