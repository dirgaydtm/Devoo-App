import { useEffect, useRef } from "react";
import { Loader } from "lucide-react";

import type { Message } from "../../types/global";
import { formatChatTimestamp } from "../../utils/date";

interface ChatMessageListProps {
    messages: Message[];
    isLoading: boolean;
    authUserId?: string;
}

const ChatMessageList = ({ messages, isLoading, authUserId }: ChatMessageListProps) => {
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader className="w-6 h-6 animate-spin" />
            </div>
        );
    }

    if (messages.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-center">
                <p className="text-sm text-base-content/60">No messages yet. Start the conversation!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 mx-4 pt-4 pb-16">
            {messages.map((message) => {
                const isSent = message.senderId === authUserId;
                return (
                    <div key={message.id} className={`flex ${isSent ? "justify-end" : "justify-start"}`}>
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
                                <p className="wrap-break-word">
                                    {message.text.split('\n').map((line, idx) => (
                                        <span key={idx}>
                                            {line}
                                            <br />
                                        </span>
                                    ))}
                                </p>
                            )}
                            <p
                                className={`text-xs mt-1 ${isSent ? "text-primary-content/70" : "text-base-content/60"
                                    }`}
                            >
                                {formatChatTimestamp(message.createdAt)}
                            </p>
                        </div>
                    </div>
                );
            })}
            <div ref={messagesEndRef} className="h-3" />
        </div>
    );
};

export default ChatMessageList;
