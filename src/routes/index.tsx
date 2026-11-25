import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowUpRight,
  AtSign,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  CircleDot,
  CodeXml,
  Download,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Send,
  ShieldCheck,
  X,
} from "lucide-react";
import {
  SiGithubactions,
  SiJira,
  SiMysql,
  SiPostman,
  SiPytest,
  SiPython,
  SiSelenium,
} from "react-icons/si";
import { Button } from "@/components/ui/button";
import headshotAsset from "@/assets/samukelo-headshot.asset.json";
import { RecruiterChat } from "@/components/recruiter-chat";

const emailAddress = "samkeloacele@gmail.com";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Samukelo Cele — Junior Test Analyst & Software Tester" },
      {
        name: "description",
        content:
          "Junior Test Analyst in Durban, South Africa. Explore Samukelo Cele’s manual testing, API automation, SQL validation, and software quality projects.",
      },
      { property: "og:title", content: "Samukelo Cele — Junior Test Analyst" },
      {
        property: "og:description",
        content:
          "I find the bugs before your users do. Junior Test Analyst specializing in manual testing, API automation, and software quality.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Portfolio,
});

const projects = [
  {
    number: "01",
    category: "Manual & API testing",
    title: "AI Smart Shopper",
    description:
      "Planned and executed 7 risk-based test cases. Uncovered a critical API defect: negative quantities were accepted instead of returning 400 Bad Request.",
    tools: ["Jira", "Postman", "Python", "API testing"],
    href: "https://github.com/SamukeloInTech/ai-smart-shopper-qa",
    accent: "mint",
  },
  {
    number: "02",
    category: "API automation · CI/CD",
    title: "Restful Booker",
    description:
      "Built a Postman collection with 8 JavaScript assertions and an automated Python/pytest flow. GitHub Actions runs the suite on every push.",
    tools: ["Postman", "Python", "Pytest", "GitHub Actions"],
    href: "https://github.com/SamukeloInTech/api-testing-portfolio",
    accent: "blue",
  },
  {
    number: "03",
    category: "UI automation · CI/CD",
    title: "SauceDemo",
    description:
      "Created 14 Selenium and pytest tests with Page Object Model, explicit waits, reusable fixtures, and headless Chrome reporting in CI.",
    tools: ["Selenium", "Python", "Pytest", "POM", "GitHub Actions"],
    href: "https://github.com/SamukeloInTech/saucedemo-automation",
    accent: "coral",
  },
  {
    number: "04",
    category: "Manual testing",
    title: "ParaBank Banking App",
    description:
      "Tested account overviews and transfers across 8 cases. Reported 3 defects—2 Critical and 1 Major—including transfers with a $0.00 balance.",
    tools: ["Manual QA", "RTM", "Bug reporting"],
    href: "https://github.com/SamukeloInTech/QA-Banking-Portfolio",
    accent: "coral",
  },
  {
    number: "05",
    category: "Database testing",
    title: "SQL E-Commerce Database",
    description:
      "Built a MySQL schema and test data, verified application records with JOIN and GROUP BY queries, and tested key integrity constraints.",
    tools: ["MySQL", "SQL", "Workbench"],
    href: "https://github.com/SamukeloInTech/SQL-Manual-QA-Project",
    accent: "mint",
  },
];

const skills = [
  { name: "Selenium", icon: SiSelenium, category: "UI automation" },
  { name: "pytest", icon: SiPytest, category: "Test framework" },
  { name: "Postman", icon: SiPostman, category: "API testing" },
  { name: "Jira", icon: SiJira, category: "Defect tracking" },
  { name: "Python", icon: SiPython, category: "Programming" },
  { name: "MySQL", icon: SiMysql, category: "Data validation" },
  { name: "GitHub Actions", icon: SiGithubactions, category: "CI / CD" },
];

const education = [
  {
    type: "Qualification",
    title: "Advanced Diploma in ICT",
    place: "Durban University of Technology",
    date: "2026",
    state: "Completed",
  },
  {
    type: "Qualification",
    title: "Diploma in ICT · Application Development",
    place: "Durban University of Technology",
    date: "2023—2025",
    state: "Completed",
  },
  {
    type: "Certification",
    title: "ISTQB Certified Tester · Foundation Level",
    place: "International Software Testing Qualifications Board",
    date: "In progress",
    state: "In progress",
  },
  {
    type: "Certification",
    title: "Introduction to pytest",
    place: "Test Automation University",
    date: "2026",
    state: "Completed",
  },
];

const testingMethods = [
  "Manual testing",
  "Functional testing",
  "API testing",
  "Regression testing",
  "Smoke & exploratory",
  "SQL data validation",
  "Agile / Scrum",
  "SDLC / STLC",
  "Defect lifecycle",
  "Git & Markdown",
  "Chrome DevTools",
];

function Portfolio() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactState, setContactState] = useState("idle");

  function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    if (!name || !email || !message) return;

    const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\nFrom ${name}\n${email}`);
    window.location.href = `mailto:${emailAddress}?subject=${subject}&body=${body}`;
    setContactState("ready");
  }

  return (
    <main className="portfolio-shell min-h-screen bg-background text-foreground">
      <header className="site-header">
        <a className="wordmark" href="#home" aria-label="Samukelo Cele home">
          <span className="wordmark-mark">SC</span>
          <span>Samukelo Cele</span>
          <span className="wordmark-availability"><span /> Open to opportunities</span>
        </a>
        <Button
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          className="menu-toggle"
          size="icon"
          variant="outline"
          onClick={() => setMenuOpen((current) => !current)}
        >
          {menuOpen ? <X /> : <Menu />}
        </Button>
        <nav className={`site-nav${menuOpen ? " is-open" : ""}`} aria-label="Main navigation">
          {[
            ["About", "#about"],
            ["Skills", "#skills"],
            ["Projects", "#projects"],
            ["Education", "#education"],
          ].map(([label, href]) => (
            <a href={href} key={label} onClick={() => setMenuOpen(false)}>
              {label}
            </a>
          ))}
          <Button asChild className="nav-contact" size="sm">
            <a href="#contact">Let’s talk <ArrowUpRight aria-hidden="true" /></a>
          </Button>
        </nav>
      </header>

      <section className="hero-section" id="home">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-line" /> TEST WITH INTENTION</p>
          <p className="hero-role">Junior Test Analyst <span>·</span> Software Tester</p>
          <h1>Samukelo<br /><span>Cele</span><span className="hero-period">.</span></h1>
          <p className="hero-summary">
            I find the bugs before your users do. Thoughtful, hands-on software testing—from API automation to the last data point.
          </p>
          <div className="hero-buttons">
            <Button asChild className="hero-primary" size="lg">
              <a href="#projects">Explore my work <ArrowDownRight aria-hidden="true" /></a>
            </Button>
            <Button asChild className="hero-secondary" size="lg" variant="outline">
              <a href="/SAMUKELO_CELE_RESUME.pdf" download="SAMUKELO_CELE_RESUME.pdf">
                <Download aria-hidden="true" /> Download résumé
              </a>
            </Button>
          </div>
          <div className="hero-socials" aria-label="Social links">
            <a href="https://github.com/SamukeloInTech" target="_blank" rel="noreferrer"><Github /> GitHub <ArrowUpRight /></a>
            <a href="https://linkedin.com/in/samukelo-cele" target="_blank" rel="noreferrer"><Linkedin /> LinkedIn <ArrowUpRight /></a>
            <a href="mailto:samkeloacele@gmail.com"><Mail /> Email <ArrowUpRight /></a>
          </div>
        </div>

        <div className="hero-art" aria-label="Samukelo Cele's professional profile">
          <div className="art-orbit orbit-one" />
          <div className="art-orbit orbit-two" />
          <div className="portrait-placeholder">
            <img className="portrait-image" src={headshotAsset.url} alt="Portrait of Samukelo Cele" />
            <span className="portrait-availability"><span /> AVAILABLE FOR WORK</span>
          </div>
          <span className="art-plus plus-top">+</span>
          <span className="art-plus plus-bottom">+</span>
          <div className="quality-stamp">
            <ShieldCheck />
            <span>Quality, by<br /><strong>design.</strong></span>
          </div>
          <div className="art-note"><span>Durban, South Africa</span><MapPin /></div>
        </div>

        <a className="hero-scroll" href="#about" aria-label="Scroll to about section">
          <span>SCROLL TO EXPLORE</span><ArrowDown />
        </a>
        <p className="hero-index">PORTFOLIO <span>2026</span></p>
      </section>

      <section className="intro-strip" aria-label="Areas of focus">
        <div><span className="strip-index">01</span><strong>Manual testing</strong><span>Test what matters</span></div>
        <div><span className="strip-index">02</span><strong>API automation</strong><span>Verify every response</span></div>
        <div><span className="strip-index">03</span><strong>Data validation</strong><span>Trust every record</span></div>
        <div><span className="strip-index">04</span><strong>CI / CD</strong><span>Keep quality in motion</span></div>
      </section>

      <section className="content-section about-section" id="about">
        <SectionHeading number="01" label="A little about me" title={<>Curious by nature.<br /><span>Rigorous by choice.</span></>} />
        <div className="about-body">
          <p className="about-lede">
            I’m an ICT graduate and aspiring test analyst who believes great software starts with great questions.
          </p>
          <div className="about-detail">
            <p>
              With an Advanced Diploma in ICT from Durban University of Technology, I’ve put theory into practice across hands-on testing projects. I translate business rules into clear test scenarios, check actual outcomes against expected results, capture evidence, and report reproducible defects in Jira.
            </p>
            <p>
              I’ve tested web APIs by hand in Postman and automated them with Python, requests, and pytest in GitHub Actions. My work also covers UI automation with Selenium and SQL data validation. Analytical, disciplined, and ready to grow on an Agile delivery team.
            </p>
            <a className="text-link" href="#contact">A little more about what I bring <ArrowUpRight /></a>
          </div>
        </div>
        <div className="about-stat-row">
          <Stat value="5" label="Quality projects" />
          <Stat value="14" label="UI tests automated" />
          <Stat value="3" label="Defects reported" />
          <Stat value="DUT" label="ICT graduate" />
        </div>
      </section>

      <section className="skills-section" id="skills">
        <div className="content-section skills-inner">
          <SectionHeading number="02" label="Tools of the trade" title={<>Tools I trust.<br /><span>Skills I keep sharpening.</span></>} />
          <div className="skills-grid">
            {skills.map(({ name, icon: Icon, category }) => (
              <div className="skill-tile" key={name}>
                <div className="skill-icon"><Icon aria-hidden="true" /></div>
                <div><span className="skill-category">{category}</span><strong>{name}</strong></div>
                <ArrowUpRight className="skill-arrow" aria-hidden="true" />
              </div>
            ))}
          </div>
          <div className="methods-row">
            <span className="methods-label">ALSO IN MY TOOLKIT</span>
            <div className="methods-list">
              {testingMethods.map((method) => <span className="method-tag" key={method}><span />{method}</span>)}
            </div>
          </div>
        </div>
      </section>

      <section className="content-section projects-section" id="projects">
        <SectionHeading number="03" label="Selected work" title={<>Finding issues.<br /><span>Building confidence.</span></>} />
        <div className="projects-intro">
          <p>Real testing work, built into a growing software quality practice.</p>
          <a className="project-index-link" href="https://github.com/SamukeloInTech" target="_blank" rel="noreferrer">MORE ON GITHUB <ArrowUpRight /></a>
        </div>
        <div className="projects-grid">
          {projects.map((project) => (
            <article className={`project-card project-${project.accent}`} key={project.number}>
              <div className="project-card-top"><span>{project.number} <span className="project-top-sep">/</span> PROJECT</span><CodeXml aria-hidden="true" /></div>
              <p className="project-category">{project.category}</p>
              <h3>{project.title}</h3>
              <p className="project-description">{project.description}</p>
              <div className="project-tools" aria-label="Tools used">
                {project.tools.map((tool) => <span key={tool}>{tool}</span>)}
              </div>
              <a className="project-repo" href={project.href} target="_blank" rel="noreferrer">
                <Github aria-hidden="true" /> View repository <ArrowUpRight aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="education-section" id="education">
        <div className="content-section education-inner">
          <SectionHeading number="04" label="The foundation" title={<>Learning that<br /><span>keeps going.</span></>} />
          <div className="education-list">
            {education.map((item, index) => (
              <article className="education-item" key={item.title}>
                <div className="education-marker"><span />{index < education.length - 1 && <i />}</div>
                <div className="education-copy">
                  <span className="education-type">{item.type}</span>
                  <h3>{item.title}</h3>
                  <p>{item.place}</p>
                </div>
                <div className="education-result">
                  <span className={`education-state${item.state === "In progress" ? " is-progress" : ""}`}>
                    {item.state === "Completed" && <Check />}{item.state}
                  </span>
                  <span className="education-date">{item.date}</span>
                </div>
              </article>
            ))}
          </div>
          <div className="education-note"><CircleDot /> <span>Growing a career in software quality, one careful test at a time.</span></div>
        </div>
      </section>

      <section className="content-section contact-section" id="contact">
        <div className="contact-heading">
          <p className="eyebrow"><span className="eyebrow-line" /> THE NEXT GOOD THING</p>
          <h2>Let’s make<br /><span>software better.</span></h2>
          <p className="contact-intro">Looking for a curious junior test analyst? I’d love to hear what your team is building.</p>
          <div className="contact-location"><MapPin /> Durban, KwaZulu-Natal, South Africa</div>
          <a className="email-direct" href="mailto:samkeloacele@gmail.com"><Mail /> {emailAddress} <ArrowUpRight /></a>
        </div>
        <form className="contact-form" onSubmit={submitContact}>
          <p className="form-eyebrow">SEND A NOTE</p>
          <label htmlFor="contact-name">Your name</label>
          <input id="contact-name" name="name" placeholder="How should I address you?" autoComplete="name" required />
          <label htmlFor="contact-email">Your email</label>
          <input id="contact-email" name="email" type="email" placeholder="you@company.com" autoComplete="email" required />
          <label htmlFor="contact-message">A little about what you’re looking for</label>
          <textarea id="contact-message" name="message" rows={4} placeholder="Tell me about the opportunity..." required />
          {contactState === "ready" && (
            <p className="contact-notice" role="status">
              <Check /> Your email app is ready with the message. Send it there to get in touch.
            </p>
          )}
          <Button className="contact-submit" size="lg" type="submit">
            Prepare your message <Send aria-hidden="true" />
          </Button>
          <p className="contact-note">Your email app will open with your message ready to send.</p>
        </form>
      </section>

      <footer className="site-footer">
        <a className="footer-brand" href="#home"><span className="wordmark-mark">SC</span><span>Samukelo Cele</span></a>
        <p>Care in every check. Confidence in every release.</p>
        <div className="footer-links">
          <a href="https://linkedin.com/in/samukelo-cele" aria-label="LinkedIn" target="_blank" rel="noreferrer"><Linkedin /></a>
          <a href="https://github.com/SamukeloInTech" aria-label="GitHub" target="_blank" rel="noreferrer"><Github /></a>
          <a href={`mailto:${emailAddress}`} aria-label="Email Samukelo"><AtSign /></a>
        </div>
        <span className="footer-year">© 2026</span>
      </footer>
      <a className="back-to-top" href="#home" aria-label="Back to top"><ChevronDown /></a>
      <RecruiterChat />
    </main>
  );
}

function SectionHeading({ number, label, title }: { number: string; label: string; title: React.ReactNode }) {
  return (
    <div className="section-heading">
      <p className="section-kicker"><span>{number}</span>{label}</p>
      <h2>{title}</h2>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return <div className="about-stat"><strong>{value}</strong><span>{label}</span></div>;
}