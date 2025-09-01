import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import {
    Eye,
    EyeOff,
    Loader2,
    LockKeyhole,
    Mail,
    MessageSquare,
    User,
} from "lucide-react";
import SignUpAnimation from "../components/SignUpAnimation";
import toast from "react-hot-toast";

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [onLogin, setOnLogin] = useState(true);

    const handleSwitchMode = () => {
        setFormData({ username: "", email: "", password: "" });
        setOnLogin((prev) => !prev);
    };
    const { login, isLoggingIn } = useAuthStore();

    const { signUp, isSigningUp } = useAuthStore();

    const validateFormSignUp = () => {
        if (!formData.username.trim()) return toast.error("Username is Required");
        if (!formData.email.trim()) return toast.error("Email is Required");
        if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Email is Invalid");
        if (!formData.password.trim()) return toast.error("Password is Required");

        return true
    };
    const validateFormLogin = () => {
        if (!formData.email.trim()) return toast.error("Email is Required");
        if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Email is Invalid");
        if (!formData.password.trim()) return toast.error("Password is Required");

        return true
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const isValid = onLogin ? validateFormLogin() : validateFormSignUp();

        if (isValid) {
            if (onLogin) {
                // Login logic
                login(formData);
            } else {
                // Sign up logic
                signUp(formData);
            }
        }
    };

    return (
        <div className="h-screen flex justify-center items-center relative">
            <div className="card relative grid lg:grid-cols-2 lg:bg-base-300 lg:w-[80%] lg:h-[80%]">
                {/* LEFT SIDE*/}
                <div className={`flex flex-col justify-center items-center ${onLogin ? "" : "hidden lg:flex"}`}>
                    <div className="w-full lg:max-w-md space-y-10">
                        {/* LOGO */}
                        <div className="text-center">
                            <div className="flex flex-col items-center gap-2 group">
                                <div
                                    className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
                                group-hover:bg-primary/20 transition-colors"
                                >
                                    <MessageSquare className="size-6 text-primary" />
                                </div>
                                <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
                                <p className="text-base-content/60">Login to your account</p>
                            </div>
                        </div>

                        {/* Form */}
                        <form noValidate onSubmit={handleSubmit} className="">

                            {/* Email */}
                            <div className="form-control">
                                <label className="input validator w-full">
                                    <Mail className="size-5 text-base-content/40" />
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => {
                                            setFormData({ ...formData, email: e.target.value });
                                            e.target.checkValidity();
                                        }}
                                    />
                                </label>
                                <p className="validator-hint text-error">
                                    Must be a valid email address
                                </p>
                            </div>

                            {/* PASSWORD */}
                            <div className="form-control mb-6">
                                <label className="input w-full">
                                    <LockKeyhole className="size-5 text-base-content/40" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={(e) =>
                                            setFormData({ ...formData, password: e.target.value })
                                        }
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 z-1 right-0 pr-3 flex items-center"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <Eye className="size-5 text-base-content/40" />
                                        ) : (
                                            <EyeOff className="size-5 text-base-content/40" />
                                        )}
                                    </button>
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-full"
                                disabled={isLoggingIn}
                            >
                                {isLoggingIn ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Loading...
                                    </>
                                ) : (
                                    "Sign in"
                                )}
                            </button>
                        </form>

                        <div className="text-center">
                            <p className="text-base-content/60">
                                Don&apos;t have an account?{" "}
                                <button
                                    className="link link-primary"
                                    onClick={handleSwitchMode}
                                >
                                    Sign up
                                </button>
                            </p>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE*/}
                <div className={`flex flex-col justify-center items-center ${onLogin ? "hidden lg:flex" : ""}`}>
                    <div className="w-full max-w-md space-y-10">
                        {/* LOGO */}
                        <div className="text-center">
                            <div className="flex flex-col items-center gap-2 group">
                                <div
                                    className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
                                group-hover:bg-primary/20 transition-colors"
                                >
                                    <MessageSquare className="size-6 text-primary" />
                                </div>
                                <h1 className="text-2xl font-bold mt-2">Sign Up</h1>
                                <p className="text-base-content/60">
                                    Create your account in just a minute.
                                </p>
                            </div>
                        </div>

                        {/* FORM */}
                        <form noValidate onSubmit={handleSubmit} className="">
                            {/* Username */}
                            <div className="form-control">
                                <label className="input validator w-full">
                                    <User className="size-5 text-base-content/40" />
                                    <input
                                        type="text"
                                        required
                                        minLength={3}
                                        maxLength={30}
                                        placeholder="Username"
                                        value={formData.username}
                                        onChange={(e) =>
                                            setFormData({ ...formData, username: e.target.value })
                                        }
                                    />
                                </label>
                                <p className="validator-hint text-error">
                                    Must be 3 to 30 characters
                                </p>
                            </div>

                            {/* Email */}
                            <div className="form-control">
                                <label className="input validator w-full">
                                    <Mail className="size-5 text-base-content/40" />
                                    <input
                                        type="email"
                                        required
                                        placeholder="Email"
                                        value={formData.email}
                                        onChange={(e) => {
                                            setFormData({ ...formData, email: e.target.value });
                                            e.target.checkValidity(); // ✅ langsung cek ke browser
                                        }}
                                    />
                                </label>
                                <p className="validator-hint text-error">
                                    Must be a valid email address
                                </p>
                            </div>

                            {/* Password */}
                            <div className="form-control">
                                <label className="input validator w-full">
                                    <LockKeyhole className="size-5 text-base-content/40" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        placeholder="Password"
                                        value={formData.password}
                                        minLength={8}
                                        pattern="^(?=.*\d).+$"
                                        onChange={(e) =>
                                            setFormData({ ...formData, password: e.target.value })
                                        }
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 z-1 right-0 pr-3 flex items-center"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <Eye className="size-5 text-base-content/40" />
                                        ) : (
                                            <EyeOff className="size-5 text-base-content/40" />
                                        )}
                                    </button>
                                </label>
                                <p className="validator-hint">
                                    Must be more than 8 characters including number
                                </p>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-full"
                                disabled={isSigningUp}
                            >
                                {isSigningUp ? (
                                    <>
                                        <Loader2 className="size-5 animate-spin" />
                                        Loading...
                                    </>
                                ) : (
                                    "Create Account"
                                )}
                            </button>
                        </form>

                        <div className="text-center">
                            <p className="text-base-content/60">
                                Already have an account?{" "}
                                <button
                                    className="link link-primary"
                                    onClick={handleSwitchMode}
                                >
                                    Login
                                </button>
                            </p>
                        </div>
                    </div>
                </div>

                <div
                    className={`card absolute transition-all duration-500 ease-in-out hidden lg:flex bg-base-30 top-0 ${onLogin ? "translate-x-full" : "translate-x-0"
                        } w-1/2 h-full bg-primary`}
                >
                    <SignUpAnimation />
                </div>
            </div>
        </div>
    );
};

export default SignUp;
