"use client";

import Link from "next/link";
import Loader from "@/components/Loader";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useState } from "react";

export default function AboutPage() {
  const [loading, setLoading] = useState(false);

  return (
    <>
      {loading && <Loader />}

      {!loading && (
        <div className="min-h-screen bg-slate-950 text-white">
          <Navbar setLoading={setLoading} />

          <section className="relative overflow-hidden py-10">
            <div className="absolute inset-0 bg-linear-to-br from-cyan-500/20 via-slate-950 to-blue-600/20" />

            <div className="relative z-10 max-w-7xl mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
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

              <motion.div
                className="mt-14 text-center"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-cyan-300"
                >
                  About Diagnostic AI
                </motion.span>

                <motion.h1
                  className="mt-8 text-5xl md:text-6xl font-black"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.4 }}
                >
                  Revolutionizing
                  <span className="block text-cyan-400">
                    Medical Intelligence
                  </span>
                </motion.h1>

                <motion.p
                  className="mt-6 max-w-3xl mx-auto text-lg text-slate-300 leading-8"
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.6 }}
                >
                  Diagnostic AI is an intelligent medical report platform that
                  enables users to extract text with AI OCR, generate
                  LLM-powered summaries, chat with reports, compare medical
                  documents, and gain AI-driven insights—all in one place.
                </motion.p>
              </motion.div>
            </div>
          </section>

          <section className="max-w-7xl mx-auto px-6 py-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                className="rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl"
                initial={{ opacity: 0, x: -60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-3xl font-bold text-cyan-400">
                  Our Mission
                </h2>

                <p className="mt-6 text-slate-300 leading-8">
                  Our mission is to make medical reports easier to understand
                  through AI-powered OCR, intelligent summaries, document chat,
                  report comparison, and advanced analysis.
                </p>

                <p className="mt-5 text-slate-300 leading-8">
                  We leverage advanced AI technologies to automate medical
                  report understanding through AI OCR, intelligent summaries,
                  document chat, report comparison, and in-depth analysis.
                </p>
              </motion.div>

              <div className="grid grid-cols-2 gap-5">
                {[
                  "AI OCR",
                  "LLM Summary",
                  "Document Chat",
                  "Report Comparison",
                ].map((item, index) => (
                  <motion.div
                    key={item}
                    className="rounded-2xl border border-slate-700 bg-slate-900 p-8 text-center"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.12,
                    }}
                    whileHover={{
                      y: -8,
                      scale: 1.03,
                      borderColor: "rgba(34, 211, 238, 0.5)",
                    }}
                  >
                    <motion.div
                      className="text-4xl mb-4"
                      animate={{
                        rotate: [0, 10, -10, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatDelay: 2,
                      }}
                    >
                      ✦
                    </motion.div>

                    <h3 className="font-semibold text-cyan-400">{item}</h3>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <section className="max-w-7xl mx-auto px-6 py-20">
            <div className="grid md:grid-cols-4 gap-6">
              {[
                ["99%", "OCR Accuracy"],
                ["10K+", "Medical Reports"],
                ["24/7", "AI Availability"],
                ["100%", "Secure Processing"],
              ].map(([value, label], index) => (
                <motion.div
                  key={label}
                  className="rounded-3xl border border-cyan-500/20 bg-cyan-500/5 p-8 text-center"
                  initial={{ opacity: 0, scale: 0.85, y: 30 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.12,
                  }}
                  whileHover={{
                    y: -8,
                    scale: 1.04,
                    borderColor: "rgba(34, 211, 238, 0.5)",
                  }}
                >
                  <motion.h3
                    className="text-5xl font-black text-cyan-400"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.12 + 0.2,
                    }}
                  >
                    {value}
                  </motion.h3>

                  <p className="mt-4 text-slate-300">{label}</p>
                </motion.div>
              ))}
            </div>
          </section>
          <Footer setLoading={setLoading} />
        </div>
      )}
    </>
  );
}
