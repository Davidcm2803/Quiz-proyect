import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Join from "./pages/Join";
import Signup from "./pages/Signup";
import QuizCreate from "./pages/QuizCreate";
import StudentGame from "./pages/StudentGame";
import HostGame from "./pages/HostGame";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/join" element={<Join />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/quiz/create" element={<QuizCreate />} />
        <Route path="/student/:roomId/:playerId" element={<StudentGame />} />
        <Route path="/host/:roomId" element={<HostGame />} />
      </Routes>
    </BrowserRouter>
  );
}