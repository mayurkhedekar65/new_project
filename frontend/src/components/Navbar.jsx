"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Navbar({ setLoading }) {
  const router = useRouter();
  const [token, setToken] = useState(null);

  const handleNavigate = (route) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push(route);
    }, 2000);
  };

  const handleNavigateWithOutputLoader = (route) => {
    router.push(route);
  };
  
  const logOut = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_name");
    alert("logged out successfully !");
    window.location.reload();
    return;
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    setToken(storedToken);
  }, []);
  return (
    <>
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur"
      >
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-2xl font-extrabold"
          >
            <Link href="/">
              Diagnostic <span className="text-cyan-400">AI</span>
            </Link>
          </motion.h1>

          {!token && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center gap-4"
            >
              <button
                onClick={() => handleNavigate("/signin")}
                className="text-sm font-semibold text-slate-300 hover:text-white px-4 py-2 rounded-xl border border-slate-600 transition-colors shadow-lg shadow-slate-500/10"
              >
                Sign In
              </button>

              <button
                onClick={() => handleNavigate("/signup")}
                className="text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-900 px-4 py-2 rounded-xl transition-colors shadow-lg shadow-cyan-500/10"
              >
                Get Started
              </button>
            </motion.div>
          )}

          {token && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center gap-4"
            >
              <button
                onClick={() => handleNavigateWithOutputLoader("/settings")}
                className="text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-900 px-4 py-2 rounded-xl transition-colors shadow-lg shadow-cyan-500/10"
              >
                User Profile
              </button>

              <button
                onClick={() => logOut()}
                className="text-sm font-semibold text-slate-300 hover:text-white px-4 py-2 rounded-xl border border-slate-600 transition-colors shadow-lg shadow-slate-500/10"
              >
                Logout
              </button>
            </motion.div>
          )}
        </div>
      </motion.header>
    </>
  );
}
