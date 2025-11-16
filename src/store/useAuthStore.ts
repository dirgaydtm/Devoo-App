import { create } from "zustand";
import toast from "react-hot-toast";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile as firebaseUpdateProfile,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

import { auth, db } from "../lib/firebase";

interface UserData {
  id?: string;
  username?: string;
  email?: string;
  password?: string;
  profilePicture?: string;
  createdAt?: Timestamp;
}

export type { UserData };

interface AuthStore {
  authUser: UserData | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  signup: (data: UserData) => Promise<void>;
  logout: () => Promise<void>;
  login: (data: UserData) => Promise<void>;
  updateProfile: (data: UserData) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  signup: async (data: UserData) => {
    set({ isSigningUp: true });
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email!,
        data.password!
      );

      // Update display name in Firebase Auth
      await firebaseUpdateProfile(userCredential.user, {
        displayName: data.username,
      });

      // Create user document in Firestore
      console.log("Creating user document for:", userCredential.user.uid);
      await setDoc(doc(db, "users", userCredential.user.uid), {
        username: data.username,
        email: data.email,
        profilePicture: data.profilePicture || "",
        createdAt: serverTimestamp(),
      });
      console.log("User document created successfully!");

      set({
        authUser: {
          id: userCredential.user.uid,
          username: data.username,
          email: data.email,
          profilePicture: data.profilePicture || "",
        },
      });

      toast.success("Account created successfully");
    } catch (error: unknown) {
      console.error("Error signing up:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Error signing up";
      toast.error(errorMessage);
    } finally {
      set({ isSigningUp: false });
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (error: unknown) {
      console.error("Error logging out:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Error logging out";
      toast.error(errorMessage);
    }
  },

  login: async (data: UserData) => {
    set({ isLoggingIn: true });
    try {
      console.log("Attempting login...");
      await signInWithEmailAndPassword(auth, data.email!, data.password!);
      console.log("Login successful!");
      toast.success("Logged in successfully");
    } catch (error: unknown) {
      console.error("Error logging in:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Invalid email or password";
      toast.error(errorMessage);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  updateProfile: async (data: UserData) => {
    set({ isUpdatingProfile: true });
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("No user logged in");

      // Get current user data from Firestore
      const userDocRef = doc(db, "users", currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      const currentUserData = userDoc.data() as UserData;

      let profilePictureURL =
        data.profilePicture || currentUserData.profilePicture;

      // If profilePicture is base64, upload to Cloudinary
      if (
        data.profilePicture &&
        data.profilePicture.startsWith("data:image")
      ) {
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

        const formData = new FormData();
        formData.append("file", data.profilePicture);
        formData.append("upload_preset", uploadPreset);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        const cloudinaryData = await response.json();
        profilePictureURL = cloudinaryData.secure_url;
      }

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

      set({
        authUser: {
          id: currentUser.uid,
          ...updatedUserData,
        },
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