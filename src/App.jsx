import Header from "./Components/Header";
import Navbar from "./Components/Navbar";
import Hero from "./Components/Hero";
import About from "./Components/About";
import Services from "./Components/Services";
import Footer from "./Components/Footer";
import HeroSlider from "./Components/HeroSlider";

function App() {
  return (
    <>
      <Header />
      <Navbar />
      {/* <Hero /> */}
      <HeroSlider />
      <About />
      <Services />
      <Footer />
    </>
  );
}

export default App;