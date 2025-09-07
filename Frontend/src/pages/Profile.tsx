import { useAuthStore } from "../store/useAuthStore"
import { Mail, PencilIcon, Trash2, User } from "lucide-react"
import { useState, useEffect } from "react"
import InitialAvatar from "../components/InitialAvatar"

const Profile = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
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
    <div className="relative h-screen sm:p-20">
      <div className="lg:max-w-3xl max-w-lg mx-auto py-8 lg:bg-base-300 rounded-xl p-6 space-y-8">
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
              <span>{authUser?.createdAt?.split("T")[0]}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span>Account Status</span>
              <span className="text-green-500">Active</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Profile;
