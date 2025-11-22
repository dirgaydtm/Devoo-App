import { useEffect, useState } from "react";

import ChatHeader from "./ChatHeader";
import ChatMessageList from "./ChatMessageList";
import ChatEmptyState from "./ChatEmptyState";
import ChatComposer from "./ChatComposer";
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
    const [composerText, setComposerText] = useState("");

    useEffect(() => {
        setComposerText("");
    }, [selectedUser?.id]);

    const handleSendMessage = async () => {
        const text = composerText.trim();
        if (!selectedUser || !text || isSendingMessage) return;
        await sendMessage({ text });
        setComposerText("");
    };

    return (
        <div className="flex-1 relative flex max-h-screen flex-col">
            <ChatHeader selectedUser={selectedUser} />

            <div className="flex-1 z-10 overflow-y-auto scrollbar-hide">
                {selectedUser ? (
                    <ChatMessageList
                        messages={messages}
                        isLoading={isMessagesLoading}
                        authUserId={authUser?.id}
                    />
                ) : (
                    <ChatEmptyState
                        users={users}
                        isUsersLoading={isUsersLoading}
                        onSelectUser={(user) => setSelectedUser(user)}
                    />
                )}
            </div>

            {selectedUser && (
                <ChatComposer
                    value={composerText}
                    onChange={setComposerText}
                    onSend={handleSendMessage}
                    isSending={isSendingMessage}
                />
            )}

            <div className="absolute inset-0 opacity-5 bg-[url('/topography.svg')] bg-cover bg-center z-0"></div>

        </div >
    );
};

export default ChatArea;
