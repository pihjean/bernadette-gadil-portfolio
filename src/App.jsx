import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Experience from "./components/Experience";
import Credentials from "./components/Credentials";
import Gallery from "./components/Gallery";
import Contact from "./components/Contact";
import Lanyard from "./components/Lanyard";
import ThemeToggle from "./components/ThemeToggle";

function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Experience />
      <Credentials />
      <Gallery />
      <Contact />
      <Lanyard />
      <ThemeToggle />
    </>
  );
}

export default App;