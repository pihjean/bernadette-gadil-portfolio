import { CheckBadge } from "./Icons";
import "./Credentials.css";

const credentials = [
  {
    title: "The Bits and Bytes of Computer Networking",
    issuer: "Google Career Certificates (Coursera)",
    year: "May 31, 2026",
  },
  {
    title: "Operating Systems and You: Becoming a Power User",
    issuer: "Google Career Certificates (Coursera)",
    year: "July 14, 2026",
  },
  {
    title: "Network Architecture",
    issuer: "Google Career Certificates (Coursera)",
    year: "July 2, 2026",
  },
  {
    title: "Inbound",
    issuer: "HubSpot Academy",
    year: "July 1, 2026",
  },
  {
    title: "Certificate of Completion — On-the-Job Training (OJT)",
    issuer: "Sisters of Mary Banneux Inc. Girlstown",
    year: "May 2026",
  },
  {
    title: "Technical Support Fundamentals",
    issuer: "Google Career Certificates (Coursera)",
    year: "Apr 5, 2026",
  },
  {
    title: "Data Science Essentials with Python",
    issuer: "Cisco Networking Academy",
    year: "Mar 27, 2026",
  },
  {
    title: "Computer Systems Servicing (CSS) NC II",
    issuer: "TESDA",
    year: "2020",
  },
];

export default function Credentials() {
  return (
    <section id="credentials" className="container sec">
      <p className="sec-label">04 / CREDENTIALS</p>

      <ul className="cred-list">
        {credentials.map((c) => (
          <li className="cred-item" key={c.title}>
            <span className="cred-icon">
              <CheckBadge />
            </span>

            <div className="cred-text">
              <h3 className="cred-title">{c.title}</h3>
              <p className="cred-issuer">{c.issuer}</p>
            </div>

            <span className="cred-year">{c.year}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}