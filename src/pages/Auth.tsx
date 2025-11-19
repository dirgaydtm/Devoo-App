import { useState, lazy, Suspense } from "react";
import LoginForm from "../components/auth/LoginForm";
import SignupForm from "../components/auth/SignupForm";

// Lazy load heavy components
const AuthAnimation = lazy(() => import("../components/auth/authAnimation"));

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);

    const handleSwitchMode = () => {
        setIsLogin((prev) => !prev);
    };

    return (
        <div className="h-screen flex justify-center items-center bg-base-300">
            {/* LOGIN FORM */}
            <div className={`flex flex-col overflow-hidden justify-center items-center duration-700 ease-in-out ${isLogin ? "lg:flex-6" : " hidden lg:flex lg:flex-4"}`}>
                <LoginForm onSwitchToSignup={handleSwitchMode} />
            </div>

            {/* SIGNUP FORM */}
            <div className={`flex flex-col overflow-hidden justify-center items-center duration-700 ease-in-out ${isLogin ? "hidden lg:flex lg:flex-4" : "lg:flex-6"}`}>
                <SignupForm onSwitchToLogin={handleSwitchMode} />
            </div>

            {/* ANIMATION OVERLAY */}
            <div className={`absolute transition-all duration-700 ease-in-out hidden lg:flex top-0 h-full w-[40%] bg-primary ${isLogin ? "left-[60%]" : "left-0"
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
