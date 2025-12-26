import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import './App.css'
import AppLayout from './layouts/AppLayout'
import LoginPage from "./pages/LoginPage";
import ResumePage from "./pages/ResumesPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import JobsPage from "./pages/JobsPage.tsx";
import JobPrepPage from "./pages/JobPrepPage.tsx";
import ResumePrepPage from "./pages/ResumePrepPage.tsx";

function App() {

  const [user, setUser] = useState({ username: "", name: "", email: "", access_token: "", user_id: "", message: "" });

  return (
    <>
      <Router>
        <Routes>

          <Route
            path="/"
            element={
              user.access_token ? <Navigate to="/app/home" /> : <Navigate to="/login" />
            }
          />

          <Route path="/login" element={<LoginPage user={user} setUser={setUser} />} />

          <Route path="/app" element={<AppLayout setUser={setUser} user={user} />}>
            <Route index element={<AppLayout user={user} setUser={setUser} />} />
            <Route path="home" element={<HomePage user={user} />} />
            <Route path="resumes" element={<ResumePage user={user} />} />
            <Route path="resumes/:id" element={<ResumePrepPage user={user} />} />
            <Route path="jobs" element={<JobsPage user={user} />} />
            <Route path="jobs/:id/prep" element={<JobPrepPage user={user} />} />
          </Route>

        </Routes>
      </Router>
    </>
  )
}

export default App;
