import { Routes, Route } from "react-router-dom";
import AdminNavbar from "../components/Adminview/Adminnavbar";
import AdminSidebar from "../components/Adminview/Adminsidebar";
import Library from "./Library";

export default function AdminDashboard() {
  return (
    <div className="bg-[#F8FBF3] flex flex-col h-screen overflow-hidden">
      <AdminNavbar />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto bg-[#F8FBF3] p-6">
          <Routes>
            <Route path="library" element={<Library />} />
            <Route path="library/" element={<Library />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
