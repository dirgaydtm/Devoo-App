import { Loader } from "lucide-react";

import InitialAvatar from "../InitialAvatar";
import type { User } from "../../types/global";

interface ChatEmptyStateProps {
    users: User[];
    isUsersLoading: boolean;
    onSelectUser: (user: User) => void;
}

const ChatEmptyState = ({ users, isUsersLoading, onSelectUser }: ChatEmptyStateProps) => (
    <div className="flex flex-col md:items-center md:justify-center  h-full gap-6">
        <div className="hidden md:flex text-center flex-col">
            <p className="text-lg font-semibold mb-2">Select a user</p>
            <p className="text-sm text-base-content/60">Choose someone to start chatting</p>
        </div>

        <div className="w-full min-h-fit md:hidden">
            {isUsersLoading ? (
                <div className="flex items-center justify-center py-4">
                    <Loader className="w-5 h-5 animate-spin" />
                </div>
            ) : users.length === 0 ? (
                <p className="text-sm text-base-content/50">Belum ada pengguna lain yang online.</p>
            ) : (
                users.map((user) => (
                    <button
                        key={user.id}
                        onClick={() => onSelectUser(user)}
                        className="w-full flex items-center gap-3 border-b border-base-200 backdrop-blur-xl p-3 text-left"
                    >
                        {user.profilePicture ? (
                            <img
                                src={user.profilePicture}
                                alt={user.username}
                                className="w-10 h-10 rounded-full object-cover"
                                crossOrigin="anonymous"
                            />
                        ) : (
                            <InitialAvatar username={user.username} className="w-10 h-10 text-lg" />
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{user.username}</p>
                            <p className="text-xs text-base-content/60 truncate">{user.email}</p>
                        </div>
                    </button>
                ))
            )}
        </div>
    </div>
);

export default ChatEmptyState;
