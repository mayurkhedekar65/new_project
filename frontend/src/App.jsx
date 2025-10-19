import { useEffect, useState } from "react";
import Home from "./pages/Home"
import InputBox from "./pages/InputBox";
import SignIn from "./pages/SignIn"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {


  return (
    <>
    <Router>
      <Routes>
           <Route path="/" element={<Home/>} />
           <Route path="/generate" element={<InputBox/>} />
           <Route path="/signin" element={<SignIn/>} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
