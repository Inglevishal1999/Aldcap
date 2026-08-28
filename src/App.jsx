import { useState, useEffect } from "react";
import { Navigate, Routes, Route } from "react-router-dom";

// IMPORT THE ADMIN PROVIDER
import { AdminProvider } from "./Admin/AdminContext";
// =====================================================
// PUBLIC PAGES
// =====================================================

import Home from "./Pages/Home";
import About from "./Pages/About";
import Careers from "./Pages/Career";
import Blog from "./Pages/Blog";
import Contact from "./Pages/Contact";
import News from "./Pages/News";
import NotFound from "./Pages/PageNotFound";

// =====================================================
// PUBLIC COMPONENT PAGES
// =====================================================

import Services from "./Components/Services";
import Gallery from "./Components/Gallery";

// =====================================================
// AUTH
// =====================================================

import Login from "./Pages/Login";

// =====================================================
// PUBLIC WEBSITE COMPONENTS
// =====================================================

import Header from "./Components/Header";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";

// =====================================================
// ADMIN
// =====================================================

import AdminLayout from "./Admin/AdminLayout";
import AdminDashboard from "./Admin/AdminDashboard";
import HeroSliderAdmin from "./Admin/HeroSliderAdmin";
import AboutAdmin from "./Admin/AboutAdmin";
import ServicesAdmin from "./Admin/ServicesAdmin";
import SafetyAdmin from "./Admin/SafetyAdmin";
import PowerStationAdmin from "./Admin/PowerStationAdmin";
import GalleryAdmin from "./Admin/GalleryAdmin";
import NewsAdmin from "./Admin/NewsAdmin";
import BlogAdmin from "./Admin/BlogAdmin";
import CareerAdmin from "./Admin/CareerAdmin";
import MessagesAdmin from "./Admin/MessageAdmin";
import DutyRosterAdmin from "./Admin/DutyRosterAdmin";

// =====================================================
// EMPLOYEE
// =====================================================

import EmployeeLayout from "./Employee/EmployeeLayout";
import EmployeeDashboard from "./Employee/EmployeeDashboard";
import DutyRoster from "./Employee/DutyRoster";

// =====================================================
// PUBLIC WEBSITE LAYOUT
// =====================================================
function PublicLayout({ children, role, onLogout }) {
  return (
    <>
      <Header />
      <Navbar role={role} onLogout={onLogout} />

      <main>{children}</main>

      <Footer />
    </>
  );
}

// =====================================================
// APP
// =====================================================

function App() {
  // ===================================================
  // SESSION
  // ===================================================

  const [session, setSession] = useState(() => {
    const saved = localStorage.getItem("session");

    if (!saved) {
      return null;
    }

    try {
      return JSON.parse(saved);
    } catch (error) {
      console.error("Invalid session found in localStorage:", error);
      localStorage.removeItem("session");
      return null;
    }
  });

  // ===================================================
  // SAVE SESSION
  // ===================================================

  useEffect(() => {
    if (session) {
      localStorage.setItem("session", JSON.stringify(session));
    } else {
      localStorage.removeItem("session");
    }
  }, [session]);

  // ===================================================
  // LOGIN SUCCESS
  // ===================================================

  function handleLoginSuccess(loginData) {
    console.log("LOGIN DATA FROM LOGIN.JSX:", loginData);

    const user = loginData?.user || {
      email: loginData?.email,
      name: loginData?.name,
      role: loginData?.role,
    };

    const role = user?.role || loginData?.role;

    if (!role) {
      console.error("Login response does not contain a role:", loginData);
      return;
    }

    const newSession = {
      token: loginData?.token || null,
      user: user,
      role: role,
      signedInAt: Date.now(),
    };

    console.log("SESSION CREATED:", newSession);
    setSession(newSession);
  }

  // ===================================================
  // LOGOUT
  // ===================================================

  function handleLogout() {
    console.log("Logging out...");
    localStorage.removeItem("session");
    setSession(null);
  }

  // ===================================================
  // ROUTES
  // ===================================================

  return (
    <AdminProvider>
      <Routes>
        {/* ROOT → LOGIN */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* LOGIN */}
        <Route
          path="/login"
          element={
            session ? (
              session.role === "admin" ? (
                <Navigate to="/admin" replace />
              ) : session.role === "employee" ? (
                <Navigate to="/home" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            ) : (
              <Login onLoginSuccess={handleLoginSuccess} />
            )
          }
        />

        {/* PUBLIC WEBSITE */}
        <Route
          path="/about"
          element={
            <PublicLayout role={session?.role} onLogout={handleLogout}>
              <About />
            </PublicLayout>
          }
        />

        <Route
          path="/services"
          element={
            <PublicLayout role={session?.role} onLogout={handleLogout}>
              <Services />
            </PublicLayout>
          }
        />

        <Route
          path="/blog"
          element={
            <PublicLayout role={session?.role} onLogout={handleLogout}>
              <Blog />
            </PublicLayout>
          }
        />

        <Route
          path="/careers"
          element={
            <PublicLayout role={session?.role} onLogout={handleLogout}>
              <Careers />
            </PublicLayout>
          }
        />

        <Route
          path="/contact"
          element={
            <PublicLayout role={session?.role} onLogout={handleLogout}>
              <Contact />
            </PublicLayout>
          }
        />

        <Route
          path="/gallery"
          element={
            <PublicLayout role={session?.role} onLogout={handleLogout}>
              <Gallery />
            </PublicLayout>
          }
        />

        <Route
          path="/news"
          element={
            <PublicLayout role={session?.role} onLogout={handleLogout}>
              <News />
            </PublicLayout>
          }
        />

        <Route
          path="/home"
          element={
            <PublicLayout role={session?.role} onLogout={handleLogout}>
              <Home />
            </PublicLayout>
          }
        />

        {/* ADMIN PORTAL */}
        <Route
          path="/admin"
          element={
            session?.role === "admin" ? (
              <AdminLayout user={session.user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="hero-slider" element={<HeroSliderAdmin />} />
          <Route path="about" element={<AboutAdmin />} />
          <Route path="services" element={<ServicesAdmin />} />
          <Route path="safety" element={<SafetyAdmin />} />
          <Route path="power-stations" element={<PowerStationAdmin />} />
          <Route path="gallery" element={<GalleryAdmin />} />
          <Route path="news" element={<NewsAdmin />} />
          <Route path="blog" element={<BlogAdmin />} />
          <Route path="careers" element={<CareerAdmin />} />
          <Route path="messages" element={<MessagesAdmin />} />
          <Route path="duty-roster" element={<DutyRosterAdmin />} />
        </Route>

        {/* EMPLOYEE PORTAL */}
        <Route
          path="/employee"
          element={
            session?.role === "employee" ? (
              <EmployeeLayout user={session.user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<EmployeeDashboard />} />
          <Route path="duty-roster" element={<DutyRoster />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AdminProvider>
  );
}

export default App;