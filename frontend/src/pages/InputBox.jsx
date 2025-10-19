import React from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faListCheck,
  faToggleOn,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";

const InputBox = () => {
  return (
    <>
    <NavBar></NavBar>
      <section id="create-quiz-section" className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Create Your Quiz
            </h2>
            <p className="text-gray-600">
              Enter your content and let our AI generate engaging questions
            </p>
          </div>

          <div
            id="quiz-creator-card"
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-8"
          >
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Enter your Topic or Paste your Text here
              </label>
              <textarea
                className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                placeholder="Type a topic like 'World War II' or paste your text content here..."
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
            </div>
            <button className="w-full bg-accent bg-cyan-500 text-white py-4 rounded-lg text-lg font-semibold transition-colors">
              <FontAwesomeIcon icon={faWandMagicSparkles} className="mr-2" />
              Generate Quiz
            </button>
          </div>
        </div>
      </section>
      <Footer></Footer>
    </>
  );
};

export default InputBox;
