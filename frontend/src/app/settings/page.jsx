"use client";

import Sidebar from "@/components/Sidebar";
import Loader from "@/components/Loader";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import axios from "axios";

export default function Page() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "",
    age: "",
  });

  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name) {
      alert("Please enter your name!");
      return;
    }

    if (!formData.email) {
      alert("Please enter your email!");
      return;
    }

    try {
      const response = await axios.put(
        "http://127.0.0.1:8000/auth/update-profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      );

      alert(response.data.message);
    } catch (error) {
      console.log(error);
      alert("Profile updation failed!");
    }
  };

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

      setFormData(response.data.user_profile_data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteProfile = async () => {
    try {
      const response = await axios.delete("http://127.0.0.1:8000/auth/delete", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      localStorage.removeItem("access_token");
      localStorage.removeItem("user_name");

      alert(response.data.message);

      router.push("/delete-profile-success");
    } catch (error) {
      console.log(error);
      alert("Profile deletion failed!");
    }
  };

  useEffect(() => {
    getUserData();

    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <motion.div
      className="min-h-screen flex bg-slate-950 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Sidebar />

      <main className="flex-1 lg:ml-72 flex flex-col min-h-screen">
        <motion.div
          className="max-w-5xl mx-auto w-full p-8 space-y-10 flex-1 mt-7"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <motion.span
            className="inline-flex rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-300 mb-7"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            Patient Details
          </motion.span>

          <motion.div
            className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit}>
              <div className="border-b border-slate-800/60 p-8">
                <motion.h2
                  className="text-2xl font-bold text-white"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  Profile Settings
                </motion.h2>

                <motion.p
                  className="text-base text-slate-400 mt-2"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  Manage your account information and preferences.
                </motion.p>
              </div>

              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                  >
                    <label className="block text-base font-semibold text-slate-300 mb-2">
                      Full Name
                    </label>

                    <input
                      type="text"
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-lg text-white outline-none focus:border-cyan-400 transition-all"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                  >
                    <label className="block text-base font-semibold text-slate-300 mb-2">
                      Email Address
                    </label>

                    <input
                      type="email"
                      required
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-lg text-white outline-none focus:border-cyan-400 transition-all"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                  >
                    <label className="block text-base font-semibold text-slate-300 mb-2">
                      Gender
                    </label>

                    <input
                      type="text"
                      required
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-lg text-white outline-none focus:border-cyan-400 transition-all"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                  >
                    <label className="block text-base font-semibold text-slate-300 mb-2">
                      Age
                    </label>

                    <input
                      type="text"
                      required
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-lg text-white outline-none focus:border-cyan-400 transition-all"
                    />
                  </motion.div>
                </div>
              </div>

              <div className="bg-slate-950/40 px-8 py-5 border-t border-slate-800/60 flex justify-end gap-4">
                <motion.button
                  type="button"
                  className="px-6 py-2.5 text-base font-bold text-slate-400 hover:text-white rounded-xl transition-colors"
                  onClick={deleteProfile}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Delete Account
                </motion.button>

                <motion.button
                  type="submit"
                  className="px-6 py-2.5 text-base font-bold text-slate-900 bg-cyan-500 hover:bg-cyan-400 rounded-xl transition-colors shadow-lg shadow-cyan-500/10"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Save Changes
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </main>
    </motion.div>
  );
}
