import React, { useState } from "react";
import axios from "axios";
const SetNewPassword = () => {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPasssword, setNewPasssword] = useState("");
  const params = new URLSearchParams(window.location.search);
  const uid = params.get("uid");
  const token = params.get("token");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // handles the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPasssword || !confirmPassword) {
      alert("please enter the password ");
    } else {
      if (newPasssword != confirmPassword) {
        alert("password reset successfully");
      } else {
        setSubmitLoading(true);

        try {
          const response = await axios.post(
            "http://127.0.0.1:8000/password/reset_password/",
            {
              uid,
              token,
              newpassword: newPasssword,
            },
          );
          setNewPasssword("");
          setConfirmPassword("");
          alert("password reset successfully.");
        } catch {
          console.error("reset link expired.");
        }
      }
      setSubmitLoading(false);
    }
  };
  return (
    <>
      <div className="bg-gradient-to-br from-primary  to-accent via-blue-700  min-h-screen flex items-center justify-center px-4">
        <div className="relative w-full max-w-md bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          <div className="flex flex-col items-center mb-6">
            <h2 className="md:text-[28px] text-[26px] font-bold text-black">
              Reset The Password
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="md:text-[15px] text-[14px] capitalize  text-gray-700">
                new password*
              </label>
              <div className="relative">
                <input
                  name="new_passsword"
                  onChange={(e) => setNewPasssword(e.target.value)}
                  value={newPasssword}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="mt-1 block w-full px-3 py-2 border border-gray-500  rounded-lg  focus:ring-1 "
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-700 font-sans"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div>
              <label className="md:text-[15px] text-[14px] capitalize  text-gray-700">
                confirm password*
              </label>
              <div className="relative">
                <input
                  name="confirm_password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="confirm the password"
                  className="mt-1 mb-8 block w-full px-3 py-2 border border-gray-500 rounded-lg focus:ring-1 "
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-700 font-sans"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
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
                  setting a password...
                </>
              ) : (
                "set a password"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
export default SetNewPassword;
