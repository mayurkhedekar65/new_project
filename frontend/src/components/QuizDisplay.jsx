import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faCheck } from "@fortawesome/free-solid-svg-icons";

const QuizDisplay = ({ quiz }) => {
  const [copied, setCopied] = useState(false);

  // check if the array is empty or not
  if (!quiz || !Array.isArray(quiz) || quiz.length === 0) {
    return (
      <div className="bg-gradient-to-l from-gray-900 via-gray-700 to-gray-900 p-6 rounded-xl shadow-lg">
        <p className="text-gray-300 text-center capitalize">
          No quiz data available
        </p>
      </div>
    );
  }

  // generate a quiz text to be copied
  const generateQuizText = () => {
    return quiz
      .map((q, index) => {
        const options = Object.keys(q)
          .filter((key) => key.toLowerCase().startsWith("option"))
          .map((opt) => `- ${q[opt]}`)
          .join("\n");

        return `${index + 1}. ${q.question}\n${options}\nCorrect: ${
          q.correct_answer
        }\n`;
      })
      .join("\n");
  };

  // copy's a quiz text on clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateQuizText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <div className="bg-gradient-to-l from-gray-900 via-gray-700 to-gray-900 text-cyan-500 p-6 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Generated Quiz</h3>
        <button
          onClick={handleCopy}
          className="text-cyan-400 hover:text-cyan-300 transition text-xl"
          title="Copy Quiz"
        >
          <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
        </button>
      </div>

      {quiz.map((q, index) => (
        <div key={index} className="mb-6 border-b border-cyan-500 pb-4">
          <p className="font-semibold mb-2 text-gray-200">
            {index + 1}. {q.question}
          </p>

          <ul className="space-y-1 ml-4 list-disc text-gray-300">
            {Object.keys(q)
              .filter((key) => key.toLowerCase().startsWith("option"))
              .map((opt, i) => (
                <li key={i}>{q[opt]}</li>
              ))}
          </ul>

          <p className="text-sm text-green-300 mt-2">
            ✅ Correct: {q.correct_answer}
          </p>
        </div>
      ))}
    </div>
  );
};

export default QuizDisplay;
