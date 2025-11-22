import { create } from "zustand";
import toast from "react-hot-toast";
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    addDoc,
    serverTimestamp,
    getDocs,
    where,
    or,
    and,
    limit,
} from "firebase/firestore";

import { db } from "../lib/firebase";
import { validateMessage } from "../utils/validation";
import type { Message, User } from "../types/global";
import { useAuthStore } from "./useAuthStore";

let usersUnsubscribe: (() => void) | null = null;
let messagesUnsubscribe: (() => void) | null = null;

interface ChatStore {
    messages: Message[];
    users: User[];
    selectedUser: User | null;
    isUsersLoading: boolean;
    isMessagesLoading: boolean;
    isSendingMessage: boolean;

    getUsers: () => Promise<void>;
    subscribeToUsers: () => (() => void) | null;
    subscribeToMessages: (userId: string) => (() => void) | null;
    sendMessage: (messageData: { text?: string; image?: string }) => Promise<void>;
    setSelectedUser: (user: User | null) => void;
    startUsersListener: () => void;
    stopUsersListener: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isSendingMessage: false,

    // Get Users Action
    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const authUser = useAuthStore.getState().authUser;
            if (!authUser) {
                console.warn("No authenticated user for getUsers");
                return;
            }

            console.log("Fetching users list...");
            const usersQuery = query(collection(db, "users"));
            const querySnapshot = await getDocs(usersQuery);

            const users: User[] = [];
            querySnapshot.forEach((doc) => {
                // Exclude current user from list
                if (doc.id !== authUser.id) {
                    users.push({ id: doc.id, ...doc.data() } as User);
                }
            });

            console.log(`Loaded ${users.length} users`);
            set({ users });
        } catch (error: unknown) {
            console.error("Error getting users:", error);
            const errorMessage =
                error instanceof Error ? error.message : "Error loading users";
            toast.error(errorMessage);
        } finally {
            set({ isUsersLoading: false });
        }
    },

    // Subscribe to Users (Real-time)
    subscribeToUsers: (): (() => void) | null => {
        const authUser = useAuthStore.getState().authUser;

        if (!authUser) {
            console.warn("No authenticated user for subscribeToUsers");
            return null;
        }

        set({ isUsersLoading: true });

        try {
            console.log("Subscribing to users updates...");
            const usersQuery = query(collection(db, "users"));

            const unsubscribe = onSnapshot(
                usersQuery,
                (snapshot) => {
                    const users: User[] = [];
                    snapshot.forEach((doc) => {
                        // Exclude current user from list
                        if (doc.id !== authUser.id) {
                            users.push({ id: doc.id, ...doc.data() } as User);
                        }
                    });

                    console.log(`Real-time users update: ${users.length} users`);
                    set({ users, isUsersLoading: false });
                },
                (error) => {
                    console.error("Error in users subscription:", error);
                    toast.error("Error loading users updates");
                    set({ isUsersLoading: false });
                }
            );

            return unsubscribe;
        } catch (error: unknown) {
            console.error("Error subscribing to users:", error);
            const errorMessage =
                error instanceof Error ? error.message : "Error subscribing to users";
            toast.error(errorMessage);
            set({ isUsersLoading: false });
            return null;
        }
    },

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
    sendMessage: async (messageData: { text?: string; image?: string }) => {
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
            const hasImage = messageData.image && messageData.image.length > 0;

            if (!hasText && !hasImage) {
                throw new Error("Message must contain either text or image");
            }

            // Validate text if present
            if (trimmedText) {
                const textError = validateMessage(trimmedText);
                if (textError) throw new Error(textError);
            }

            console.log("Validating message input... OK");
            console.log("Sending message...");

            await addDoc(collection(db, "messages"), {
                senderId: authUser.id,
                receiverId: selectedUser.id,
                text: trimmedText || "",
                image: messageData.image || "",
                createdAt: serverTimestamp(),
            });
            console.log("Message sent successfully!");
        } catch (error: unknown) {
            console.error("Error sending message:", error);
            const errorMessage =
                error instanceof Error ? error.message : "Error sending message";
            toast.error(errorMessage);
        }
        finally {
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

    startUsersListener: () => {
        if (usersUnsubscribe) return;
        const unsubscribe = get().subscribeToUsers();
        if (unsubscribe) {
            usersUnsubscribe = unsubscribe;
        }
    },

    stopUsersListener: () => {
        if (usersUnsubscribe) {
            usersUnsubscribe();
            usersUnsubscribe = null;
        }
        set({ users: [], isUsersLoading: false });
    },

}));

let previousAuthUserId: string | undefined;

useAuthStore.subscribe((state) => {
    const authUserId = state.authUser?.id;
    const { startUsersListener, stopUsersListener, setSelectedUser } = useChatStore.getState();

    if (authUserId && authUserId !== previousAuthUserId) {
        startUsersListener();
    } else if (!authUserId && previousAuthUserId) {
        stopUsersListener();
        setSelectedUser(null);
    }

    previousAuthUserId = authUserId;
});
