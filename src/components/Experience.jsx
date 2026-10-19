import "./Experience.css";

const experiences = [
  {
    date: "August 2026–November 2026",
    tag: "Quality Analyst",
    title: "Quality Analyst Intern (Remote)",
    company: "August 99",
    location: "Ortigas Center, Pasig City, Metro Manila",
    points: [
      "Performed regression testing on a live website builder and real estate website templates, ensuring existing features remained stable after each maintenance release.",
      "Documented and reported defects with clear reproduction steps, then retested fixes to confirm resolution before deployment.",
      "Verified template functionality, layout, and responsiveness across browsers and devices to maintain a consistent user experience.",
      "Coordinated with the development team on testing progress, blockers, and quality concerns to support timely releases.",
    ],
  },
  {
    date: "February 2026–May 2026",
    tag: "Technical Support",
    title: "Technical Support Intern",
    company: "Sisters of Mary Banneux Inc. Girlstown",
    location: "Silang, Cavite",
    points: [
      "Diagnosed and resolved computer, printer, and network issues to minimize technical downtime.",
      "Configured and maintained computer systems, printers, and network devices to support efficient operations.",
      "Provided prompt technical assistance to students, faculty, and administrative staff.",
      "Assisted with software installation, user support, and basic system maintenance.",
    ],
  },
  {
    date: "June 2025–July 2025",
    tag: "Administrative Support",
    title: "Office Clerk (SPES Beneficiary)",
    company: "Business Permit and Licensing Office (BPLO), LGU San Vicente",
    location: "San Vicente, Camarines Norte",
    points: [
      "Assisted clients with business permit applications and administrative inquiries.",
      "Organized and maintained office records for easier document retrieval and file management.",
      "Encoded and verified transaction data with accuracy and attention to detail.",
      "Supported daily administrative operations, document preparation, and office coordination.",
    ],
  },
  {
    date: "July 2022–October 2022",
    tag: "Customer Service",
    title: "Cashier / Sales Clerk",
    company: "HP Department Store",
    location: "Daet, Camarines Norte",
    points: [
      "Assisted customers with purchases by providing product information, handling transactions accurately, and ensuring efficient checkout service.",
    ],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="container sec exp">
      <p className="sec-label">02 / EXPERIENCES</p>

      <div className="exp-list">
        {experiences.map((e) => (
          <article className="exp-item" key={e.title}>
            <div className="exp-meta">
              <p className="exp-date">{e.date}</p>
              <p className="exp-tag">{e.tag}</p>
            </div>

            <div className="exp-body">
              <h3 className="exp-title">{e.title}</h3>
              <p className="exp-company">{e.company}</p>
              <p className="exp-location">{e.location}</p>

              <ul className="exp-points">
                {e.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}