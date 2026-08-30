"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Footer({ setLoading }) {
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

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    setToken(storedToken);
  }, []);
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="border-t border-slate-900 bg-slate-950 text-slate-400 py-12 mt-auto"
    >
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-3"
        >
          <h3 className="text-lg font-bold text-white">
            Diagnostic <span className="text-cyan-400">AI</span>
          </h3>

          <p className="text-sm text-slate-500">
            Next-generation AI tools built specifically for medical report
            understanding, analysis, and intelligent document workflows.
          </p>
        </motion.div>

        {token && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Platform
            </h4>

            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => handleNavigateWithOutputLoader("/comparison")}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Dashboard
                </button>
              </li>

              <li>
                <button
                  onClick={() =>
                    handleNavigateWithOutputLoader("/document-chat")
                  }
                  className="hover:text-cyan-400 transition-colors"
                >
                  Upload Document
                </button>
              </li>

              <li>
                <button
                  onClick={() =>
                    handleNavigateWithOutputLoader("/report-analysis")
                  }
                  className="hover:text-cyan-400 transition-colors"
                >
                  Report Analysis
                </button>
              </li>
            </ul>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
            Support
          </h4>

          <ul className="space-y-2.5 text-sm">
            <li>
              <button
                onClick={() => handleNavigate("/feedback")}
                className="hover:text-cyan-400 transition-colors"
              >
                Feedback
              </button>
            </li>

            <li>
              <button
                onClick={() => handleNavigate("/about")}
                className="hover:text-cyan-400 transition-colors"
              >
                About
              </button>
            </li>
          </ul>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-slate-900 text-xs text-slate-500 flex flex-col md:flex-row justify-between gap-4"
      >
        <p>&copy; 2026 Diagnostic AI. All rights reserved.</p>
      </motion.div>
    </motion.footer>
  );
}
