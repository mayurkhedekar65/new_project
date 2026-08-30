"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import axios from "axios";

export default function ForgotPassword() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    user_email: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.user_email) {
      alert("please enter your email !");
      return;
    }
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/auth/reset-password",
        formData,
      );
      localStorage.setItem("user_email", formData.user_email);
      setFormData({
        user_email: "",
      });
      alert(response.data.message);
      router.push("/verify-otp");
    } catch (error) {
      console.log(error);
      alert("failed to send reset email !");
      return;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      ></motion.div>

      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"
        animate={{
          scale: [1.15, 1, 1.15],
          opacity: [0.8, 0.5, 0.8],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      ></motion.div>

      <motion.div
        className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.6,
          ease: "easeOut",
        }}
      >
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.2,
          }}
        >
          <h1 className="text-3xl font-black text-white tracking-tight">
            Forgot
            <span className="text-cyan-400"> Password</span>
          </h1>

          <p className="mt-3 text-slate-400">
            Enter your registered email address. We'll send you a password reset
            link.
          </p>
        </motion.div>

        <motion.form
          className="mt-10 space-y-6"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.35,
          }}
        >
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email Address
            </label>

            <input
              type="email"
              required
              name="user_email"
              value={formData.user_email}
              onChange={handleChange}
              placeholder="example@gmail.com"
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400"
            />
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-cyan-500 py-3 font-semibold text-slate-900 hover:bg-cyan-400 disabled:bg-cyan-700 disabled:cursor-not-allowed transition shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
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
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </motion.button>
        </motion.form>

        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.5,
            delay: 0.5,
          }}
        >
          <Link href="/signin" className="text-cyan-400 hover:text-cyan-300">
            ← Back to Sign In
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
