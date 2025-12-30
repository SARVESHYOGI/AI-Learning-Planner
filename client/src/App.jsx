import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Questionnaire from "./components/Questionnaire";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Generatedplans from "./pages/Generatedplans";
import PlanPage from "./pages/PlanPage";
import NoPage from "./pages/NoPage";
import DashBoard from "./pages/DashBoard";
import Layout from "./pages/Layout";
import { Toaster } from 'react-hot-toast';
import TrackPlan from "./pages/TrackPlan";
import Profile from "./pages/Profile";


export const BACKENDURL = "http://localhost:5000";
// export const BACKENDURL = "https://ai-powered-sql-prep.onrender.com";

function App() {

  return (
    <Router>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<Layout />} >
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/questionnaire" element={<Questionnaire />} />
          <Route path="/generatedplans" element={<Generatedplans />} />
          <Route path="/seeplan/:id" element={<PlanPage />} />
          <Route path="/trackingplan" element={<TrackPlan />} />
          <Route path="/*" element={<NoPage />} />
        </Route>


      </Routes>
    </Router>
  );
}

export default App;