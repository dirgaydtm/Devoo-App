import { Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "react-hot-toast"

import Auth from "./pages/Auth"
import Home from "./pages/Home"
import Profile from "./pages/Profile"
import Loader from "./components/Loader"
import { useAuthStore } from "./store/useAuthStore"
import { useThemeStore } from "./store/useThemeStore"
import { useAuthListener } from "./hooks/useAuthListener"

const App = () => {
  const { authUser, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();

  useAuthListener();

  if (isCheckingAuth && !authUser) {
    return <div className="flex items-center justify-center h-screen">
      <Loader />
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