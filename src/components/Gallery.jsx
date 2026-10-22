import { useEffect, useRef, useState } from "react";
import "./Gallery.css";

const DEFAULT_IMG_RATIO = 4 / 3;

// Mga certificate: public/certificates/
// Walang space at maliit na letra sa pangalan ng file (case-sensitive ang hosting).
// Palitan ang 6 na bagong entry (certificate-7 hanggang certificate-12) ng totoong file at pamagat.
const certificates = [
  { src: "/certificates/cisco.png", caption: "Cisco Certificate" },
  { src: "/certificates/inbound-certificate.png", caption: "Inbound Certificate" },
  { src: "/certificates/network-architecture.png", caption: "Network Architecture" },
  { src: "/certificates/operating-systems.png", caption: "Operating Systems" },
  { src: "/certificates/technical-support-fundamentals.png", caption: "Technical Support Fundamentals" },
  { src: "/certificates/bytes-and-bites-network.png", caption: "The Bits and Bytes of Computer Networking" },

  // ----- 6 NA BAGO -----
  { src: "/certificates/certificate-7.jpg", caption: "IS WEB 3.0: Exploring Innovations in Web Development" },
  { src: "/certificates/certificate-8.jpg", caption: "Certificate of Completion: OJT" },
  { src: "/certificates/certificate-9.jpg", caption: "Certificate of Recognition: OJT" },
  { src: "/certificates/certificate-10.jpg", caption: "Certificate of Academic Excellence: Best in Capstone" },
  { src: "/certificates/certificate-11.jpg", caption: "Certificate of Academic Excellence: Academic Distinction Awardee" },
  { src: "/certificates/certificate-12.jpg", caption: "Certificate of Academic Excellence: Best in OJT" },
];

// Graduation / Recognition: public/gallery/grad/grad-1.jpg hanggang grad-9.jpg
const GRAD_COUNT = 9;
const GRAD_EXT = "jpg"; // palitan kung png / jpeg ang mga file
const gradPhotos = Array.from({ length: GRAD_COUNT }, (_, i) => ({
  src: `/gallery/grad/grad-${i + 1}.${GRAD_EXT}`,
  caption: `Graduation / Recognition ${i + 1}`,
}));

// Mga OJT picture: public/gallery/ojt/ojt-1.jpg hanggang ojt-10.jpg
const OJT_COUNT = 10;
const OJT_EXT = "jpg"; // palitan kung png / jpeg ang mga file
const ojtPhotos = Array.from({ length: OJT_COUNT }, (_, i) => ({
  src: `/gallery/ojt/ojt-${i + 1}.${OJT_EXT}`,
  caption: `On-the-Job Training ${i + 1}`,
}));

// Team Moments: public/gallery/team/team-1.jpg hanggang team-5.jpg
const TEAM_COUNT = 5;
const TEAM_EXT = "jpg"; // palitan kung png / jpeg ang mga file
const teamPhotos = Array.from({ length: TEAM_COUNT }, (_, i) => ({
  src: `/gallery/team/team-${i + 1}.${TEAM_EXT}`,
  caption: `Team Moments ${i + 1}`,
}));

// Ang may `album` ay nagbubukas ng sarili nitong set ng files.
// `unit` = lalabas sa badge (hal. "12 certificates")
const photos = [
  {
    caption: "Graduation / Recognition",
    ratio: "4 / 5",
    src: gradPhotos[0].src, // cover ng tile
    album: gradPhotos,
    unit: "photos",
  },
  {
    caption: "Certificates",
    ratio: "4 / 3",
    src: "/certificates/inbound-certificate.png", // cover ng tile
    album: certificates,
    unit: "certificates",
  },
  {
    caption: "On-the-Job Training",
    ratio: "1 / 1",
    src: ojtPhotos[0].src, // cover ng tile
    album: ojtPhotos,
    unit: "photos",
  },
  {
    caption: "Team Moments",
    ratio: "3 / 4",
    src: teamPhotos[0].src, // cover ng tile
    album: teamPhotos,
    unit: "photos",
  },
];

const SWIPE_MIN = 50; // pinakamaliit na layo (px) para ituring na swipe

export default function Gallery() {
  // lb = { list: [...], i: index } o null
  const [lb, setLb] = useState(null);
  const [failed, setFailed] = useState({});
  const [ratios, setRatios] = useState({}); // src -> lapad / taas ng totoong file
  const touch = useRef(null);

  const markFailed = (src) => setFailed((f) => ({ ...f, [src]: true }));
  const setRatio = (src, r) =>
    setRatios((m) => (m[src] === r ? m : { ...m, [src]: r }));

  const close = () => setLb(null);
  const prev = () =>
    setLb((s) => (s ? { ...s, i: (s.i + s.list.length - 1) % s.list.length } : s));
  const next = () =>
    setLb((s) => (s ? { ...s, i: (s.i + 1) % s.list.length } : s));

  // Lahat ng tile ay album na
  const openTile = (p) => setLb({ list: p.album, i: 0 });

  const isOpen = lb !== null;

  useEffect(() => {
    if (!isOpen) return;
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
  }, [isOpen]);

  const current = lb ? lb.list[lb.i] : null;
  const multi = lb ? lb.list.length > 1 : false;

  // Swipe pakaliwa/pakanan sa phone
  const onTouchStart = (e) => {
    const t = e.touches[0];
    touch.current = { x: t.clientX, y: t.clientY };
  };

  const onTouchEnd = (e) => {
    if (!touch.current || !lb || lb.list.length < 2) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touch.current.x;
    const dy = t.clientY - touch.current.y;
    touch.current = null;
    if (Math.abs(dx) < SWIPE_MIN || Math.abs(dx) < Math.abs(dy)) return;
    if (dx > 0) prev();
    else next();
  };

  // Hugis ng viewer: manual > nabasa sa picture > default
  const ar = current
    ? current.ratio ?? ratios[current.src] ?? DEFAULT_IMG_RATIO
    : DEFAULT_IMG_RATIO;

  return (
    <section id="gallery" className="container sec">
      <p className="sec-label">05 / GALLERY</p>

      <div className="gal-grid">
        {photos.map((p) => (
          <button
            key={p.caption}
            type="button"
            className="gal-item"
            style={{ aspectRatio: p.ratio }}
            onClick={() => openTile(p)}
            aria-label={`Open ${p.caption} (${p.album.length} ${p.unit || "files"})`}
          >
            {failed[p.src] ? (
              <span className="gal-ph">{p.caption}</span>
            ) : (
              <img
                src={p.src}
                alt={p.caption}
                loading="lazy"
                draggable={false}
                onError={() => markFailed(p.src)}
              />
            )}

            <span className="gal-count">
              {p.album.length} {p.unit || "files"}
            </span>

            <span className="gal-cap">{p.caption}</span>
          </button>
        ))}
      </div>

      {isOpen && (
        <div
          className="lb"
          role="dialog"
          aria-modal="true"
          onClick={close}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <button className="lb-close" onClick={close} aria-label="Close">
            ✕
          </button>

          {multi && (
            <button
              className="lb-nav lb-prev"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Previous"
            >
              ‹
            </button>
          )}

          <figure
            className="lb-fig"
            style={{ "--ar": ar }}
            onClick={(e) => e.stopPropagation()}
          >
            {failed[current.src] ? (
              <div className="lb-ph">{current.caption}</div>
            ) : (
              <img
                key={current.src}
                className="lb-media"
                src={current.src}
                alt={current.caption}
                draggable={false}
                onLoad={(e) =>
                  setRatio(
                    current.src,
                    e.currentTarget.naturalWidth / e.currentTarget.naturalHeight
                  )
                }
                onError={() => markFailed(current.src)}
              />
            )}
            <figcaption>
              {current.caption}
              <span>
                {lb.i + 1} / {lb.list.length}
              </span>
            </figcaption>
          </figure>

          {multi && (
            <button
              className="lb-nav lb-next"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Next"
            >
              ›
            </button>
          )}
        </div>
      )}
    </section>
  );
}