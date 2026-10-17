import { CheckBadge } from "./Icons";
import "./Credentials.css";

const credentials = [
  {
    title: "Google IT Support Professional",
    issuer: "Google Career Certificates (Coursera)",
    year: "2026",
  },
  {
    title: "Certificate of Completion — On-the-Job Training (OJT)",
    issuer: "Sisters of Mary Banneux Inc. Girlstown",
    year: "2026",
  },
  {
    title: "Inbound",
    issuer: "HubSpot Academy",
    year: "2026",
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
      <p className="sec-label">03 / CREDENTIALS</p>

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