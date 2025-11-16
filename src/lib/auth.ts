import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { useAuthStore } from "../store/useAuthStore";
import type { UserData } from "../store/useAuthStore";

export function setupAuthListener() {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    useAuthStore.setState({
                        authUser: {
                            id: user.uid,
                            ...userDoc.data()
                        } as UserData,
                        isCheckingAuth: false
                    });
                } else {
                    useAuthStore.setState({ isCheckingAuth: false });
                }
            } catch (error: unknown) {
                console.error("Error fetching user doc:", error);
                useAuthStore.setState({ isCheckingAuth: false });
            }
        } else {
            useAuthStore.setState({ authUser: null, isCheckingAuth: false });
        }
    });
}
