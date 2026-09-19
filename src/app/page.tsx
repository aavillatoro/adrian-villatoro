import Image from "next/image";

const projects = [
  {
    title: "ResearchFlow",
    date: "2026",
    summary:
      "Research-paper discovery platform that retrieves, normalizes, and ranks academic results.",
    stack: "Python / FastAPI / PostgreSQL / React / TypeScript",
  },
  {
    title: "GIS Database System",
    date: "2026",
    summary:
      "Java GIS with name and coordinate indexing, radius search, and synchronized data structures.",
    stack: "Java / BST / 2D kd-tree",
  },
  {
    title: "HerAI.Life",
    date: "2025",
    summary:
      "Full-stack conversational application with faster API responses and message processing.",
    stack: "Node.js / React / DeepSeek Distill",
  },
  {
    title: "Zenith Task",
    date: "2025",
    summary:
      "Study organizer with task management, Pomodoro timers, and a deployed REST API.",
    stack: "Python / JavaScript / Flask",
  },
];

function SectionChevron({ href, label, up = false }: { href: string; label: string; up?: boolean }) {
  return (
    <a className="section-chevron" href={href} aria-label={label}>
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d={up ? "M5 15l7-7 7 7" : "M5 9l7 7 7-7"} />
      </svg>
    </a>
  );
}

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <nav aria-label="Primary navigation">
          <a href="#work">work</a>
          <a href="#background">background</a>
          <a href="#contact">contact</a>
        </nav>
      </header>

      <section className="screen intro" id="home">
        <div className="screen-content intro-content">
          <div className="hero-copy">
          <h1 className="hero-name">adrian villatoro</h1>
          <p className="intro-text">
            Hey, I&apos;m Adrian. I&apos;m from Arlington, VA and am currently a
            senior studying Computer Science @ Virginia Tech. I work across
            full-stack web development, APIs, and data systems.
          </p>
          <div className="intro-actions">
            <a className="text-link" href="#work">View work</a>
            <div className="social-links" aria-label="Social profiles">
              <a
                href="https://github.com/aavillatoro"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 .3A12 12 0 0 0 8.2 23.7c.6.1.8-.3.8-.6v-2.3c-3.3.7-4-1.4-4-1.4-.6-1.4-1.4-1.8-1.4-1.8-1.1-.8.1-.8.1-.8 1.2.1 1.9 1.2 1.9 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0C17.6 5.8 18.6 6 18.6 6c.7 1.7.3 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3Z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/adrian-villatoro"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.5 3h-17C2.7 3 2 3.7 2 4.5v15C2 20.3 2.7 21 3.5 21h17c.8 0 1.5-.7 1.5-1.5v-15c0-.8-.7-1.5-1.5-1.5ZM8 18H5V9h3v9ZM6.5 7.8A1.75 1.75 0 1 1 6.5 4.3a1.75 1.75 0 0 1 0 3.5ZM19 18h-3v-4.4c0-1.1 0-2.5-1.5-2.5S13 12.3 13 13.5V18h-3V9h2.9v1.2c.4-.8 1.4-1.5 2.7-1.5 2.9 0 3.4 1.9 3.4 4.4V18Z" />
                </svg>
              </a>
            </div>
          </div>
          </div>
          <Image
            className="hero-gif"
            src="/hero-yoshi.gif"
            alt="Animated Yoshi"
            width={200}
            height={200}
            unoptimized
            loading="eager"
          />
        </div>
        <SectionChevron href="#work" label="Scroll to selected work" />
      </section>

      <section className="screen work" id="work">
        <div className="screen-content">
          <div className="section-title">
            <h2>Selected work</h2>
            <span>2025-2026</span>
          </div>

          <div className="project-list">
            {projects.map((project) => (
              <article key={project.title}>
                <div className="project-title">
                  <h3>{project.title}</h3>
                  <time>{project.date}</time>
                </div>
                <p>{project.summary}</p>
                <small>{project.stack}</small>
              </article>
            ))}
          </div>
        </div>
        <SectionChevron href="#background" label="Scroll to background" />
      </section>

      <section className="screen background" id="background">
        <div className="screen-content">
          <div className="section-title">
            <h2>Background</h2>
          </div>

          <div className="background-grid">
            <div>
              <h3>Education</h3>
              <div className="entry">
                <strong>Virginia Tech</strong>
                <span>2022-2027</span>
                <p>B.S. Computer Science<br />Minor in Japanese Studies</p>
              </div>

              <h3>Skills</h3>
              <p className="skills">
                Python, Java, JavaScript, TypeScript, C, SQL, React, Next.js,
                Node.js, FastAPI, Flask, PostgreSQL, Git
              </p>
            </div>

            <div>
              <h3>Experience</h3>
              <div className="entry">
                <strong>Starbucks Coffee Company</strong>
                <span>2023-2025</span>
                <p>Barista / Blacksburg, Virginia</p>
              </div>
              <div className="entry">
                <strong>Mozaiko LLC</strong>
                <span>2023</span>
                <p>Japanese Language Director</p>
              </div>
              <div className="entry">
                <strong>VVT Esports</strong>
                <span>2022-PRESENT</span>
                <p>Valorant Team Captain</p>
              </div>
            </div>
          </div>
        </div>
        <SectionChevron href="#contact" label="Scroll to contact" />
      </section>

      <section className="screen contact" id="contact">
        <div className="screen-content contact-content">
          <h2>Contact</h2>
          <a className="email" href="mailto:aavillatorouriona@gmail.com">
            aavillatorouriona@gmail.com
          </a>
        </div>
        <SectionChevron href="#home" label="Back to top" up />
      </section>
    </main>
  );
}
