'use client';
import React, { useState } from "react";
import { Card, CardBody, Link, Button } from "@heroui/react";
import { Menu, Config, User } from "@/components/icons";
import { ThemeSwitch } from "@/components/theme-switch";
import { X } from "lucide-react";

// Define el tipo de cada ítem de menú
type MenuItem = {
    titulo: string;
    href: string;
    Icon: React.ReactNode;
};

// Array de elementos del menú
const menuItems: MenuItem[] = [
    {
        titulo: "Inicio",
        href: "/admin/dashboard",
        Icon: <Menu />
    },
    {
        titulo: "Usuarios",
        href: "/admin/dashboard/usuarios",
        Icon: <User />
    },
    {
        titulo: "Configuración",
        href: "/admin/dashboard/configuracion",
        Icon: <Config />
    }
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col sm:flex-row bg-gray-100">
            {/* Mobile top bar */}
            <div className="sm:hidden flex items-center justify-between bg-[#003f63] text-white p-4">
                <h1 className="text-xl font-bold">Miche Claro</h1>
                <button className='bg-[#003f63]' onClick={() => setSidebarOpen(!sidebarOpen)}>
                    {sidebarOpen ? <X size={24} /> : <Menu />}
                </button>
            </div>

            {/* Sidebar */}
            <aside
                className={`bg-[#003f63] text-white w-64 p-6 flex-col space-y-6 transform sm:transform-none transition-transform duration-200 z-50 ${sidebarOpen ? "flex absolute sm:relative left-0 top-0 h-full" : "hidden sm:flex"
                    }`}
            >
                <h1 className="text-2xl font-bold">Miche Claro</h1>
                <div className="text-lg mb-4">Menú</div>
                <nav className="flex flex-col gap-4">
                    {menuItems.map((item, index) => (
                        <Card key={index} isPressable radius="sm" shadow="lg" className="hover:shadow-xl">
                            <Link color="foreground" href={item.href} className="block">
                                <CardBody className="flex flex-row items-center gap-3 bg-[#2096da]  px-4 py-2 rounded">
                                    {item.Icon}
                                    <span className="font-medium text-base">{item.titulo}</span>
                                </CardBody>
                            </Link>
                        </Card>
                    ))}
                </nav>
            </aside>

            {/* Main content */}
            <main className="flex-1 p-6 sm:p-8">{children}</main>
        </div>
    );
}
