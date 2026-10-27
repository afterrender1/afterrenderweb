"use client";
import React, { useRef, useState } from "react";
import { Loader2, AlertCircle, UploadCloud } from "lucide-react";
import { api, friendlyError } from "./ui";

const MAX_UPLOAD_MB = 10;

// Signed direct upload: the server signs, the browser sends the file straight to Cloudinary
export const uploadToCloudinary = async (file, onProgress, folder = "events") => {
    const sig = await api("/api/admin/upload-signature", {
        method: "POST",
        body: JSON.stringify({ folder }),
    });

    const body = new FormData();
    body.append("file", file);
    body.append("api_key", sig.apiKey);
    body.append("timestamp", sig.timestamp);
    body.append("signature", sig.signature);
    body.append("folder", sig.folder);

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`);
        xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 100));
        xhr.onload = () => {
            let data = null;
            try {
                data = JSON.parse(xhr.responseText);
            } catch {
                /* handled below */
            }
            if (xhr.status >= 200 && xhr.status < 300 && data?.secure_url) resolve(data.secure_url);
            else reject(new Error(data?.error?.message || `Upload failed (${xhr.status})`));
        };
        xhr.onerror = () => reject(new Error("Upload failed — check your connection."));
        xhr.send(body);
    });
};

/* ---------- Image upload field ---------- */
const ImageUpload = ({ value, onChange, onBusyChange, aspect = "aspect-video", contain = false, folder = "events" }) => {
    const inputRef = useRef(null);
    const [progress, setProgress] = useState(null);
    const [error, setError] = useState("");
    const [dragging, setDragging] = useState(false);
    const [broken, setBroken] = useState(false);

    const handleFile = async (file) => {
        if (!file) return;
        setError("");
        if (!file.type.startsWith("image/")) {
            setError("Please choose an image file (PNG, JPG, WEBP, GIF or SVG).");
            return;
        }
        if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
            setError(`Image is too large — max ${MAX_UPLOAD_MB} MB.`);
            return;
        }

        setProgress(0);
        onBusyChange(true);
        try {
            const url = await uploadToCloudinary(file, setProgress, folder);
            setBroken(false);
            onChange(url);
        } catch (err) {
            setError(friendlyError(err, "Upload failed."));
        } finally {
            setProgress(null);
            onBusyChange(false);
            if (inputRef.current) inputRef.current.value = "";
        }
    };

    const uploading = progress !== null;

    return (
        <div className="min-w-0">
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
            />

            {value && !uploading ? (
                <div className={`group relative ${aspect} rounded-lg overflow-hidden border border-stone-200 bg-stone-50`}>
                    {broken ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-stone-400 bg-stone-50">
                            <AlertCircle size={20} />
                            <p className="text-xs">Image couldn&apos;t be loaded</p>
                        </div>
                    ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={value}
                            alt=""
                            onError={() => setBroken(true)}
                            className={`w-full h-full ${contain ? "object-contain" : "object-cover"}`}
                        />
                    )}
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-end gap-1.5 p-2 bg-gradient-to-t from-black/60 to-transparent md:inset-0 md:items-center md:justify-center md:bg-black/40 md:p-0 md:opacity-0 md:group-hover:opacity-100 md:focus-within:opacity-100 transition-opacity">
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className="h-8 px-3 rounded-md text-xs font-medium bg-white text-stone-900 hover:bg-stone-100 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900/40"
                        >
                            Replace
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                onChange("");
                                setBroken(false);
                            }}
                            className="h-8 px-3 rounded-md text-xs font-medium bg-white text-red-600 hover:bg-red-50 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900/40"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    type="button"
                    disabled={uploading}
                    onClick={() => inputRef.current?.click()}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(e) => {
                        e.preventDefault();
                        setDragging(false);
                        handleFile(e.dataTransfer.files?.[0]);
                    }}
                    className={`${aspect} w-full flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-sm transition-colors cursor-pointer disabled:cursor-wait ${
                        dragging
                            ? "border-stone-900 bg-stone-100 text-stone-900"
                            : "border-stone-300 text-stone-500 hover:border-stone-400 hover:bg-stone-50"
                    }`}
                >
                    {uploading ? (
                        <>
                            <Loader2 size={20} className="animate-spin text-stone-900" />
                            <span className="text-xs text-stone-600">Uploading… {progress}%</span>
                            <span className="w-3/4 max-w-xs h-1 rounded-full bg-stone-200 overflow-hidden">
                                <span className="block h-full bg-stone-900 transition-all" style={{ width: `${progress}%` }} />
                            </span>
                        </>
                    ) : (
                        <>
                            <UploadCloud size={20} />
                            <span className="text-xs">
                                <span className="text-stone-900 font-medium">Upload</span> or drag & drop
                            </span>
                        </>
                    )}
                </button>
            )}

            {error && (
                <p className="flex items-start gap-1.5 mt-2 text-xs text-red-600" role="alert">
                    <AlertCircle size={13} className="mt-px shrink-0" />
                    <span className="min-w-0 break-words">{error}</span>
                </p>
            )}
        </div>
    );
};

export default ImageUpload;
