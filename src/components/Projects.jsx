import { useState } from "react";
import "./Projects.css";

const filters = ["All", "IT & Development", "QA & Testing", "UI/UX"];

// Palitan ang mga image src ng sarili mong picture (ilagay sa public/projects/)
// Halimbawa: "/projects/ncamis-1.jpg"
const projects = [
  {
    title: "NCAMIS-SHS: Student Management Information System",
    tag: "Web System · Project Management",
    categories: ["IT & Development", "QA & Testing"],
    description:
      "Developed a web-based student management system to streamline enrollment, student records, grading, payment monitoring, and school administration.",
    role: "Project Manager, QA",
    chips: ["Web-based system", "Student records", "Grading", "Payment monitoring"],
    images: [
      "https://snipboard.io/xYCQot.jpg",
      "https://snipboard.io/7iUYmv.jpg",
      "https://snipboard.io/Fo0Inc.jpg",
      "https://snipboard.io/ZiI8pE.jpg",
    ],
  },
  {
    title: "GoTyme Banking System: Quality Assurance Testing",
    tag: "QA Testing · Documentation",
    categories: ["QA & Testing"],
    description:
      "Conducted manual functional, exploratory, and security testing of the GoTyme Bank mobile application to identify issues and improve system reliability, usability, and security.",
    role: "QA, Documentation",
    chips: ["Functional testing", "Exploratory testing", "Security testing", "Bug reporting"],
    images: [], // walang picture muna, placeholder ang lalabas
    file: { label: "View QA report", href: "/projects/gotyme-qa-report.pdf" },
  },
  {
    title: "Expression Companion: Personal Diary Smartband",
    tag: "UI/UX · Concept Design",
    categories: ["UI/UX"],
    description:
      "Designed a smartband concept that helps teenagers express their emotions and seek support through a confidential, stigma-free digital diary experience. Expression Companion is a digital diary smartband device made for teenagers to journal and reach out for support privately.",
    role: "UI/UX Design",
    chips: ["UI/UX Design", "Wearable concept", "Mental wellness", "Confidential"],
    images: [
      "https://snipboard.io/6kQ7Pf.jpg",
      "https://snipboard.io/xHpbW6.jpg",
    ],
  },
];

const pad = (n) => String(n).padStart(2, "0");

function ProjectCard({ project, number }) {
  const [idx, setIdx] = useState(0);
  const [failed, setFailed] = useState({});
  const total = project.images.length;
  const multi = total > 1;

  const prev = () => setIdx((i) => (i + total - 1) % total);
  const next = () => setIdx((i) => (i + 1) % total);

  const showPlaceholder = total === 0 || failed[idx];

  return (
    <article className="pj-card">
      <div className="pj-media">
        {showPlaceholder ? (
          <div className="pj-ph">
            <span>{total === 0 ? "Project preview" : "Photo coming soon"}</span>
            {project.file && (
              <a
                href={project.file.href}
                target="_blank"
                rel="noreferrer"
                className="pj-file"
              >
                {project.file.label} ↗
              </a>
            )}
          </div>
        ) : (
          <img
            src={project.images[idx]}
            alt={`${project.title} — ${idx + 1}`}
            loading="lazy"
            draggable={false}
            onError={() => setFailed((f) => ({ ...f, [idx]: true }))}
          />
        )}

        {multi && (
          <>
            <button
              type="button"
              className="pj-nav pj-prev"
              onClick={prev}
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              type="button"
              className="pj-nav pj-next"
              onClick={next}
              aria-label="Next image"
            >
              ›
            </button>
            <span className="pj-count">
              {idx + 1} / {total}
            </span>
          </>
        )}
      </div>

      <div className="pj-top">
        <span className="pj-tag">{project.tag}</span>
        <span className="pj-num">{pad(number)}</span>
      </div>

      <h3 className="pj-title">{project.title}</h3>
      <p className="pj-desc">{project.description}</p>
      <p className="pj-role">
        <span>Role:</span> {project.role}
      </p>

      {project.file && !showPlaceholder && (
        <a
          href={project.file.href}
          target="_blank"
          rel="noreferrer"
          className="pj-file pj-file--inline"
        >
          {project.file.label} ↗
        </a>
      )}

      <ul className="pj-chips">
        {project.chips.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
    </article>
  );
}

export default function Projects() {
  const [active, setActive] = useState("All");

  const visible = projects
    .map((p, i) => ({ p, n: i + 1 }))
    .filter(({ p }) => active === "All" || p.categories.includes(active));

  return (
    <section id="projects" className="container sec pj">
      <div className="pj-head">
        <div>
          <p className="sec-label">03 / ACADEMIC PROJECTS</p>
          <h2 className="pj-heading">Ideas turned into projects.</h2>
        </div>
        <p className="pj-sub">
          Coursework transformed into functional systems through research,
          design, development, and testing.
        </p>
      </div>

      <div className="pj-filters" role="tablist">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            role="tab"
            aria-selected={active === f}
            className={`pj-filter ${active === f ? "is-active" : ""}`}
            onClick={() => setActive(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="pj-grid">
        {visible.map(({ p, n }) => (
          <ProjectCard key={p.title} project={p} number={n} />
        ))}
      </div>
    </section>
  );
}