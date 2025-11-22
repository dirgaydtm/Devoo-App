import { Timestamp } from "firebase/firestore";
import { MenuIcon } from "lucide-react";

import UserInfo from "../components/profile/UserInfo";
import ThemePicker from "../components/profile/ThemePicker";
import ThemePreview from "../components/profile/ThemePreview";
import { THEMES } from "../constants/themes";
import AppLayout from "../layout/AppLayout";
import { useThemeStore } from "../store/useThemeStore";
import { useProfileEditor } from "../hooks/useProfileEditor";

const Profile = () => {
  const { setTheme } = useThemeStore();
  const {
    authUser,
    isUpdatingProfile,
    usernameDraft,
    setUsernameDraft,
    profilePhoto,
    handleImageUpload,
    handleResetProfilePicture,
    handleUsernameBlur,
  } = useProfileEditor();

  const memberSinceLabel = authUser?.createdAt
    ? (authUser.createdAt as Timestamp).toDate().toLocaleDateString()
    : undefined;

  return (
    <AppLayout >
      <div className="flex-1 flex flex-col lg:flex-row gap-5 lg:max-h-screen sm:p-10 overflow-y-auto">
        <div className="bg-base-300 z-10 p-4 border-b border-base-300 flex items-center md:hidden justify-between ">
          <div className="flex flex-col">
            <span className="font-semibold">Devoo</span>
          </div>
          <label htmlFor="sidebar-drawer" className="btn md:hidden btn-ghost gap-2">
            <MenuIcon />
          </label>
        </div>

        <UserInfo
          username={usernameDraft}
          email={authUser?.email}
          profilePhoto={profilePhoto}
          memberSinceLabel={memberSinceLabel}
          isUpdating={isUpdatingProfile}
          onImageChange={handleImageUpload}
          onReset={handleResetProfilePicture}
          onUsernameChange={setUsernameDraft}
          onUsernameBlur={handleUsernameBlur}
        />

        <div className="flex flex-5 flex-col lg:flex-row p-8 bg-base-300 rounded-xl gap-5">
          <div className="order-2 lg:order-1 flex-5 flex flex-col gap-2">
            <h1 className="text-2xl hidden sm:flex font-semibold text-left">Theme</h1>
            <ThemePicker themes={THEMES} onSelectTheme={setTheme} />
          </div>

          <div className="order-1 lg:order-2 flex-3 flex flex-col rounded border border-base-300 md:h-full gap-2 shadow-lg">
            <h1 className="text-2xl hidden sm:flex font-semibold text-left">Preview</h1>
            <h1 className="text-2xl flex sm:hidden font-semibold text-left">Theme</h1>
            <ThemePreview />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
