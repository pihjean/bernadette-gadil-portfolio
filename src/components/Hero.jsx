import { useState } from "react";
import { ArrowIcon } from "./Icons";
import ResumeViewer from "./ResumeViewer";
import "./Hero.css";

export default function Hero() {
  const [showResume, setShowResume] = useState(false);

  return (
    <section id="top" className="container hero">
      <div className="hero-text">
        <h1 className="hero-title">
          Hello, I’m
          <br />
          Bernadette
          <br />
          Rala Gadil.
        </h1>

        <p className="hero-desc">
          I value accuracy, continuous learning, and collaboration. I approach
          challenges with curiosity, adapt to new situations, and strive to
          contribute meaningfully to a team through a thoughtful and reliable
          work ethic.
        </p>

        <div className="hero-actions">
          <a href="#contact" className="hero-btn">
            Let’s connect <ArrowIcon />
          </a>

          <button
            type="button"
            className="hero-btn hero-btn--outline"
            onClick={() => setShowResume(true)}
          >
            View Resume <ArrowIcon />
          </button>
        </div>
      </div>

      {/* Dito sasabit ang lanyard (tingnan ang Lanyard.jsx) */}
      <div className="hero-image" />

      {showResume && <ResumeViewer onClose={() => setShowResume(false)} />}
    </section>
  );
}