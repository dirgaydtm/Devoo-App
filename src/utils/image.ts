export const uploadImage = async (
    imageDataUrl?: string,
    fallback?: string
): Promise<string | undefined> => {
    if (!imageDataUrl) return fallback;
    if (!imageDataUrl.startsWith("data:image")) return imageDataUrl;

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    const formData = new FormData();
    formData.append("file", imageDataUrl);
    formData.append("upload_preset", uploadPreset);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
    });

    const cloudinaryData = await response.json();
    return cloudinaryData.secure_url as string;
};
