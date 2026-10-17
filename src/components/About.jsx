import "./About.css";

const icons = {
  monitor: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 16H5a1.5 1.5 0 0 1-1.5-1.5v-9A1.5 1.5 0 0 1 5 4h8" />
      <path d="M8 20h5M10.5 16v4" />
      <circle cx="17.5" cy="7.5" r="2" />
      <path d="M17.5 3.5v1M17.5 10.5v1M13.9 5.5l.9.5M20.2 9l.9.5M13.9 9.5l.9-.5M20.2 6l.9-.5" />
    </svg>
  ),
  bug: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="3.5" width="17" height="13" rx="1.5" />
      <path d="M8 20.5h8M12 16.5v4" />
      <ellipse cx="12" cy="10.5" rx="2.4" ry="3" />
      <path d="M12 7.5V6M9.6 9.5H8M9.6 11.5H8M14.4 9.5H16M14.4 11.5H16M10.2 7.8 9 6.6M13.8 7.8 15 6.6" />
    </svg>
  ),
  docs: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4H18a2 2 0 0 1 2 2v8.5a1.5 1.5 0 0 1-1.5 1.5H17" />
      <rect x="4" y="7" width="13" height="13" rx="2" />
    </svg>
  ),
};

const services = [
  {
    icon: "monitor",
    title: "Technical Support",
    text: "Hands-on help with computer, printer, and basic network issues, along with hardware and software setup, plus practical support for users and teams.",
    tags: "Troubleshooting · Setup · Maintenance · User support",
  },
  {
    icon: "bug",
    title: "Quality Analyst",
    text: "Regression testing, defect documentation, retesting fixes, and checking website functionality and responsiveness across browsers and devices.",
    tags: "Testing · Bug reporting · Retesting",
  },
  {
    icon: "docs",
    title: "Administrative Support",
    text: "Careful data entry, organized records, document preparation, and coordination for daily office operations, with attention to detail and accuracy.",
    tags: "Records · Documentation · Data entry · Office coordination",
  },
];

const skills = [
  "Technical Support",
  "Computer & Network Troubleshooting",
  "Administrative Support",
  "Customer Service",
  "Data Entry & Documentation",
  "Problem Solving",
  "Communication",
  "Time Management",
  "Adaptability",
  "Attention to Detail",
];

const tools = [
  {
    label: "AI Tools",
    items: ["ChatGPT", "Gemini", "Claude", "Grammarly", "Canva AI"],
  },
  {
    label: "Productivity",
    items: [
      "Microsoft 365 (Word, Excel, PowerPoint)",
      "Google Workspace (Docs, Sheets, Slides, Drive)",
    ],
  },
  {
    label: "Communication",
    items: ["Zoom", "Microsoft Teams", "Google Meet", "Discord", "Slack"],
  },
  {
    label: "Project Management",
    items: ["Jira", "Notion", "Monday.com"],
  },
  {
    label: "Design & Social Media",
    items: ["Canva", "CapCut", "Adobe Photoshop", "Figma"],
  },
];

const languages = [
  { name: "English", level: "Professional Working Proficiency" },
  { name: "Filipino", level: "Native Proficiency" },
];

export default function About() {
  return (
    <section id="about" className="container about">
      <p className="about-label">01 / ABOUT ME</p>

      <p className="about-intro">
        I’m a motivated and adaptable Information Systems graduate who values
        continuous learning, accuracy, and collaboration. I approach challenges
        with curiosity and a willingness to learn, and I’m always looking for
        opportunities to grow professionally and contribute meaningfully to a
        team.
      </p>

      <p className="about-label about-label--sub">WHAT I DO</p>

      <div className="about-grid">
        {services.map((s) => (
          <article className="about-card" key={s.title}>
            <span className="about-icon">{icons[s.icon]}</span>
            <h3 className="about-card-title">{s.title}</h3>
            <p className="about-card-text">{s.text}</p>
            <p className="about-card-tags">{s.tags}</p>
          </article>
        ))}
      </div>

      {/* ---------- TOOLS & SKILLS ---------- */}
      <p className="about-label about-label--sub about-label--tools">
        TOOLS &amp; SKILLS
      </p>

      <div className="ts">
        <div className="ts-skills">
          <h3 className="ts-title">Core skills</h3>
          <ul className="ts-chips">
            {skills.map((s) => (
              <li key={s} className="chip chip--outline">
                {s}
              </li>
            ))}
          </ul>

          <h3 className="ts-title ts-title--lang">Languages</h3>
          <ul className="ts-langs">
            {languages.map((l) => (
              <li key={l.name}>
                <span className="ts-lang-name">{l.name}</span>
                <span className="ts-lang-level">{l.level}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="ts-tools">
          <h3 className="ts-title">Tools I use</h3>
          <ul className="ts-rows">
            {tools.map((t) => (
              <li key={t.label} className="ts-row">
                <span className="ts-row-label">{t.label}</span>
                <ul className="ts-chips">
                  {t.items.map((i) => (
                    <li key={i} className="chip chip--fill">
                      {i}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}