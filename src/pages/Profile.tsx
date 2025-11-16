import { THEMES } from "../constants/themes";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { Send, Mail, PencilIcon, Trash2, User } from "lucide-react";
import { useState, useEffect } from "react";
import InitialAvatar from "../components/InitialAvatar";
import Navbar from "../components/Navbar";
import { Timestamp } from "firebase/firestore";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  { id: 2, content: "I'm doing great! Just working on some new features.", isSent: true },
];

const Profile = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const { setTheme } = useThemeStore();

  const [selectedImg, setSelectedImg] = useState<string>("");
  const [usernameInput, setUsernameInput] = useState(authUser?.username || "");

  useEffect(() => {
    setUsernameInput(authUser?.username || "");
  }, [authUser?.username]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image as string);
      await updateProfile({ profilePicture: base64Image as string });
    }
  }

  const handleUsernameBlur = async () => {
    if (usernameInput !== authUser?.username) {
      await updateProfile({ username: usernameInput });
    }
  }

  const handleResetProfilePic = async () => {
    await updateProfile({
      profilePicture: "",
    });
  }

  return (
    <div className=" flex flex-col h-screen">
      <Navbar />
      <div className="flex-1 flex flex-col lg:flex-row gap-5 sm:p-10">
        {/* profile */}
        <div className="flex-2 p-8 lg:bg-base-300 rounded-xl space-y-8">
          <h1 className="text-2xl font-semibold text-center">Profile</h1>
          {/* avatar upload section */}

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="avatar">
                <div className="size-32 rounded-full object-cover">
                  {selectedImg || authUser?.profilePicture ? (
                    <img src={selectedImg || authUser?.profilePicture} />
                  ) : (
                    <InitialAvatar />
                  )}
                </div>
              </div>
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <PencilIcon className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>

              <button
                type="button"
                onClick={handleResetProfilePic}
                disabled={isUpdatingProfile}
                className={`
                  absolute bottom-0 left-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}>
                <Trash2 className="w-5 h-5 text-base-200" />
              </button>

            </div>

          </div>



          <div className="space-y-6">
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-sm text-zinc-400 gap-2"><User className="w-4 h-4" />
                Username</legend>
              <input
                type="text"
                className="input bg-base-200 border-none w-full"
                value={usernameInput}
                onChange={e => setUsernameInput(e.target.value)}
                onBlur={handleUsernameBlur}
                disabled={isUpdatingProfile}
              />
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend text-sm text-zinc-400 gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </legend>
              <input
                className="input bg-base-200 w-full"
                value={authUser?.email}
                disabled />
            </fieldset>
          </div>

          <div className="mt-6 bg-base-200 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>
                  {(authUser?.createdAt as Timestamp).toDate().toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>

        </div>

        {/* settings */}
        <div className="flex  flex-5 flex-col sm:flex-row p-8 bg-base-300 rounded-xl gap-5">

          {/* Theme Selection Section */}
          <div className="order-2 sm:order-1 flex-5 flex flex-col gap-2">
            <h1 className="text-2xl hidden sm:flex font-semibold text-left">Theme</h1>
            <div className="flex-auto grid  grid-cols-3 sm:grid-cols-4 md:grid-cols-6 content-start p-4 rounded-lg bg-base-200">
              {THEMES.map((t) => (
                <button
                  key={t}
                  className="group flex flex-col gap-1.5 p-2 rounded-lg transition-colors
                hover:bg-base-100"
                  onClick={() => setTheme(t)}
                >
                  <div className="relative h-8 w-full rounded-md overflow-hidden" data-theme={t}>
                    <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                      <div className="rounded bg-primary"></div>
                      <div className="rounded bg-secondary"></div>
                      <div className="rounded bg-accent"></div>
                      <div className="rounded bg-neutral"></div>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium truncate w-full text-center">
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </span>
                </button>
              ))}</div>
          </div>

          {/* Preview Section */}
          <div className="order-1 sm:order-2 flex-3 flex flex-col rounded-xl border border-base-300 gap-2 shadow-lg">
            <h1 className="text-2xl hidden sm:flex font-semibold text-left">Preview</h1>
            <h1 className="text-2xl flex sm:hidden font-semibold text-left">Theme</h1>
            <div className="p-4 bg-base-200 flex-1 rounded-lg">

              {/* Mock Chat UI */}
              <div className="flex flex-col bg-base-100 rounded-xl shadow-sm overflow-hidden h-full max-w-lg mx-auto">
                {/* Chat Header */}
                <div className="px-4 py-3 border-b border-base-300 bg-base-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium">
                      J
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">John Doe</h3>
                      <p className="text-xs text-base-content/70">Online</p>
                    </div>
                  </div>
                </div>

                <div className="flex-auto" />

                {/* Chat Messages */}
                <div className="p-4 space-y-4 overflow-y-auto bg-base-100">
                  {PREVIEW_MESSAGES.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`
                          max-w-[80%] rounded-xl p-3 shadow-sm
                          ${message.isSent ? "bg-primary text-primary-content" : "bg-base-200"}
                        `}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={`
                            text-[10px] mt-1.5
                            ${message.isSent ? "text-primary-content/70" : "text-base-content/70"}
                          `}
                        >
                          12:00 PM
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-base-300 bg-base-100">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="input border-none flex-1 text-sm h-10"
                      placeholder="Type a message..."
                    />
                    <button className="btn btn-primary">
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default Profile;
