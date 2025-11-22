import { useState } from "react";
import ChatHeader from "../home/ChatHeader";
import ChatMessageList from "../home/ChatMessageList";
import ChatComposer from "../home/ChatComposer";
import { PREVIEW_AUTH_USER_ID, PREVIEW_MESSAGES, PREVIEW_SELECTED_USER } from "../../constants/preview";
import type { Message } from "../../types/global";

const ThemePreview = () => {
    const [messages, setMessages] = useState<Message[]>(PREVIEW_MESSAGES);
    const [composerText, setComposerText] = useState("");

    const handleSend = () => {
        const text = composerText.trim();
        if (!text) return;

        const newMessage: Message = {
            id: `preview-${Date.now()}`,
            senderId: PREVIEW_AUTH_USER_ID,
            receiverId: PREVIEW_SELECTED_USER.id ?? "preview-contact",
            text,
            createdAt: new Date(),
        };

        setMessages((prev) => [...prev, newMessage]);
        setComposerText("");
    };

    return (
        <div className="p-4 bg-base-200 flex-1 rounded-lg h-full">
            <div className="relative flex flex-col bg-base-100 rounded-3xl shadow-sm overflow-hidden h-full max-w-lg mx-auto">
                <ChatHeader selectedUser={PREVIEW_SELECTED_USER} />

                <div className="flex-1 overflow-y-auto scrollbar-hide">
                    <ChatMessageList messages={messages} isLoading={false} authUserId={PREVIEW_AUTH_USER_ID} />
                </div>

                <ChatComposer
                    value={composerText}
                    onChange={setComposerText}
                    onSend={handleSend}
                    isSending={false}
                />

                <div className="absolute inset-0 opacity-5 bg-[url('/topography.svg')] bg-cover bg-center z-0" />
            </div>
        </div>
    );
};

export default ThemePreview;
