import { useEffect, useState } from "react";
import "./Gallery.css";

// Ilagay ang mga picture sa public/gallery/ at palitan ang caption dito
const photos = [
  { src: "/gallery/photo-1.jpg", caption: "Graduation Day", ratio: "4 / 5" },
  { src: "/gallery/photo-2.jpg", caption: "On-the-Job Training", ratio: "1 / 1" },
  { src: "/gallery/photo-3.jpg", caption: "Office Work", ratio: "4 / 3" },
  { src: "/gallery/photo-4.jpg", caption: "Team Moments", ratio: "3 / 4" },
  { src: "/gallery/photo-5.jpg", caption: "Certificates", ratio: "4 / 3" },
  { src: "/gallery/photo-6.jpg", caption: "Behind the Scenes", ratio: "1 / 1" },
];

export default function Gallery() {
  const [open, setOpen] = useState(null);
  const [failed, setFailed] = useState({});

  const markFailed = (i) => setFailed((f) => ({ ...f, [i]: true }));
  const close = () => setOpen(null);
  const prev = () => setOpen((i) => (i + photos.length - 1) % photos.length);
  const next = () => setOpen((i) => (i + 1) % photos.length);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <section id="gallery" className="container sec">
      <p className="sec-label">04 / GALLERY</p>

      <div className="gal-grid">
        {photos.map((p, i) => (
          <button
            key={p.src}
            type="button"
            className="gal-item"
            style={{ aspectRatio: p.ratio }}
            onClick={() => setOpen(i)}
            aria-label={`Open photo: ${p.caption}`}
          >
            {failed[i] ? (
              <span className="gal-ph">{p.caption}</span>
            ) : (
              <img
                src={p.src}
                alt={p.caption}
                loading="lazy"
                draggable={false}
                onError={() => markFailed(i)}
              />
            )}
            <span className="gal-cap">{p.caption}</span>
          </button>
        ))}
      </div>

      {open !== null && (
        <div className="lb" role="dialog" aria-modal="true" onClick={close}>
          <button className="lb-close" onClick={close} aria-label="Close">
            ✕
          </button>

          <button
            className="lb-nav lb-prev"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Previous photo"
          >
            ‹
          </button>

          <figure className="lb-fig" onClick={(e) => e.stopPropagation()}>
            {failed[open] ? (
              <div className="lb-ph">{photos[open].caption}</div>
            ) : (
              <img src={photos[open].src} alt={photos[open].caption} />
            )}
            <figcaption>
              {photos[open].caption}
              <span>
                {open + 1} / {photos.length}
              </span>
            </figcaption>
          </figure>

          <button
            className="lb-nav lb-next"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Next photo"
          >
            ›
          </button>
        </div>
      )}
    </section>
  );
}