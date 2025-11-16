import { Routes, Route, Navigate } from "react-router-dom"
import Auth from "./pages/Auth"
import Home from "./pages/Home"
import Profile from "./pages/Profile"
import { useAuthStore } from "./store/useAuthStore"
import { setupAuthListener } from "./lib/auth"
import { useEffect } from "react"
import { Toaster } from "react-hot-toast"
import { Trio } from "ldrs/react"
import { useThemeStore } from "./store/useThemeStore"

const App = () => {
  const { authUser, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    setupAuthListener();
  }, []);

  if (isCheckingAuth && !authUser) {
    return <div className="flex items-center justify-center h-screen">
      <Trio size="150" />
    </div>
  }

  return (
    <div data-theme={theme}>
      <Routes>
        <Route path="/" element={authUser ? <Home /> : <Navigate to="/auth" />} />
        <Route path="/auth" element={!authUser ? <Auth /> : <Navigate to="/" />} />
        <Route path="/profile" element={authUser ? <Profile /> : <Navigate to="/auth" />} />
      </Routes>

      <Toaster />

    </div>
  )
}

export default App