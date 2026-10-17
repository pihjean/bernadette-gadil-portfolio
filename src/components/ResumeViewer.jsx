import { useEffect } from "react";
import "./ResumeViewer.css";

const PDF = "/resume.pdf";

export default function ResumeViewer({ onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div className="rv" role="dialog" aria-modal="true" aria-label="Resume" onClick={onClose}>
      <div className="rv-panel" onClick={(e) => e.stopPropagation()}>
        <div className="rv-bar">
          <p className="rv-title">Resume — Bernadette Rala Gadil</p>

          <div className="rv-actions">
            <a href={PDF} target="_blank" rel="noreferrer" className="rv-link">
              Open in new tab
            </a>
            <a href={PDF} download="Bernadette-Gadil-Resume.pdf" className="rv-link">
              Download
            </a>
            <button type="button" className="rv-close" onClick={onClose} aria-label="Close resume">
              ✕
            </button>
          </div>
        </div>

        <div className="rv-body">
          <iframe src={`${PDF}#view=FitH`} title="Resume PDF" className="rv-frame" />
          <p className="rv-fallback">
            Hindi lumalabas ang PDF sa browser mo?{" "}
            <a href={PDF} target="_blank" rel="noreferrer">
              Buksan sa bagong tab
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}