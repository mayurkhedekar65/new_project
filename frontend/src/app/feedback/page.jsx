"use client";

import Link from "next/link";
import Loader from "@/components/Loader";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

export default function FeedbackPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    user_feedback: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.user_name) {
      alert("Please enter your name!");
      return;
    }

    if (!formData.user_email) {
      alert("Please enter your email!");
      return;
    }

    if (!formData.user_feedback.trim()) {
      alert("Please enter your feedback!");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/public/feedback",
        formData,
      );

      setFormData({
        user_name: "",
        user_email: "",
        user_feedback: "",
      });
      alert(response.data.message);
    } catch (error) {
      console.error(error);
      alert("Failed to submit feedback!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}

      {!loading && (
        <div className="min-h-screen bg-slate-950 relative overflow-hidden text-white">
          <Navbar setLoading={setLoading} />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm font-medium text-cyan-400 backdrop-blur-md transition-all duration-300 hover:border-cyan-400 hover:bg-slate-800 hover:text-cyan-300"
              >
                <span className="material-symbols-outlined text-[20px]">
                  arrow_back
                </span>
                Back to Home
              </Link>
            </motion.div>

            <div className="mt-10 grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.7,
                  ease: "easeOut",
                }}
              >
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="inline-flex items-center rounded-full bg-cyan-500/10 border border-cyan-400/20 px-5 py-2 text-cyan-400 font-semibold text-sm mb-8"
                >
                  Contact Us
                </motion.span>

                <motion.h1
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-5xl lg:text-5xl font-black leading-tight"
                >
                  Let's Talk About Your
                  <br />
                  <span className="text-white">Feedback</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="mt-8 text-lg text-slate-400 leading-8 max-w-lg"
                >
                  Have questions, suggestions, or feedback? We'd love to hear
                  from you. Reach out to our team and we'll get back to you as
                  soon as possible.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.5 }}
                  className="mt-12 space-y-7"
                >
                  <motion.div
                    whileHover={{ x: 8 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-5"
                  >
                    <div className="h-14 w-14 rounded-2xl border border-slate-700 bg-white/5 flex items-center justify-center text-cyan-400 text-2xl">
                      ✉
                    </div>

                    <div>
                      <p className="text-slate-400 text-sm">Email</p>
                      <p className="text-xl font-semibold">
                        support@yourwebsite.com
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ x: 8 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-5"
                  >
                    <div className="h-14 w-14 rounded-2xl border border-slate-700 bg-white/5 flex items-center justify-center text-cyan-400 text-2xl">
                      ☎
                    </div>

                    <div>
                      <p className="text-slate-400 text-sm">Phone</p>
                      <p className="text-xl font-semibold">+91 98765 43210</p>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ x: 8 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-5"
                  >
                    <div className="h-14 w-14 rounded-2xl border border-slate-700 bg-white/5 flex items-center justify-center text-cyan-400 text-2xl">
                      📍
                    </div>

                    <div>
                      <p className="text-slate-400 text-sm">Location</p>
                      <p className="text-xl font-semibold">Goa, India</p>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50, scale: 0.97 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{
                  duration: 0.7,
                  delay: 0.2,
                  ease: "easeOut",
                }}
                className="w-full rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="text-center mb-8"
                >
                  <h1 className="text-3xl font-black tracking-tight">
                    Send <span className="text-cyan-400">Feedback</span>
                  </h1>

                  <p className="text-sm text-slate-400 mt-2">
                    We'd love to hear your thoughts and suggestions.
                  </p>
                </motion.div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                  >
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Name
                    </label>

                    <input
                      type="text"
                      name="user_name"
                      placeholder="John Doe"
                      value={formData.user_name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-cyan-400 transition"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.7 }}
                  >
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Email
                    </label>

                    <input
                      type="email"
                      name="user_email"
                      placeholder="johndoe@gmail.com"
                      value={formData.user_email}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-cyan-400 transition"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.8 }}
                  >
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Feedback
                    </label>

                    <textarea
                      name="user_feedback"
                      rows={5}
                      placeholder="Write your feedback here..."
                      value={formData.user_feedback}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 outline-none resize-none focus:border-cyan-400 transition"
                    />
                  </motion.div>

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{
                      scale: isLoading ? 1 : 1.02,
                      boxShadow: isLoading
                        ? "none"
                        : "0px 10px 30px rgba(34, 211, 238, 0.15)",
                    }}
                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                    transition={{ duration: 0.2 }}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full py-3.5 bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-700 disabled:cursor-not-allowed text-slate-900 rounded-xl font-bold transition duration-200 shadow-lg shadow-cyan-500/10 mt-4 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="w-5 h-5 animate-spin"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="9"
                            stroke="currentColor"
                            strokeWidth="3"
                          />
                          <path
                            className="opacity-90"
                            d="M21 12a9 9 0 0 1-9 9"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                          />
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      "Submit Feedback"
                    )}
                  </motion.button>
                </form>
              </motion.div>
            </div>
          </div>
          <Footer setLoading={setLoading} />
        </div>
      )}
    </>
  );
}
