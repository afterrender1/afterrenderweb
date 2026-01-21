"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader, Video, Code2, Link as LinkIcon, Briefcase, AlertCircle } from "lucide-react";

const roleOptions = [
    "Video Editor",
    "WordPress Developer",
    "MERN Stack Developer",
    "Fullstack Developer",
    "Frontend Developer",
    "Backend Developer",
];

const ApplyForm = () => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: "", message: "" });
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        portfolio: "",
        about: "",
        roles: [],
        frontendTech: [],
        backendTech: [],
        software: [],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        // --- STRICT 50-WORD LIMIT LOGIC ---
        if (name === "about") {
            const words = value.trim().split(/\s+/);
            const wordCount = value.trim() === "" ? 0 : words.length;

            // If word count is 50, only allow change if new value is shorter (deleting)
            if (wordCount > 50 && value.length > form.about.length) {
                return;
            }
        }

        setForm({ ...form, [name]: value });
    };

    const handleRoleChange = (role) => {
        let updated = [...form.roles];
        if (role === "Video Editor") {
            updated = updated.includes("Video Editor") ? [] : ["Video Editor"];
        } else {
            updated = updated.filter((r) => r !== "Video Editor");
            if (updated.includes(role)) {
                updated = updated.filter((item) => item !== role);
            } else {
                if (updated.length < 3) updated.push(role);
            }
        }
        setForm({ ...form, roles: updated });
    };

    const toggleSubSkill = (field, value) => {
        let updated = [...form[field]];
        if (updated.includes(value)) {
            updated = updated.filter((v) => v !== value);
        } else {
            updated.push(value);
        }
        setForm({ ...form, [field]: updated });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: "", message: "" });

        try {
            const res = await fetch("/api/apply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (data.success) {
                setStatus({ type: "success", message: "✅ Application submitted successfully!" });
                setForm({
                    name: "", email: "", phone: "", portfolio: "", about: "",
                    roles: [], frontendTech: [], backendTech: [], software: [],
                });
            } else {
                setStatus({ type: "error", message: "❌ Submission failed. Try again." });
            }
        } catch (error) {
            setStatus({ type: "error", message: "⚠️ Something went wrong." });
        } finally {
            setLoading(false);
            setTimeout(() => setStatus({ type: "", message: "" }), 4000);
        }
    };

    const isDev = form.roles.some((r) => r.includes("Developer") || r.includes("MERN"));
    const isVideo = form.roles.includes("Video Editor");

    // Helper to calculate word count for the UI
    const currentWordCount = form.about.trim() === "" ? 0 : form.about.trim().split(/\s+/).length;

    return (
        <section className="relative w-full py-30 sm:py-24 md:py-28 bg-black text-white overflow-hidden">
            {/* Background Decor */}
            <div className="absolute inset-0">
                <div
                    className="absolute inset-0 opacity-25"
                    style={{
                        backgroundImage: `url('/images/herobg.png')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                />
                <div className="absolute inset-0 bg-linear-to-b from-black via-black/90 to-black" />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[400px] lg:w-[500px] h-[300px] md:h-[400px] lg:h-[500px] bg-linear-to-r from-[#48A2FF] to-[#C9E4FF] rounded-full blur-3xl opacity-30 pointer-events-none" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

                {/* Left Side Content */}
                <motion.div
                    initial={{ opacity: 0, x: -60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="space-y-10 text-center lg:text-left lg:sticky lg:top-24 self-start"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-4">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                        <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Hiring Talent</span>
                    </div>
                    <div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
                            Build Your{" "}
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#48A2FF] to-[#C9E4FF]">
                                Career
                            </span> With Us
                        </h2>
                        <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0">
                            We're looking for passionate developers and editors to join our creative team. Show us what you've got!
                        </p>
                    </div>

                    <div className="space-y-5 w-full max-w-md mx-auto lg:mx-0">
                        <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-lg hover:bg-white/10 transition-all">
                            <Briefcase className="text-[#48A2FF] w-6 h-6 shrink-0" />
                            <div className="text-left">
                                <p className="font-medium text-sm sm:text-base">Open Positions</p>
                                <p className="text-gray-400 text-sm sm:text-base">Video, Fullstack, MERN, WordPress</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Right Side Form */}
                <motion.form
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl space-y-6"
                >
                    {/* Basic Grid Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex flex-col">
                            <label className="text-gray-300 mb-2 text-sm font-medium">Full Name</label>
                            <input type="text" name="name" required value={form.name} onChange={handleChange} placeholder="Your Name" className="bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#48A2FF] transition-all" />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-300 mb-2 text-sm font-medium">Email</label>
                            <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="your@email.com" className="bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#48A2FF] transition-all" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex flex-col">
                            <label className="text-gray-300 mb-2 text-sm font-medium">Phone Number</label>
                            <input type="tel" name="phone" required value={form.phone} onChange={handleChange} placeholder="+93 0000000000" className="bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#48A2FF] transition-all" />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-300 mb-2 text-sm font-medium">Portfolio Link</label>
                            <input type="url" name="portfolio" required value={form.portfolio} onChange={handleChange} placeholder="https://..." className="bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#48A2FF] transition-all" />
                        </div>
                    </div>

                    {/* Roles Selector */}
                    <div className="flex flex-col space-y-3">
                        <label className="text-gray-300 text-sm font-medium">Select Your Expertise (Max 3)</label>
                        <div className="flex flex-wrap gap-2">
                            {roleOptions.map((role) => (
                                <button
                                    key={role}
                                    type="button"
                                    onClick={() => handleRoleChange(role)}
                                    className={`px-4 py-2 rounded-lg border text-xs transition-all ${form.roles.includes(role)
                                        ? "bg-[#48A2FF] border-[#48A2FF] text-black font-bold shadow-[0_0_15px_rgba(72,162,255,0.4)]"
                                        : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                                        }`}
                                >
                                    {role}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Dynamic Tech Stacks */}
                    <AnimatePresence>
                        {isVideo && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="p-4 bg-red-500/5 border border-red-500/20 rounded-2xl space-y-3 overflow-hidden">
                                <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase"><Video size={14} /> Video Software</div>
                                <div className="flex flex-wrap gap-2">
                                    {["Premiere Pro", "After Effects", "Davinci", "CapCut"].map(s => (
                                        <button key={s} type="button" onClick={() => toggleSubSkill("software", s)} className={`px-3 py-1.5 rounded-md text-[10px] border ${form.software.includes(s) ? "bg-red-500 text-white border-red-500" : "border-white/10 text-gray-400"}`}>{s}</button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                        {isDev && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="space-y-4 overflow-hidden">
                                <div className="p-4 bg-[#48A2FF]/5 border border-[#48A2FF]/20 rounded-2xl space-y-3">
                                    <div className="flex items-center gap-2 text-[#48A2FF] text-xs font-bold uppercase"><Code2 size={14} /> Tech Stack</div>
                                    <div className="flex flex-wrap gap-2">
                                        {[...new Set(["Next.js", "React.js", "Node.js", "Tailwind", "Laravel", "MongoDB"])].map(t => (
                                            <button key={t} type="button" onClick={() => toggleSubSkill("frontendTech", t)} className={`px-3 py-1.5 rounded-md text-[10px] border ${form.frontendTech.includes(t) ? "bg-[#48A2FF] text-black font-bold border-[#48A2FF]" : "border-white/10 text-gray-400"}`}>{t}</button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* About Section - Restricted to 50 Words */}
                    <div className="flex flex-col">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-gray-300 text-sm font-medium">About Yourself</label>
                            <span className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${currentWordCount >= 50 ? 'text-red-400 border-red-400/30 bg-red-400/5' : 'text-gray-500 border-white/10 bg-white/5'}`}>
                                {currentWordCount} / 50 Words
                            </span>
                        </div>
                        <textarea
                            name="about"
                            required
                            value={form.about}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Tell us about your experience..."
                            className={`bg-black/20 border rounded-xl px-4 py-3 text-white focus:outline-none transition-all resize-none text-sm leading-relaxed ${currentWordCount >= 50 ? 'border-red-500/50' : 'border-white/10 focus:border-[#48A2FF]'}`}
                        />
                        {currentWordCount >= 50 && (
                            <p className="mt-2 text-[10px] text-red-400 flex items-center gap-1 font-medium animate-pulse">
                                <AlertCircle size={12} /> Word limit reached. Please be concise.
                            </p>
                        )}
                    </div>

                    <div className="text-center pt-2">
                        <motion.button
                            whileHover={!loading ? { scale: 1.02 } : {}}
                            whileTap={!loading ? { scale: 0.98 } : {}}
                            type="submit"
                            disabled={loading}
                            className={`w-full font-bold py-4 rounded-xl text-lg shadow-lg transition-all duration-300 ${loading ? "bg-gray-600 text-gray-200 cursor-not-allowed" : "bg-linear-to-r from-[#48A2FF] to-[#C9E4FF] text-[#0A2540] hover:shadow-[0_0_25px_rgba(72,162,255,0.4)]"
                                }`}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <Loader className="w-5 h-5 animate-spin" />
                                    Submitting...
                                </div>
                            ) : (
                                "Submit Application"
                            )}
                        </motion.button>
                    </div>
                </motion.form>
            </div>

            {/* Success Toast */}
            <AnimatePresence>
                {status.message && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 40 }}
                        transition={{ duration: 0.3 }}
                        className={`fixed bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 px-2 sm:px-6 md:px-8 py-2 sm:py-3 md:py-3 z-50 rounded-full text-white font-semibold text-xs sm:text-sm md:text-base shadow-lg sm:shadow-xl max-w-xs sm:max-w-sm md:max-w-md text-center ${status.type === "success" ? "bg-green-600" : "bg-red-600"
                            }`}
                    >
                        {status.message}
                    </motion.div>
                )}
            </AnimatePresence>

        </section>
    );
};

export default ApplyForm;