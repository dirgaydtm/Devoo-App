export const validateMessage = (text: string | undefined): string | null => {
    if (!text || text.trim().length === 0) {
        return "Message cannot be empty";
    }
    if (text.length > 1000) {
        return "Message must be less than 1000 characters";
    }
    return null;
};
