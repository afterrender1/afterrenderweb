"use client";

import React, { useRef, useState } from "react";
import { Camera, Loader2, Trash2 } from "lucide-react";
import { authClient } from "@/app/lib/auth-client";
import { AVATAR_MAX_MB } from "@/app/lib/avatar";
import { Avatar, authErrorMessage } from "@/components/auth/ui";
import { Badge, Button, DotsMenu, Input, Message, PageHeader, Row, Section, formatDate, useConfirm } from "./shared";

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

const PhotoRow = ({ user }) => {
    const inputRef = useRef(null);
    const [progress, setProgress] = useState(null);
    const [msg, setMsg] = useState({ type: "error", text: "" });
    const { ask, dialog, busy: removing } = useConfirm();
    const uploading = progress !== null;

    const handleFile = async (file) => {
        if (!file) return;
        setMsg({ type: "error", text: "" });
        if (!ACCEPTED_TYPES.includes(file.type)) return setMsg({ type: "error", text: "Use a JPG, PNG, WEBP or AVIF image." });
        if (file.size > AVATAR_MAX_MB * 1024 * 1024) return setMsg({ type: "error", text: `Image must be under ${AVATAR_MAX_MB} MB.` });

        setProgress(0);
        try {
            const url = await uploadAvatarToCloudinary(file, setProgress);
            const { error } = await authClient.updateUser({ image: url });
            if (error) throw new Error(authErrorMessage(error, "Could not save your photo."));
            setMsg({ type: "success", text: "Photo updated." });
        } catch (err) {
            setMsg({ type: "error", text: err?.message || "Upload failed." });
        } finally {
            setProgress(null);
            if (inputRef.current) inputRef.current.value = "";
        }
    };

    const removePhoto = async () => {
        const { error } = await authClient.updateUser({ image: null });
        if (error) return authErrorMessage(error, "Could not remove your photo.");
        // Best effort: delete the file itself from Cloudinary.
        await fetch("/api/user/avatar", { method: "DELETE" }).catch(() => {});
        setMsg({ type: "success", text: "Photo removed." });
    };

    const confirmRemove = () => {
        setMsg({ type: "error", text: "" });
        ask({
            title: "Remove profile photo?",
            description: "Your photo will be deleted and your initials will be shown instead.",
            confirmLabel: "Remove photo",
            destructive: true,
            action: removePhoto,
        });
    };

    return (
        <Row
            label="Photo"
            action={
                <DotsMenu
                    label="Photo options"
                    disabled={uploading || removing}
                    items={[
                        {
                            label: user.image ? "Change photo" : "Upload photo",
                            icon: Camera,
                            onSelect: () => inputRef.current?.click(),
                        },
                        user.image && { label: "Remove photo", icon: Trash2, destructive: true, onSelect: confirmRemove },
                    ]}
                />
            }
            below={msg.text ? <Message type={msg.type}>{msg.text}</Message> : null}
        >
            {dialog}
            <input
                ref={inputRef}
                type="file"
                accept={ACCEPTED_TYPES.join(",")}
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
            />
            <div className="flex items-center gap-3">
                <div className="relative">
                    <Avatar src={user.image} name={user.name} email={user.email} size={48} />
                    {uploading && (
                        <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 text-[10px] font-medium text-white">
                            <Loader2 size={14} className="animate-spin" />
                        </span>
                    )}
                </div>
                <span className="text-zinc-500">
                    {uploading ? `Uploading… ${progress}%` : `JPG, PNG or WEBP, up to ${AVATAR_MAX_MB} MB`}
                </span>
            </div>
        </Row>
    );
};

const NameRow = ({ user }) => {
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(user.name || "");
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState({ type: "error", text: "" });

    const trimmed = name.trim().replace(/\s+/g, " ");

    const save = async (e) => {
        e.preventDefault();
        if (!trimmed) return setMsg({ type: "error", text: "Name can't be empty." });
        if (trimmed === user.name) return setEditing(false);
        setSaving(true);
        const { error } = await authClient.updateUser({ name: trimmed });
        setSaving(false);
        if (error) return setMsg({ type: "error", text: authErrorMessage(error, "Could not save your name.") });
        setEditing(false);
        setMsg({ type: "success", text: "Name updated." });
    };

    if (editing) {
        return (
            <Row label="Name">
                <form onSubmit={save} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <Input
                        autoFocus
                        aria-label="Full name"
                        autoComplete="name"
                        maxLength={60}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="sm:max-w-xs"
                    />
                    <div className="flex gap-2">
                        <Button type="submit" variant="primary" loading={saving}>
                            Save
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => {
                                setEditing(false);
                                setName(user.name || "");
                                setMsg({ type: "error", text: "" });
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
                {msg.text && (
                    <div className="mt-2">
                        <Message type={msg.type}>{msg.text}</Message>
                    </div>
                )}
            </Row>
        );
    }

    return (
        <Row
            label="Name"
            action={
                <Button
                    onClick={() => {
                        setName(user.name || "");
                        setMsg({ type: "error", text: "" });
                        setEditing(true);
                    }}
                >
                    Edit
                </Button>
            }
            below={msg.text ? <Message type={msg.type}>{msg.text}</Message> : null}
        >
            {user.name}
        </Row>
    );
};

export default function ProfileTab({ user }) {
    return (
        <>
            <PageHeader title="Profile" description="Your personal info on AfterRender." />
            <div className="space-y-6">
                <Section>
                    <PhotoRow user={user} />
                    <NameRow user={user} />
                    <Row label="Email">
                        <span className="inline-flex flex-wrap items-center gap-2">
                            <span className="break-all">{user.email}</span>
                            {user.emailVerified ? <Badge tone="success">Verified</Badge> : <Badge tone="warning">Not verified</Badge>}
                        </span>
                    </Row>
                    <Row label="Member since">{formatDate(user.createdAt)}</Row>
                </Section>
            </div>
        </>
    );
}
