import React from "react";

const QuizDisplay = ({questions}) => {
  
  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6">
      {questions.map((q, index) => (
        <div
          key={index}
          className="p-6 bg-white rounded-lg shadow-md border border-gray-200"
        >
          <h2 className="text-lg font-semibold mb-4">
            {index + 1}. {q.question}
          </h2>
          <ul className="list-decimal list-inside space-y-2">
            {Object.keys(q)
              .filter((key) => key.startsWith("option"))
              .map((key, idx) => (
                <li key={idx} className="text-gray-700">
                  {q[key]}
                </li>
              ))}
          </ul>
          <ul className="list-decimal list-inside space-y-2 text-color font-bold text-green-400 mt-3">
                     <span className="text-black capitalize">answer : </span>{q.correct_answer}
                    </ul>
        </div>
      ))}
    </div>
  );
};

export default QuizDisplay;
