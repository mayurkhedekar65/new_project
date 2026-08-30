"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import axios from "axios";

export default function ResetPassword() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const [formData, setFormData] = useState({
    user_password: "",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!formData.user_password) {
      alert("please enter your new password !");
      return;
    }

    if (!confirmPassword) {
      alert("please confirm your new password !");
      return;
    }

    if (formData.user_password.length < 8) {
      alert("password length should be minimum 8 characters !");
      return;
    }

    if (formData.user_password != confirmPassword) {
      alert("password doesn't match !");
      return;
    }
    try {
      const email = localStorage.getItem("user_email");
      const response = await axios.post(
        "http://127.0.0.1:8000/auth/update-password",
        {
          user_email: email,
          user_password: formData.user_password,
        },
      );
      localStorage.removeItem("user_email");
      setFormData({
        user_password: "",
      });
      setConfirmPassword("");
      alert(response.data.message);
      router.push("/password-reset-success");
      return;
    } catch (error) {
      console.log(error);
      alert("failed to update new password !");
      return;
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8"
      >
        <div className="text-center">
          <h1 className="text-3xl font-black text-white tracking-tight">
            Reset
            <span className="text-cyan-400"> Password</span>
          </h1>

          <p className="mt-3 text-slate-400">
            Create a new password for your account.
          </p>
        </div>

        <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              New Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                name="user_password"
                value={formData.user_password}
                onChange={handleChange}
                placeholder="Enter new password"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 pr-20 text-white outline-none focus:border-cyan-400"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-cyan-400 hover:text-cyan-300"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Confirm Password
            </label>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                placeholder="Confirm password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 pr-20 text-white outline-none focus:border-cyan-400"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-cyan-400 hover:text-cyan-300"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-cyan-500 py-3 font-semibold text-slate-900 hover:bg-cyan-400 disabled:bg-cyan-700 disabled:cursor-not-allowed transition shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
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
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/signin" className="text-cyan-400 hover:text-cyan-300">
            ← Back to Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
