import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

import './App.css'
import AppLayout from './layouts/AppLayout'
import LoginPage from "./pages/LoginPage";
import ResumePage from "./pages/ResumesPage.tsx";

function App() {

  const [user, setUser] = useState({ access_token: "", user_id: "", message: "" });

  return (
    <>
      <Router>
        <Routes>

          <Route path="/" element={<AppLayout />} />
          <Route path="/login" element={<LoginPage user={user} setUser={setUser} />} />

          <Route path="/app" element={<AppLayout />}>
            <Route index element={<AppLayout />} />
            <Route path="resumes" element={<ResumePage user={user} />} />
            <Route path="jobs" />
            <Route path="jobs/:id/prep" />
          </Route>

        </Routes>
      </Router>
    </>
  )
}

export default App
