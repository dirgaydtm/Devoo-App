import { useEffect, useState } from "react";

import ChatHeader from "./ChatHeader";
import ChatMessageList from "./ChatMessageList";
import ChatEmptyState from "./ChatEmptyState";
import ChatComposer from "./ChatComposer";
import { useContactStore } from "../../store/useContactStore";
import { useMessageStore } from "../../store/useMessageStore";
import { useAuthStore } from "../../store/useAuthStore";

const ChatArea = () => {
    const { authUser } = useAuthStore();
    const { users, isUsersLoading } = useContactStore();
    const {
        selectedUser,
        messages,
        isMessagesLoading,
        isSendingMessage,
        sendMessage,
        setSelectedUser,
    } = useMessageStore();
    const [composerText, setComposerText] = useState("");

    useEffect(() => {
        setComposerText("");
    }, [selectedUser?.id]);

    const handleSendMessage = async (imageFile?: File) => {
        const text = composerText.trim();
        if (!selectedUser || isSendingMessage) return;
        if (!text && !imageFile) return;
        await sendMessage({ text, imageFile });
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
