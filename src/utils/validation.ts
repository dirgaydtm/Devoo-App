import type { UserData } from "../types/global";

export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePassword = (password: string): string | null => {
    if (password.length < 6) {
        return "Password must be at least 6 characters";
    }
    return null;
};

export const validateUsername = (username: string): string | null => {
    if (!username || username.trim().length < 3) {
        return "Username must be at least 3 characters";
    }
    if (username.length > 30) {
        return "Username must be at most 30 characters";
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return "Username can only contain letters, numbers, and underscores";
    }
    return null;
};

export const validateMessage = (text: string | undefined): string | null => {
    if (!text || text.trim().length === 0) {
        return "Message cannot be empty";
    }
    return null;
};

export const validateProfile = (data: Partial<UserData>) => {
    if (data.username) {
        const usernameError = validateUsername(data.username);
        if (usernameError) return usernameError;
    }
    if (data.password) {
        const passwordError = validatePassword(data.password);
        if (passwordError) return passwordError;
    }
    return null;
};
