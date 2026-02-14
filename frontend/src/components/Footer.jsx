import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import image from "../assets/logo.png";
import { motion } from "motion/react";

const Footer = () => {
  const navigate = useNavigate();
  const [loading, setloadervalue] = useState(false);
  const activateLoaderthree = () => {
    setloadervalue(true);
    setTimeout(() => {
      setloadervalue(false);
      navigate("/contact");
    }, 1500);
  };

  const activateLoaderfour = () => {
    setloadervalue(true);
    setTimeout(() => {
      setloadervalue(false);
      navigate("/about");
    }, 1500);
  };
  return (
    <>
      {loading && <Loader />}
      <footer id="footer" className="bg-gray-900 text-white py-12">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true, amount: 0.2 }}
          className="max-w-7xl mx-auto px-6"
        >
          <div className="flex flex-col sm:flex-wrap md:flex-row  justify-around items-start gap-6  md:gap-50">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img className="md:h-8 h-7" src={image} alt="" />
              </div>
              <p className="text-gray-400 text-sm">
                Create engaging quizzes instantly with the power of artificial
                intelligence.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className=" text-sm text-gray-400  flex flex-col space-y-2">
                <li>
                  <button
                    className="hover:text-white transition-colors cursor-pointer"
                    onClick={activateLoaderthree}
                  >
                    Contact
                  </button>
                </li>
                <li>
                  <button
                    className="hover:text-white transition-colors cursor-pointer"
                    onClick={activateLoaderfour}
                  >
                    About
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400 capitalize">
            <p>
              © 2025 quizize<span className="lowercase">.ai</span> All rights
              reserved.
            </p>
          </div>
        </motion.div>
      </footer>
    </>
  );
};
export default Footer;
