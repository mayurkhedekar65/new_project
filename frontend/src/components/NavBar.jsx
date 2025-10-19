import React,{useState} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBrain } from "@fortawesome/free-solid-svg-icons";
import {useNavigate} from "react-router-dom"
import Loader from "./Loader";

const NavBar = () => {
   const navigate = useNavigate();
    const [loading, setloadervalue] = useState(false);
    const activateLoader = () => {
      setloadervalue(true);
      setTimeout(() => {
        setloadervalue(false);
        navigate("/signin");
      }, 1500);
    };
  return (
    <> 
      {loading && <Loader/>}
      <header
        id="header"
        className="bg-white shadow-sm border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faBrain} className="mr-2" />
            </div>
            <h1 className="md:text-xl text-lg font-bold text-gray-900">
              AI Quiz Generator
            </h1>
          </div>
          <nav className="flex items-center space-x-8">
            <span className="text-gray-600 hover:text-primary transition-colors cursor-pointer">
              Contact
            </span>
            <span className="text-gray-600 hover:text-primary transition-colors cursor-pointer">
              About
            </span>
            <button className="px-4 py-2 text-primary border border-primary rounded-lg bg-primary  transition-all" onClick={activateLoader}>
              Sign In
            </button>
            <button className="px-4 py-2 bg-primary text-white rounded-lg bg-blue-700 transition-colors">
              Sign Up
            </button>
          </nav>
        </div>
      </header>
    </>
  );
};

export default NavBar;
