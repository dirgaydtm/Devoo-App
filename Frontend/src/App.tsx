import { Routes, Route, Navigate } from "react-router-dom"
import SignUp from "./pages/SignUpLogIn"
import Home from "./pages/Home"
import Settings from "./pages/Settings"
import Profile from "./pages/Profile"
import { useAuthStore } from "./store/useAuthStore"
import { useEffect } from "react"
import { LoaderPinwheel } from "lucide-react"
import { Toaster } from "react-hot-toast"

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log(authUser);

  if (isCheckingAuth && !authUser) {
    return <div className="flex items-center justify-center h-screen">
      <LoaderPinwheel className="size-20 animate-spin" />
    </div>
  }

  return (
    <div>
      <Routes>
        <Route path="/" element={authUser ? <Home /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUp /> : <Navigate to="/" />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={authUser ? <Profile /> : <Navigate to="/login" />} />
      </Routes>

      <Toaster />

    </div>
  )
}

export default App