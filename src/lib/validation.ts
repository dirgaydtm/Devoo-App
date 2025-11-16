export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePassword = (password: string): string | null => {
    if (password.length < 6) {
        return "Password must be at least 6 characters";
    }
    if (!/[A-Z]/.test(password)) {
        return "Password must contain at least one uppercase letter";
    }
    if (!/[0-9]/.test(password)) {
        return "Password must contain at least one number";
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
    if (text.length > 1000) {
        return "Message must be less than 1000 characters";
    }
    return null;
};
