import { create } from "zustand";
import toast from "react-hot-toast";
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    addDoc,
    serverTimestamp,
    where,
    or,
    and,
    limit,
} from "firebase/firestore";

import { db } from "../lib/firebase";
import { uploadImage } from "../utils/image";
import { fileToBase64 } from "../utils/file";
import { validateMessage } from "../utils/validation";
import type { Message, User } from "../types/global";
import { useAuthStore } from "./useAuthStore";

let messagesUnsubscribe: (() => void) | null = null;

interface MessageStore {
    messages: Message[];
    selectedUser: User | null;
    isMessagesLoading: boolean;
    isSendingMessage: boolean;

    subscribeToMessages: (userId: string) => (() => void) | null;
    sendMessage: (messageData: { text?: string; imageFile?: File }) => Promise<void>;
    setSelectedUser: (user: User | null) => void;
}

export const useMessageStore = create<MessageStore>((set, get) => ({
    messages: [],
    selectedUser: null,
    isMessagesLoading: false,
    isSendingMessage: false,

    // Subscribe to Messages (Real-time)
    subscribeToMessages: (userId: string): (() => void) | null => {
        const authUser = useAuthStore.getState().authUser;

        if (!authUser) {
            console.warn("No authenticated user for subscribeToMessages");
            return null;
        }

        set({ isMessagesLoading: true });

        try {
            console.log(`Subscribing to messages with user: ${userId}`);

            // Query messages between current user and selected user using where/or/and
            const messagesQuery = query(
                collection(db, "messages"),
                or(
                    and(
                        where("senderId", "==", authUser.id),
                        where("receiverId", "==", userId)
                    ),
                    and(
                        where("senderId", "==", userId),
                        where("receiverId", "==", authUser.id)
                    )
                ),
                orderBy("createdAt", "asc"),
                limit(50) // Load max 50 messages for pagination
            );

            const unsubscribe = onSnapshot(
                messagesQuery,
                (snapshot) => {
                    const messages: Message[] = [];
                    snapshot.forEach((doc) => {
                        messages.push({ id: doc.id, ...doc.data() } as Message);
                    });

                    console.log(`Received ${messages.length} messages`);
                    set({ messages, isMessagesLoading: false });
                },
                (error: unknown) => {
                    console.error("Error subscribing to messages:", error);
                    const errorMessage =
                        error instanceof Error
                            ? error.message
                            : "Error loading messages";
                    toast.error(errorMessage);
                    set({ isMessagesLoading: false });
                }
            );

            return unsubscribe;
        } catch (error: unknown) {
            console.error("Error setting up message subscription:", error);
            const errorMessage =
                error instanceof Error ? error.message : "Error loading messages";
            toast.error(errorMessage);
            set({ isMessagesLoading: false });
            return null;
        }
    },

    // Send Message Action
    sendMessage: async (messageData: { text?: string; imageFile?: File }) => {
        const { selectedUser } = get();
        const authUser = useAuthStore.getState().authUser;

        if (!selectedUser || !authUser) {
            console.warn("Missing selected user or auth user for sendMessage");
            return;
        }

        try {
            set({ isSendingMessage: true });
            // Validate message content - at least one of text or image should exist
            const trimmedText = messageData.text?.trim();
            const hasText = !!trimmedText && trimmedText.length > 0;
            const hasImageFile = !!messageData.imageFile;

            if (!hasText && !hasImageFile) {
                throw new Error("Message must contain either text or image");
            }

            // Validate text if present
            if (trimmedText) {
                const textError = validateMessage(trimmedText);
                if (textError) throw new Error(textError);
            }

            let imageUrl = "";
            if (hasImageFile && messageData.imageFile) {
                // Convert file to dataURL
                const dataUrl = await fileToBase64(messageData.imageFile);
                imageUrl = (await uploadImage(dataUrl)) || "";
            }

            console.log("Validating message input... OK");
            console.log("Sending message...");

            await addDoc(collection(db, "messages"), {
                senderId: authUser.id,
                receiverId: selectedUser.id,
                text: trimmedText || "",
                image: imageUrl,
                createdAt: serverTimestamp(),
            });
            console.log("Message sent successfully!");
        } catch (error: unknown) {
            console.error("Error sending message:", error);
            const errorMessage =
                error instanceof Error ? error.message : "Error sending message";
            toast.error(errorMessage);
        } finally {
            set({ isSendingMessage: false });
        }
    },

    // Set Selected User Action
    setSelectedUser: (user: User | null) => {
        console.log(`Selected user: ${user?.username || "none"}`);

        if (messagesUnsubscribe) {
            messagesUnsubscribe();
            messagesUnsubscribe = null;
        }

        if (!user) {
            set({ selectedUser: null, messages: [], isMessagesLoading: false });
            return;
        }

        if (!user.id) {
            console.warn("Selected user is missing an id, skipping subscription");
            set({ selectedUser: user, messages: [], isMessagesLoading: false });
            return;
        }

        set({ selectedUser: user, messages: [], isMessagesLoading: true });
        const unsubscribe = get().subscribeToMessages(user.id);
        if (unsubscribe) {
            messagesUnsubscribe = unsubscribe;
        }
    },
}));

// Auto-clear selected user when user logs out
useAuthStore.subscribe((state) => {
    const authUserId = state.authUser?.id;
    const { setSelectedUser } = useMessageStore.getState();

    if (!authUserId) {
        setSelectedUser(null);
    }
});

