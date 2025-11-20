import { create } from "zustand";
import toast from "react-hot-toast";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile as firebaseUpdateProfile,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import { auth, db } from "../lib/firebase";
import {
  buildAuthStoreUser,
  buildOAuthUserData,
  ensureLoginInput,
  ensureSignupInput,
  uploadProfilePictureIfNeeded,
  withServerTimestamp,
} from "../lib/authHelpers";
import { validateUsername } from "../lib/validation";
import type { UserData } from "../types/global";

interface AuthStore {
  authUser: UserData | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  signup: (data: UserData) => Promise<void>;
  logout: () => Promise<void>;
  login: (data: UserData) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
  updateProfile: (data: UserData) => Promise<void>;
}

export type { UserData };

export const useAuthStore = create<AuthStore>((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  // Signup Action
  signup: async (data: UserData) => {
    set({ isSigningUp: true });
    try {
      // Validate input
      ensureSignupInput(data);

      console.log("Validating signup input... OK");

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
      await setDoc(
        doc(db, "users", userCredential.user.uid),
        withServerTimestamp({
          username: data.username,
          email: data.email,
          profilePicture: data.profilePicture || "",
        })
      );
      console.log("User document created successfully!");

      set({
        authUser: buildAuthStoreUser(userCredential.user.uid, data),
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

  // Logout Action
  logout: async () => {
    try {
      console.log("Logging out...");
      await signOut(auth);
      set({ authUser: null });
      toast.success("Logged out successfully");
      console.log("Logout successful!");
    } catch (error: unknown) {
      console.error("Error logging out:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Error logging out";
      toast.error(errorMessage);
    }
  },

  // Login Action
  login: async (data: UserData) => {
    set({ isLoggingIn: true });
    try {
      // Validate input
      ensureLoginInput(data);

      console.log("Validating login input... OK");
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

  // Update Profile Action
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

      const profilePictureURL = await uploadProfilePictureIfNeeded(
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

      set({
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

  // Login with Google
  loginWithGoogle: async () => {
    set({ isLoggingIn: true });
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user document exists in Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      // If new user, create document
      if (!userDoc.exists()) {
        const userData = buildOAuthUserData(user);

        await setDoc(userDocRef, withServerTimestamp(userData));

        // Set auth user in store
        set({
          authUser: buildAuthStoreUser(user.uid, userData),
        });

        toast.success("Account created successfully!");
      } else {
        // Get existing user data
        const existingUserData = userDoc.data() as UserData;

        // Set auth user in store
        set({
          authUser: buildAuthStoreUser(user.uid, existingUserData),
        });

        toast.success("Logged in successfully");
      }
    } catch (error: unknown) {
      console.error("Error logging in with Google:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to login with Google";
      toast.error(errorMessage);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // Login with GitHub
  loginWithGithub: async () => {
    set({ isLoggingIn: true });
    try {
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user document exists in Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      // If new user, create document
      if (!userDoc.exists()) {
        const userData = buildOAuthUserData(user);

        await setDoc(userDocRef, withServerTimestamp(userData));

        // Set auth user in store
        set({
          authUser: buildAuthStoreUser(user.uid, userData),
        });

        toast.success("Account created successfully!");
      } else {
        // Get existing user data
        const existingUserData = userDoc.data() as UserData;

        // Set auth user in store
        set({
          authUser: buildAuthStoreUser(user.uid, existingUserData),
        });

        toast.success("Logged in successfully");
      }
    } catch (error: unknown) {
      console.error("Error logging in with GitHub:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to login with GitHub";
      toast.error(errorMessage);
    } finally {
      set({ isLoggingIn: false });
    }
  },
}));