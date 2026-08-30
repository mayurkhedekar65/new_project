"use client";

import Loader from "@/components/Loader";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import axios from "axios";

export default function SignInPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleNavigate = (route) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push(route);
    }, 2000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    if (!formData.email) {
      alert("please enter your email !");
      return;
    }
    if (!formData.password) {
      alert("please enter your password !");
      return;
    }
    if (formData.password.length < 8) {
      alert("password length should be minimum 8 characters !");
      return;
    }
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/auth/signin",
        formData,
      );
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("user_name", response.data.user_name);
      setFormData({
        email: "",
        password: "",
      });
      router.push("/report-analysis");
      alert(response.data.message);
      return;
    } catch (error) {
      console.log(error);
      alert("login failed !");
      return;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      {!loading && (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-6 relative overflow-hidden text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"
          ></motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"
          ></motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
            }}
            className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl relative z-10"
          >
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl font-black tracking-tight">
                Sign <span className="text-cyan-400">In</span>
              </h1>

              <p className="text-sm text-slate-400 mt-2">
                Welcome back. Access your clinical workspace.
              </p>
            </motion.div>

            <motion.form
              onSubmit={handleSubmit}
              className="space-y-5"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Email
                </label>

                <input
                  type="email"
                  required
                  name="email"
                  placeholder="johndoe@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-cyan-400 transition"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-slate-300">
                    Password
                  </label>

                  <button
                    onClick={() => handleNavigate("/forgot-password")}
                    className="text-xs text-cyan-400 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 pr-20 text-white placeholder-slate-500 outline-none focus:border-cyan-400 transition"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-cyan-400 hover:text-cyan-300"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                className="w-full py-3.5 bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-700 disabled:cursor-not-allowed text-slate-900 rounded-xl font-bold transition duration-200 shadow-lg shadow-cyan-500/10 mt-2 flex items-center justify-center gap-2"
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
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </motion.button>
            </motion.form>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-sm text-center text-slate-400 mt-8"
            >
              Don't have an account?{" "}
              <button
                onClick={() => handleNavigate("/signup")}
                className="text-cyan-400 font-semibold hover:underline"
              >
                Create an account
              </button>
            </motion.p>
          </motion.div>
        </div>
      )}
    </>
  );
}
