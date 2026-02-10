import React from "react";

const QuizDisplay = ({ quiz }) => {

  if (!quiz || !Array.isArray(quiz) || quiz.length === 0) {
    return (
      <div className="bg-gradient-to-l from-gray-900 via-gray-700 to-gray-900  p-6 rounded-xl shadow-lg">
        <p className="text-gray-300 text-center capitalize">No quiz data available</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-l from-gray-900 via-gray-700 to-gray-900 
 text-cyan-500 p-6 rounded-xl shadow-lg">
      <h3 className="text-xl text-cyan-500 font-bold mb-6 text-primary">Generated Quiz</h3>

      {quiz.map((q, index) => (
        <div key={index} className="mb-6 border-b border-cyan-500 pb-4">
          <p className="font-semibold mb-2 text-gray-200 ">
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
