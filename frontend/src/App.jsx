import Home from "./pages/Home"
import InputBox from "./pages/InputBox";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Contact from "./pages/Contact";
import About from "./pages/About";
import ForgotPassword from "./pages/ForgotPassword";
import SetNewPassword from "./pages/SetNewPassword";
import Profile from "./components/Profile";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {


  return (
    <>
    <Router>
      <Routes>
           <Route path="/" element={<Home/>} />
           <Route path="/generatequiz" element={<InputBox/>} />
           <Route path="/signin" element={<SignIn/>} />
           <Route path="/signup" element={<SignUp/>} />
           <Route path="/contact" element={<Contact/>} />
           <Route path="/about" element={<About/>} />
           <Route path="/forgotpassword" element={<ForgotPassword/>} />
           <Route path="/setnewpassword" element={<SetNewPassword/>} />
           <Route path="/profile" element={<Profile/>} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
