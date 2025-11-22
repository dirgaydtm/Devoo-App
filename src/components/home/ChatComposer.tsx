import { useImageInput } from "../../hooks/useImageInput";
import { Loader, Send, Image as ImageIcon, X } from "lucide-react";

interface ChatComposerProps {
    value: string;
    onChange: (value: string) => void;
    onSend: (imageFile?: File) => Promise<void> | void;
    isSending: boolean;
}

const ChatComposer = ({ value, onChange, onSend, isSending }: ChatComposerProps) => {
    const {
        imageFile,
        imagePreview,
        fileInputRef,
        handleFileChange,
        handleRemoveImage,
        handleDrop,
        handleDragOver,
    } = useImageInput();

    const isSendDisabled = (!value.trim() && !imageFile) || isSending;

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            if (isSendDisabled) return;
            handleSend();
        }
    };

    const handleSend = async () => {
        await onSend(imageFile || undefined);
        handleRemoveImage();
    };

    return (
        <div
            className="absolute z-10 w-full bg-[linear-gradient(to_top,var(--color-base-100)_50%,transparent_50%)] p-4 bottom-0"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
        >
            {imagePreview && (
                <div className="absolute flex bottom-10 items-center mt-2 bg-base-300 rounded-t-4xl p-5 px-5 pb-10 w-fit max-w-xs">
                    <img src={imagePreview} alt="Preview" className="max-h-32 max-w-xs rounded-lg mr-2" />
                    <button onClick={handleRemoveImage} className="btn btn-sm btn-circle btn-error"><X className="w-4 h-4" /></button>
                </div>
            )}
            <div className="relative flex rounded-full w-full p-2 space-x-2 bg-base-300 items-center">
                <button
                    type="button"
                    className="btn btn-circle btn-ghost"
                    onClick={() => fileInputRef.current?.click()}
                    tabIndex={-1}
                >
                    <ImageIcon className="w-5 h-5" />
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                />
                <textarea
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isSending}
                    placeholder="Type a message"
                    className="py-2 px-2 rounded-full focus:outline-0 text-base flex-1 resize-none"
                    rows={1}
                />
                <button
                    onClick={handleSend}
                    disabled={isSendDisabled}
                    className="btn btn-circle btn-primary"
                >
                    {isSending ? <Loader className="w-6 h-6 animate-spin" /> : <Send className="w-4" />}
                </button>
            </div>

        </div>
    );
};

export default ChatComposer;
