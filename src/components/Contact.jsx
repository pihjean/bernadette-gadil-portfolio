import { ArrowIcon } from "./Icons";
import "./Contact.css";

const details = [
  {
    label: "Email",
    value: "bernadettegadil4@gmail.com",
    href: "mailto:bernadettegadil4@gmail.com",
    arrow: true,
  },
  {
    label: "Phone",
    value: "+639661789102",
    href: "tel:+639661789102",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/bernadettegadil",
    href: "https://linkedin.com/in/bernadettegadil",
    arrow: true,
    external: true,
  },
  {
    label: "Facebook",
    value: "Bernadette Gadil",
    href: "https://www.facebook.com/share/19W9ngoZfy/",
    arrow: true,
    external: true,
  },
  {
    label: "Based in",
    value: "Camarines Norte, Philippines",
  },
];

export default function Contact() {
  return (
    <footer id="contact" className="contact">
      <div className="contact-inner">
        <div className="contact-top">
          <div className="contact-intro">
            <p className="contact-label">06 / GET IN TOUCH</p>
            <h2 className="contact-title">
              Let’s start a
              <br />
              conversation.
            </h2>
            <p className="contact-desc">
              Interested in discussing a technical, administrative, or support
              role? I’d be glad to hear from you.
            </p>
          </div>

          <dl className="contact-list">
            {details.map((d) => (
              <div className="contact-row" key={d.label}>
                <dt>{d.label}</dt>
                <dd>
                  {d.href ? (
                    <a
                      href={d.href}
                      {...(d.external
                        ? { target: "_blank", rel: "noreferrer" }
                        : {})}
                    >
                      <span>{d.value}</span>
                      {d.arrow && <ArrowIcon size={12} />}
                    </a>
                  ) : (
                    <span>{d.value}</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="contact-foot">
          <span>Bernadette Rala Gadil</span>
          <span>©2026</span>
          <a href="#top" className="contact-top-link">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}