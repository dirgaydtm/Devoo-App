import { create } from "zustand";
import toast from "react-hot-toast";
import { updateProfile as firebaseUpdateProfile } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

import { auth, db } from "../lib/firebase";
import { uploadImage } from "../utils/image";
import { validateUsername } from "../utils/validation";
import { buildAuthStoreUser } from "../utils/auth";
import type { UserData } from "../types/global";
import { useAuthStore } from "./useAuthStore";

interface ProfileStore {
  isUpdatingProfile: boolean;
  updateProfile: (data: UserData) => Promise<void>;
}

export const useProfileStore = create<ProfileStore>((set) => ({
  isUpdatingProfile: false,

  updateProfile: async (data: UserData) => {
    set({ isUpdatingProfile: true });
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("No user logged in");

      // Validate username if provided
      if (data.username) {
        const usernameError = validateUsername(data.username);
        if (usernameError) throw new Error(usernameError);
      }

      console.log("Validating profile update input... OK");

      // Get current user data from Firestore
      const userDocRef = doc(db, "users", currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      const currentUserData = userDoc.data() as UserData;

      const profilePictureURL = await uploadImage(
        data.profilePicture,
        currentUserData.profilePicture
      );

      // Prepare update data - only include defined values
      const updateData: Partial<UserData> = {};

      if (data.username !== undefined) {
        updateData.username = data.username;
      }

      if (profilePictureURL !== undefined) {
        updateData.profilePicture = profilePictureURL;
      }

      // Update Firestore only if there's data to update
      if (Object.keys(updateData).length > 0) {
        await updateDoc(userDocRef, updateData);
      }

      // Update Firebase Auth profile
      const authUpdateData: { displayName?: string; photoURL?: string } = {};
      if (data.username !== undefined) {
        authUpdateData.displayName = data.username;
      }
      if (profilePictureURL !== undefined) {
        authUpdateData.photoURL = profilePictureURL;
      }

      if (Object.keys(authUpdateData).length > 0) {
        await firebaseUpdateProfile(currentUser, authUpdateData);
      }

      // Get updated user data
      const updatedUserDoc = await getDoc(userDocRef);
      const updatedUserData = updatedUserDoc.data() as UserData;

      // Update authUser in AuthStore
      useAuthStore.setState({
        authUser: buildAuthStoreUser(currentUser.uid, updatedUserData),
      });

      toast.success("Profile updated successfully");
    } catch (error: unknown) {
      console.error("Error updating profile:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error updating profile";
      toast.error(errorMessage);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));

