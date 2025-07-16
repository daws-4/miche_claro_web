import { NextResponse, NextRequest } from "next/server";
import {connectDB} from "@/lib/db"; // Asegúrate de que la ruta sea correcta
import usuariosVendedores from "@/models/usuariosVendedores"; // Importa tu modelo
import bcrypt from "bcryptjs";

// GET: Obtener todos los vendedores
export async function GET() {
  try {
    await connectDB();
    const vendedores = await usuariosVendedores.find({});
    return NextResponse.json(
      { success: true, data: vendedores },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

// POST: Crear un nuevo vendedor
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    // Hashear la contraseña antes de guardarla
    if (body.password) {
      const salt = await bcrypt.genSalt(10);
      body.password = await bcrypt.hash(body.password, salt);
    }

    const vendedor = await usuariosVendedores.create(body);
    return NextResponse.json(
      { success: true, data: vendedor },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 400 }
    );
  }
}

// PUT: Actualizar un vendedor existente
export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID no proporcionado" },
        { status: 400 }
      );
    }

    const body = await req.json();

    // Si se está actualizando la contraseña, hashearla
    if (body.password) {
      const salt = await bcrypt.genSalt(10);
      body.password = await bcrypt.hash(body.password, salt);
    } else {
      delete body.password; // No enviar la contraseña si no se cambia
    }

    const vendedor = await usuariosVendedores.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!vendedor) {
      return NextResponse.json(
        { success: false, error: "Vendedor no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: vendedor },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 400 }
    );
  }
}

// DELETE: Eliminar un vendedor
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID no proporcionado" },
        { status: 400 }
      );
    }

    const deletedVendedor = await usuariosVendedores.findByIdAndDelete(id);

    if (!deletedVendedor) {
      return NextResponse.json(
        { success: false, error: "Vendedor no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
