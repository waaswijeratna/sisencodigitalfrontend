import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminHome from "./pages/admin/AdminHome";
import TeamMemberHome from "./pages/team-member/TeamMemberHome";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/team-member" element={<TeamMemberHome />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;