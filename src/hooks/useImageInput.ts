import { useState, useRef, useCallback, useEffect } from "react";

export function useImageInput() {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Cleanup object URL on unmount or when preview changes
    useEffect(() => {
        return () => {
            if (imagePreview && imagePreview.startsWith("blob:")) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Revoke previous object URL if exists
            setImagePreview((prev) => {
                if (prev && prev.startsWith("blob:")) {
                    URL.revokeObjectURL(prev);
                }
                return URL.createObjectURL(file);
            });
            setImageFile(file);
        }
    }, []);

    const handleRemoveImage = useCallback(() => {
        // Revoke object URL before clearing
        setImagePreview((prev) => {
            if (prev && prev.startsWith("blob:")) {
                URL.revokeObjectURL(prev);
            }
            return null;
        });
        setImageFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith("image/")) {
            // Revoke previous object URL if exists
            setImagePreview((prev) => {
                if (prev && prev.startsWith("blob:")) {
                    URL.revokeObjectURL(prev);
                }
                return URL.createObjectURL(file);
            });
            setImageFile(file);
        }
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    }, []);

    return {
        imageFile,
        imagePreview,
        fileInputRef,
        handleFileChange,
        handleRemoveImage,
        handleDrop,
        handleDragOver,
    };
}
