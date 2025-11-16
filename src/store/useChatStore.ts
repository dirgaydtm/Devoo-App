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
    Timestamp
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuthStore } from "./useAuthStore";

interface Message {
    id?: string;
    senderId: string;
    receiverId: string;
    text: string;
    image?: string;
    createdAt: Timestamp | Date | null;
}

interface User {
    id: string;
    username: string;
    email: string;
    profilePicture?: string;
    createdAt?: Timestamp | Date | null;
}interface ChatStore {
    messages: Message[];
    users: User[];
    selectedUser: User | null;
    isUsersLoading: boolean;
    isMessagesLoading: boolean;

    getUsers: () => Promise<void>;
    getMessages: (userId: string) => void;
    sendMessage: (messageData: { text?: string; image?: string }) => Promise<void>;
    setSelectedUser: (user: User | null) => void;
    subscribeToMessages: () => (() => void) | null;
}

export const useChatStore = create<ChatStore>((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const authUser = useAuthStore.getState().authUser;
            if (!authUser) return;

            // Get all users except current user
            const usersQuery = query(collection(db, "users"));
            const querySnapshot = await getDocs(usersQuery);

            const users: User[] = [];
            querySnapshot.forEach((doc) => {
                if (doc.id !== authUser.id) {
                    users.push({ id: doc.id, ...doc.data() } as User);
                }
            });

            set({ users });
        } catch (error) {
            console.error("Error getting users:", error);
            const errorMessage = error instanceof Error ? error.message : "Error loading users";
            toast.error(errorMessage);
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: (userId: string) => {
        set({ isMessagesLoading: true });
        const authUser = useAuthStore.getState().authUser;
        if (!authUser) return;

        try {
            // Better approach: Query all messages and filter in memory
            const allMessagesQuery = query(
                collection(db, "messages"),
                orderBy("createdAt", "asc")
            );

            const unsubscribe = onSnapshot(allMessagesQuery, (snapshot) => {
                const messages: Message[] = [];
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    // Filter messages between current user and selected user
                    if (
                        (data.senderId === authUser.id && data.receiverId === userId) ||
                        (data.senderId === userId && data.receiverId === authUser.id)
                    ) {
                        messages.push({ id: doc.id, ...data } as Message);
                    }
                });
                set({ messages, isMessagesLoading: false });
            });

            return unsubscribe;
        } catch (error) {
            console.error("Error getting messages:", error);
            const errorMessage = error instanceof Error ? error.message : "Error loading messages";
            toast.error(errorMessage);
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser } = get();
        const authUser = useAuthStore.getState().authUser;

        if (!selectedUser || !authUser) return;

        try {
            await addDoc(collection(db, "messages"), {
                senderId: authUser.id,
                receiverId: selectedUser.id,
                text: messageData.text || "",
                image: messageData.image || "",
                createdAt: serverTimestamp(),
            });
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage = error instanceof Error ? error.message : "Error sending message";
            toast.error(errorMessage);
        }
    },

    setSelectedUser: (user) => {
        set({ selectedUser: user });
    },

    subscribeToMessages: () => {
        const { selectedUser } = get();
        const authUser = useAuthStore.getState().authUser;

        if (!selectedUser || !authUser) return null;

        // Query messages in real-time
        const messagesQuery = query(
            collection(db, "messages"),
            orderBy("createdAt", "asc")
        );

        const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
            const messages: Message[] = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                // Filter messages between current user and selected user
                if (
                    (data.senderId === authUser.id && data.receiverId === selectedUser.id) ||
                    (data.senderId === selectedUser.id && data.receiverId === authUser.id)
                ) {
                    messages.push({ id: doc.id, ...data } as Message);
                }
            });
            set({ messages });
        });

        return unsubscribe;
    },
}));
