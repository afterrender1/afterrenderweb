"use client";
import React, { useState, useEffect } from "react";
import { Poppins } from "next/font/google";
import Navbar from "./Navbar";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "600"],
});

const SECURE_EMAIL = process.env.NEXT_PUBLIC_SECURE_EMAIL;
const SECURE_PASSWORD = process.env.NEXT_PUBLIC_SECURE_PASSWORD;

const AdminStudio = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("");
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState("");
    const [image, setImage] = useState("");

    useEffect(() => {
        const auth = localStorage.getItem("is_admin");
        if (auth === "true") setIsAdmin(true);
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        if (loginData.email === SECURE_EMAIL && loginData.password === SECURE_PASSWORD) {
            setIsAdmin(true);
            localStorage.setItem("is_admin", "true");
        } else {
            alert("❌ Access Denied");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("is_admin");
        setIsAdmin(false);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => setImage(reader.result);
    };

    // FIXED TAGS LOGIC
    const addTag = (e) => {
        if (e && e.key !== "Enter") return;
        if (e) e.preventDefault();

        const val = tagInput.trim().replace(/#/g, "");
        if (val && !tags.includes(val)) {
            setTags((prev) => [...prev, val]);
            setTagInput("");
        }
    };

    const removeTag = (idx) => setTags(tags.filter((_, i) => i !== idx));

    const submitBlog = async (e) => {
        e.preventDefault();

        // Final verification of required fields
        if (!title || !content || !image || !category) {
            alert("Please fill Title, Content, Category and Image.");
            return;
        }

        setLoading(true);
        try {
            // Payload explicitly capturing current tags state
            const payload = {
                title,
                content,
                category,
                tags: [...tags], // Ensuring array is sent
                image,
                author: "Admin"
            };

            const res = await fetch("/api/blog", { // Check your API path (usually /api/blogs)
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (data.success) {
                alert("✨ Story published!");
                setTitle(""); setContent(""); setTags([]); setImage(""); setCategory("");
            } else {
                throw new Error(data.error);
            }
        } catch (err) {
            alert("❌ Error: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isAdmin) {
        return (
            <div className={`min-h-screen flex items-center justify-center bg-[#0a0a0c] p-6 ${poppins.className}`}>
                <form onSubmit={handleLogin} className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl space-y-6">
                    <h2 className="text-3xl font-bold text-white text-center">Creator Studio</h2>
                    <input type="text" placeholder="Admin Email" className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none" onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} required />
                    <input type="password" placeholder="Security Key" className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none" onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} required />
                    <button className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-bold">Unlock Access</button>
                </form>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className={`min-h-screen bg-linear-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] py-12 sm:py-32 px-4 sm:px-6 lg:px-8 ${poppins.className}`}>
                <div className="max-w-3xl mx-auto">
                    <div className="flex justify-between items-center mb-12">
                        <div className="space-y-1">
                            <h1 className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-300">Publishing Deck</h1>
                            <button onClick={handleLogout} className="text-[9px] text-white/30 uppercase hover:text-red-400 transition-colors">Lock Studio</button>
                        </div>
                        <button
                            onClick={submitBlog}
                            disabled={loading}
                            className={`px-10 py-3 rounded-full font-bold transition-all shadow-lg text-sm flex items-center gap-2
                                ${loading ? "bg-white/10 text-white/30 cursor-not-allowed" : "bg-white text-indigo-900 hover:bg-indigo-50 active:scale-95"}`}
                        >
                            {loading ? "Publishing..." : "Publish Insight"}
                        </button>
                    </div>

                    <div className={`bg-black/40 backdrop-blur-xl sm:rounded-3xl border border-white/10 overflow-hidden shadow-2xl transition-all duration-500 ${loading ? "opacity-40 pointer-events-none scale-[0.98]" : "opacity-100"}`}>
                        <div className="relative h-56 sm:h-80 bg-white/5 border-b border-white/10">
                            {image ? (
                                <div className="h-full w-full relative">
                                    <img src={image} alt="Preview" className="w-full h-full object-cover" />
                                    <button onClick={() => setImage("")} className="absolute top-4 right-4 bg-black/60 p-2 rounded-full text-white">×</button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center h-full cursor-pointer hover:bg-white/5 transition-colors">
                                    <svg className="w-10 h-10 text-indigo-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" /></svg>
                                    <span className="text-xs text-white/40 font-medium">Add Visual Context</span>
                                    <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                                </label>
                            )}
                        </div>

                        <div className="p-8 sm:p-14 space-y-10">
                            <input type="text" placeholder="Headline..." className="w-full text-3xl sm:text-5xl font-bold bg-transparent outline-none text-white placeholder-white/5 leading-tight" value={title} onChange={(e) => setTitle(e.target.value)} />

                            <div className="flex flex-col sm:flex-row gap-6">
                                <select value={category} onChange={(e) => setCategory(e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500 transition-all cursor-pointer">
                                    <option value="" className="bg-[#1d1949]">Select Category</option>
                                    <option value="Technology" className="bg-[#1d1949]">Technology</option>
                                    <option value="Innovation" className="bg-[#1d1949]">Innovation</option>
                                    <option value="Design" className="bg-[#1d1949]">Design</option>
                                </select>

                                <div className="flex-1 space-y-3">
                                    <div className="relative">
                                        <input type="text" placeholder="Tags (Press Enter)" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500 transition-all" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={addTag} />
                                        <button onClick={() => addTag()} className="absolute right-3 top-3 text-[10px] text-indigo-400 font-bold uppercase">Add</button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {tags.map((tag, i) => (
                                            <span key={i} className="px-2 py-1 bg-indigo-500/20 text-indigo-300 text-[10px] rounded-md border border-indigo-500/30 flex items-center gap-2 animate-in zoom-in duration-300">
                                                #{tag} <button onClick={() => removeTag(i)} className="hover:text-red-400">×</button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <textarea placeholder="Your narrative begins here..." className="w-full min-h-[400px] bg-transparent outline-none text-white/70 text-lg leading-relaxed resize-none font-light" value={content} onChange={(e) => setContent(e.target.value)} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminStudio;