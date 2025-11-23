import { useState } from "react";
import { Loader, CircleUserRound, LogOut, PanelRightOpen, HomeIcon, PanelRightClose, Plus, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import InitialAvatar from "./InitialAvatar";
import Logo from "./Logo";
import { useAuthStore } from "../store/useAuthStore";
import { useContactStore } from "../store/useContactStore";
import { useMessageStore } from "../store/useMessageStore";
import { useLayoutStore } from "../store/useLayoutStore";

const Sidebar = () => {
    const [email, setEmail] = useState("");
    const { logout } = useAuthStore();
    const navigate = useNavigate();
    const {
        users,
        isUsersLoading,
        addContact,
        isAddingContact,
    } = useContactStore();
    const { selectedUser, setSelectedUser } = useMessageStore();
    const { setSidebarOpen } = useLayoutStore();

    const handleSelectUser = (user: typeof users[0]) => {
        setSelectedUser(user);
        navigate("/");
    };

    const handleGoHome = () => {
        setSelectedUser(null);
        navigate("/");
        setSidebarOpen(false);
    };

    const handleAddContact = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await addContact(email);
        setEmail("");
    };

    return (
        <div className="drawer-side is-drawer-close:overflow-visible z-50">
            <label htmlFor="sidebar-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
            <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-18 is-drawer-open:w-80">
                {/* Navigation Menu */}
                <ul className="menu w-full">
                    <div className="flex gap-2 justify-center is-drawer-open:justify-between items-center h-16 w-full">
                        <span className="is-drawer-close:hidden font-extrabold flex text-lg justify-center items-center"><Logo className="size-9 m-2"/><p className="text-secondary">De</p><p className="text-primary">voo</p></span>
                        <label htmlFor="sidebar-drawer"
                            className="is-drawer-close:hidden hidden items-center justify-center size-11 rounded-full cursor-pointer hover:bg-white/10 md:flex">
                            <PanelRightOpen />
                        </label>
                        <label htmlFor="sidebar-drawer"
                            className="is-drawer-open:hidden hidden items-center justify-center size-11 rounded-full cursor-pointer hover:bg-white/10 md:flex is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Resize"
                        >
                            <PanelRightClose />
                        </label>
                    </div>
                    <li>
                        <Link to="/" onClick={handleGoHome} className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Home">
                            <div className="shrink-0">
                                <div className="w-8 h-8 flex items-center justify-center">
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
                                <div className="w-8 h-8 flex items-center justify-center">
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
                                <div className="w-8 h-8 flex items-center justify-center">
                                    <LogOut className="w-6 h-6" />
                                </div>
                            </div>
                            <div className="flex-1 min-w-0 is-drawer-close:hidden text-left">
                                <p className="font-medium text-base-content">Logout</p>
                            </div>
                        </button>
                    </li>
                </ul>


                <div className="divider my-0"></div>

                {/* Contacts List */}
                <ul className="menu w-full grow">
                    {/* Add Contact Input */}
                    <form onSubmit={handleAddContact} className="flex gap-2 justify-center items-center w-full my-3">
                        <label className="input validator outline-0 shadow-none border-0 border-b flex-1 is-drawer-close:hidden ms-3">
                        <Mail className="size-5 text-base-content/40" />
                        <input
                                type="email"
                                placeholder="Add by email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isAddingContact}
                            />
                        </label>
                            
                        <button
                            type="submit"
                            disabled={isAddingContact || !email.trim()}
                            className="is-drawer-close:tooltip is-drawer-close:tooltip-right items-center justify-center size-11 rounded-full cursor-pointer hover:bg-white/10 md:flex"
                            data-tip="Add Contact"
                        >
                            {isAddingContact ? (
                                <Loader className="animate-spin" />
                            ) : (
                                <Plus />
                            )}
                        </button>
                    </form>

                    {isUsersLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader className="w-6 h-6 animate-spin" />
                        </div>
                    ) : users.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center p-4 is-drawer-close:hidden gap-2">
                                <p className="text-sm text-base-content/60">No contacts yet</p>
                                <p className="text-xs text-base-content/40">Add a contact to start chatting</p>
                        </div>
                    ) : (
                        users.map((user) => (
                            <li key={user.id}>
                                <button onClick={() => handleSelectUser(user)} className={`is-drawer-close:tooltip is-drawer-close:tooltip-right h-12 flex items-center ${selectedUser?.id === user.id ? "active" : ""}`} data-tip={user.username}>
                                    <div className="shrink-0">
                                        {user.profilePicture ? (
                                            <img src={user.profilePicture} alt={user.username} className="size-8  rounded-full object-cover" crossOrigin="anonymous" />
                                        ) : (
                                            <InitialAvatar username={user.username} className="w-10 h-10 text-base" />
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
