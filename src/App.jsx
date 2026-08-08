import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./Components/Home";
import About from "./Components/About";
import Services from "./Components/Services";
// import Consumers from "./Components/Consumers";
import Careers from "./Components/Career";
import Blog from "./Components/Blog";
import Contact from "./Components/Contact";
import Header from "./Components/Header";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Gallery from "./Components/Gallery";
import NotFound from "./Components/PageNotFound";
import Login from "./Components/Login";

function App() {
  // Tracks whether someone is signed in, and as which role.
  // Persisted to localStorage so a refresh doesn't boot them back to login.
  const [session, setSession] = useState(() => {
    const saved = localStorage.getItem("session");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (session) {
      localStorage.setItem("session", JSON.stringify(session));
    } else {
      localStorage.removeItem("session");
    }
  }, [session]);

  function handleLoginSuccess(role) {
    setSession({ role, signedInAt: Date.now() });
  }

  function handleLogout() {
    setSession(null);
  }

  // Not signed in — show only the login screen, nothing else in the app.
  if (!session) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Signed in — show the normal site.
  return (
    <>
      <Header role={session.role} onLogout={handleLogout} />
      <Navbar role={session.role} onLogout={handleLogout} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/blog" element={<Blog />} />
        {/* <Route path="/consumers" element={<Consumers />} /> */}
        <Route path="/careers" element={<Careers />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;