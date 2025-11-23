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
} from "firebase/firestore";

import { auth, db } from "../lib/firebase";
import {
  buildAuthStoreUser,
  buildOAuthUserData,
  ensureLoginInput,
  ensureSignupInput,

  withServerTimestamp,
} from "../utils/auth";
import type { UserData } from "../types/global";

interface AuthStore {
  authUser: UserData | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isCheckingAuth: boolean;
  signup: (data: UserData) => Promise<void>;
  logout: () => Promise<void>;
  login: (data: UserData) => Promise<void>;
  loginWithOAuth: (provider: "google" | "github") => Promise<void>;
}

export type { UserData };

export const useAuthStore = create<AuthStore>((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
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

  loginWithOAuth: async (providerType: "google" | "github") => {
    set({ isLoggingIn: true });
    const providerLabel = providerType === "google" ? "Google" : "GitHub";
    try {
      const provider =
        providerType === "google" ? new GoogleAuthProvider() : new GithubAuthProvider();

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        const userData = buildOAuthUserData(user);
        await setDoc(userDocRef, withServerTimestamp(userData));
        set({ authUser: buildAuthStoreUser(user.uid, userData) });
        toast.success("Account created successfully!");
      } else {
        const existingUserData = userDoc.data() as UserData;
        set({ authUser: buildAuthStoreUser(user.uid, existingUserData) });
        toast.success("Logged in successfully");
      }
    } catch (error: unknown) {
      console.error(`Error logging in with ${providerLabel}:`, error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : `Failed to login with ${providerLabel}`;
      toast.error(errorMessage);
    } finally {
      set({ isLoggingIn: false });
    }
  },
}));