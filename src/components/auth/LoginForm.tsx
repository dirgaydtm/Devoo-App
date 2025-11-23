import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import OAuthButtons from "./OAuthButtons";
import Logo from "../Logo";

interface LoginFormProps {
    onSwitchToSignup: () => void;
}

const LoginForm = ({ onSwitchToSignup }: LoginFormProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const { login, isLoggingIn } = useAuthStore();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await login(formData);
    };

    const inputClass = "input validator outline-0 shadow-none border-0 border-b w-full";
    const iconClass = "size-5 text-base-content/40";

    return (
        <div className="w-xs md:w-md space-y-6">
            {/* Logo */}
            <div className="flex flex-col items-center gap-1 text-center">
                <div className="group flex flex-col items-center gap-2 ">
                    <Logo className="size-12 p-2 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-transform duration-300" />
                    <span className="flex-row font-bold hidden group-hover:flex transition-transform duration-300"><p className="text-secondary">De</p><p className="text-primary">voo</p></span>
                </div>
                <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
                <p className="text-sm text-base-content/60">Login to your account</p>
            </div>

            {/* Form */}
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

                <label className={inputClass}>
                    <LockKeyhole className={iconClass} />
                    <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <button type="button" onClick={() => setShowPassword((prev) => !prev)}>
                        {showPassword ? <Eye className={iconClass} /> : <EyeOff className={iconClass} />}
                    </button>
                </label>

                <button type="submit" className="btn btn-primary w-full" disabled={isLoggingIn}>
                    {isLoggingIn ? (
                        <>
                            <span className="loading loading-spinner loading-xs"></span> Loading...
                        </>
                    ) : (
                        "Sign in"
                    )}
                </button>
            </form>

            {/* OAuth Buttons */}
            <OAuthButtons />

            {/* Switch to Signup */}
            <p className="text-center text-sm text-base-content/60">
                Don&apos;t have an account?{" "}
                <button className="link link-primary" onClick={onSwitchToSignup}>
                    Sign up
                </button>
            </p>
        </div>
    );
};

export default LoginForm;
