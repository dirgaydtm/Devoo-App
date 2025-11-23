import { create } from "zustand";
import toast from "react-hot-toast";
import {
    collection,
    query,
    onSnapshot,
    getDocs,
    where,
    doc,
    setDoc,
    getDoc,
    serverTimestamp,
} from "firebase/firestore";

import { db } from "../lib/firebase";
import { validateEmail } from "../utils/validation";
import type { User } from "../types/global";
import { useAuthStore } from "./useAuthStore";

let usersUnsubscribe: (() => void) | null = null;

interface ContactStore {
    users: User[];
    isUsersLoading: boolean;
    isAddingContact: boolean;

    subscribeToContacts: () => (() => void) | null;
    addContact: (email: string) => Promise<void>;
    startListener: () => void;
    stopListener: () => void;
}

export const useContactStore = create<ContactStore>((set, get) => ({
    users: [],
    isUsersLoading: false,
    isAddingContact: false,

    // Subscribe to Contacts (Real-time) - Only shows added contacts
    subscribeToContacts: (): (() => void) | null => {
        const authUser = useAuthStore.getState().authUser;

        if (!authUser || !authUser.id) {
            console.warn("No authenticated user for subscribeToContacts");
            return null;
        }

        set({ isUsersLoading: true });

        try {
            console.log("Subscribing to contacts updates...");
            const contactsRef = collection(db, "contacts", authUser.id, "contacts");

            const unsubscribe = onSnapshot(
                contactsRef,
                async (snapshot) => {
                    const contactIds: string[] = [];
                    snapshot.forEach((doc) => {
                        contactIds.push(doc.id);
                    });

                    // Fetch user data for each contact
                    const users: User[] = [];
                    for (const contactId of contactIds) {
                        try {
                            const userDoc = await getDoc(doc(db, "users", contactId));
                            if (userDoc.exists()) {
                                users.push({ id: userDoc.id, ...userDoc.data() } as User);
                            }
                        } catch (error) {
                            console.error(`Error fetching user ${contactId}:`, error);
                        }
                    }

                    console.log(`Real-time contacts update: ${users.length} contacts`);
                    set({ users, isUsersLoading: false });
                },
                (error) => {
                    console.error("Error in contacts subscription:", error);
                    toast.error("Error loading contacts updates");
                    set({ isUsersLoading: false });
                }
            );

            return unsubscribe;
        } catch (error: unknown) {
            console.error("Error subscribing to contacts:", error);
            const errorMessage =
                error instanceof Error ? error.message : "Error subscribing to contacts";
            toast.error(errorMessage);
            set({ isUsersLoading: false });
            return null;
        }
    },

    // Add Contact by Email
    addContact: async (email: string) => {
        const authUser = useAuthStore.getState().authUser;

        if (!authUser || !authUser.id) {
            toast.error("You must be logged in to add contacts");
            return;
        }

        set({ isAddingContact: true });

        try {
            // Validate email
            if (!email || !email.trim()) {
                throw new Error("Email is required");
            }

            const trimmedEmail = email.trim().toLowerCase();
            if (!validateEmail(trimmedEmail)) {
                throw new Error("Invalid email format");
            }

            // Check if trying to add own email
            if (trimmedEmail === authUser.email?.toLowerCase()) {
                throw new Error("You cannot add yourself as a contact");
            }

            // Find user by email
            const usersQuery = query(
                collection(db, "users"),
                where("email", "==", trimmedEmail)
            );
            const querySnapshot = await getDocs(usersQuery);

            if (querySnapshot.empty) {
                throw new Error("User with this email not found");
            }

            const userDoc = querySnapshot.docs[0];
            const contactId = userDoc.id;

            // Check if contact already exists
            const contactRef = doc(db, "contacts", authUser.id, "contacts", contactId);
            const contactDoc = await getDoc(contactRef);

            if (contactDoc.exists()) {
                throw new Error("Contact already added");
            }

            // Add contact
            await setDoc(contactRef, {
                addedAt: serverTimestamp(),
            });

            toast.success("Contact added successfully");
        } catch (error: unknown) {
            console.error("Error adding contact:", error);
            const errorMessage =
                error instanceof Error ? error.message : "Error adding contact";
            toast.error(errorMessage);
        } finally {
            set({ isAddingContact: false });
        }
    },

    startListener: () => {
        if (usersUnsubscribe) return;
        const unsubscribe = get().subscribeToContacts();
        if (unsubscribe) {
            usersUnsubscribe = unsubscribe;
        }
    },

    stopListener: () => {
        if (usersUnsubscribe) {
            usersUnsubscribe();
            usersUnsubscribe = null;
        }
        set({ users: [], isUsersLoading: false });
    },
}));

// Auto-start/stop contacts listener based on auth state
let previousAuthUserId: string | undefined;

useAuthStore.subscribe((state) => {
    const authUserId = state.authUser?.id;
    const { startListener, stopListener } = useContactStore.getState();

    if (authUserId && authUserId !== previousAuthUserId) {
        startListener();
    } else if (!authUserId && previousAuthUserId) {
        stopListener();
    }

    previousAuthUserId = authUserId;
});

