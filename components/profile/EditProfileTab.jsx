"use client";

import React, { useRef, useState } from "react";
import { Camera, Loader2, Trash2 } from "lucide-react";
import { authClient } from "@/app/lib/auth-client";
import { AVATAR_MAX_MB } from "@/app/lib/avatar";
import { Alert, Avatar, Field, PrimaryButton, SecondaryButton, authErrorMessage } from "@/components/auth/ui";
import { Panel } from "./shared";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

// 1) our server signs the upload, 2) the browser sends the file straight to Cloudinary.
const uploadAvatarToCloudinary = async (file, onProgress) => {
    const res = await fetch("/api/user/avatar", { method: "POST" });
    const sig = await res.json().catch(() => null);
    if (!res.ok || !sig?.success) throw new Error(sig?.error || "Could not start the upload.");

    const body = new FormData();
    body.append("file", file);
    body.append("api_key", sig.apiKey);
    body.append("signature", sig.signature);
    for (const [key, value] of Object.entries(sig.params)) body.append(key, value);

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`);
        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onload = () => {
            let data = null;
            try {
                data = JSON.parse(xhr.responseText);
            } catch {
                /* handled below */
            }
            if (xhr.status >= 200 && xhr.status < 300 && data?.secure_url) resolve(data.secure_url);
            else reject(new Error(data?.error?.message || `Upload failed (${xhr.status}).`));
        };
        xhr.onerror = () => reject(new Error("Upload failed. Check your connection and try again."));
        xhr.send(body);
    });
};

const AvatarSection = ({ user }) => {
    const inputRef = useRef(null);
    const [progress, setProgress] = useState(null);
    const [removing, setRemoving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const uploading = progress !== null;

    const handleFile = async (file) => {
        if (!file) return;
        setError("");
        setSuccess("");
        if (!ACCEPTED_TYPES.includes(file.type)) {
            setError("Please choose a JPG, PNG, WEBP or AVIF image.");
            return;
        }
        if (file.size > AVATAR_MAX_MB * 1024 * 1024) {
            setError(`Image is too large. Max ${AVATAR_MAX_MB} MB.`);
            return;
        }

        setProgress(0);
        try {
            const url = await uploadAvatarToCloudinary(file, setProgress);
            const { error: err } = await authClient.updateUser({ image: url });
            if (err) throw new Error(authErrorMessage(err, "Could not save your photo."));
            setSuccess("Profile photo updated.");
        } catch (err) {
            setError(err?.message || "Upload failed.");
        } finally {
            setProgress(null);
            if (inputRef.current) inputRef.current.value = "";
        }
    };

    const handleRemove = async () => {
        setError("");
        setSuccess("");
        setRemoving(true);
        const { error: err } = await authClient.updateUser({ image: null });
        if (err) {
            setRemoving(false);
            setError(authErrorMessage(err, "Could not remove your photo."));
            return;
        }
        // Best effort: delete the file itself from Cloudinary.
        await fetch("/api/user/avatar", { method: "DELETE" }).catch(() => {});
        setRemoving(false);
        setSuccess("Profile photo removed.");
    };

    return (
        <Panel title="Profile photo" description={`JPG, PNG, WEBP or AVIF, up to ${AVATAR_MAX_MB} MB.`}>
            <input
                ref={inputRef}
                type="file"
                accept={ACCEPTED_TYPES.join(",")}
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
            />
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                <div className="relative w-fit">
                    <Avatar src={user.image} name={user.name} email={user.email} size={96} />
                    {uploading && (
                        <span className="absolute inset-0 rounded-full bg-black/55 text-white flex flex-col items-center justify-center text-xs font-semibold">
                            <Loader2 size={18} className="animate-spin mb-1" />
                            {progress}%
                        </span>
                    )}
                </div>
                <div className="flex flex-wrap gap-2.5">
                    <SecondaryButton
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        disabled={uploading || removing}
                    >
                        <Camera size={16} />
                        {user.image ? "Change photo" : "Upload photo"}
                    </SecondaryButton>
                    {user.image && (
                        <SecondaryButton
                            type="button"
                            onClick={handleRemove}
                            loading={removing}
                            disabled={uploading}
                            className="text-red-600! hover:bg-red-50!"
                        >
                            {!removing && <Trash2 size={16} />}
                            Remove
                        </SecondaryButton>
                    )}
                </div>
            </div>
            <div className="mt-4 space-y-2">
                <Alert type="error">{error}</Alert>
                <Alert type="success">{success}</Alert>
            </div>
        </Panel>
    );
};

const DetailsSection = ({ user }) => {
    const [name, setName] = useState(user.name || "");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const trimmed = name.trim().replace(/\s+/g, " ");
    const unchanged = trimmed === (user.name || "");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        if (!trimmed) return setError("Name can't be empty.");
        setSaving(true);
        const { error: err } = await authClient.updateUser({ name: trimmed });
        setSaving(false);
        if (err) return setError(authErrorMessage(err, "Could not save your changes."));
        setSuccess("Your profile has been updated.");
    };

    return (
        <Panel title="Personal details" description="This is how you'll appear on invoices and in emails from us.">
            <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
                <Field
                    label="Full name"
                    name="name"
                    autoComplete="name"
                    required
                    maxLength={60}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Field
                    label="Email"
                    type="email"
                    value={user.email}
                    disabled
                    readOnly
                    hint="Your email is used to log in and can't be changed here."
                />
                <Alert type="error">{error}</Alert>
                <Alert type="success">{success}</Alert>
                <PrimaryButton type="submit" loading={saving} disabled={unchanged} className="sm:w-auto sm:px-8">
                    Save changes
                </PrimaryButton>
            </form>
        </Panel>
    );
};

export default function EditProfileTab({ user }) {
    return (
        <div className="space-y-6">
            <AvatarSection user={user} />
            <DetailsSection user={user} />
        </div>
    );
}
