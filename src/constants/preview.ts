import type { Message, User } from "../types/global";

export const PREVIEW_AUTH_USER_ID = "preview-auth";

export const PREVIEW_SELECTED_USER: User = {
    id: "preview-contact",
    username: "Dirga Developer",
};

export const PREVIEW_MESSAGES: Message[] = [
    {
        id: "preview-1",
        senderId: PREVIEW_SELECTED_USER.id!,
        receiverId: PREVIEW_AUTH_USER_ID,
        text: "Hey! How's it going?",
        createdAt: new Date(),
    },
    {
        id: "preview-2",
        senderId: PREVIEW_AUTH_USER_ID,
        receiverId: PREVIEW_SELECTED_USER.id!,
        text: "I'm doing great! Just working on some new features.",
        createdAt: new Date(Date.now() + 1000 * 60),
    },
];
