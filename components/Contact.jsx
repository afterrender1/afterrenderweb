"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";

const ContactForm = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    service: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", form);
    alert("Thanks for reaching out!");
  };

  return (
    <section id="contact" className="relative w-full py-28 bg-black text-white overflow-hidden">
      {/* Background Layers */}
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
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-linear-to-r from-[#48A2FF] to-[#C9E4FF] rounded-full blur-3xl opacity-30 pointer-events-none" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Left Info Section */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="space-y-10"
          style={{ fontFamily: "poppins" }}
        >
          <div>
            <h2 className="text-5xl font-bold mb-6">
              Let’s <span className="text-transparent bg-clip-text bg-linear-to-r from-[#48A2FF] to-[#C9E4FF]">Collaborate</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              We’d love to hear about your ideas, projects, or challenges. Reach out and we’ll get back within 24 hours.
            </p>
          </div>

          <div className="space-y-5">
            {/* Contact Cards */}
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-lg hover:bg-white/10 transition-all">
              <Mail className="text-[#48A2FF] w-6 h-6" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-gray-400 text-sm">video@afterrender.com</p>
              </div>
            </div>
          
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-lg hover:bg-white/10 transition-all">
              <MapPin className="text-[#48A2FF] w-6 h-6" />
              <div>
                <p className="font-medium">Location</p>
                <p className="text-gray-400 text-sm">Karachi, Pakistan</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Form Section */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-10 shadow-2xl space-y-6"
          style={{ fontFamily: "poppins" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-gray-300 mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
                className="bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#48A2FF] transition-all"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-300 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
                className="bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#48A2FF] transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-300 mb-2">Service</label>
            <select
              name="service"
              value={form.service}
              onChange={handleChange}
              required
              className="bg-black/10 border cursor-pointer border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#48A2FF] transition-all"
            >
              <option value="" className="bg-black ">Select a Service</option>
              <option value="social" className="bg-black" >Video Editing</option>
              <option value="video" className="bg-black" >Video Production</option>
              <option value="design" className="bg-black" >Creative Design</option>
              <option value="ads" className="bg-black" >Facebook/Instagram Ads</option>
              <option value="other" className="bg-black" >Other</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-300 mb-2">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Write your message..."
              required
              rows="5"
              className="bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#48A2FF] transition-all resize-none"
            />
          </div>

          <div className="text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="bg-linear-to-r from-[#48A2FF] to-[#C9E4FF] text-[#0A2540] cursor-pointer font-semibold px-10 py-4 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Send Message
            </motion.button>
          </div>
        </motion.form>
      </div>
    </section>
  );
};

export default ContactForm;
