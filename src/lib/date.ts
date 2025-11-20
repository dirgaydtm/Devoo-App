import type { Timestamp } from "firebase/firestore";

export const formatChatTimestamp = (
    createdAt: Timestamp | Date | null,
    locale: string = "en-US"
): string => {
    if (!createdAt) return "";

    const date = createdAt instanceof Date ? createdAt : createdAt.toDate();

    return date.toLocaleTimeString(locale, {
        hour: "2-digit",
        minute: "2-digit",
    });
};
