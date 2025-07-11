'use client'
import axios from "axios"
import { useState, useEffect } from "react"
import { Card, CardHeader, Form, Input, Button } from "@heroui/react";
import { EyeSlashFilledIcon, EyeFilledIcon } from "@/components/icons";
import { useRouter } from "next/navigation";


export default function Home() {
    const router = useRouter();
    const [submitted, setSubmitted] = useState<null | { [k: string]: FormDataEntryValue }>(null);
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);
  

    const onSubmit = async (e:any) => {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(e.currentTarget));
        console.log(data);
        setSubmitted(data);
        try{
            const response = await axios.post('/api/auth/login', data)
            if(response.status === 200) {
                console.log("Login successful:", response.data);
                router.push('/admin');
            }else {
                console.log("Login failed:", response.data);
                alert("Login failed: " + response.data.message);
            }

        }catch (error) {
                console.error("Error during login:", error);   
        }
    };
    return (
        <div className='min-h-screen w-full bg-gradient-to-bl from-azul1 to-cyan-800'>
            <section className='flex flex-col gap-12 mx-8 sm:mx-16 rounded justify-center items-center pt-32'>
                <div className='flex justify-center items-center max-w-md sm:max-w-lg shadow-2xl'>
                    <Card shadow="lg" radius="none" >
                        <CardHeader className='border-verde3  border flex gap-4 justify-center items-center bg-gray-300'> 
                            <h1 className='text-verde2 text-xl '>¡Inicia Sesión Administrador!</h1>
                        </CardHeader>
                    </Card>
                </div>
                <div className='flex justify-center items-center  max-w-lg sm:max-w-lg shadow-2xl mb-12'>
                    <Card shadow="lg" radius="sm" >
                        <CardHeader className='bg-gray-300  border flex gap-4 justify-center items-center  '>
                            <Form className="w-full gap-8 px-6 py-4" onSubmit={onSubmit}>
                                <Input
                                    className="max-w-xs"
                                    isRequired
                                    errorMessage="Nombre de usuario incorrecto"
                                    label="Usuario"
                                    labelPlacement="outside"
                                    name="username"
                                    placeholder="Ingresa tu nombre de usuario"
                                    type="text"
                                    variant="bordered"
                                />
                                <Input
                                    isRequired
                                    className="max-w-xs"
                                    endContent={
                                        <button
                                            aria-label="toggle password visibility"
                                            className="focus:outline-none"
                                            type="button"
                                            onClick={toggleVisibility}
                                        >
                                            {isVisible ? (
                                                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                            ) : (
                                                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                            )}
                                        </button>
                                    }
                                    label="Contraseña"
                                    name="password"
                                    labelPlacement="outside"
                                    placeholder="Ingresa tu contraseña"
                                    type={isVisible ? "text" : "password"}
                                    variant="bordered"
                                />
                                <Button type="submit" variant="bordered" className=' w-full bg-lime-600'>
                                    Submit
                                </Button>
                            </Form>
                        </CardHeader>
                    </Card>
                </div>
            </section>
        </div>
    )

}