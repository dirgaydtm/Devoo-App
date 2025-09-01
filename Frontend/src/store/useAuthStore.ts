import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthStore {
  authUser: User | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,

  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check-auth");
      set({ authUser: res.data });
    } catch (error) {
      console.log("Error checking auth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  }

  //  signUp: async (data) => {

  // }


}))