import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faListCheck,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "motion/react";
import axios from "axios";
import QuizDisplay from "../components/QuizDisplay";

const InputBox = () => {
  const [textData, setTextData] = useState({ text_data: "", num_of_questions: "", file: "" });
  const [quizData, setQuizData] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [selectedText, setSelectedText] = useState("");
  const [viewMode, setViewMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/get_user_data/user_data/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          },
        );
        setQuizData(response.data.user_data);
      } catch (error) {
        console.error("failed to fetch user data", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "file") {
      setTextData({ ...textData, file: e.target.files[0] });
    } else {
      setTextData({ ...textData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("please login to generate a quiz");
    }
    else {
      if (!textData.text_data && !textData.file) {
        alert("please enter the text or select a pdf/doc file !");
        return;
      }
      if(textData.text_data && textData.file){
        alert("please either enter the text or select a pdf/doc file !");
        return; 
      }
      if (!textData.num_of_questions) {
        alert("please select the quiz count !")
        return
      }
      if (!textData.text_data && textData.file || textData.text_data && !textData.file) {
        setLoading(true);
        try {
          const formData = new FormData();

          formData.append("text_data", textData.text_data);
          formData.append("num_of_questions", textData.num_of_questions);

          if (textData.file) {
            formData.append("file", textData.file);
          }
          const response = await axios.post(
            "http://127.0.0.1:8000/generate_quiz/",
            formData,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              },
            },
          );

          const newQuizItem = {
            id: Date.now(),
            user_input: response.data.user_input,
            generated_quiz: response.data.generated_quiz_data.generated_quiz,
          };

          setQuizData((prev) => [newQuizItem, ...prev]);
          setSelectedQuiz(newQuizItem.generated_quiz);
          setSelectedText(newQuizItem.user_input);
          setViewMode(true);
          setTextData({ text_data: "", num_of_questions: "", file: "" });
          alert("quiz generated successfully");
        } catch (error) {
          console.error("failed to generate quiz's", error);
        }
        setLoading(false);
      }
    }
  };

  return (
    <>
      {/* <NavBar></NavBar> */}
      {!sidebarOpen && token && (
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true, amount: 0.3 }}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed top-10 left-4 z-50 bg-primary text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faListCheck} />
          Your Texts
        </motion.button>
      )}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        onClick={(e) => e.stopPropagation()}
        className={`fixed top-0 left-0 h-full w-80 bg-gradient-to-b from-primary to-blue-700 text-white shadow-2xl transform transition-transform duration-300 z-50 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="p-5 flex justify-between items-center border-b bg-cyan-500 border-white/20">
          <h2 className="text-xl font-bold capitalize">history</h2>
          <button onClick={() => setSidebarOpen(false)}>✕</button>
        </div>

        <div className="p-4 space-y-3 overflow-y-auto h-[calc(100%-70px)]">
          {quizData.map((item) => (
            <div
              key={item.id}
              className="bg-gradient-to-l from-gray-900 via-gray-800 to-gray-900 text-gray-200 rounded-lg p-3 cursor-pointer hover:scale-[1.02] transition"
              onClick={() => {
                setSelectedText(item.user_input);

                const quiz =
                  item.generated_quiz ||
                  item.llm_response?.generated_quiz ||
                  [];

                setSelectedQuiz(quiz);
                setViewMode(true);
                setSidebarOpen(false);
              }}
            >
              {item.user_input.slice(0, 60)}...
            </div>
          ))}
        </div>
      </div>

      <section className="bg-gradient-to-br from-primary to-accent via-blue-700 py-35 ">
        <div className={`max-w-4xl mx-auto px-3 ${sidebarOpen ? "ml-80" : ""}`}>
          {viewMode && (
            <button
              onClick={() => {
                setViewMode(false);
                setSelectedQuiz(null);
                setSelectedText("");
              }}
              className="mb-4 bg-cyan-500 text-white border px-4 py-1 rounded shadow"
            >
              ← Create New Quiz
            </button>
          )}

          {!viewMode && (
            <>
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
                  <div className="flex-col justify-start items-center gap-x-5">
                    <div>
                      <select
                        className="border bg-white border-gray-300 md:text-[14px] text-[13px] w-75 h-10 md:w-37 md:h-10 mb-6 rounded-xl pl-3 placeholder:capitalize placeholder:text-[10px] text-gray-700"
                        name="num_of_questions"
                        id=""
                        onChange={handleChange}
                        value={textData.num_of_questions}
                      >
                        {" "}
                        <option className="capitalize text-gray-700" value="" disabled>
                          Select Quiz Count
                        </option>
                        <option value="5">5 Questions</option>
                        <option value="10">10 Questions</option>
                        <option value="15">15 Questions</option>
                        <option value="20">20 Questions</option>
                      </select>
                    </div>
                    <div>
                      <input className="border-2 border-gray-300 placeholder:text-gray-300 px-2 py-2 rounded-xl text-[14px] mb-4" type="file" name="file" onChange={handleChange} />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className={`w-full py-2 rounded-lg md:text-[17px] text-[16px] font-semibold transition-colors text-white
                border border-cyan-500
                ${loading
                        ? "bg-cyan-400 cursor-not-allowed"
                        : "bg-cyan-500 hover:bg-white hover:text-cyan-500 hover:border hover:rounded-lg"
                      }
               `}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin text-white"></span>
                        Generating...
                      </span>
                    ) : (
                      <>
                        <FontAwesomeIcon
                          icon={faWandMagicSparkles}
                          className="mr-2"
                        />
                        Generate Quiz
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            </>
          )}

          {viewMode && (
            <div className="space-y-6">
              <div className="bg-gradient-to-l from-gray-900 via-gray-700 to-gray-900 text-cyan-500 p-6 rounded-xl shadow">
                <h3 className="font-bold text-lg mb-3">Your Text</h3>
                <p className="whitespace-pre-line text-gray-200">
                  {selectedText}
                </p>
              </div>

              {viewMode && selectedQuiz && <QuizDisplay quiz={selectedQuiz} />}
            </div>
          )}
        </div>
      </section>

      {/* <Footer></Footer> */}
    </>
  );
};

export default InputBox;
