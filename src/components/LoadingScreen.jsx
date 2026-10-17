import { useEffect, useState } from "react";
import "./LoadingScreen.css";

const NAME = "Bernadette Rala Gadil";

function LoadingScreen({ duration = 5000, onComplete }) {
  const [progress, setProgress] = useState(0);
  const [exit, setExit] = useState(false);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    let raf;
    let exitTimer;
    const start = performance.now();

    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setProgress(Math.round(eased * 100));

      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setExit(true);
        exitTimer = setTimeout(() => onComplete?.(), 1000);
      }
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(exitTimer);
      document.body.style.overflow = prevOverflow;
    };
  }, [duration, onComplete]);

  return (
    <div className={`loader ${exit ? "loader--exit" : ""}`}>
      <div className="loader__inner">
        <p className="loader__label">Portfolio</p>

        <div className="loader__mark">
          <span className="loader__ring" />
          <span className="loader__initials">BG</span>
        </div>

        <h1 className="loader__name" aria-label={NAME}>
          {NAME.split(" ").map((word, w) => (
            <span key={w} className="loader__word">
              {word.split("").map((char, i) => (
                <span
                  key={i}
                  className="loader__char"
                  style={{ animationDelay: `${0.2 + (w * 6 + i) * 0.03}s` }}  // dati 0.045
                >
                  {char}
                </span>
              ))}
            </span>
          ))}
        </h1>

        <p className="loader__role">Information Systems Graduate</p>
      </div>

      <div className="loader__footer">
        <div className="loader__track">
          <div className="loader__fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="loader__meta">
          <span>Loading</span>
          <span className="loader__percent">
            {String(progress).padStart(3, "0")}
          </span>
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;