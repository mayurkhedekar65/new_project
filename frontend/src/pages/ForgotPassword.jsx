import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  const showSignIn = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/signin");
    }, 1500);
  };

  const showSignUp = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/signup");
    }, 1500);
  };

  // handles the value change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // handles the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      alert("please enter your email id.");
    } else {
      setSubmitLoading(true);
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/password/forgot_password/",
          formData,
        );
        alert("reset link generated.");
        setFormData({
          email: "",
        });
      } catch {
        console.error("error in submitting form");
        alert("email not found");
      }
      setSubmitLoading(false);
    }
  };
  return (
    <>
      {loading && <Loader />}
      {!loading && (
        <div className="bg-gradient-to-br from-primary  to-accent via-blue-700 min-h-screen flex items-center justify-center px-4">
          <div className="relative w-full max-w-md bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <div className="flex flex-col items-center mb-6">
              <h2 className="md:text-[28px] text-[26px] font-bold text-black">
                Forgot Password
              </h2>
              <p className="md:text-[15px] text-[14px] text-gray-500 mt-1 text-center">
                Enter your email to receive reset instructions
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="md:text-[15px] text-[14px] text-gray-700">
                  Email Address*
                </label>
                <input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  value={formData.email}
                  placeholder="Enter your email"
                  className="mt-1 block w-full px-3 py-2 border border-gray-500 rounded-lg  focus:ring-1 "
                />
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitLoading}
                className={`font-semibold capitalize border pt-2 pb-2 w-96 mx-auto rounded-xl text-[17px] transition flex items-center justify-center gap-2
                   ${
                     submitLoading
                       ? "bg-cyan-400 cursor-not-allowed text-white border-cyan-400"
                       : "bg-cyan-500 text-white hover:bg-white hover:text-cyan-500 hover:border-cyan-500"
                   }`}
              >
                {submitLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Sending the link...
                  </>
                ) : (
                  "send the link"
                )}
              </button>
            </form>
            <div className="flex justify-center items-center gap-x-1.5 text-[15px]">
              <p
                onClick={showSignIn}
                className="text-center text-[15px] text-gray-600 mt-6"
              >
                Remembered your password?{" "}
                <a className="text-blue-600 font-semibold hover:underline hover:text-cyan-500">
                  Sign in
                </a>
              </p>
              <p
                onClick={showSignUp}
                className="text-center text-sm text-gray-600 mt-6"
              >
                or{" "}
                <a className="text-blue-600 font-semibold hover:underline hover:text-cyan-500">
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ForgotPassword;
