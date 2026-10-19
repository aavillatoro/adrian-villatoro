"use client";

import Image from "next/image";
import { useId, useState } from "react";

export type Project = {
  title: string;
  date: string;
  summary: string;
  stack: string;
  // set together: these projects go in the win row and open to show both
  image?: string;
  links?: { label: string; href: string }[];
};

const chars = ["*", "+", ".", "*", "+"];

// built with the web animations api so particles need no react state and
// clean themselves up
function burst(from: Element) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const origin = from.getBoundingClientRect();
  const x = origin.left + origin.width / 2;
  const y = origin.top + origin.height / 2;

  for (let i = 0; i < 28; i += 1) {
    const star = document.createElement("span");
    star.className = "confetti-star";
    star.textContent = chars[Math.floor(Math.random() * chars.length)];
    // every fifth one white, the rest yellow
    star.style.color = i % 5 === 0 ? "var(--star-white)" : "var(--star-yellow)";
    star.style.left = `${x}px`;
    star.style.top = `${y}px`;
    star.style.fontSize = `${14 + Math.random() * 10}px`;
    document.body.appendChild(star);

    const angle = Math.random() * Math.PI * 2;
    const speed = 80 + Math.random() * 110;
    const dx = Math.cos(angle) * speed;
    const dy = Math.sin(angle) * speed - 40;
    const spin = (Math.random() - 0.5) * 360;
    star
      .animate(
        [
          { transform: "translate(-50%, -50%) rotate(0deg)", opacity: 1 },
          { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${spin / 2}deg)`, opacity: 1, offset: 0.45 },
          // second leg drops, so the burst falls instead of just fading out
          { transform: `translate(calc(-50% + ${dx * 1.3}px), calc(-50% + ${dy + 70}px)) rotate(${spin}deg)`, opacity: 0 },
        ],
        { duration: 900 + Math.random() * 500, easing: "cubic-bezier(0.2, 0.7, 0.4, 1)" },
      )
      .finished.then(() => star.remove(), () => star.remove());
  }
}

// the open card takes the whole row with its image in the other column, so
// the text stays put and the other card moves down a row
export default function WinRow({ projects }: { projects: Project[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const idBase = useId();

  const toggle = (i: number, card: HTMLElement) => {
    if (open === i) {
      setOpen(null);
      return;
    }
    setOpen(i);
    const text = card.querySelector("p");
    if (text) burst(text);
  };

  return (
    <>
      {projects.map((project, i) => {
        const isOpen = open === i;
        const detailsId = `${idBase}-${i}`;
        return (
          <article
            key={project.title}
            className={isOpen ? "win-card is-open" : "win-card"}
            data-side={i % 2 === 0 ? "left" : "right"}
          >
            <div className="win-text">
              <div className="project-title">
                <h3>
                  <button
                    type="button"
                    className="win-toggle"
                    aria-expanded={isOpen}
                    aria-controls={detailsId}
                    onClick={(event) => toggle(i, event.currentTarget.closest("article")!)}
                  >
                    {project.title}
                  </button>
                </h3>
                <time>{project.date}</time>
                <span className="project-toggle" data-open={isOpen} aria-hidden="true" />
              </div>
              <p>{project.summary}</p>
              <small>{project.stack}</small>
              {isOpen && project.links && (
                <div id={detailsId} className="project-links">
                  {project.links.map((link) => (
                    <a key={link.href} className="text-link" href={link.href} target="_blank" rel="noreferrer">
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
            {isOpen && project.image && (
              <Image
                className="project-image win-image"
                src={project.image}
                alt={`${project.title} screenshot`}
                width={1600}
                height={900}
                unoptimized
              />
            )}
          </article>
        );
      })}
    </>
  );
}
