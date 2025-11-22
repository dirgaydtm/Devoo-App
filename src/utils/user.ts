export const getUserInitials = (username?: string | null): string => {
    if (!username) return "?";

    return (
        username
            .split(" ")
            .filter(Boolean)
            .map((word) => word[0]!.toUpperCase())
            .join("")
            .slice(0, 2) || "?"
    );
};
