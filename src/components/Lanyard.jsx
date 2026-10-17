import { useEffect, useRef } from "react";
import "./Lanyard.css";

const CARD_W = 230;
const CARD_LINK = 190; // layo ng clip papunta sa gitna ng card
const CARD_BELOW = 220; // layo ng gitna ng card papunta sa ilalim nito
const SEG = 18; // haba ng bawat segment ng tali (px)
const DT = 1 / 120;
const GRAVITY = 2200;
const DAMPING = 0.995;
const ITER = 12;

const MAX_DOWN = 1000; // pinakamalayong pwedeng hilahin pababa (px)
const STRETCH = 1 // gaano ka-stretch ang tali kapag hinila (22%)
const DRAG_SOFT = 0.3; // lambot ng tali habang hinihila (mas mababa = mas malambot)

const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
const node = (x, y, w) => ({ x, y, px: x, py: y, w });

export default function Lanyard() {
  const layerRef = useRef(null);
  const svgRef = useRef(null);
  const badgeRef = useRef(null);
  const simRef = useRef(null);
  const drag = useRef({ active: false, tx: 0, ty: 0, ox: 0, oy: 0, cx: 0, cy: 0 });

  useEffect(() => {
    const layer = layerRef.current;
    const svg = svgRef.current;
    const badge = badgeRef.current;
    const leftPaths = [...svg.querySelectorAll(".strap-l")];
    const rightPaths = [...svg.querySelectorAll(".strap-r")];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dg = drag.current;

    let sim = null;
    let raf = 0;
    let stopped = false;
    let lastW = 0;
    let lastT = 0;
    let time = 0;

    /* ---------- LAYOUT ---------- */
    const measure = () => {
      const w = document.documentElement.clientWidth;
      const mobile = w <= 800;
      const scale = w < 420 ? 0.82 : w < 800 ? 0.92 : 1;
      const slot = document.querySelector(".hero-image");
      const hero = document.getElementById("top");
      const sy = window.scrollY;
      const sr = slot ? slot.getBoundingClientRect() : null;

      const cx = sr ? sr.left + sr.width / 2 : w - 200;
      const slotTop = sr ? sr.top + sy : 160;
      const restY = slotTop + (mobile ? 70 : 60);

      let spread = mobile ? clamp(w * 0.14, 44, 80) : clamp(w * 0.1, 90, 210);
      spread = Math.max(20, Math.min(spread, cx - 14, w - 14 - cx));

      const heroBottom = hero ? hero.getBoundingClientRect().bottom + sy : 0;
      const layerH = Math.max(heroBottom, window.innerHeight);

      return { w, scale, cx, restY, spread, layerH };
    };

    const applySize = (c) => {
      layer.style.height = `${c.layerH}px`;
      svg.setAttribute("width", c.w);
      svg.setAttribute("height", c.layerH);
    };

    /* ---------- BUILD SIMULATION ---------- */
    const init = (drop) => {
      const cfg = measure();
      applySize(cfg);

      const { cx, restY, spread, scale } = cfg;
      const link = CARD_LINK * scale;
      const ay = -12; // sa itaas ng screen
      const ropeLen = Math.hypot(spread, restY - ay) * 1.03; // may kaunting luwag
      const n = clamp(Math.round(ropeLen / SEG), 10, 34);
      const seg = ropeLen / n;
      const eqY = Math.sqrt(Math.max(ropeLen * ropeLen - spread * spread, 0)) + ay;

      const J = node(cx, drop ? restY - 120 : eqY, 0.35); // clip
      const C = node(cx + (drop ? 36 : 0), J.y + link, 0.35); // gitna ng card

      const chain = (ax) => {
        const arr = [];
        for (let k = 0; k < n; k++) {
          const t = k / n;
          const jitter = drop ? Math.sin(k * 1.7) * 5 * Math.sin(Math.PI * t) : 0;
          arr.push(
            node(ax + (cx - ax) * t + jitter, ay + (J.y - ay) * t, k === 0 ? 0 : 1)
          );
        }
        arr.push(J);
        return arr;
      };

      const L = chain(cx - spread);
      const R = chain(cx + spread);

      sim = {
        cfg, J, C, L, R, seg, link, scale, ropeLen,
        eqC: eqY + link, // y ng gitna ng card kapag nakasabit lang
        nodes: [...L.slice(1), ...R.slice(1, -1), C],
      };
      simRef.current = sim;
    };

    /* ---------- PHYSICS ---------- */
    // k = lambot: 1 = matigas, mas mababa = nag-i-stretch
    const pull = (a, b, rest, oneSided, k = 1) => {
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const d = Math.hypot(dx, dy) || 1e-6;
      if (oneSided && d <= rest) return;
      const ws = a.w + b.w;
      if (!ws) return;
      const f = ((d - rest) / d / ws) * k;
      a.x += dx * f * a.w;
      a.y += dy * f * a.w;
      b.x -= dx * f * b.w;
      b.y -= dy * f * b.w;
    };

    // Pumipigil sa matatalim na tupi, kaya smooth ang baluktot ng tali
    const push = (a, b, min, k) => {
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const d = Math.hypot(dx, dy) || 1e-6;
      if (d >= min) return;
      const ws = a.w + b.w;
      if (!ws) return;
      const f = ((d - min) / d / ws) * k;
      a.x += dx * f * a.w;
      a.y += dy * f * a.w;
      b.x -= dx * f * b.w;
      b.y -= dy * f * b.w;
    };

    const substep = () => {
      const { J, C, L, R, seg, link, nodes } = sim;
      time += DT;

      // Verlet integration
      for (const nd of nodes) {
        if (nd === C && dg.active) continue;
        const vx = (nd.x - nd.px) * DAMPING;
        const vy = (nd.y - nd.py) * DAMPING;
        nd.px = nd.x;
        nd.py = nd.y;
        nd.x += vx;
        nd.y += vy + GRAVITY * DT * DT;
      }

      // Mahinang hangin habang walang humahawak
      if (!reduce && !dg.active) {
        C.x += Math.sin(time * 0.7) * 90 * DT * DT;
      }

      // Sinusundan ng card ang pointer habang hinihila
      if (dg.active) {
        C.px = C.x;
        C.py = C.y;
        C.x += (dg.cx - C.x) * 0.35;
        C.y += (dg.cy - C.y) * 0.35;
      }
      C.w = dg.active ? 0 : 0.35;

      // Habang hinihila, malambot ang tali (nag-i-stretch).
      // Pagbitaw, matigas ulit, kaya sumasalpok pabalik na may bounce.
      const ropeK = dg.active ? DRAG_SOFT : 1;

      for (let it = 0; it < ITER; it++) {
        for (let i = 0; i < L.length - 1; i++) pull(L[i], L[i + 1], seg, true, ropeK);
        for (let i = 0; i < R.length - 1; i++) pull(R[i], R[i + 1], seg, true, ropeK);
        pull(J, C, link, false);
        for (let i = 0; i < L.length - 2; i++) push(L[i], L[i + 2], seg * 2 * 0.94, 0.4);
        for (let i = 0; i < R.length - 2; i++) push(R[i], R[i + 2], seg * 2 * 0.94, 0.4);
      }
    };

    /* ---------- RENDER ---------- */
    const pathOf = (arr, ex, ey) => {
      const p = arr.map((n) => [n.x, n.y]);
      p[p.length - 1] = [ex, ey];
      let d = `M${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)}`;
      for (let i = 1; i < p.length - 1; i++) {
        const mx = (p[i][0] + p[i + 1][0]) / 2;
        const my = (p[i][1] + p[i + 1][1]) / 2;
        d += ` Q${p[i][0].toFixed(1)} ${p[i][1].toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;
      }
      const last = p[p.length - 1];
      d += ` L${last[0].toFixed(1)} ${last[1].toFixed(1)}`;
      return d;
    };

    const render = () => {
      const { J, C, L, R, scale } = sim;
      const dx = C.x - J.x;
      const dy = C.y - J.y;
      const len = Math.hypot(dx, dy) || 1;
      const angle = (-Math.atan2(dx, dy) * 180) / Math.PI;

      badge.style.transform = `translate(${(J.x - CARD_W / 2).toFixed(1)}px, ${J.y.toFixed(
        1
      )}px) rotate(${angle.toFixed(2)}deg) scale(${scale})`;

      // Dulo ng tali: nakapasok sa metal crimp
      const ex = J.x + (dx / len) * 8 * scale;
      const ey = J.y + (dy / len) * 8 * scale;

      const dL = pathOf(L, ex, ey);
      const dR = pathOf(R, ex, ey);
      leftPaths.forEach((p) => p.setAttribute("d", dL));
      rightPaths.forEach((p) => p.setAttribute("d", dR));
    };

    /* ---------- LOOP ---------- */
    const frame = (now) => {
      if (stopped) return;
      const real = Math.min((now - lastT) / 1000, 0.05);
      lastT = now;
      const steps = clamp(Math.round(real / DT), 1, 6);

      const { cfg, scale, L, R, ropeLen, link, eqC } = sim;

      if (dg.active) {
        const half = (CARD_W / 2) * scale;
        let tx = clamp(dg.tx, half + 4, cfg.w - half - 4);

        // Limit sa pagbaba: hanggang MAX_DOWN lang mula sa pagkakasabit,
        // at hindi lalampas sa ilalim ng hero
        const yMax = Math.max(
          80,
          Math.min(cfg.layerH - CARD_BELOW * scale - 6, eqC + MAX_DOWN * scale)
        );
        let ty = clamp(dg.ty, 80, yMax);

        // Limit sa abot ng tali (kasama na ang stretch)
        const reach = ropeLen * (1 + STRETCH) + link - 8;
        for (let pass = 0; pass < 3; pass++) {
          for (const a of [L[0], R[0]]) {
            const dx = tx - a.x;
            const dy = ty - a.y;
            const d = Math.hypot(dx, dy);
            if (d > reach) {
              tx = a.x + (dx / d) * reach;
              ty = a.y + (dy / d) * reach;
            }
          }
        }
        dg.cx = tx;
        dg.cy = ty;
      }

      for (let i = 0; i < steps; i++) substep();
      render();
      raf = requestAnimationFrame(frame);
    };

    /* ---------- RESIZE ---------- */
    const onResize = () => {
      if (!sim) return;
      const w = document.documentElement.clientWidth;
      if (w !== lastW) {
        lastW = w;
        dg.active = false;
        init(false);
      } else {
        // Mobile address bar lang ang gumalaw, huwag i-reset ang card
        const c = measure();
        sim.cfg.layerH = c.layerH;
        applySize(sim.cfg);
      }
    };
    window.addEventListener("resize", onResize);

    // Hintayin muna ang fonts para tama ang sukat ng layout
    (document.fonts?.ready ?? Promise.resolve()).then(() => {
      if (stopped) return;
      lastW = document.documentElement.clientWidth;
      init(!reduce);
      badge.style.opacity = 1;
      lastT = performance.now();
      raf = requestAnimationFrame(frame);
    });

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  /* ---------- POINTER (hila) ---------- */
  const onPointerDown = (e) => {
    const sim = simRef.current;
    if (!sim) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const d = drag.current;
    d.active = true;
    d.ox = sim.C.x - e.pageX;
    d.oy = sim.C.y - e.pageY;
    d.tx = sim.C.x;
    d.ty = sim.C.y;
    d.cx = sim.C.x;
    d.cy = sim.C.y;
  };

  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d.active) return;
    d.tx = e.pageX + d.ox;
    d.ty = e.pageY + d.oy;
  };

  const onPointerUp = () => {
    drag.current.active = false;
  };

  return (
    <div className="lanyard-layer" ref={layerRef}>
      <svg ref={svgRef} className="lanyard-svg" aria-hidden="true">
        <path className="strap-edge strap-l" />
        <path className="strap-edge strap-r" />
        <path className="strap-body strap-l" />
        <path className="strap-body strap-r" />
        <path className="strap-stitch strap-l" />
        <path className="strap-stitch strap-r" />
      </svg>

      <div
        ref={badgeRef}
        className="badge"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div className="clip">
          <span className="clip-crimp" />
          <span className="clip-ring" />
          <span className="clip-hook" />
        </div>

        <div className="holder">
          <span className="holder-slot" />

          <div className="id-card">
            <div className="id-head">
              <span className="id-logo">BG.</span>
              <span className="id-sub">Personal Portfolio</span>
            </div>

            <img
              src="/profile.png"
              alt="Bernadette Rala Gadil"
              className="id-photo"
              draggable={false}
            />

            <ul className="id-info">
              <li>
                <span>Name:</span> Bernadette R. Gadil
              </li>
              <li>
                <span>Course:</span> Information Systems
              </li>
              <li>
                <span>Status:</span> Graduate
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}