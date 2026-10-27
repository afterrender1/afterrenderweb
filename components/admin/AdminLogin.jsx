"use client";
import React, { useState } from "react";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { inputClass, labelClass, primaryBtn, iconBtn } from "./ui";

const AdminLogin = ({ onSuccess }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            if (res.ok) {
                onSuccess();
            } else {
                setError("Access denied. Check your email and security key.");
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-dvh flex items-center justify-center bg-stone-50 px-4 py-8">
            <form
                onSubmit={handleLogin}
                className="w-full max-w-sm bg-white border border-stone-200 p-6 sm:p-8 rounded-xl shadow-xs space-y-5"
            >
                <div className="text-center">
                    <div className="size-10 mx-auto mb-3 rounded-md bg-stone-900 text-stone-50 grid place-items-center font-semibold">A</div>
                    <h2 className="text-xl font-semibold tracking-tight text-stone-900">Creator Studio</h2>
                    <p className="text-sm text-stone-500 mt-1">Sign in to manage your site.</p>
                </div>

                <div>
                    <label htmlFor="admin-email" className={labelClass}>Email</label>
                    <input
                        id="admin-email"
                        type="email"
                        autoComplete="username"
                        placeholder="admin@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputClass}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="admin-key" className={labelClass}>Security key</label>
                    <div className="relative">
                        <input
                            id="admin-key"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`${inputClass} pr-11`}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((s) => !s)}
                            className={`${iconBtn} absolute right-0.5 top-0.5 sm:top-0`}
                            aria-label={showPassword ? "Hide security key" : "Show security key"}
                            title={showPassword ? "Hide" : "Show"}
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                {error && (
                    <p className="flex items-start gap-2 text-sm text-red-600" role="alert">
                        <AlertCircle size={16} className="mt-0.5 shrink-0" />
                        <span className="min-w-0 break-words">{error}</span>
                    </p>
                )}

                <button disabled={loading} className={`${primaryBtn} w-full`}>
                    {loading && <Loader2 size={16} className="animate-spin" />}
                    {loading ? "Checking..." : "Unlock Access"}
                </button>
            </form>
        </div>
    );
};

export default AdminLogin;
