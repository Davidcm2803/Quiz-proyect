// src/App.jsx

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Join from "./pages/Join";
import Signup from "./pages/Signup";
import Register from "./pages/Register";
import QuizCreate from "./pages/QuizCreate";
import StudentGame from "./pages/StudentGame";
import HostGame from "./pages/HostGame";
import QuizAIGenerator from "./pages/QuizAIGenerator";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/join" element={<Join />} />
        <Route path="/register" element={<Register />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/student/:roomId/:playerId" element={<StudentGame />} />
        <Route path="/host/:roomId" element={<HostGame />} />

        <Route
          path="/quiz/create"
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
          path="/admin"
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