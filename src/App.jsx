import { useState, useCallback } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Credentials from "./components/Credentials";
import Gallery from "./components/Gallery";
import Contact from "./components/Contact";
import Lanyard from "./components/Lanyard";
import ThemeToggle from "./components/ThemeToggle";
import LoadingScreen from "./components/LoadingScreen";

function App() {
  const [loading, setLoading] = useState(true);
  const handleComplete = useCallback(() => setLoading(false), []);

  return (
    <>
      {loading && <LoadingScreen duration={3000} onComplete={handleComplete} />}
      <Navbar />
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Credentials />
      <Gallery />
      <Contact />
      <Lanyard />
      <ThemeToggle />
    </>
  );
}

export default App;