import { useState } from "react";
import { Navigate, Routes, Route } from "react-router-dom";

// =====================================================
// ADMIN CONTEXT
// =====================================================

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
import Signup from "./Pages/Signup";

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
// READ SESSION FROM LOCAL STORAGE
// =====================================================

function getInitialSession() {
  try {
    const savedSession = localStorage.getItem("session");

    if (!savedSession) {
      return null;
    }

    const parsedSession = JSON.parse(savedSession);

    // Basic validation
    if (!parsedSession || !parsedSession.token || !parsedSession.role) {
      localStorage.removeItem("session");
      return null;
    }

    return parsedSession;
  } catch (error) {
    console.error("Failed to restore session:", error);

    localStorage.removeItem("session");

    return null;
  }
}

// =====================================================
// APP
// =====================================================

function App() {
  // ---------------------------------------------------
  // Restore session immediately from localStorage.
  //
  // NO API REQUEST IS MADE HERE.
  // ---------------------------------------------------

  const [session, setSession] = useState(getInitialSession);

  // ===================================================
  // LOGIN SUCCESS
  // ===================================================

  const handleLoginSuccess = (loginData) => {
    console.log("LOGIN SUCCESS DATA:", loginData);

    const user = loginData?.user;

    const token = loginData?.token;

    const role = user?.role;

    // -----------------------------------------------
    // Validate login response
    // -----------------------------------------------

    if (!token) {
      console.error("Login response does not contain a token:", loginData);

      return;
    }

    if (!user) {
      console.error("Login response does not contain user:", loginData);

      return;
    }

    if (!role) {
      console.error("Login response does not contain role:", loginData);

      return;
    }

    // -----------------------------------------------
    // Create ONE consistent session
    // -----------------------------------------------

    const newSession = {
      token,
      user,
      role,
      signedInAt: Date.now(),
    };

    // -----------------------------------------------
    // Store session
    // -----------------------------------------------

    localStorage.setItem("session", JSON.stringify(newSession));

    // Keep token available for Axios interceptor
    localStorage.setItem("token", token);

    // Optional compatibility
    localStorage.setItem("user", JSON.stringify(user));

    // -----------------------------------------------
    // Update React state
    // -----------------------------------------------

    setSession(newSession);
  };

  // ===================================================
  // LOGOUT
  // ===================================================

  const handleLogout = () => {
    console.log("Logging out...");

    // Remove all authentication information
    localStorage.removeItem("session");
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");

    // Return application to logged-out state
    setSession(null);
  };

  // ===================================================
  // ROUTES
  // ===================================================

  return (
    <AdminProvider>
      <Routes>
        {/* =================================================
            ROOT
        ================================================= */}

        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* =================================================
            LOGIN
        ================================================= */}

        <Route
          path="/login"
          element={
            session ? (
              session.role === "admin" ? (
                <Navigate to="/admin" replace />
              ) : session.role === "employee" ? (
                <Navigate to="/employee" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            ) : (
              <Login onLoginSuccess={handleLoginSuccess} />
            )
          }
        />

        {/* =================================================
            SIGN UP
        ================================================= */}

        <Route
          path="/signup"
          element={
            session ? (
              session.role === "admin" ? (
                <Navigate to="/admin" replace />
              ) : session.role === "employee" ? (
                <Navigate to="/employee" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            ) : (
              <Signup />
            )
          }
        />

        {/* =================================================
            PUBLIC WEBSITE
        ================================================= */}

        <Route
          path="/home"
          element={
            <PublicLayout role={session?.role} onLogout={handleLogout}>
              <Home />
            </PublicLayout>
          }
        />

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

        {/* =================================================
            ADMIN PORTAL
        ================================================= */}

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

        {/* =================================================
            EMPLOYEE PORTAL
        ================================================= */}

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

        {/* =================================================
            404
        ================================================= */}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AdminProvider>
  );
}

export default App;