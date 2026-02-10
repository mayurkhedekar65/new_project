import React, { useState } from "react";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import axios from "axios";

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setloadervalue] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formData, setFormData] = useState({
    customer_email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customer_email || !formData.password) {
      alert("please fill the form");
    }
    if (formData.password !== confirmPassword) {
      alert("password does not match");
    } else {
      setSubmitLoading(true);
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/user_form/user_signup/",
          formData,
        );
        setFormData({
          customer_email: "",
          password: "",
        });
        setConfirmPassword("");
        alert(response.data.message);
      } catch {
        alert("failed to signup");
      }
      setSubmitLoading(false);
    }
  };
  const activateLoader = () => {
    setloadervalue(true);
    setTimeout(() => {
      setloadervalue(false);
      navigate("/signin");
    }, 1500);
  };
  return (
    <>
      {loading && <Loader />}
      <main className="bg-gradient-to-br from-primary via-blue-600 to-accent grid place-items-center h-screen border">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-12"
        >
          <div className=" bg-white text-center  pt-8 pb-8  md:pt-10 md:pb-10 pr-8 pl-8 rounded-2xl">
            <h3 className="capitalize md:text-[28px] text-[26px] mb-5 text-black font-bold">
              sign up
            </h3>
            <form action="#" onSubmit={handleSubmit} className="text-center">
              <div>
                <div className="text-left mb-2">
                  <label
                    htmlFor="email"
                    className="capitalize text-gray-700 md:text-[15px] text-[14px]"
                  >
                    email*
                  </label>
                </div>
                <input
                  name="customer_email"
                  className="border  border-gray-500 w-70 h-13 md:w-80 md:h-12 mb-6 rounded-xl pl-3 placeholder:capitalize placeholder:text-[14px]"
                  value={formData.customer_email}
                  onChange={handleChange}
                  type="text"
                  placeholder="enter the email"
                />
              </div>
              <div>
                <div className="text-left mb-2">
                  <label
                    htmlFor="password"
                    className="capitalize text-gray-700 md:text-[15px] text-[14px]"
                  >
                    password*
                  </label>
                </div>
                <div className="relative">
                  <input
                    name="password"
                    className="border  border-gray-500 w-70 h-13 md:w-80 md:h-12 mb-6 rounded-xl pl-3 placeholder:capitalize placeholder:text-[14px]"
                    value={formData.password}
                    onChange={handleChange}
                    type={showPassword ? "text" : "password"}
                    placeholder="enter the password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/3 -translate-y-1/2 text-sm text-gray-700 font-sans"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              <div>
                <div className="text-left mb-2">
                  <label
                    htmlFor="confirm password"
                    className="capitalize text-gray-700 md:text-[15px] text-[14px]"
                  >
                    confirm password*
                  </label>
                </div>
                <div className="relative">
                  <input
                    className="border  border-gray-500 w-70 h-13 md:w-80 md:h-12 mb-10 rounded-xl pl-3 placeholder:capitalize placeholder:text-[14px]"
                    type={showConfirmPassword ? "text" : "password"}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    value={confirmPassword}
                    placeholder="enter the confirm password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/4 -translate-y-1/2 text-sm text-gray-700 font-sans"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              <div>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitLoading}
                  className={`font-semibold capitalize border pt-2 pb-2 w-72 mx-auto rounded-xl text-[17px] transition flex items-center justify-center gap-2
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
                    "Submit"
                  )}
                </button>
              </div>
              <div className="flex justify-center items-center gap-2 capitalize mt-5 text-[15px]">
                <div>
                  <p>already have an account ?</p>
                </div>
                <div>
                  <button
                    type="button"
                    className="hover:text-cyan-500 capitalize text-blue-600"
                    onClick={activateLoader}
                  >
                    signin
                  </button>
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      </main>
    </>
  );
};
export default SignUp;
