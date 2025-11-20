import { useEffect, useRef, useState } from "react";
import { Send, Loader, Phone, Video, MoreVertical } from "lucide-react";
import { formatChatTimestamp } from "../../lib/date";
import { getUserInitials } from "../../lib/user";
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";

const ChatArea = () => {
    const { authUser } = useAuthStore();
    const {
        selectedUser,
        messages,
        isMessagesLoading,
        isSendingMessage,
        sendMessage,
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
            <div className="flex-1 flex flex-col bg-base-200 m-4 sm:m-6 rounded-xl overflow-hidden">
                <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                        <p className="text-lg font-semibold mb-2">Select a user</p>
                        <p className="text-sm text-base-content/60">
                            Choose someone to start chatting
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-base-200 m-4 sm:m-6 rounded-xl overflow-hidden">
            {/* Chat Header */}
            <div className="bg-base-300 p-4 border-b border-base-300 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {selectedUser.profilePicture ? (
                        <img
                            src={selectedUser.profilePicture}
                            alt={selectedUser.username}
                            className="w-10 h-10 rounded-full object-cover"
                            crossOrigin="anonymous"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-content font-semibold">
                            {getUserInitials(selectedUser.username)}
                        </div>
                    )}
                    <div>
                        <p className="font-semibold">{selectedUser.username}</p>
                        <p className="text-xs text-base-content/60">Online</p>
                    </div>
                </div>

                {/* Header Actions */}
                <div className="flex gap-2">
                    <button className="btn btn-ghost btn-sm btn-circle">
                        <Phone className="w-5 h-5" />
                    </button>
                    <button className="btn btn-ghost btn-sm btn-circle">
                        <Video className="w-5 h-5" />
                    </button>
                    <button className="btn btn-ghost btn-sm btn-circle">
                        <MoreVertical className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-base-100">
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

            {/* Message Input */}
            <div className="border-t border-base-300 p-4 bg-base-200">
                <div className="flex gap-3 items-end">
                    <textarea
                        value={composerText}
                        onChange={(e) => setComposerText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isSendingMessage || !selectedUser}
                        placeholder="Type a message... (Shift+Enter for new line)"
                        className="textarea textarea-bordered textarea-sm flex-1 resize-none"
                        rows={1}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!composerText.trim() || isSendingMessage || !selectedUser}
                        className="btn btn-primary btn-sm gap-2"
                    >
                        {isSendingMessage ? (
                            <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatArea;
