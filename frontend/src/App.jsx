import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Join from "./pages/Join";
import Signup from "./pages/Signup";
import Register from "./pages/Register";
import QuizCreate from "./pages/QuizCreate";
import StudentGame from "./pages/StudentGame";
import Presentgame from "./pages/Presentgame";
import PresentGameMenu from "./components/game/PresentGameMenu";
import HostGame from "./pages/HostGame";
import QuizAIGenerator from "./pages/QuizAIGenerator";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import QuizPDF from "./pages/QuizPDF";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/quiz/pdf"  element={<ProtectedRoute><QuizPDF /></ProtectedRoute>}/>
        <Route path="/" element={<Home />} />
        <Route path="/join" element={<Join />} />
        <Route path="/register" element={<Register />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/student/:roomId/:playerId" element={<StudentGame />} />
        <Route path="/game/:roomId/:playerId" element={<PresentGameMenu />} />
        <Route path="/host/:roomId" element={<HostGame />} />
        <Route path="/present" element={<Presentgame />} />
        {/*Lo que tiene ProtectedRoute necesita estar logueado */}
        <Route
          path="/quiz/create"
          element={
            <ProtectedRoute>
              <QuizCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz/edit/:quizId"
          element={
            <ProtectedRoute>
              <QuizCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz/ai"
          element={
            <ProtectedRoute>
              <QuizAIGenerator />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
