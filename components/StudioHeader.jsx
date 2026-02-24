"use client";
import React, { useState } from 'react';
import DeleteBlogPostModel from './DeleteBlogPostModel'; // Your Manage Blogs component

const StudioHeader = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
   const handleLogout = () => {
        localStorage.removeItem("is_admin");
    window.location.reload()
    };
    return (
        <div className="flex items-center  w-full  p-4">
            {/* Left Side: Branding */}
            <div className="space-y-1"
            onClick={() => setIsMenuOpen(!isMenuOpen)}

            >
                <h1 className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-300">
                    Settings
                </h1>
            </div>

            {/* Right Side: Action Menu */}
            <div className="relative">
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-2 text-white/40 hover:text-white transition-colors rounded-full hover:bg-white/5"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="1"></circle>
                        <circle cx="12" cy="5" r="1"></circle>
                        <circle cx="12" cy="19" r="1"></circle>
                    </svg>
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                    <>
                        {/* Transparent overlay to close menu when clicking outside */}
                        <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)}></div>

                        <div className="absolute -right-17 mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-2xl z-20 overflow-hidden py-1">

                            {/* Manage Blogs Option (The Modal trigger) */}
                            <div className=" transition-colors">
                                <DeleteBlogPostModel variant="dropdown" />
                            </div>

                            <div className="h-px bg-white/5 my-1"></div>

                            {/* Lock Studio Option */}
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 text-[10px] uppercase tracking-wider text-white/60 hover:text-red-400 transition-colors flex items-center gap-2"
                            >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                Lock Studio
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default StudioHeader;