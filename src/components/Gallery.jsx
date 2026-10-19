import { useEffect, useRef, useState } from "react";
import "./Gallery.css";

const isPdf = (src) => /\.pdf$/i.test(src);

// Tantiya habang hindi pa nababasa ang totoong sukat
const DEFAULT_PDF_RATIO = 11 / 8.5; // Letter landscape
const DEFAULT_IMG_RATIO = 4 / 3;

// Mga certificate: ilagay sa public/certificates/ (puwedeng .pdf, .jpg, .jpeg, .png)
// Opsyonal: `ratio` (lapad / taas) kung gusto mong ikaw mismo ang magtakda ng hugis.
// Halimbawa Letter landscape: ratio: 11 / 8.5 | A4 landscape: ratio: 297 / 210
const certificates = [
  { src: "/certificates/cisco.pdf", caption: "Cisco Certificate" },
  { src: "/certificates/inbound-certificate.png", caption: "Inbound Certificate" },
  { src: "/certificates/network-architecture.pdf", caption: "Network Architecture" },
  { src: "/certificates/operating-systems.pdf", caption: "Operating Systems" },
  { src: "/certificates/technical-support-fundamentals.pdf", caption: "Technical Support Fundamentals" },
  { src: "/certificates/bytes-and-bites-network.pdf", caption: "The Bits and Bytes of Computer Networking" },
];

// Mga tile sa gallery. Ang may `album` ay nagbubukas ng sarili nitong set ng files.
// Ang ibang tile: ilagay ang picture sa public/gallery/ (hal. graduation.jpg)
// Hangga't wala pang file, placeholder na may caption ang lalabas.
const photos = [
  { src: "/gallery/graduation.jpg", caption: "Graduation Day", ratio: "4 / 5" },
  {
    caption: "Certificates",
    ratio: "4 / 3",
    // Cover ng tile. Dapat picture (png/jpg), hindi PDF
    src: "/certificates/inbound-certificate.png",
    album: certificates,
  },
  { src: "/gallery/ojt.jpg", caption: "On-the-Job Training", ratio: "1 / 1" },
  { src: "/gallery/team-moments.jpg", caption: "Team Moments", ratio: "3 / 4" },
];

// Mga tile na walang album (para sa lightbox ng ordinaryong picture)
const singles = photos.filter((p) => !p.album);

const SWIPE_MIN = 50; // pinakamaliit na layo (px) para ituring na swipe

/* Kinukuha ang hugis (lapad / taas) ng unang page ng PDF sa pamamagitan ng
   pagbasa ng /MediaBox (at /Rotate) mula mismo sa file. Walang library na kailangan.
   Kapag hindi mabasa (hal. compressed ang page info), null ang ibabalik. */
async function readPdfRatio(src, signal) {
  const res = await fetch(src, { signal });
  if (!res.ok) return null;
  const buf = await res.arrayBuffer();
  const text = new TextDecoder("latin1").decode(buf);

  const box = text.match(
    /\/MediaBox\s*\[\s*(-?[\d.]+)\s+(-?[\d.]+)\s+(-?[\d.]+)\s+(-?[\d.]+)\s*\]/
  );
  if (!box) return null;

  let w = Math.abs(parseFloat(box[3]) - parseFloat(box[1]));
  let h = Math.abs(parseFloat(box[4]) - parseFloat(box[2]));
  if (!w || !h) return null;

  const rot = text.match(/\/Rotate\s+(-?\d+)/);
  if (rot && Math.abs(parseInt(rot[1], 10)) % 180 === 90) [w, h] = [h, w];

  return w / h;
}

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
  const pdf = current ? isPdf(current.src) : false;

  // Para sa PDF: basahin ang totoong hugis ng page (kung wala pang manual `ratio`)
  const currentSrc = current ? current.src : null;
  const hasManual = current ? current.ratio != null : false;
  useEffect(() => {
    if (!currentSrc || !pdf || hasManual || ratios[currentSrc] != null) return;
    const ctrl = new AbortController();
    readPdfRatio(currentSrc, ctrl.signal)
      .then((r) => r && setRatio(currentSrc, r))
      .catch(() => {}); // kapag hindi mabasa, gagamitin ang default na ratio
    return () => ctrl.abort();
  }, [currentSrc, pdf, hasManual]); // eslint-disable-line react-hooks/exhaustive-deps

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

  // Hugis ng viewer: manual > nabasa sa file > default
  const ar = current
    ? current.ratio ??
      ratios[current.src] ??
      (pdf ? DEFAULT_PDF_RATIO : DEFAULT_IMG_RATIO)
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
            {pdf ? (
              <iframe
                key={current.src}
                src={`${current.src}#toolbar=0&navpanes=0&scrollbar=0&view=Fit`}
                title={current.caption}
                className="lb-media lb-pdf"
              />
            ) : failed[current.src] ? (
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
                {pdf && (
                  <a
                    href={current.src}
                    target="_blank"
                    rel="noreferrer"
                    className="lb-open"
                  >
                    Open PDF ↗
                  </a>
                )}{" "}
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