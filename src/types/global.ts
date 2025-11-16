import { Timestamp } from "firebase/firestore";

// Auth types
export interface UserData {
    id?: string;
    username?: string;
    email?: string;
    password?: string;
    profilePicture?: string;
    createdAt?: Timestamp | Date | null;
}

// Chat types
export interface Message {
    id?: string;
    senderId: string;
    receiverId: string;
    text: string;
    image?: string;
    createdAt: Timestamp | Date | null;
}

// User type (UserData without password)
export type User = Omit<UserData, "password">;
