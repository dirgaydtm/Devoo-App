import { useEffect, useState, useCallback, type ChangeEvent } from "react";
import toast from "react-hot-toast";

import { fileToBase64 } from "../utils/file";
import { useAuthStore } from "../store/useAuthStore";
import { useProfileStore } from "../store/useProfileStore";

export const useProfileEditor = () => {
    const { authUser } = useAuthStore();
    const { isUpdatingProfile, updateProfile } = useProfileStore();
    const [usernameDraft, setUsernameDraft] = useState(authUser?.username || "");
    const [tempProfileImage, setTempProfileImage] = useState(authUser?.profilePicture || "");

    useEffect(() => {
        setUsernameDraft(authUser?.username || "");
        setTempProfileImage(authUser?.profilePicture || "");
    }, [authUser?.username, authUser?.profilePicture]);

    const handleImageUpload = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        try {
            const base64 = await fileToBase64(file);
            setTempProfileImage(base64);
            await updateProfile({ profilePicture: base64 });
        } catch (error) {
            console.error("Error uploading profile image:", error);
            toast.error("Failed to upload profile picture");
        }
    }, [updateProfile]);

    const handleResetProfilePicture = useCallback(async () => {
        try {
            await updateProfile({ profilePicture: "" });
            setTempProfileImage("");
        } catch (error) {
            console.error("Error resetting profile picture:", error);
            toast.error("Failed to reset profile picture");
        }
    }, [updateProfile]);

    const handleUsernameBlur = useCallback(async () => {
        if (!authUser) return;
        const trimmed = usernameDraft.trim();
        if (!trimmed || trimmed === authUser.username) return;

        try {
            await updateProfile({ username: trimmed });
        } catch (error) {
            console.error("Error updating username:", error);
        }
    }, [authUser, usernameDraft, updateProfile]);

    const profilePhoto = tempProfileImage || authUser?.profilePicture;

    return {
        authUser,
        isUpdatingProfile,
        usernameDraft,
        setUsernameDraft,
        profilePhoto,
        handleImageUpload,
        handleResetProfilePicture,
        handleUsernameBlur,
    };
};
