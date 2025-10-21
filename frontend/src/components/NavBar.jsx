import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBrain, faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import image from "../assets/ChatGPT Image Oct 21, 2025, 06_18_51 PM-Photoroom.png";

const NavBar = () => {
  const navigate = useNavigate();
  const [loading, setLoaderValue] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const activateLoader = (path) => {
    setLoaderValue(true);
    setTimeout(() => {
      setLoaderValue(false);
      navigate(path);
      setMenuOpen(false); // Close menu after navigation
    }, 1500);
  };

  return (
    <>
      {loading && <Loader />}
  
      
      <header className="bg-gradient from-primary  to-accent  shadow-sm fixed top-0 left-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button onClick={() => navigate("/")}>
              <div className="rounded-lg flex items-center justify-around gap-2 hover:opacity-70">
                <img className="md:h-10  h-8" src={image} alt="" />
              </div>
            </button>
          </div>

          <div className="md:hidden">
            <FontAwesomeIcon
              icon={menuOpen ? faXmark : faBars}
              className="text-2xl text-white cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
            />
          </div>

          <nav
            className={`${
              menuOpen
                ? "flex flex-col absolute  top-16 left-0 w-full bg-gradient-to-b from-primary via-blue-600 shadow-md py-4 space-y-4 items-center"
                : "hidden"
            } md:flex md:space-x-8 md:static md:flex-row md:justify-center md:items-center md:space-y-0 md:bg-transparent md:shadow-none`}
          >
            <button
              className="hover:text-gray-400 hover:text-primary text-white cursor-pointer transition-colors "
              onClick={() => activateLoader("/contact")}
            >
              Contact
            </button>
            <button
              className="hover:text-gray-400 hover:text-primary text-white cursor-pointer transition-colors"
              onClick={() => activateLoader("/about")}
            >
              About
            </button>
            <button
              className="px-41 py-2 md:px-4 md:py-2 bg-cyan-500 border border-white text-white rounded-lg hover:bg-primary hover:border hover:bg-white hover:rounded-lg hover:border-blue-700  hover:text-blue-700 transition-all"
              onClick={() => activateLoader("/signin")}
            >
              Sign In
            </button>
            <button
              className="px-40 py-2 md:px-4 md:py-2 bg-blue-700 text-white rounded-lg hover:border hover:text-cyan-500 hover:bg-white hover:border-cyan-500 hover:rounded-lg hover-border-black border transition-all"
              onClick={() => activateLoader("/signup")}
            >
              Sign Up
            </button>
          </nav>
        </div>
      </header>
    </>
  );
};

export default NavBar;
