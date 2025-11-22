import { getUserInitials } from "../utils/user";

interface InitialAvatarProps {
    username?: string;
    className?: string;
}

const InitialAvatar = ({ username, className = "" }: InitialAvatarProps) => {

    const initials = getUserInitials(username ?? "");

    return (
        <div
            className={`inline-flex aspect-square items-center justify-center rounded-full bg-linear-to-r from-primary to-secondary text-primary-content font-bold uppercase tracking-wide shadow-md select-none ${className}`}
            aria-label={username || "Anonymous user"}
        >
            {initials}
        </div>
    );
};

export default InitialAvatar;
