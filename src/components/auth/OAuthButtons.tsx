import { useAuthStore } from "../../store/useAuthStore";
import { FaGoogle, FaGithub } from "react-icons/fa";

const OAuthButtons = () => {
    const { loginWithOAuth, isLoggingIn, isSigningUp } = useAuthStore();
    const isLoading = isLoggingIn || isSigningUp;

    return (
        <>
            {/* Divider */}
            <div className="divider text-xs text-base-content/40">OR CONTINUE WITH</div>

            {/* OAuth Buttons */}
            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={() => loginWithOAuth("google")}
                    disabled={isLoading}
                    className="btn btn-outline border-base-content/40 hover:border-none hover:bg-primary flex-1 gap-2"
                >
                    <FaGoogle className="size-5" />
                    Google
                </button>
                <button
                    type="button"
                    onClick={() => loginWithOAuth("github")}
                    disabled={isLoading}
                    className="btn btn-outline border-base-content/40 hover:border-none hover:bg-primary flex-1 gap-2"
                >
                    <FaGithub className="size-5" />
                    GitHub
                </button>
            </div>
        </>
    );
};

export default OAuthButtons;
