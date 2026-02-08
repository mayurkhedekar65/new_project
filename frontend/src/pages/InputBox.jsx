import React, { useState } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faListCheck,
  faToggleOn,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "motion/react";
import axios from "axios";
import QuizDisplay from "../components/QuizDisplay";

const InputBox = () => {
  const [textData, setTextData] = useState({
    text_data: "",
  });
  const [quizData, setQuizData] = useState(null || []);
  const handleChange = (e) => {
    setTextData({ ...textData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!textData) {
      alert("please enter the text !");
    } else {
      try {
        const response = await axios.post(
          `http://127.0.0.1:8000/generate_quiz/`,
          textData,
        );
        setQuizData(response.data.generated_quiz);
        setTextData({
          text_data: "",
        });
        alert("form submitted");
      } catch {
        console.error("failed to generate quiz's");
      }
    }
  };
  return (
    <>
      <NavBar></NavBar>
      <section
        id="create-quiz-section"
        className="py-16 bg-gradient-to-br from-primary  to-accent via-blue-700 pt-35 "
      >
        <div className="max-w-4xl mx-auto px-3">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Create Your Quiz
            </h2>
            <p className="text-white text-[15px] md:text-[16px]">
              Enter your content and let our AI generate engaging questions
            </p>
          </motion.div>
          {console.log(quizData)}
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            viewport={{ once: true }}
            id="quiz-creator-card"
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
          >
            <form action="#" onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-[15px] md:text-[16px] font-semibold text-gray-700 mb-3">
                  Enter your Topic or Paste your Text here
                </label>
                <textarea
                  name="text_data"
                  onChange={handleChange}
                  value={textData.text_data}
                  className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none placeholder:text-[15px] md:text-[16px]"
                  placeholder="Type a topic like 'World War II' or paste your text content here..."
                ></textarea>
              </div>

              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Quiz Type
                </label>
                <div className="flex space-x-3">
                  <button className="flex-1 py-3 px-4 border-2 border-primary bg-primary text-white rounded-lg font-medium">
                    <FontAwesomeIcon icon={faListCheck} className="mr-2" />
                    Multiple Choice
                  </button>
                  <button className="flex-1 py-3 px-4 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:border-primary hover:text-primary transition-colors">
                    <FontAwesomeIcon icon={faToggleOn} className="mr-2" />
                    True/False
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Number of Questions
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="5"
                    max="20"
                    value="10"
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  ></input>
                  <div className="w-12 h-12 bg-primary text-white rounded-lg flex items-center justify-center font-bold">
                    10
                  </div>
                </div>
              </div>
            </div> */}
              <button className="hover:bg-white hover:border-cyan-500 hover:border  hover:rounded-lg  hover:text-cyan-500 w-full  bg-accent border border-cyan-500 bg-cyan-500 text-white py-2 rounded-lg md:text-[17px] text-[16px] font-semibold transition-colors">
                <FontAwesomeIcon icon={faWandMagicSparkles} className="mr-2" />
                Generate Quiz
              </button>
            </form>
            <QuizDisplay questions={quizData} />
          </motion.div>
        </div>
      </section>
      <Footer></Footer>
    </>
  );
};

export default InputBox;
