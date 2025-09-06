import { Routes, Route, Navigate } from "react-router-dom"
import Auth from "./pages/Auth"
import Home from "./pages/Home"
import Settings from "./pages/Settings"
import Profile from "./pages/Profile"
import { useAuthStore } from "./store/useAuthStore"
import { useEffect } from "react"
import { Toaster } from "react-hot-toast"
import { Trio } from "ldrs/react"

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log(authUser);

  if (isCheckingAuth && !authUser) {
    return <div className="flex items-center justify-center h-screen">
      <Trio size="150"/>
    </div>
  }

  return (
    <div>
      <Routes>
        <Route path="/" element={authUser ? <Home /> : <Navigate to="/auth" />} />
        <Route path="/auth" element={!authUser ? <Auth /> : <Navigate to="/" />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={authUser ? <Profile /> : <Navigate to="/auth" />} />
      </Routes>

      <Toaster />

    </div>
  )
}

export default App