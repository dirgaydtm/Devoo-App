import { useEffect, useRef, useState } from "react";
import { Send, Loader, MenuIcon } from "lucide-react";
import { formatChatTimestamp } from "../../lib/date";
import { getUserInitials } from "../../lib/user";
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";

const ChatArea = () => {
    const { authUser } = useAuthStore();
    const {
        selectedUser,
        users,
        isUsersLoading,
        messages,
        isMessagesLoading,
        isSendingMessage,
        sendMessage,
        setSelectedUser,
    } = useChatStore();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [composerText, setComposerText] = useState("");

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async () => {
        const text = composerText.trim();
        if (!selectedUser || !text) return;
        await sendMessage({ text });
        setComposerText("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    if (!selectedUser) {
        return (
            <div className="flex flex-col h-full w-full">
                {/* Chat Header */}
                <div className="bg-base-300 z-10 p-3 border-b border-base-300 flex md:hidden items-center justify-between">
                    <label htmlFor="sidebar-drawer" className="btn md:hidden btn-ghost gap-2" ><MenuIcon /></label>
                </div>

                <div className="flex-1 hidden flex-col items-center justify-center text-center md:flex">
                    <p className="text-lg font-semibold mb-2">Select a user</p>
                    <p className="text-sm text-base-content/60">
                        Choose someone to start chatting
                    </p>
                </div>

                <div className="md:hidden">
                    {isUsersLoading ? (
                        <div className="flex items-center justify-center py-4">
                            <Loader className="w-5 h-5 animate-spin" />
                        </div>
                    ) : users.length === 0 ? (
                        <p className="text-sm text-base-content/50">
                            Belum ada pengguna lain yang online.
                        </p>
                    ) : (
                        users.map((user) => (
                            <button
                                key={user.id}
                                onClick={() => setSelectedUser(user)}
                                className="w-full flex items-center gap-3 border-b border-base-300 px-4 py-3 text-left"
                            >
                                {user.profilePicture ? (
                                    <img
                                        src={user.profilePicture}
                                        alt={user.username}
                                        className="w-10 h-10 rounded-full object-cover"
                                        crossOrigin="anonymous"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-primary text-primary-content font-semibold flex items-center justify-center">
                                        {getUserInitials(user.username)}
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">{user.username}</p>
                                    <p className="text-xs text-base-content/60 truncate">{user.email}</p>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 relative flex max-h-screen flex-col">
            {/* Chat Header */}
            <div className="bg-base-300 z-10 p-4 border-b border-base-300 flex items-center justify-between">
                <div className="flex items-center gap-3">

                    <img
                        src={selectedUser.profilePicture}
                        alt={getUserInitials(selectedUser.username)}
                        className="w-10 h-10 rounded-full overflow-hidden object-cover"
                        crossOrigin="anonymous"
                    />
                    <div>
                        <p className="font-semibold">{selectedUser.username}</p>
                        <p className="text-xs text-base-content/60">Online</p>
                    </div>
                </div>
                <label htmlFor="sidebar-drawer" className="btn md:hidden btn-ghost gap-2" ><MenuIcon /></label>
            </div>

            {/* Messages Area */}
            <div className="flex-1 z-10 mx-4 pt-4 pb-16 overflow-y-auto scrollbar-hide">
                <div className="space-y-4 ">
                    {isMessagesLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader className="w-6 h-6 animate-spin" />
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-center">
                            <div>
                                <p className="text-sm text-base-content/60">
                                    No messages yet. Start the conversation!
                                </p>
                            </div>
                        </div>
                    ) : (
                        messages.map((message) => {
                            const isSent = message.senderId === authUser?.id;
                            return (
                                <div
                                    key={message.id}
                                    className={`flex ${isSent ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`
                                        max-w-xs lg:max-w-md rounded-2xl px-4 py-2 shadow-sm
                                        ${isSent
                                                ? "bg-primary text-primary-content rounded-br-none"
                                                : "bg-base-300 text-base-content rounded-bl-none"
                                            }
                                    `}
                                    >
                                        {message.image && (
                                            <img
                                                src={message.image}
                                                alt="message"
                                                className="rounded-lg mb-2 max-w-xs"
                                                crossOrigin="anonymous"
                                            />
                                        )}
                                        {message.text && (
                                            <p className="wrap-break-word">{message.text}</p>
                                        )}
                                        <p
                                            className={`
                                            text-xs mt-1
                                            ${isSent
                                                    ? "text-primary-content/70"
                                                    : "text-base-content/60"
                                                }
                                        `}
                                        >
                                            {formatChatTimestamp(message.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Message Input */}
            <div className="absolute z-10 w-full bg-[linear-gradient(to_top,var(--color-base-100)_50%,transparent_50%)] p-4 bottom-0">
                <div className="flex rounded-full w-full p-2 space-x-2 bg-base-300">
                    <textarea
                        value={composerText}
                        onChange={(e) => setComposerText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isSendingMessage || !selectedUser}
                        placeholder="Type a message"
                        className="py-2 px-6 rounded-full focus:outline-0 text-base flex-1 resize-none"
                        rows={1}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!composerText.trim() || isSendingMessage || !selectedUser}
                        className="btn btn-circle btn-primary"
                    >
                        {isSendingMessage ? (
                            <Loader className="w-6 h-6 animate-spin" />
                        ) : (
                            <Send className="w-4" />
                        )}
                    </button>
                </div>
            </div>


            <div className="absolute inset-0 opacity-20 bg-[url('/topography.svg')] bg-cover bg-center z-0"></div>

        </div >
    );
};

export default ChatArea;
