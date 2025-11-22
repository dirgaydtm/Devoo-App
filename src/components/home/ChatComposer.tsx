import { type KeyboardEvent } from "react";
import { Loader, Send } from "lucide-react";

interface ChatComposerProps {
    value: string;
    onChange: (value: string) => void;
    onSend: () => Promise<void> | void;
    isSending: boolean;
}

const ChatComposer = ({ value, onChange, onSend, isSending }: ChatComposerProps) => {
    const isSendDisabled = !value.trim() || isSending;

    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            if (isSendDisabled) return;
            void onSend();
        }
    };

    return (
        <div className="absolute z-10 w-full bg-[linear-gradient(to_top,var(--color-base-100)_50%,transparent_50%)] p-4 bottom-0">
            <div className="relative flex rounded-full w-full p-2 space-x-2 bg-base-300">
                <textarea
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isSending}
                    placeholder="Type a message"
                    className="py-2 px-6 rounded-full focus:outline-0 text-base flex-1 resize-none"
                    rows={1}
                />
                <button
                    onClick={() => void onSend()}
                    disabled={isSendDisabled}
                    className="absolute btn btn-circle btn-primary right-2"
                >
                    {isSending ? <Loader className="w-6 h-6 animate-spin" /> : <Send className="w-4" />}
                </button>
            </div>
        </div>
    );
};

export default ChatComposer;
