"use client";

import React, { useEffect, useRef, useState } from "react";
import { Camera, Trash2 } from "lucide-react";
import { authClient } from "@/app/lib/auth-client";
import { AVATAR_MAX_MB } from "@/app/lib/avatar";
import { Avatar, authErrorMessage } from "@/components/auth/ui";
import { SettingsButton as Button, Input, Message, formatDate, useConfirm } from "./shared";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const AVATAR_SIZE = 64;

const ProfileRow = ({ label, children, action, editing = false }) => (
    <div className={`grid gap-x-6 gap-y-2 px-5 py-5 sm:grid-cols-[136px_minmax(0,1fr)] sm:px-6 ${editing ? "items-start" : "items-center"}`}>
        <dt className={`text-[13px] text-gray-500 ${editing ? "sm:pt-2.5" : ""}`}>{label}</dt>
        <dd className="flex min-w-0 items-center gap-4">
            <div className="min-w-0 flex-1 text-sm leading-6 text-gray-950">{children}</div>
            {action}
        </dd>
    </div>
);

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

// A short status line that clears itself (success) or stays until the next action (error).
const useNotice = () => {
    const [notice, setNotice] = useState(null); // { type, text }
    const timer = useRef(null);
    useEffect(() => () => clearTimeout(timer.current), []);
    return [
        notice,
        (type, text) => {
            clearTimeout(timer.current);
            setNotice(text ? { type, text } : null);
            if (text && type === "success") timer.current = setTimeout(() => setNotice(null), 3500);
        },
    ];
};

// Avatar with an upload-progress ring drawn around it.
const AvatarWithProgress = ({ user, progress }) => {
    const ring = AVATAR_SIZE + 12;
    const radius = ring / 2 - 2;
    const circumference = 2 * Math.PI * radius;
    return (
        <span className="relative inline-flex shrink-0" style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}>
            <Avatar src={user.image} name={user.name} email={user.email} size={AVATAR_SIZE} />
            {progress !== null && (
                <svg
                    width={ring}
                    height={ring}
                    viewBox={`0 0 ${ring} ${ring}`}
                    className="pointer-events-none absolute -left-1.5 -top-1.5 -rotate-90"
                    aria-hidden="true"
                >
                    <circle cx={ring / 2} cy={ring / 2} r={radius} fill="none" stroke="#e5e7eb" strokeWidth="3" />
                    <circle
                        cx={ring / 2}
                        cy={ring / 2}
                        r={radius}
                        fill="none"
                        stroke="#48A2FF"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference * (1 - progress / 100)}
                        style={{ transition: "stroke-dashoffset 0.2s linear" }}
                    />
                </svg>
            )}
        </span>
    );
};

const PhotoBlock = ({ user }) => {
    const inputRef = useRef(null);
    const [progress, setProgress] = useState(null);
    const [notice, setNotice] = useNotice();
    const { ask, dialog, busy: removing } = useConfirm();
    const uploading = progress !== null;

    const handleFile = async (file) => {
        if (!file) return;
        setNotice();
        if (!ACCEPTED_TYPES.includes(file.type)) return setNotice("error", "Use a JPG, PNG, WEBP or AVIF image.");
        if (file.size > AVATAR_MAX_MB * 1024 * 1024) return setNotice("error", `Image must be under ${AVATAR_MAX_MB} MB.`);

        setProgress(0);
        try {
            const url = await uploadAvatarToCloudinary(file, setProgress);
            const { error } = await authClient.updateUser({ image: url });
            if (error) throw new Error(authErrorMessage(error, "Could not save your photo."));
            setNotice("success", "Photo updated");
        } catch (err) {
            setNotice("error", err?.message || "Upload failed.");
        } finally {
            setProgress(null);
            if (inputRef.current) inputRef.current.value = "";
        }
    };

    const confirmRemove = () => {
        setNotice();
        ask({
            title: "Remove profile photo?",
            description: "Your photo will be deleted and your initials will be shown instead.",
            confirmLabel: "Remove photo",
            destructive: true,
            action: async () => {
                const { error } = await authClient.updateUser({ image: null });
                if (error) return authErrorMessage(error, "Could not remove your photo.");
                // Best effort: delete the file itself from Cloudinary.
                await fetch("/api/user/avatar", { method: "DELETE" }).catch(() => {});
                setNotice("success", "Photo removed");
            },
        });
    };

    return (
        <div className="grid grid-cols-[64px_minmax(0,1fr)] items-center gap-x-4 gap-y-4 border-b border-gray-200 px-5 py-6 sm:grid-cols-[64px_minmax(0,1fr)_auto] sm:px-6">
            {dialog}
            <input
                ref={inputRef}
                type="file"
                accept={ACCEPTED_TYPES.join(",")}
                aria-label="Upload profile photo"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
            />
            <AvatarWithProgress user={user} progress={progress} />
            <div className="min-w-0 flex-1">
                <h2 className="text-sm font-medium text-gray-950">Profile photo</h2>
                <p
                    role={notice?.type === "error" ? "alert" : "status"}
                    className={`mt-1 text-[13px] leading-5 ${
                        uploading || !notice ? "text-gray-500" : notice.type === "error" ? "text-red-600" : "text-emerald-600"
                    }`}
                >
                    {uploading ? `Uploading… ${progress}%` : notice ? notice.text : `JPG, PNG or WEBP, up to ${AVATAR_MAX_MB} MB`}
                </p>
            </div>
            <div className="col-span-2 flex flex-wrap items-center gap-2 sm:col-span-1">
                <Button disabled={uploading || removing} onClick={() => inputRef.current?.click()}>
                    <Camera size={14} aria-hidden="true" />
                    {user.image ? "Change photo" : "Upload photo"}
                </Button>
                {user.image && (
                    <Button variant="ghost" disabled={uploading || removing} onClick={confirmRemove} aria-label="Remove profile photo">
                        <Trash2 size={15} aria-hidden="true" />
                    </Button>
                )}
            </div>
        </div>
    );
};

const NameRow = ({ user }) => {
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(user.name || "");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const trimmed = name.trim().replace(/\s+/g, " ");

    const startEditing = () => {
        setName(user.name || "");
        setError("");
        setEditing(true);
    };

    const save = async (e) => {
        e.preventDefault();
        if (!trimmed) return setError("Name can't be empty.");
        if (trimmed === user.name) return setEditing(false);
        setSaving(true);
        const { error: err } = await authClient.updateUser({ name: trimmed });
        setSaving(false);
        if (err) return setError(authErrorMessage(err, "Could not save your name."));
        setEditing(false);
    };

    if (!editing) {
        return (
            <ProfileRow label="Name" action={<Button onClick={startEditing} aria-label="Edit name">Edit</Button>}>
                {user.name}
            </ProfileRow>
        );
    }

    return (
        <ProfileRow label="Name" editing>
            <form onSubmit={save} className="flex flex-wrap items-center gap-2.5">
                <Input
                    autoFocus
                    aria-label="Full name"
                    autoComplete="name"
                    maxLength={60}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === "Escape" && setEditing(false)}
                    className="rounded-md! sm:max-w-64"
                />
                <div className="flex gap-2">
                    <Button type="submit" variant="primary" loading={saving}>
                        Save
                    </Button>
                    <Button variant="ghost" onClick={() => setEditing(false)} disabled={saving}>
                        Cancel
                    </Button>
                </div>
            </form>
            {error && (
                <div className="mt-2">
                    <Message>{error}</Message>
                </div>
            )}
        </ProfileRow>
    );
};

export default function ProfileTab({ user }) {
    return (
        <>
            <header data-reveal className="mb-7 sm:mb-8">
                <h1 className="text-2xl font-semibold tracking-tight text-gray-950 sm:text-[28px]">Your profile</h1>
                <p className="mt-2 text-sm leading-6 text-gray-500">How you appear across AfterRender.</p>
            </header>
            <section data-reveal aria-label="Profile information" className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <PhotoBlock user={user} />
                <dl className="divide-y divide-gray-100">
                    <NameRow user={user} />
                    <ProfileRow label="Email">
                        <span className="break-all">{user.email}</span>
                    </ProfileRow>
                    <ProfileRow label="Member since">{formatDate(user.createdAt)}</ProfileRow>
                </dl>
            </section>
        </>
    );
}
