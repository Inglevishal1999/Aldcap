import { Routes, Route } from "react-router-dom";

import Home from "./Components/Home";
import About from "./Components/About";
import Services from "./Components/Services";
// import Consumers from "./Components/Consumers";
import Careers from "./Components/Career";
import Blog from "./Components/Blog";
import Contact from "./Components/Contact";
import Header from "./components/Header";
import Navbar from "./Components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Header />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route path="/services" element={<Services />} />

        {/* <Route path="/consumers" element={<Consumers />} /> */}

        <Route path="/blog" element={<Blog />} />

        <Route path="/careers" element={<Careers />} />

        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer/>
    </>
  );
}

export default App;
