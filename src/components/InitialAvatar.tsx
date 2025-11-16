import { useAuthStore } from "../store/useAuthStore"

const Avatar = () => {
    const { authUser } = useAuthStore();
    const initial = authUser?.username
        ?.split(" ")
        .map(word => word[0])
        .join("")
        .toUpperCase() || "?"

    return (
        <div className="size-full rounded-full text-5xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center font-bold shadow-md">
            {initial}
        </div>
    )
}

export default Avatar
