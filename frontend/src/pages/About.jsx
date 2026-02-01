import React from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { motion } from "motion/react";

const About = () => {
  return (
    <>
      <NavBar></NavBar>
      <div className="bg-gradient-to-br from-primary  to-accent via-blue-700 min-h-screen flex flex-col items-center justify-center px-6 pt-15 md:py-12">
        <motion.h1
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="md:text-4xl text-3xl font-bold text-white mb-6 text-center capitalize"
        >
          About quizize<span className="text-[#FE9D1B] lowercase">.ai</span>
        </motion.h1>
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="flex-wrap text-[17px] md:text-lg text-white max-w-3xl text-center leading-relaxed ">
            The{" "}
            <span className="font-semibold text-white capitalize">
              quizize<span className="text-[#FE9D1B] lowercase">.ai</span>{" "}
            </span>
            is an intelligent platform that allows users to effortlessly create
            quizzes on any topic using the power of Artificial Intelligence. By
            leveraging advanced natural language processing, the system
            automatically generates well-structured and accurate questions,
            saving users time and effort.
          </p>
          <p className="flex-wrap text-[17px] md:text-lg text-white max-w-3xl text-center leading-relaxed mt-4 ">
            Whether you’re a student preparing for exams, a teacher designing
            assessments, or just someone who loves testing knowledge — this tool
            helps you generate, customize, and take quizzes instantly. Simply
            enter a topic or description, and let the AI do the rest!
          </p>
          <p className=" flex-wrap text-[15px] md:text-md text-white max-w-2xl text-center mt-6 italic">
            Our goal is to make learning interactive, efficient, and fun — one
            quiz at a time.
          </p>
        </motion.div>
      </div>
      <Footer></Footer>
    </>
  );
};
export default About;
