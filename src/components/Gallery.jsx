import { useEffect, useRef, useState } from "react";
import "./Gallery.css";

const DEFAULT_IMG_RATIO = 4 / 3;

const certificates = [
  { src: "/certificates/cisco.png", caption: "Cisco Certificate" },
  { src: "/certificates/inbound-certificate.png", caption: "Inbound Certificate" },
  { src: "/certificates/network-architecture.png", caption: "Network Architecture" },
  { src: "/certificates/operating-systems.png", caption: "Operating Systems" },
  { src: "/certificates/technical-support-fundamentals.png", caption: "Technical Support Fundamentals" },
  { src: "/certificates/bytes-and-bites-network.png", caption: "The Bits and Bytes of Computer Networking" },
];

const photos = [
  { src: "/gallery/graduation.jpg", caption: "Graduation Day", ratio: "4 / 5" },
  {
    caption: "Certificates",
    ratio: "4 / 3",
    src: "/certificates/inbound-certificate.png",
    album: certificates,
  },
  { src: "/gallery/ojt.jpg", caption: "On-the-Job Training", ratio: "1 / 1" },
  { src: "/gallery/team-moments.jpg", caption: "Team Moments", ratio: "3 / 4" },
];

const singles = photos.filter((p) => !p.album);
const SWIPE_MIN = 50;

export default function Gallery() {
  const [lb, setLb] = useState(null); // { list, i } o null
  const [failed, setFailed] = useState({});
  const [ratios, setRatios] = useState({});
  const touch = useRef(null);

  const markFailed = (src) => setFailed((f) => ({ ...f, [src]: true }));
  const setRatio = (src, r) =>
    setRatios((m) => (m[src] === r ? m : { ...m, [src]: r }));

  const close = () => setLb(null);
  const prev = () =>
    setLb((s) => (s ? { ...s, i: (s.i + s.list.length - 1) % s.list.length } : s));
  const next = () =>
    setLb((s) => (s ? { ...s, i: (s.i + 1) % s.list.length } : s));

  const openTile = (p) => {
    if (p.album) setLb({ list: p.album, i: 0 });
    else setLb({ list: singles, i: singles.indexOf(p) });
  };

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
            aria-label={
              p.album
                ? `Open ${p.caption} (${p.album.length} files)`
                : `Open photo: ${p.caption}`
            }
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

            {p.album && (
              <span className="gal-count">{p.album.length} certificates</span>
            )}
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
              onClick={(e) => { e.stopPropagation(); prev(); }}
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
              <span>{lb.i + 1} / {lb.list.length}</span>
            </figcaption>
          </figure>

          {multi && (
            <button
              className="lb-nav lb-next"
              onClick={(e) => { e.stopPropagation(); next(); }}
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