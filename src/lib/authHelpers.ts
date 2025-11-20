import type { User as FirebaseUser } from "firebase/auth";
import { serverTimestamp } from "firebase/firestore";

import type { UserData } from "../types/global";
import { validateEmail, validatePassword, validateUsername } from "./validation";

export const ensureSignupInput = (data: UserData) => {
    if (!data.email || !data.password || !data.username) {
        throw new Error("Email, password, and username are required");
    }

    const emailError = !validateEmail(data.email) ? "Invalid email format" : null;
    if (emailError) throw new Error(emailError);

    const passwordError = validatePassword(data.password);
    if (passwordError) throw new Error(passwordError);

    const usernameError = validateUsername(data.username);
    if (usernameError) throw new Error(usernameError);
};

export const ensureLoginInput = (data: UserData) => {
    if (!data.email || !data.password) {
        throw new Error("Email and password are required");
    }

    const emailError = !validateEmail(data.email) ? "Invalid email format" : null;
    if (emailError) throw new Error(emailError);
};

export const buildAuthStoreUser = (uid: string, data: UserData): UserData => ({
    id: uid,
    username: data.username || "",
    email: data.email || "",
    profilePicture: data.profilePicture || "",
    createdAt: data.createdAt ?? null,
});

export const buildOAuthUserData = (user: FirebaseUser): UserData => ({
    email: user.email || "",
    username: user.displayName || user.email?.split("@")[0] || "User",
    profilePicture: user.photoURL || "",
});

export const withServerTimestamp = (data: UserData) => ({
    ...data,
    createdAt: serverTimestamp(),
});

export const uploadProfilePictureIfNeeded = async (
    profilePicture?: string,
    fallback?: string
) => {
    if (!profilePicture) return fallback;
    if (!profilePicture.startsWith("data:image")) return profilePicture;

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    const formData = new FormData();
    formData.append("file", profilePicture);
    formData.append("upload_preset", uploadPreset);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
    });

    const cloudinaryData = await response.json();
    return cloudinaryData.secure_url as string;
};
