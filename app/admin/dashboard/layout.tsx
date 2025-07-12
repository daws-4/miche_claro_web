import React from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-[#003f63] text-white flex flex-col p-6">
                <div className="text-2xl font-bold mb-8">Panel Admin</div>
                <nav className="flex flex-col gap-4">
                    <a href="/admin/dashboard" className="hover:text-yellow-300">Inicio</a>
                    <a href="/admin/dashboard/usuarios" className="hover:text-yellow-300">Usuarios</a>
                    <a href="/admin/dashboard/configuracion" className="hover:text-yellow-300">Configuración</a>
                </nav>
            </aside>
            {/* Main content */}
            <main className="flex-1 p-8">{children}</main>
        </div>
    );
}