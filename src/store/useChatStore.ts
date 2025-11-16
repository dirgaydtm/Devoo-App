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
  Timestamp,
  where,
  or,
  and,
  limit,
} from "firebase/firestore";

import { db } from "../lib/firebase";
import { useAuthStore } from "./useAuthStore";


// ============================================================================
// Types
// ============================================================================

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
}

interface ChatStore {
  messages: Message[];
  users: User[];
  selectedUser: User | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;

  getUsers: () => Promise<void>;
  subscribeToMessages: (userId: string) => (() => void) | null;
  sendMessage: (messageData: { text?: string; image?: string }) => Promise<void>;
  setSelectedUser: (user: User | null) => void;
}


// ============================================================================
// Store
// ============================================================================

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  // --------------------------------------------------------------------------
  // Get Users Action
  // --------------------------------------------------------------------------
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

  // --------------------------------------------------------------------------
  // Subscribe to Messages (Real-time)
  // --------------------------------------------------------------------------
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

  // --------------------------------------------------------------------------
  // Send Message Action
  // --------------------------------------------------------------------------
  sendMessage: async (messageData) => {
    const { selectedUser } = get();
    const authUser = useAuthStore.getState().authUser;

    if (!selectedUser || !authUser) {
      console.warn("Missing selected user or auth user for sendMessage");
      return;
    }

    try {
      console.log("Sending message...");
      await addDoc(collection(db, "messages"), {
        senderId: authUser.id,
        receiverId: selectedUser.id,
        text: messageData.text || "",
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
  },

  // --------------------------------------------------------------------------
  // Set Selected User Action
  // --------------------------------------------------------------------------
  setSelectedUser: (user) => {
    console.log(`Selected user: ${user?.username || "none"}`);
    set({ selectedUser: user });
  },
}));
