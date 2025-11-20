import { Loader, CircleUserRound, LogOut, PanelRightOpen, HomeIcon, PanelRightClose } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";
import { getUserInitials } from "../../lib/user";

const Sidebar = () => {
    const { logout } = useAuthStore();
    const navigate = useNavigate();
    const {
        users,
        selectedUser,
        isUsersLoading,
        setSelectedUser,
    } = useChatStore();

    const handleSelectUser = (user: typeof users[0]) => {
        setSelectedUser(user);
        navigate("/");
    };

    return (
        <div className="drawer-side is-drawer-close:overflow-visible z-50">
            <label htmlFor="sidebar-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
            <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-18 is-drawer-open:w-80">
                {/* Navigation Menu */}
                <ul className="menu w-full p-2">
                    <div className="flex px-2 py-4 items-center justify-between w-full">
                        <span className="is-drawer-close:hidden font-semibold">Devoo</span>
                        <label htmlFor="sidebar-drawer"
                            className="is-drawer-close:hidden flex items-center justify-center size-11 rounded-full cursor-pointer hover:bg-white/10 "
                        >
                            <PanelRightOpen />
                        </label>
                        <label htmlFor="sidebar-drawer"
                            className="is-drawer-open:hidden flex items-center justify-center size-11 rounded-full cursor-pointer hover:bg-white/10 "
                        >
                            <PanelRightClose />
                        </label>
                    </div>
                    <li>
                        <Link to="/" className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Home">
                            <div className="shrink-0">
                                <div className="w-8 h-8 flex items-center justify-center text-primary-content">
                                    <HomeIcon className="w-6 h-6" />
                                </div>
                            </div>
                            <div className="flex-1 min-w-0 is-drawer-close:hidden text-left">
                                <p className="font-medium text-base-content">Home</p>
                            </div>
                        </Link>
                    </li>
                    <li>
                        <Link to="/profile" className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Profile">
                            <div className="shrink-0">
                                <div className="w-8 h-8 flex items-center justify-center text-primary-content">
                                    <CircleUserRound className="w-6 h-6" />
                                </div>
                            </div>
                            <div className="flex-1 min-w-0 is-drawer-close:hidden text-left">
                                <p className="font-medium text-base-content">Profile</p>
                            </div>
                        </Link>
                    </li>
                    <li>
                        <button onClick={logout} className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Logout">
                            <div className="shrink-0">
                                <div className="w-8 h-8 flex items-center justify-center text-primary-content">
                                    <LogOut className="w-6 h-6" />
                                </div>
                            </div>
                            <div className="flex-1 min-w-0 is-drawer-close:hidden text-left">
                                <p className="font-medium text-base-content">Logout</p>
                            </div>
                        </button>
                    </li>
                </ul>

                <div className="divider"></div>

                {/* Users List */}
                <ul className="menu w-full grow">
                    {isUsersLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader className="w-6 h-6 animate-spin" />
                        </div>
                    ) : users.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-center p-4 is-drawer-close:hidden">
                            <div>
                                <p className="text-sm text-base-content/60">No users found</p>
                            </div>
                        </div>
                    ) : (
                        users.map((user) => (
                            <li key={user.id}>
                                <button onClick={() => handleSelectUser(user)} className={`is-drawer-close:tooltip is-drawer-close:tooltip-right ${selectedUser?.id === user.id ? "active" : ""}`} data-tip={user.username}>
                                    <div className="shrink-0">
                                        {user.profilePicture ? (
                                            <img src={user.profilePicture} alt={user.username} className="w-8 h-8 rounded-full object-cover" crossOrigin="anonymous" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-content font-semibold">
                                                {getUserInitials(user.username)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 is-drawer-close:hidden text-left">
                                        <p className="font-medium truncate">{user.username}</p>
                                        <p className="text-xs text-base-content/60">{user.email}</p>
                                    </div>
                                </button>
                            </li>
                        ))
                    )}
                </ul>


            </div>
        </div>
    );
};

export default Sidebar;
