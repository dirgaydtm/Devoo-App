import { MenuIcon } from "lucide-react";

import InitialAvatar from "../InitialAvatar";
import type { User } from "../../types/global";

interface ChatHeaderProps {
    selectedUser: User | null;
}

const ChatHeader = ({ selectedUser }: ChatHeaderProps) => (
    <div
        className={`bg-base-300 z-10 p-4 border-b border-base-300 flex items-center justify-between ${selectedUser ? "" : "md:hidden"
            }`}
    >
        <div className="flex items-center gap-3">
            {selectedUser ? (
                <>
                    {selectedUser.profilePicture ? (
                        <img
                            src={selectedUser.profilePicture}
                            className="h-8 w-8 md:h-10 md:w-10 rounded-full object-cover overflow-hidden"
                            crossOrigin="anonymous"
                        />
                    ) : (
                        <InitialAvatar
                            username={selectedUser.username}
                            className="h-8 w-8 md:h-10 md:w-10 text-sm md:text-lg"
                        />
                    )}
                    <div>
                        <p className="text-sm md:text-base font-semibold">
                            {selectedUser.username}
                        </p>
                        <p className="text-xs md:text-sm text-base-content/60">Online</p>
                    </div>
                </>
            ) : (
                <div className="flex flex-col">
                    <span className="font-semibold">Devoo</span>
                </div>
            )}
        </div>
        <label htmlFor="sidebar-drawer" className="btn md:hidden btn-ghost gap-2">
            <MenuIcon />
        </label>
    </div>
);

export default ChatHeader;
