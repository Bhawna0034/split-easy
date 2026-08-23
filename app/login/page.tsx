"use client"
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { LoginProps, SignUpFormProps } from "@/types";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, User, Wallet } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";


export default function Login() {
    const router = useRouter();
    const [formData, setFormData] = useState<LoginProps>({
        email: "",
        password: ""
    })
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<LoginProps>({
        email: "",
        password: ""
    })
    const [loading, setLoading] = useState(false)

    const validateForm = () => {
        const newErrors = {
            email: "",
            password: ""
        }


        if (!formData.email.trim()) {
            newErrors.email = "Email is required"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address.";
        }
        if (!formData.password) {
            newErrors.password = "Password is required.";
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters.";
        } else if (formData.password.length > 64) {
            newErrors.password = "Password must be less than 64 characters.";
        }
        setErrors(newErrors);
        return !Object.values(newErrors).some(Boolean);
    }
    const handleChange = (field: keyof LoginProps, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);

        try {
            const response = await fetch("api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (!response.ok) {
                toast.error(data.error || "Something went wrong")
                return;
            }
            toast.success("Login successfully!", {
                style: {
                    background: "#f0fdf4",
                    color: "#166534",
                    border: "1px solid #bbf7d0",
                }
            });
            // console.log(data);

        } catch (error) {
            console.error("Login failed: ", error)
            toast.error("Something went wrong. Please try again")
        } finally {
            setLoading(false)
        }

    }
    return (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center overflow-hidden bg-[#f8f4ef] min-h-screen p-12">
            <div className="h-full overflow-y-auto bg-white rounded-sm max-w-[90%] px-6 py-12">
                <div className="flex items-center gap-2.5 px-2 text-left">
                    <span className="flex size-9 items-center justify-center rounded-xl bg-[#27232a] text-[#fffaf5]"><Wallet className="size-[18px]" /></span>
                    <span className="text-[17px] font-bold tracking-[-0.04em]">Split<span className="text-[#f07d58]">Easy</span></span>
                </div>
                <div className="mt-12 space-y-3">
                    {/* <p className="text-base text-[#aca7a2]">GET STARTED</p> */}
                    <h2 className="text-5xl font-bold text-[#28252a]">Welcome Back.</h2>
                    <p className="text-base text-[#aca7a3] font-normal pt-1">Start splitting expenses with your people.</p>
                </div>
                <div className="mt-12">
                    <form className="space-y-4" onSubmit={handleSubmit}>

                        <Field>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <div className="relative">
                                <Mail className="pointer-events-none absolute top-1/2 left-4 w-4 h-4 -translate-y-1/2 text-[#c0bdb9]" />
                                <Input id="name" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} placeholder="you@example.com"
                                    autoComplete="off" className={`border rounded-lg pl-11 py-3.5 pr-4 text-gray-600 placeholder-[#bbbbbc] outline-none transition focus:border-neutral-400 ${errors.email ? "border-red-400" : "border-[#e4dfda]"}`} />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.email}
                                </p>
                            )}
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="password">Password</FieldLabel>
                            <div className="relative">
                                <LockKeyhole className="pointer-events-none absolute top-1/2 left-4 w-4 h-4 -translate-y-1/2 text-[#c0bdb9]" />
                                <Input id="name" type={showPassword ? "text" : "password"} value={formData.password} onChange={(e) => handleChange("password", e.target.value)} placeholder="At least 8 characters"
                                    autoComplete="new-password" className={`border border-[#e4dfda] rounded-lg px-11 py-3.5  text-gray-600 placeholder-[#bbbbbc] outline-none transition focus:border-neutral-400 ${errors.password ? "border-red-400" : "border-[#e4dfda]"}`} />
                                <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#c0bdb9] transition hover:text-[#27232a]" aria-label={showPassword ? "Hide Password" : "Show password"}>
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.password}
                                </p>
                            )}
                        </Field>
                        <Button type="submit" className="bg-[#27232a] text-[#f5f2ee] rounded-lg w-full h-10 hover:text-white mt-4">
                            {loading ? "Login" : "Login"}
                            <ArrowRight className="h-4 w-4" />
                        </Button>

                    </form>
                    <div className="mt-6 text-center text-sm text-[#aca7a3]">
                        Don't have an account?{" "}
                        <Link
                            href="/signup"
                            className="font-medium text-[#27232a] transition hover:text-[#f07d58]"
                        >
                            Create one
                        </Link>
                    </div>
                </div>
            </div>
            <div className="max-lg:hidden relative w-full h-full rounded-sm overflow-hidden">
                <Image
                    src="/background-image.png"
                    alt="SplitEasy app preview"
                    fill
                    priority
                    className="object-fit"
                />
            </div>


        </section>
    )
}