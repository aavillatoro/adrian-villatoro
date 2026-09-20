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

function makeRand(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

// two zones per section, both kept to the top three quarters: a column down each
// gutter beside the content, and a strip across the full width above it. gutter
// x is px from centre so those stars clip off-screen rather than drifting onto
// the text when the window narrows; the strip clears the content vertically, so
// percentages are safe there. seeded - Math.random would desync hydration.
function makeStars(seed: number, gutterCount: number, near: number, far: number, stripCount: number) {
  const rand = makeRand(seed);
  const chars = ["*", "+", ".", "*", "+"];
  // cycled, not drawn at random - two thirds yellow, and every run of nine is
  // guaranteed one of each accent rather than leaving a colour out by chance
  const tints = ["yellow", "yellow", "white", "yellow", "yellow", "purple", "yellow", "yellow", "blue"];
  let n = 0;
  const star = (left: string, y: number) => {
    const duration = +(3.4 + rand() * 3).toFixed(2);
    return {
      left,
      top: `${y.toFixed(2)}%`,
      char: chars[Math.floor(rand() * chars.length)],
      size: +(rand() * 5 + 10).toFixed(1),
      duration,
      // negative, so each star loads already partway through its cycle. a
      // positive delay would park every star at its default opacity until the
      // timer fired, which is why they all came up lit on refresh.
      delay: +(-rand() * duration).toFixed(2),
      tint: tints[n++ % tints.length],
    };
  };

  const stars = [];

  // one star per band down each gutter, jittered inside its band. pure random
  // clumps three in a corner and leaves gaps; banding keeps the spacing even.
  const perSide = Math.round(gutterCount / 2);
  const bandHeight = (75 - 20) / perSide;
  for (let side = 0; side < 2; side += 1) {
    for (let row = 0; row < perSide; row += 1) {
      const x = Math.round((near + rand() * (far - near)) * (side === 0 ? -1 : 1));
      // right column sits a quarter band lower so the sides don't read as pairs
      const frac = 0.2 + side * 0.25 + rand() * 0.4;
      stars.push(star(`calc(50% + ${x}px)`, 20 + bandHeight * (row + frac)));
    }
  }

  // strip above the content - high enough to stay off the name and yoshi even
  // on a short viewport, where the centred content creeps upward
  const colWidth = 92 / stripCount;
  for (let col = 0; col < stripCount; col += 1) {
    stars.push(star(`${(4 + colWidth * (col + 0.15 + rand() * 0.7)).toFixed(2)}%`, 3 + rand() * 12));
  }

  return stars;
}

const introStars = makeStars(20260920, 26, 490, 700, 16);
const contactStars = makeStars(77712345, 24, 330, 640, 12);

function Starfield({ stars }: { stars: ReturnType<typeof makeStars> }) {
  return (
    <div className="starfield" aria-hidden="true">
      {stars.map((star, i) => (
        <span
          key={i}
          className={`star star-${star.tint}`}
          style={{
            left: star.left,
            top: star.top,
            fontSize: `${star.size}px`,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
          }}
        >
          {star.char}
        </span>
      ))}
    </div>
  );
}

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
          <a href="#hobbies">hobbies</a>
          <a href="#contact">contact</a>
        </nav>
      </header>

      <section className="screen intro" id="home">
        <Starfield stars={introStars} />
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
        <SectionChevron href="#work" label="Scroll to recent projects" />
      </section>

      <section className="screen work" id="work">
        <div className="screen-content">
          <div className="section-title">
            <h2>recent projects</h2>
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
            <h2>background</h2>
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
        <SectionChevron href="#hobbies" label="Scroll to hobbies" />
      </section>

      <section className="screen hobbies" id="hobbies">
        <div className="screen-content">
          <div className="section-title">
            <h2>hobbies</h2>
          </div>

          <div className="hobbies-content">
            <p className="hobbies-text">
              Outside of coding, I enjoy many different hobbies. I play a ton of
              Valorant and eventually hit Radiant. As IGL, I&apos;ve helped my
              uni win over $1,000 in earnings across LANs in the east coast!
              I&apos;m also an avid Liverpool FC supporter (YNWA) and recently
              picked up bouldering.
            </p>
            <div className="hobbies-logos">
              <Image
                className="hobbies-logo hobbies-logo-radiant"
                src="/valorant-radiant.png"
                alt="Valorant Radiant rank"
                width={1024}
                height={1024}
              />
              <Image
                className="hobbies-logo"
                src="/liverpool.png"
                alt="Liverpool FC liver bird"
                width={280}
                height={430}
              />
            </div>
          </div>
        </div>
        <SectionChevron href="#contact" label="Scroll to contact" />
      </section>

      <section className="screen contact" id="contact">
        <Starfield stars={contactStars} />
        <div className="screen-content contact-content">
          <Image
            className="contact-star"
            src="/star-spinning.gif"
            alt="Spinning star"
            width={200}
            height={194}
            unoptimized
          />
          <h2>Reach out to me on:</h2>
          <div className="contact-links">
            <a href="mailto:aavillatorouriona@gmail.com" aria-label="Email Adrian" title="Email">
              (email)
            </a>
            <a href="https://www.linkedin.com/in/adrian-villatoro" target="_blank" rel="noreferrer" aria-label="Adrian on LinkedIn" title="LinkedIn">
              (linkedin)
            </a>
          </div>
        </div>
        <SectionChevron href="#home" label="Back to top" up />
      </section>
    </main>
  );
}
