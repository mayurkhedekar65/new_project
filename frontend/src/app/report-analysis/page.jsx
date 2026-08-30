"use client";

import Sidebar from "@/components/Sidebar";
import Loader from "@/components/Loader";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import axios from "axios";

export default function ReportAnalysisPage() {
  const [profile, setProfile] = useState({});
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getUserData = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/auth/get-profile",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      );

      setProfile(response.data.user_profile_data);
    } catch (error) {
      console.log(error);
    }
  };

  const getReportData = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/analysis/get-reports",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      );

      setReport(response.data.latest_report);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
    getReportData();
  }, []);

  setTimeout(() => {
    setLoading(false);
  }, 2000);

  if (loading) {
    return <Loader />;
  }

  if (!report) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="min-h-screen bg-slate-950 text-white flex items-center justify-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
          className="text-red-400"
        >
          Failed to load report.
        </motion.p>
      </motion.div>
    );
  }

  if (report.length === 0) {
    return (
      <motion.div
        className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900/70 p-10 text-center shadow-xl"
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <motion.div
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.2,
              type: "spring",
              stiffness: 200,
            }}
          >
            <svg
              className="h-8 w-8 text-cyan-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.7}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h4m-7 4h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z"
              />
            </svg>
          </motion.div>

          <motion.h1
            className="text-2xl font-semibold text-white"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            Upload a Report
          </motion.h1>

          <motion.p
            className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-400"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            At least one medical report is required to generate your report
            analysis.
          </motion.p>

          <motion.button
            onClick={() => router.push("/document-chat")}
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-6 py-3 text-sm font-medium text-slate-300 transition hover:border-cyan-500/50 hover:bg-slate-700 hover:text-cyan-400"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Go Back
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-slate-950 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Sidebar />

      <main className="flex-1 lg:ml-72 flex flex-col min-h-screen">
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="mt-6 mb-8 text-lg"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-300">
                Patient Details
              </span>

              <h1 className="mt-4 text-3xl font-bold">{profile.name}</h1>

              <p className="mt-2 text-slate-400">
                {profile.gender} • {profile.age} Years • Email ID:{" "}
                {profile.email}
              </p>
            </motion.div>

            {report.map((currentReport, reportIndex) => {
              const labResults = [
                {
                  name: "Hemoglobin",
                  value: currentReport.hemoglobin,
                  unit: "g/dL",
                },
                {
                  name: "WBC Count",
                  value: currentReport.wbc_count,
                  unit: "cells/µL",
                },
                {
                  name: "Platelet Count",
                  value: currentReport.platelet_count,
                  unit: "cells/µL",
                },
                {
                  name: "Blood Sugar",
                  value: currentReport.blood_sugar,
                  unit: "mg/dL",
                },
                {
                  name: "HbA1c",
                  value: currentReport.hba1c,
                  unit: "%",
                },
                {
                  name: "Total Cholesterol",
                  value: currentReport.total_cholesterol,
                  unit: "mg/dL",
                },
                {
                  name: "HDL Cholesterol",
                  value: currentReport.hdl_cholesterol,
                  unit: "mg/dL",
                },
                {
                  name: "LDL Cholesterol",
                  value: currentReport.ldl_cholesterol,
                  unit: "mg/dL",
                },
                {
                  name: "Triglycerides",
                  value: currentReport.triglycerides,
                  unit: "mg/dL",
                },
                {
                  name: "Creatinine",
                  value: currentReport.creatinine,
                  unit: "mg/dL",
                },
                {
                  name: "eGFR",
                  value: currentReport.egfr,
                  unit: "mL/min/1.73m²",
                },
                {
                  name: "AST (SGOT)",
                  value: currentReport.ast_sgot,
                  unit: "U/L",
                },
                {
                  name: "ALT (SGPT)",
                  value: currentReport.alt_sgpt,
                  unit: "U/L",
                },
                {
                  name: "TSH",
                  value: currentReport.tsh,
                  unit: "mIU/L",
                },
                {
                  name: "Vitamin D",
                  value: currentReport.vitamin_d,
                  unit: "ng/mL",
                },
              ];

              return (
                <motion.div
                  key={currentReport.id || reportIndex}
                  className="mb-8"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: reportIndex * 0.15,
                    ease: "easeOut",
                  }}
                >
                  <div className="grid gap-6 lg:grid-cols-1">
                    <motion.div
                      className="rounded-2xl border border-slate-700 bg-slate-900 p-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: reportIndex * 0.15 + 0.1,
                      }}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <span className="inline-flex rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-300">
                            Report {reportIndex + 1}
                          </span>

                          <h2 className="mt-3 text-xl font-semibold text-white">
                            {currentReport.file_name}
                          </h2>
                        </div>

                        <span className="text-sm text-slate-500">
                          {currentReport.upload_date}
                        </span>
                      </div>

                      <h2 className="mb-4 text-2xl font-semibold text-cyan-400">
                        AI Generated Report Summary
                      </h2>

                      <p className="leading-7 text-slate-400 text-justify text-lg">
                        {currentReport.summary || "No summary available."}
                      </p>

                      <div className="mt-8">
                        <h3 className="mb-4 text-xl font-semibold text-white">
                          Key Findings
                        </h3>

                        {currentReport.key_findings?.length > 0 ? (
                          <ul className="space-y-3">
                            {currentReport.key_findings.map(
                              (finding, index) => (
                                <li
                                  key={index}
                                  className="flex items-start gap-3 rounded-xl border border-slate-700 bg-slate-800/50 p-4 text-slate-300"
                                >
                                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-xs text-cyan-400">
                                    ✓
                                  </span>

                                  <span>{finding}</span>
                                </li>
                              ),
                            )}
                          </ul>
                        ) : (
                          <p className="text-slate-500">
                            No key findings available.
                          </p>
                        )}
                      </div>

                      <div className="mt-8">
                        <h3 className="mb-4 text-xl font-semibold text-white">
                          Recommendations
                        </h3>

                        {currentReport.recommendations?.length > 0 ? (
                          <ul className="space-y-3">
                            {currentReport.recommendations.map(
                              (recommendation, index) => (
                                <li
                                  key={index}
                                  className="flex items-start gap-3 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 text-slate-300"
                                >
                                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-xs text-blue-400">
                                    →
                                  </span>

                                  <span>{recommendation}</span>
                                </li>
                              ),
                            )}
                          </ul>
                        ) : (
                          <p className="text-slate-500">
                            No recommendations available.
                          </p>
                        )}
                      </div>

                      <div className="mt-8">
                        <h3 className="mb-4 text-xl font-semibold text-white">
                          Follow Up
                        </h3>

                        {currentReport.follow_up?.length > 0 ? (
                          <ul className="space-y-3">
                            {currentReport.follow_up.map((item, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-slate-300"
                              >
                                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-xs text-amber-400">
                                  !
                                </span>

                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-slate-500">
                            No follow-up required.
                          </p>
                        )}
                      </div>
                    </motion.div>
                  </div>

                  <motion.div
                    className="mt-6 rounded-2xl border border-slate-700 bg-slate-900 p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: reportIndex * 0.15 + 0.2,
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold">Lab Results</h2>

                      <span className="text-sm text-slate-500">
                        Report {reportIndex + 1}
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-slate-300 text-lg">
                        <thead className="border-b border-slate-700 text-slate-400">
                          <tr>
                            <th className="py-3 text-left">Test</th>

                            <th className="py-3 text-center">Value</th>

                            <th className="py-3 text-center">Unit</th>
                          </tr>
                        </thead>

                        <tbody>
                          {labResults.map((lab, index) => (
                            <motion.tr
                              key={lab.name}
                              className={
                                index !== labResults.length - 1
                                  ? "border-b border-slate-800"
                                  : ""
                              }
                              initial={{ opacity: 0, x: -15 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                duration: 0.3,
                                delay: reportIndex * 0.15 + index * 0.04,
                              }}
                            >
                              <td className="py-4 font-medium text-slate-200">
                                {lab.name}
                              </td>

                              <td className="py-4 text-center">
                                {lab.value !== null && lab.value !== undefined
                                  ? lab.value
                                  : "N/A"}
                              </td>

                              <td className="py-4 text-center text-slate-500">
                                {lab.unit}
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>
    </motion.div>
  );
}
