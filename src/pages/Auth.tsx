import { useState, useRef, lazy, Suspense } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, LockKeyhole, Mail, MessageSquare, User } from "lucide-react";
import toast from "react-hot-toast";

// Lazy load heavy components
const SignUpAnimation = lazy(() => import("../components/authAnimation"));

const Auth = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [formData, setFormData] = useState({ username: "", email: "", password: "" });
    const [isLogin, setIsLogin] = useState(true);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);

    const { login, isLoggingIn, signup, isSigningUp } = useAuthStore();

    const handleSwitchMode = () => {
        setFormData({ username: "", email: "", password: "" });
        setConfirmPassword("");
        setIsLogin((prev) => !prev);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isLogin) {
            login(formData);
        } else {
            if (formData.password !== confirmPassword) {
                toast.error("Passwords do not match");
                return;
            }
            signup(formData);
        }
    };

    const inputClass = "input validator outline-0 shadow-none border-0 border-b w-full";
    const iconClass = "size-5 text-base-content/40";

    const PasswordToggle = ({ show, onClick }: { show: boolean; onClick: () => void }) => (
        <button type="button" onClick={onClick}>
            {show ? <Eye className={iconClass} /> : <EyeOff className={iconClass} />}
        </button>
    );

    const Logo = ({ title, subtitle }: { title: string; subtitle: string }) => (
        <div className="flex flex-col items-center gap-1 text-center">
            <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="size-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mt-2">{title}</h1>
            <p className="text-sm text-base-content/60">{subtitle}</p>
        </div>
    );

    return (
        <div className="h-screen flex justify-center items-center bg-base-300">
            {/* LOGIN FORM */}
            <div className={`flex flex-col overflow-hidden justify-center items-center duration-700 ease-in-out ${isLogin ? "lg:flex-6" : " hidden lg:flex lg:flex-4"}`}>
                <div className="w-xs md:w-md space-y-10">
                    <Logo title="Welcome Back" subtitle="Login to your account" />

                    <form noValidate onSubmit={handleSubmit} className="space-y-6">
                        <label className={inputClass}>
                            <Mail className={iconClass} />
                            <input
                                type="email"
                                placeholder="Email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </label>

                        <label className={`${inputClass} `}>
                            <LockKeyhole className={iconClass} />
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                placeholder="Password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            <PasswordToggle show={showPassword} onClick={() => setShowPassword(!showPassword)} />
                        </label>

                        <button type="submit" className="btn btn-primary w-full" disabled={isLoggingIn}>
                            {isLoggingIn ? <><span className="loading loading-spinner loading-xs"></span> Loading...</> : "Sign in"}
                        </button>
                    </form>

                    <p className="text-center text-sm text-base-content/60">
                        Don&apos;t have an account?{" "}
                        <button className="link link-primary" onClick={handleSwitchMode}>Sign up</button>
                    </p>
                </div>
            </div>

            {/* SIGNUP FORM */}
            <div className={`flex flex-col overflow-hidden justify-center items-center duration-700 ease-in-out ${isLogin ? "hidden lg:flex lg:flex-4" : "lg:flex-6"}`}>
                <div className="w-xs md:w-md space-y-10">
                    <Logo title="Create Account" subtitle="Sign up in just a minute" />

                    <form noValidate onSubmit={handleSubmit} className="space-y-6">
                        <label className={inputClass}>
                            <User className={iconClass} />
                            <input
                                type="text"
                                required
                                minLength={3}
                                maxLength={30}
                                placeholder="Username"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        </label>

                        <label className={inputClass}>
                            <Mail className={iconClass} />
                            <input
                                type="email"
                                required
                                placeholder="Email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </label>

                        <label className={`${inputClass} `}>
                            <LockKeyhole className={iconClass} />
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                placeholder="Password"
                                value={formData.password}
                                minLength={6}
                                onChange={(e) => {
                                    setFormData({ ...formData, password: e.target.value });
                                }}
                            />
                            <PasswordToggle show={showPassword} onClick={() => setShowPassword(!showPassword)} />
                        </label>

                        <label className={`${inputClass} `}>
                            <LockKeyhole className={iconClass} />
                            <input
                                ref={confirmPasswordRef}
                                type={showConfirmPassword ? "text" : "password"}
                                required
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    if (e.target.value !== formData.password) {
                                        e.target.setCustomValidity("Passwords do not match");
                                    } else {
                                        e.target.setCustomValidity("");
                                    }
                                }}
                            />
                            <PasswordToggle show={showConfirmPassword} onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
                        </label>

                        <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>
                            {isSigningUp ? <><span className="loading loading-spinner loading-xs"></span>Creating Account...</> : "Create Account"}
                        </button>
                    </form>

                    <p className="text-sm text-center text-base-content/60">
                        Already have an account?{" "}
                        <button className="link link-primary" onClick={handleSwitchMode}>Login</button>
                    </p>
                </div>
            </div>

            {/* ANIMATION OVERLAY */}
            <div className={`absolute transition-all duration-700 ease-in-out hidden lg:flex top-0 h-full w-[40%] bg-primary ${isLogin ? "left-[60%]" : "left-0"
                }`}>
                <Suspense fallback={
                    <div className="loading loading-ring size-40 m-auto "></div>
                }>
                    <SignUpAnimation />
                </Suspense>
            </div>
        </div>
    );
};

export default Auth;
