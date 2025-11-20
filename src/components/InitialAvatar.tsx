import { useAuthStore } from "../store/useAuthStore"
import { getUserInitials } from "../lib/user"

const Avatar = () => {
    const { authUser } = useAuthStore();
    const initial = getUserInitials(authUser?.username)

    return (
        <div className="size-full rounded-full text-5xl bg-linear-to-r from-primary to-secondary flex items-center justify-center font-bold shadow-md">
            {initial}
        </div>
    )
}

export default Avatar
