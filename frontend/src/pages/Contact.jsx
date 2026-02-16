import React from "react";
import { useState } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { motion } from "motion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPhone,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  // handles the value change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // handles the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setFormData({
        name: "",
        email: "",
        message: "",
      });
      alert("please fill the form");
    } else {
      setSubmitLoading(true);
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/user_feedback/",
          formData,
        );
        setFormData({
          name: "",
          email: "",
          message: "",
        });
        alert("feedback submitted");
      } catch {
        console.error("failed to submit");
        alert("failed to submit the feedback");
      }
      setSubmitLoading(false);
    }
  };
  return (
    <>
      <NavBar></NavBar>
      <main className="bg-gradient-to-br from-primary via-blue-600 to-accent grid place-items-center min-h-screen py-16  border pt-35">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true, amount: 0.3 }}
          className=" text-center flex flex-col   md:flex-row justify-between items-center md:space-x-50 space-y-10 md:space-y-0 px-6"
        >
          <div className="text-center md:text-left text-white max-w-md">
            <h1 className="md:text-4xl text-3xl font-extrabold mb-5">
              Get in Touch
            </h1>
            <p className="text-[17px] md:text-lg leading-relaxed mb-8">
              Have questions, feedback, or partnership ideas? We’d love to hear
              from you! Fill out the form or reach us directly through the
              details below.
            </p>

            <div className="space-y-5 text-[17px] md:text-[18px]">
              <div className="flex items-center space-x-3">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="text-white text-xl"
                />
                <span>support@quizizeai.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <FontAwesomeIcon
                  icon={faPhone}
                  className="text-white text-xl"
                />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3">
                <FontAwesomeIcon
                  icon={faLocationDot}
                  className="text-white text-xl"
                />
                <span>Goa, India</span>
              </div>
            </div>
          </div>
          <div className="bg-white pt-10 pb-8 md:pt-12 md:pb-10 pr-8 pl-8 rounded-2xl max-w-md">
            <form action="#" onSubmit={handleSubmit} className="text-center">
              <div>
                <div className="text-left mb-2">
                  <label
                    htmlFor="name"
                    className="capitalize text-gray-700 md:text-[15px] text-[14px]"
                  >
                    your name*
                  </label>
                </div>
                <input
                  className="border  border-gray-500 w-70 h-13 md:w-80 md:h-12 mb-6 rounded-xl pl-3 placeholder:capitalize placeholder:text-[14px]"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="enter your name"
                />
              </div>
              <div>
                <div className="text-left mb-2">
                  <label
                    htmlFor="email"
                    className="capitalize text-gray-700 md:text-[15px] text-[14px]"
                  >
                    your email*
                  </label>
                </div>
                <input
                  className="border  border-gray-500 w-70 h-13 md:w-80 md:h-12 mb-6 rounded-xl pl-3 placeholder:capitalize placeholder:text-[14px]"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="enter your email"
                />
              </div>
              <div>
                <div className="text-left mb-2">
                  <label
                    htmlFor="message"
                    className="capitalize text-gray-700 md:text-[15px] text-[14px]"
                  >
                    your message*
                  </label>
                </div>
                <textarea
                  className="mb-10 w-70 h-30 md:w-80 md:h-35 p-3 border  border-gray-500 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none placeholder:capitalize placeholder:text-[14px]"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="enter your message"
                ></textarea>
              </div>
              <div>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitLoading}
                  className={`font-semibold capitalize border pt-2 pb-2 w-80 mx-auto rounded-xl text-[17px] transition flex items-center justify-center gap-2
                   ${
                     submitLoading
                       ? "bg-cyan-400 cursor-not-allowed text-white border-cyan-400"
                       : "bg-cyan-500 text-white hover:bg-white hover:text-cyan-500 hover:border-cyan-500"
                   }`}
                >
                  {submitLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Submitting...
                    </>
                  ) : (
                    "submit"
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </main>
      <Footer></Footer>
    </>
  );
};
export default Contact;
