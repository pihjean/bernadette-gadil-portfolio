import "./Navbar.css";

const ArrowIcon = () => (
  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
    <path
      d="M2 10L10 2M10 2H3.5M10 2V8.5"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Navbar() {
  return (
    <header className="container">
      <nav className="navbar">
        <a href="#top" className="brand">
          <span className="brand-logo">BG.</span>
          <span className="brand-divider" />
          <span className="brand-tag">Personal Portfolio</span>
        </a>

        <ul className="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#experience">Experience</a></li>
          <li><a href="#projects">Projects</a></li>
          <li><a href="#credentials">Credentials</a></li>
          <li><a href="#gallery">Gallery</a></li>
          <li>
            <a href="#contact" className="nav-cta">
              Get in touch <ArrowIcon />
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}