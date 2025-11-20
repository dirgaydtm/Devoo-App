import { useState, useRef } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { Eye, EyeOff, LockKeyhole, Mail, MessageSquare, User } from "lucide-react";
import OAuthButtons from "./OAuthButtons";
import toast from "react-hot-toast";

interface SignupFormProps {
    onSwitchToLogin: () => void;
}

const SignupForm = ({ onSwitchToLogin }: SignupFormProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [formData, setFormData] = useState({ username: "", email: "", password: "" });
    const confirmPasswordRef = useRef<HTMLInputElement>(null);

    const { signup, isSigningUp } = useAuthStore();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (formData.password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        signup(formData);
    };

    const inputClass = "input validator outline-0 shadow-none border-0 border-b w-full";
    const iconClass = "size-5 text-base-content/40";

    return (
        <div className="w-xs md:w-md space-y-6">
            {/* Logo */}
            <div className="flex flex-col items-center gap-1 text-center">
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <MessageSquare className="size-6 text-primary" />
                </div>
                <h1 className="text-2xl font-bold mt-2">Create Account</h1>
                <p className="text-sm text-base-content/60">Sign up in just a minute</p>
            </div>

            {/* Form */}
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

                <label className={inputClass}>
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
                    <button type="button" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <Eye className={iconClass} /> : <EyeOff className={iconClass} />}
                    </button>
                </label>

                <label className={inputClass}>
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
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        {showConfirmPassword ? <Eye className={iconClass} /> : <EyeOff className={iconClass} />}
                    </button>
                </label>

                <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>
                    {isSigningUp ? (
                        <>
                            <span className="loading loading-spinner loading-xs"></span>Creating Account...
                        </>
                    ) : (
                        "Create Account"
                    )}
                </button>
            </form>

            {/* OAuth Buttons */}
            <OAuthButtons />

            {/* Switch to Login */}
            <p className="text-sm text-center text-base-content/60">
                Already have an account?{" "}
                <button className="link link-primary" onClick={onSwitchToLogin}>
                    Login
                </button>
            </p>
        </div>
    );
};

export default SignupForm;
