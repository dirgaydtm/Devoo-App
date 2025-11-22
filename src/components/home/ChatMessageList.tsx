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
                                max-w-3xs lg:max-w-md rounded-2xl p-1 shadow-sm
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
                                    className="rounded-2xl max-w-full"
                                    crossOrigin="anonymous"
                                />
                            )}
                            {message.text && (
                                <p className= "text-sm lg:text-lg wrap-break-word m-1">
                                    {message.text.split("\n").map((line, idx, arr) => (
                                        <>
                                            {line}
                                            {idx < arr.length - 1 && <br />}
                                        </>
                                    ))}
                                </p>
                            )}
                            <p
                                className={`text-xs lg:text-sm m-1 ${isSent ? "text-primary-content/70 text-end" : "text-base-content/60"
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
