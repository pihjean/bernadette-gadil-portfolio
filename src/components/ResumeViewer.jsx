import { useEffect, useRef, useState } from "react";
import * as pdfjs from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.js?url";
import "./ResumeViewer.css";

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

const PDF = "/resume.pdf";

export default function ResumeViewer({ onClose }) {
  const bodyRef = useRef(null);
  const [pages, setPages] = useState([]); // listahan ng page numbers
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const docRef = useRef(null);

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

  // I-load ang PDF
  useEffect(() => {
    const task = pdfjs.getDocument(PDF);
    let cancelled = false;

    task.promise
      .then((doc) => {
        if (cancelled) return;
        docRef.current = doc;
        setPages(Array.from({ length: doc.numPages }, (_, i) => i + 1));
        setStatus("ready");
      })
      .catch(() => !cancelled && setStatus("error"));

    return () => {
      cancelled = true;
      task.destroy();
    };
  }, []);

  return (
    <div className="rv" role="dialog" aria-modal="true" aria-label="Resume" onClick={onClose}>
      <div className="rv-panel" onClick={(e) => e.stopPropagation()}>
        <div className="rv-bar">
          <p className="rv-title">Resume — Bernadette Rala Gadil</p>

          <div className="rv-actions">
            <a href={PDF} download="Bernadette-Gadil-Resume.pdf" className="rv-link">
              Download
            </a>
            <button type="button" className="rv-close" onClick={onClose} aria-label="Close resume">
              ✕
            </button>
          </div>
        </div>

        <div className="rv-body rv-body--img" ref={bodyRef}>
          {status === "loading" && <p className="rv-fallback">Loading resume…</p>}

          {status === "error" && (
            <p className="rv-fallback">
              Hindi ma-load ang resume.{" "}
              <a href={PDF} download="Bernadette-Gadil-Resume.pdf">
                I-download ang PDF
              </a>
              .
            </p>
          )}

          {status === "ready" &&
            pages.map((n) => (
              <PdfPage key={n} doc={docRef.current} num={n} container={bodyRef} />
            ))}
        </div>
      </div>
    </div>
  );
}

function PdfPage({ doc, num, container }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    let renderTask = null;

    (async () => {
      try {
        const page = await doc.getPage(num);
        if (cancelled) return;

        // Sukatin ayon sa lapad ng viewer (max 900px)
        const boxW = Math.min(900, (container.current?.clientWidth || 360) - 24);
        const base = page.getViewport({ scale: 1 });
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        const scale = (boxW / base.width) * dpr;
        const vp = page.getViewport({ scale });

        const canvas = canvasRef.current;
        canvas.width = vp.width;
        canvas.height = vp.height;

        renderTask = page.render({
          canvasContext: canvas.getContext("2d"),
          viewport: vp,
        });
        await renderTask.promise;
      } catch {
        /* na-cancel o nabigo ang page na ito */
      }
    })();

    return () => {
      cancelled = true;
      if (renderTask) renderTask.cancel();
    };
  }, [doc, num, container]);

  return <canvas ref={canvasRef} className="rv-canvas" />;
}