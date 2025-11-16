import { useEffect, useRef, useState } from "react";
import { Send, Loader, Phone, Video, MoreVertical } from "lucide-react";
import Navbar from "../components/Navbar";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { Timestamp } from "firebase/firestore";

const Home = () => {
    const { authUser } = useAuthStore();
    const {
        messages,
        users,
        selectedUser,
        isUsersLoading,
        isMessagesLoading,
        getUsers,
        subscribeToMessages,
        sendMessage,
        setSelectedUser,
    } = useChatStore();

    const [messageInput, setMessageInput] = useState("");
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const unsubscribeRef = useRef<(() => void) | null>(null);

    // Load users on mount
    useEffect(() => {
        getUsers();
    }, [getUsers]);

    // Subscribe to messages when user is selected
    useEffect(() => {
        if (!selectedUser?.id) return;

        // Cleanup previous subscription
        if (unsubscribeRef.current) {
            unsubscribeRef.current();
        }

        // Subscribe to new messages
        unsubscribeRef.current = subscribeToMessages(selectedUser.id);

        // Cleanup on unmount
        return () => {
            if (unsubscribeRef.current) {
                unsubscribeRef.current();
            }
        };
    }, [selectedUser?.id, subscribeToMessages]);

    // Auto-scroll to latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Handle send message
    const handleSendMessage = async () => {
        if (!messageInput.trim() || !selectedUser) return;

        const messageText = messageInput;
        setMessageInput("");
        setIsSending(true);

        try {
            console.log("Sending message:", messageText);
            await sendMessage({ text: messageText });
        } catch (error) {
            console.error("Error sending message:", error);
            setMessageInput(messageText); // Restore input on error
        } finally {
            setIsSending(false);
        }
    };

    // Handle key press (Enter to send, Shift+Enter for new line)
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Format message time
    const formatTime = (createdAt: Timestamp | Date | null) => {
        if (!createdAt) return "";
        const date =
            createdAt instanceof Timestamp ? createdAt.toDate() : createdAt;
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="flex flex-col h-screen bg-base-100">
            <Navbar />

            <div className="flex flex-1 overflow-hidden gap-4 p-4 sm:p-6">
                {/* Users List - Desktop Sidebar */}
                <div className="hidden sm:flex sm:w-80 flex-col bg-base-200 rounded-xl overflow-hidden">
                    {/* Users Header */}
                    <div className="p-4 border-b border-base-300">
                        <h2 className="text-lg font-semibold">Messages</h2>
                    </div>

                    {/* Users List */}
                    <div className="flex-1 overflow-y-auto">
                        {isUsersLoading ? (
                            <div className="flex items-center justify-center h-full">
                                <Loader className="w-6 h-6 animate-spin" />
                            </div>
                        ) : users.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-center p-4">
                                <div>
                                    <p className="text-sm text-base-content/60">No users found</p>
                                </div>
                            </div>
                        ) : (
                            users.map((user) => (
                                <button
                                    key={user.id}
                                    onClick={() => setSelectedUser(user)}
                                    className={`w-full p-4 border-b border-base-300 hover:bg-base-300 transition-colors flex items-center gap-3 ${selectedUser?.id === user.id ? "bg-base-300" : ""
                                        }`}
                                >
                                    {/* User Avatar */}
                                    <div className="shrink-0">
                                        {user.profilePicture ? (
                                            <img
                                                src={user.profilePicture}
                                                alt={user.username}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-content font-semibold">
                                                {user.username?.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>

                                    {/* User Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{user.username}</p>
                                        <p className="text-xs text-base-content/60">Online</p>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col bg-base-200 rounded-xl overflow-hidden">
                    {selectedUser ? (
                        <>
                            {/* Chat Header */}
                            <div className="bg-base-300 p-4 border-b border-base-300 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {selectedUser.profilePicture ? (
                                        <img
                                            src={selectedUser.profilePicture}
                                            alt={selectedUser.username}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-content font-semibold">
                                            {selectedUser.username?.charAt(0).toUpperCase()}
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
                                                className={`flex ${isSent ? "justify-end" : "justify-start"
                                                    }`}
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
                                                        {formatTime(message.createdAt)}
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
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        disabled={isSending}
                                        placeholder="Type a message... (Shift+Enter for new line)"
                                        className="textarea textarea-bordered textarea-sm flex-1 resize-none"
                                        rows={1}
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={!messageInput.trim() || isSending}
                                        className="btn btn-primary btn-sm gap-2"
                                    >
                                        {isSending ? (
                                            <Loader className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Send className="w-4 h-4" />
                                        )}
                                        Send
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        // No user selected
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <p className="text-lg font-semibold mb-2">Select a user</p>
                                <p className="text-sm text-base-content/60">
                                    Choose someone to start chatting
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Mobile Users Modal - Shows as overlay on mobile */}
                {selectedUser && (
                    <div className="sm:hidden fixed inset-0 bg-black/50 z-40">
                        <div className="absolute left-0 top-0 h-full w-64 bg-base-200 flex flex-col border-r border-base-300">
                            <div className="p-4 border-b border-base-300 flex items-center justify-between">
                                <h2 className="text-lg font-semibold">Messages</h2>
                                <button
                                    onClick={() => setSelectedUser(null)}
                                    className="btn btn-ghost btn-sm btn-circle"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto">
                                {users.map((user) => (
                                    <button
                                        key={user.id}
                                        onClick={() => setSelectedUser(user)}
                                        className={`w-full p-4 border-b border-base-300 hover:bg-base-300 transition-colors flex items-center gap-3 ${selectedUser?.id === user.id ? "bg-base-300" : ""
                                            }`}
                                    >
                                        <div className="shrink-0">
                                            {user.profilePicture ? (
                                                <img
                                                    src={user.profilePicture}
                                                    alt={user.username}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-content font-semibold">
                                                    {user.username?.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">{user.username}</p>
                                            <p className="text-xs text-base-content/60">Online</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
