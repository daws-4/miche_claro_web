'use client'
import { CardBody, CardFooter, Card, Button, Form, Input } from "@heroui/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { GooglePlayIcon, AppStoreIcon } from "@/components/icons";
import { useState, useEffect } from "react";


function Counter({ to }: { to: string }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = parseInt(to);
        if (start === end) return;

        const step = 10; // Contar de 10 en 10
        const steps = Math.ceil(end / step);
        const totalMilSecDur = 4000; // 4 segundos
        const incrementTime = Math.max(10, Math.floor(totalMilSecDur / steps));

        let timer = setInterval(() => {
            start += step;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(start);
            }
        }, incrementTime);

        return () => clearInterval(timer);
    }, [to]);

    return <span>{count}</span>;
}
function CounterUser({ to }: { to: string }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = parseInt(to);
        if (start === end) return;

        const step = 10; // Contar de 10 en 10
        const steps = Math.ceil(end / step);
        const totalMilSecDur = 4000; // 4 segundos
        const incrementTime = Math.max(10, Math.floor(totalMilSecDur / steps));

        let timer = setInterval(() => {
            start += step;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(start);
            }
        }, incrementTime);

        return () => clearInterval(timer);
    }, [to]);

    return <span>{count}</span>;
}

export default function Home() {

    const stats = {
        sellers: 1200,
        users: 5000,
    };
    return (
        <div className="min-h-screen bg-[#f3f1e6] text-gray-900 font-sans">
            {/* NAVBAR + HERO */}
            <header className="bg-[#003f63] text-white">
                <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
                    <div className="flex items-center space-x-3">
                        <img src="/logo/logo_micheclaro.png" alt="Miche Claro Logo" className="h-14 w-14 shadow-lg shadow-black" />
                        <span className="text-xl font-bold">Miche Claro</span>
                    </div>
                    <nav className="hidden md:flex space-x-6">
                        <Link href="/pricing" className="hover:text-yellow-300 font-medium">Precios</Link>
                        <Link href="/register" className="hover:text-yellow-300 font-medium">Registro</Link>
                        <Link href="/login" className="hover:text-yellow-300 font-medium">Iniciar sesión</Link>
                    </nav>
                </div>

                <div className="text-center py-20 px-6">
                    <motion.h1
                        className="text-5xl font-extrabold"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        Miche Claro 🍻
                    </motion.h1>
                    <motion.p
                        className="mt-4 text-xl max-w-xl mx-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                    >
                        La app para vender y comprar alcohol desde tu celular... ¡y jugar mientras tomas! Perfecta para bodegas y amantes del alcohol.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                        className="mt-8 flex justify-center gap-4 flex-wrap"
                    >
                        <Button
                            href="#cta"
                            className="bg-[#f9e27b] text-[#003f63] px-8 py-3 rounded-full font-bold hover:bg-[#ffe168] transition"
                            size="lg"
                        >
                            Descárgala ahora
                        </Button>
                        <Button
                            href="#"
                            size="lg"
                            className="bg-black text-white px-6 py-2 rounded-xl font-semibold hover:bg-gray-800 items-center justify-center"
                        >
                           <GooglePlayIcon/> Google Play
                        </Button>
                        <Button
                            href="#"
                            size="lg"
                            className="bg-black text-white px-6 py-2 rounded-xl font-semibold hover:bg-gray-800"
                        >
                         <AppStoreIcon/>App Store
                        </Button>
                    </motion.div>
                </div>
            </header>


            {/* ESTADÍSTICAS DE USO */}
            <section className="py-16 px-6 bg-[#e3d9c6] text-center">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-[#003f63] mb-4">Nuestra comunidad</h2>
                    <p className="text-lg text-[#403d39] mb-8">Gracias por confiar en Miche Claro 🍻</p>

                    {stats && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-4xl font-bold">
                            <motion.div
                                className="bg-white py-10 rounded-xl shadow text-[#003f63]"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                            >
                                <Counter to={stats.sellers} />
                                <span className="block text-lg mt-2 font-normal text-[#403d39]">Vendedores registrados</span>
                            </motion.div>
                            <motion.div
                                className="bg-white py-10 rounded-xl shadow text-[#003f63]"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                            >
                                <CounterUser to={stats.users} />
                                <span className="block text-lg mt-2 font-normal text-[#403d39]">Usuarios activos</span>
                            </motion.div>
                        </div>
                    )}
                </div>
            </section>


            {/* BENEFICIOS PARA BODEGAS */}
            <section className="py-16 px-6 bg-[#f3f1e6] text-center">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-[#285c3c] mb-6">¿Tienes una bodega?</h2>
                    <p className="max-w-2xl mx-auto text-lg text-[#403d39] mb-6">
                        Miche Claro te conecta con más clientes, aumenta tus ventas y digitaliza tu negocio.
                        Recibe pedidos online y gestiona tu catálogo desde cualquier lugar.
                    </p>
                    <img src="/bodegas-beneficio.jpg" alt="Bodegas" className="mx-auto w-full max-w-[600px] h-[400px] object-cover rounded" />
                </div>
            </section>

            {/* BENEFICIOS PARA CONSUMIDORES */}
            <section className="py-16 px-6 bg-[#e3d9c6] text-center">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-[#003f63] mb-6">¿Te gusta beber con estilo?</h2>
                    <p className="max-w-2xl mx-auto text-lg text-[#403d39] mb-6">
                        Compra tus bebidas favoritas sin salir de casa y diviértete con nuestros juegos diseñados para animar tu noche.
                    </p>
                    <img src="/consumidores-juegos.jpg" alt="Consumidores" className="mx-auto w-full max-w-[600px] h-[400px] object-cover rounded" />
                </div>
            </section>

            {/* TESTIMONIOS */}
            <section className="py-16 px-6 bg-[#f3f1e6] text-center">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-[#003f63] mb-8">Lo que dicen nuestros usuarios</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card>

                            <CardBody className="bg-[#e3d9c6] p-6 rounded-xl shadow">
                                "Desde que uso Miche Claro, mis ventas han aumentado un 40%. ¡Una maravilla para mi bodega!"
                            </CardBody>
                            <CardFooter className="mt-4 text-sm text-gray-600">— Juan, dueño de bodega</CardFooter>
                        </Card>
                        <Card>
                            <CardBody className="bg-[#e3d9c6] p-6 rounded-xl shadow">
                                "La compré por la cerveza, me quedé por los juegos. ¡La mejor app para beber!"
                            </CardBody>
                            <CardFooter className="mt-4 text-sm text-gray-600">— Carla, usuaria</CardFooter>
                        </Card>
                    </div>
                </div>
            </section>

            {/* REGISTRO PARA NEGOCIOS */}
            <section id="registro" className="py-20 px-6 bg-[#f9e27b] text-center">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-[#003f63] mb-4">¿Eres dueño de una bodega?</h2>
                    <p className="mb-6 text-lg text-[#403d39]">Si estás interesado en implementar Miche Claro en tu negocio, regístrate y nos pondremos en contacto contigo.</p>
                    <Form className="max-w-md mx-auto bg-white p-6 rounded-xl shadow py-2 gap-4 justify-center items-center ">
                        <Input type="text" placeholder="Nombre del negocio" className="w-full px-1 py-2 rounded-md mt-3" />
                        <Input type="email" placeholder="Correo electrónico" className="w-full px-1 py-2 rounded-md" />
                        <Input type="tel" placeholder="Teléfono" className="w-full px-1 py-2 rounded-md" />
                        <Button className="w-1/2 bg-[#003f63] text-white py-2 rounded-md font-semibold hover:bg-[#002a45] transition mb-3">
                            Registrarme
                        </Button>
                    </Form>
                </div>
            </section>

            {/* CTA FINAL */}
            <section id="cta" className="py-20 px-6 bg-[#003f63] text-white text-center">
                <h2 className="text-3xl font-bold mb-4">¿Listo para vender o beber con Miche Claro?</h2>
                <p className="mb-6 text-lg">Descárgala gratis y únete a la nueva forma de disfrutar el alcohol con tecnología.</p>
                <Button
                    href="#"
                    className="bg-[#f9e27b] text-[#003f63] px-8 py-3 rounded-full font-bold hover:bg-[#ffe168] transition"
                >
                    Descargar Ahora
                </Button>
            </section>
          
            {/* FOOTER */}
            <footer className="py-6 text-center text-sm text-gray-600">
                © 2025 Miche Claro. Todos los derechos reservados.
            </footer>
        </div>
    );
}
