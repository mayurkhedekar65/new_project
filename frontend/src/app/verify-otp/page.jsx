"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import axios from "axios";

export default function EnterOtp() {
  const router = useRouter();
  const [show, setShow] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    otp: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [timer, setTimer] = useState(60);

  useEffect(() => {
    if (timer === 0) {
      setShow(false);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.otp) {
      alert("please enter OTP !");
      return;
    }

    try {
      const email = localStorage.getItem("user_email");
      const response = await axios.post(
        "http://127.0.0.1:8000/auth/verify-otp",
        {
          user_email: email,
          otp: formData.otp,
        },
      );
      setFormData({
        otp: "",
      });
      alert(response.data.message);
      router.push("/update-password");
    } catch (error) {
      console.log(error);
      alert("invalid or expired OTP !");
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      const email = localStorage.getItem("user_email");
      const response = await axios.post(
        "http://127.0.0.1:8000/auth/reset-password",
        {
          user_email: email,
        },
      );
      setTimer(60);
      setShow(true);
      alert(response.data.message);
    } catch (error) {
      console.log(error);
      setTimer(0);
      alert("failed to send generate otp !");
      return;
    }
  };
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"
      ></motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"
      ></motion.div>

      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8"
      >
        <div className="text-center">
          <h1 className="text-3xl font-black text-white tracking-tight">
            Enter
            <span className="text-cyan-400"> OTP</span>
          </h1>

          <p className="mt-3 text-slate-400">
            Enter the OTP sent to your registered email address to verify your
            identity.
          </p>
        </div>

        <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
          {show && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <label className="block text-sm font-medium text-slate-300 mb-2">
                OTP
              </label>

              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                placeholder="Enter OTP"
                maxLength={6}
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-center text-xl tracking-[0.5em] text-white outline-none focus:border-cyan-400"
              />
            </motion.div>
          )}

          <div className="text-center text-sm text-slate-400">
            {timer > 0 ? (
              <p>
                Resend OTP{" "}
                <span className="text-cyan-400 font-semibold">{timer}s</span>
              </p>
            ) : (
              <button
                type="button"
                onClick={() => resendOtp()}
                className="text-cyan-400 hover:text-cyan-300 font-semibold text-xl"
              >
                Resend OTP
              </button>
            )}
          </div>

          {show && (
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
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
                  Verifying...
                </>
              ) : (
                "Verify OTP"
              )}
            </motion.button>
          )}
        </form>

        <div className="mt-8 text-center">
          <Link
            href="/forgot-password"
            className="text-cyan-400 hover:text-cyan-300"
          >
            ← Back to Forgot Password
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
