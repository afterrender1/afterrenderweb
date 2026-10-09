"use client";
import React, { useState } from "react";

const AdminLogin = ({ onSuccess }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-6">
            <form
                onSubmit={handleLogin}
                className="w-full max-w-md bg-white border border-neutral-200 p-8 rounded-2xl shadow-sm space-y-5"
            >
                <h2 className="text-2xl font-semibold text-neutral-900 text-center">Creator Studio</h2>

                <input
                    type="email"
                    placeholder="Admin Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-neutral-200 text-neutral-900 placeholder-neutral-400 outline-none focus:border-[#80C1FC] focus:ring-2 focus:ring-[#80C1FC]/30 transition"
                    required
                />
                <input
                    type="password"
                    placeholder="Security Key"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-neutral-200 text-neutral-900 placeholder-neutral-400 outline-none focus:border-[#80C1FC] focus:ring-2 focus:ring-[#80C1FC]/30 transition"
                    required
                />

                {error && <p className="text-sm text-red-600">{error}</p>}

                <button
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-neutral-900 text-white font-medium hover:bg-neutral-800 disabled:opacity-60 transition cursor-pointer"
                >
                    {loading ? "Checking..." : "Unlock Access"}
                </button>
            </form>
        </div>
    );
};

export default AdminLogin;
