import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button, Input, Checkbox, Divider } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schemas/authSchemas";
import { useAuth } from "../hooks/useAuth";
import { Sms, Lock1, Eye, EyeSlash, ArrowLeft } from "iconsax-react";
import { useState } from "react";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/dashboard";

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data) => {
        setServerError("");
        const result = await login(data.email, data.password);
        if (result.success) {
            navigate(from, { replace: true });
        } else {
            setServerError(result.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-12">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[#0a0a0f]">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/15 rounded-full blur-[150px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-[150px]" />
            </div>

            <div className="relative w-full max-w-md animate-slide-up">
                {/* Back Button */}
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors no-underline"
                >
                    <ArrowLeft size={18} />
                    Back to Home
                </Link>

                {/* Card */}
                <div className="glass-card p-8 sm:p-10">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
                            <span className="text-white font-bold text-2xl">L</span>
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
                        <p className="text-gray-400 text-sm">
                            Sign in to continue your learning journey
                        </p>
                    </div>

                    {/* Server Error */}
                    {serverError && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-6">
                            <p className="text-red-400 text-sm text-center">{serverError}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div>
                            <Input
                                {...register("email")}
                                type="email"
                                label="Email"
                                placeholder="Enter your email"
                                variant="bordered"
                                startContent={
                                    <Sms size={18} className="text-gray-400 flex-shrink-0" />
                                }
                                isInvalid={!!errors.email}
                                errorMessage={errors.email?.message}
                                classNames={{
                                    inputWrapper:
                                        "border-white/10 hover:border-indigo-500/40 bg-white/5",
                                    label: "text-gray-400",
                                    input: "text-white",
                                }}
                            />
                        </div>

                        <div>
                            <Input
                                {...register("password")}
                                type={showPassword ? "text" : "password"}
                                label="Password"
                                placeholder="Enter your password"
                                variant="bordered"
                                startContent={
                                    <Lock1 size={18} className="text-gray-400 flex-shrink-0" />
                                }
                                endContent={
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-gray-400 hover:text-white transition-colors bg-transparent border-0 cursor-pointer"
                                    >
                                        {showPassword ? (
                                            <EyeSlash size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>
                                }
                                isInvalid={!!errors.password}
                                errorMessage={errors.password?.message}
                                classNames={{
                                    inputWrapper:
                                        "border-white/10 hover:border-indigo-500/40 bg-white/5",
                                    label: "text-gray-400",
                                    input: "text-white",
                                }}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <Checkbox
                                size="sm"
                                classNames={{ label: "text-gray-400 text-sm" }}
                                color="secondary"
                            >
                                Remember me
                            </Checkbox>
                            <Link
                                to="/forgot-password"
                                className="text-indigo-400 text-sm hover:text-indigo-300 transition-colors no-underline"
                            >
                                Forgot Password?
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            isLoading={isSubmitting}
                            className="w-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-semibold shadow-lg shadow-indigo-500/25 h-12 text-base"
                        >
                            {isSubmitting ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>

                    <Divider className="my-6 bg-white/10" />

                    {/* Footer */}
                    <p className="text-center text-gray-400 text-sm">
                        Don&apos;t have an account?{" "}
                        <Link
                            to="/register"
                            className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors no-underline"
                        >
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
