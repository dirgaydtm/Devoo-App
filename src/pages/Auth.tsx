import { lazy, Suspense, useState } from "react";
import LoginForm from "../components/auth/LoginForm";
import SignupForm from "../components/auth/SignupForm";

// Lazy load heavy components
const AuthAnimation = lazy(() => import("../components/auth/authAnimation"));

const Auth = () => {
    const [isLoginMode, setIsLoginMode] = useState(true);

    const handleSwitchMode = () => setIsLoginMode((prev) => !prev);

    return (
        <div className="h-screen flex justify-center items-center bg-base-300 relative overflow-hidden">
            {/* LOGIN FORM */}
            <div
                className={`flex flex-col justify-center items-center transition-all duration-700 ease-in-out absolute lg:relative
                    ${isLoginMode
                        ? "opacity-100 translate-x-0 lg:flex-6 pointer-events-auto"
                        : "opacity-0 -translate-x-full lg:translate-x-0 lg:opacity-100 lg:flex-4 pointer-events-none lg:pointer-events-auto"
                    }`}
            >
                <LoginForm onSwitchToSignup={handleSwitchMode} />
            </div>

            {/* SIGNUP FORM */}
            <div
                className={`flex flex-col justify-center items-center transition-all duration-700 ease-in-out absolute lg:relative
                    ${isLoginMode
                        ? "opacity-0 translate-x-full lg:translate-x-0 lg:opacity-100 lg:flex-4 pointer-events-none lg:pointer-events-auto"
                        : "opacity-100 translate-x-0 lg:flex-6 pointer-events-auto"
                    }`}
            >
                <SignupForm onSwitchToLogin={handleSwitchMode} />
            </div>

            {/* ANIMATION OVERLAY */}
            <div className={`absolute transition-all duration-700 ease-in-out hidden lg:flex top-0 h-full w-[40%] bg-primary ${isLoginMode ? "left-[60%]" : "left-0"
                }`}>
                <Suspense fallback={
                    <div className="loading loading-ring size-40 m-auto "></div>
                }>
                    <AuthAnimation />
                </Suspense>
            </div>
        </div>
    );
};

export default Auth;
