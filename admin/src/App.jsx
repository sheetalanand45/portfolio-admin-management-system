import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Skills from "./pages/Skills";
import About from "./pages/About";
import Blogs from "./pages/Blogs";
import Experience from "./pages/Experience";
import ContactInfo from "./pages/ContactInfo";
import Testimonials from "./pages/Testimonials";
import Services from "./pages/Services";
import Media from "./pages/Media";
import Messages from "./pages/Messages";
import Sidebar from "./components/Sidebar";
import Settings from "./pages/Settings";

function ProtectedLayout() {
  const token = localStorage.getItem("adminToken");
  const [activePage, setActivePage] = useState("Dashboard");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const renderPage = () => {
    switch (activePage) {
      case "Home":
        return <Home />;

      case "About":
        return <About />;

      case "Projects":
        return <Projects />;

      case "Skills":
        return <Skills />;

      case "Blogs":
        return <Blogs />;

      case "Experience":
        return <Experience />;

      case "Contact Info":
        return <ContactInfo />;

      case "Testimonials":
        return <Testimonials />;

      case "Services":
        return <Services />;

      case "Messages":
        return <Messages />;

      case "Media":
        return <Media />;

      case "Settings":
        return <Settings />;

      case "Dashboard":
      default:
        return <Dashboard setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      {renderPage()}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={<ProtectedLayout />}
        />

        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;