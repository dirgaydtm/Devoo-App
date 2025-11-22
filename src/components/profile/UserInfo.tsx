import type { ChangeEvent } from "react";
import { Mail, PencilIcon, Trash2, User } from "lucide-react";

import InitialAvatar from "../InitialAvatar";

interface UserInfoCardProps {
    username?: string;
    email?: string;
    profilePhoto?: string;
    memberSinceLabel?: string;
    statusText?: string;
    isUpdating: boolean;
    onImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onReset: () => void;
    onUsernameChange: (value: string) => void;
    onUsernameBlur: () => void;
}

const UserInfoCard = ({
    username,
    email,
    profilePhoto,
    memberSinceLabel,
    statusText = "Active",
    isUpdating,
    onImageChange,
    onReset,
    onUsernameChange,
    onUsernameBlur,
}: UserInfoCardProps) => {
    return (
        <div className="flex-2 p-8 lg:bg-base-300 rounded-xl space-y-8">
            <h1 className="text-2xl font-semibold text-center">Profile</h1>

            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <div className="avatar">
                        <div className="size-32 rounded-full object-cover">
                            {profilePhoto ? (
                                <img src={profilePhoto} />
                            ) : (
                                <InitialAvatar username={username} className="size-full text-4xl" />
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
                            ${isUpdating ? "animate-pulse pointer-events-none" : ""}
                        `}
                    >
                        <PencilIcon className="w-5 h-5 text-base-200" />
                        <input
                            type="file"
                            id="avatar-upload"
                            className="hidden"
                            accept="image/*"
                            onChange={onImageChange}
                            disabled={isUpdating}
                        />
                    </label>

                    <button
                        type="button"
                        onClick={onReset}
                        disabled={isUpdating}
                        className={`
                            absolute bottom-0 left-0
                            bg-base-content hover:scale-105
                            p-2 rounded-full cursor-pointer
                            transition-all duration-200
                            ${isUpdating ? "animate-pulse pointer-events-none" : ""}
                        `}
                    >
                        <Trash2 className="w-5 h-5 text-base-200" />
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                <fieldset className="fieldset">
                    <legend className="fieldset-legend text-sm text-zinc-400 gap-2">
                        <User className="w-4 h-4" />
                        Username
                    </legend>
                    <input
                        type="text"
                        className="input bg-base-200 border-none w-full"
                        value={username ?? ""}
                        onChange={(event) => onUsernameChange(event.target.value)}
                        onBlur={onUsernameBlur}
                        disabled={isUpdating}
                    />
                </fieldset>

                <fieldset className="fieldset">
                    <legend className="fieldset-legend text-sm text-zinc-400 gap-2">
                        <Mail className="w-4 h-4" />
                        Email Address
                    </legend>
                    <input className="input bg-base-200 w-full" value={email} disabled />
                </fieldset>
            </div>

            <div className="mt-6 bg-base-200 rounded-xl p-6">
                <h2 className="text-lg font-medium mb-4">Account Information</h2>
                <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                        <span>Member Since</span>
                        <span>{memberSinceLabel}</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                        <span>Account Status</span>
                        <span className="text-green-500">{statusText}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserInfoCard;
