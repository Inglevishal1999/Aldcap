import { Routes, Route } from "react-router-dom";

import Home from "./Components/Home";
import Header from "./Components/Header";
import Navbar from "./Components/Navbar"
import About from "./Components/About";
import Services from "./Components/Services";
import Blog from "./Components/Blog";
// import Contact from "./Components/Contact";
import Careers from "./Components/Career";
import Footer from "./components/Footer";
// import Consumers from "./Components/Consumers";

function App() {
  return (
    <>
    <Header />
    <Navbar />

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/blog" element={<Blog />} />
      {/* <Route path="/consumers" element={<Consumers />} /> */}
      <Route path="/careers" element={<Careers />} />
      {/* <Route path="/contact" element={<Contact />} /> */}
    </Routes>
    <Footer />
    </>
  );
}

export default App;