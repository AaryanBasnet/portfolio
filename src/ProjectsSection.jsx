import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { projects, filters } from './data';

// Order of the grid under the featured (thesis) card, by project id in data.js.
// Any project missing from this list is appended in data order.
const GRID_ORDER = ['03', '04', '01', '02', '06'];

// Tint behind each device frame and colour of the hero block in the drawn fallback.
const LOOK = {
  '05': { bg: '#1B1816', hero: '#E8250E' },
  '03': { bg: '#F0CDBE', hero: '#0D0D0D' },
  '04': { bg: '#D9D8C3', hero: '#E8250E' },
  '01': { bg: '#DDD0BD', hero: '#0D0D0D' },
  '02': { bg: '#E8250E', hero: '#0D0D0D' },
  '06': { bg: '#E6DDCF', hero: '#E8250E' },
};
const DEFAULT_LOOK = { bg: '#EAE4D4', hero: '#0D0D0D' };

const pad = (n) => String(n).padStart(2, '0');
const focusRing = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-ink';

function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden="true">
      <path d="M7 17L17 7M8 7h9v9" />
    </svg>
  );
}

/* ---------- device frames + drawn fallbacks ---------- */

function BrowserSkeleton({ hero }) {
  return (
    <div className="flex h-full flex-col gap-3 p-3.5" aria-hidden="true">
      <div className="flex items-center justify-between">
        <span className="h-[9px] w-[18%] bg-ink" />
        <span className="flex gap-2.5">
          <span className="h-[7px] w-7 bg-ink/20" />
          <span className="h-[7px] w-7 bg-ink/20" />
          <span className="h-[7px] w-7 bg-ink/20" />
        </span>
      </div>
      <div className="h-[32%]" style={{ backgroundColor: hero }} />
      <div className="grid flex-1 grid-cols-3 gap-2.5">
        <div className="bg-bone" />
        <div className="bg-bone" />
        <div className="bg-bone" />
      </div>
    </div>
  );
}

function PhoneSkeleton({ hero }) {
  return (
    <div className="flex h-full flex-col gap-2.5 p-3" aria-hidden="true">
      <span className="mx-auto h-2 w-1/3 rounded bg-ink" />
      <div className="h-[30%]" style={{ backgroundColor: hero }} />
      <div className="h-2.5 w-3/5 bg-ink" />
      <div className="grid flex-1 grid-cols-2 gap-2">
        <div className="bg-bone" />
        <div className="bg-bone" />
        <div className="bg-bone" />
        <div className="bg-bone" />
      </div>
    </div>
  );
}

function BrowserFrame({ children }) {
  return (
    <div className="absolute left-[11%] top-[22%] flex h-[92%] w-[78%] flex-col border-[1.5px] border-ink bg-white shadow-[8px_8px_0_rgba(13,13,13,0.2)]">
      <div className="flex items-center gap-1.5 border-b-[1.5px] border-ink px-3 py-[9px]">
        <span className="h-2 w-2 rounded-full bg-ink" />
        <span className="h-2 w-2 rounded-full bg-ink/45" />
        <span className="h-2 w-2 rounded-full bg-ink/20" />
        <span className="ml-2.5 h-[9px] flex-1 bg-bone" />
      </div>
      <div className="relative min-h-0 flex-1 overflow-hidden">{children}</div>
    </div>
  );
}

function PhoneFrame({ children }) {
  return (
    <div className="absolute left-1/2 top-[14%] aspect-[9/18] w-[30%] -translate-x-1/2 overflow-hidden rounded-[26px] border-[5px] border-ink bg-white shadow-[8px_8px_0_rgba(13,13,13,0.25)]">
      {children}
    </div>
  );
}

// Drawn placeholder shown for projects that have no mockup image (`cardImage`) yet.
function Screen({ project, hero }) {
  const isPhone = project.category === 'Mobile';
  return isPhone ? (
    <PhoneFrame><PhoneSkeleton hero={hero} /></PhoneFrame>
  ) : (
    <BrowserFrame><BrowserSkeleton hero={hero} /></BrowserFrame>
  );
}

/* ---------- card pieces ---------- */

function Media({ project, ratio }) {
  const look = LOOK[project.id] || DEFAULT_LOOK;
  return (
    <div className={`relative overflow-hidden border-[1.5px] border-ink ${ratio}`} style={{ backgroundColor: look.bg }}>
      <span className="font-mono absolute left-3.5 top-3.5 z-10 border-[1.5px] border-ink bg-cream px-2.5 py-1.5 text-[0.68rem] font-medium uppercase tracking-[0.1em]">
        {project.thesis ? `${project.category} · Thesis` : project.category}
      </span>
      <span
        aria-hidden="true"
        className="absolute right-3.5 top-3.5 z-10 flex h-11 w-11 items-center justify-center border-[1.5px] border-ink bg-cream text-ink transition-colors group-hover:bg-ink group-hover:text-cream"
      >
        <ArrowIcon />
      </span>
      {project.cardImage ? (
        <img
          src={project.cardImage}
          alt={`${project.title}: ${project.subtitle}`}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.3,1)] group-hover:scale-[1.03]"
        />
      ) : (
        <Screen project={project} hero={look.hero} />
      )}
    </div>
  );
}

function TagList({ tags }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {tags.slice(0, 4).map((tag) => (
        <li key={tag} className="font-mono border border-rule bg-bone px-[9px] py-[5px] text-[0.68rem] uppercase tracking-[0.08em] text-muted">
          {tag}
        </li>
      ))}
    </ul>
  );
}

function TitleLink({ project, onOpen, children }) {
  // The button stretches over the whole card (after:absolute after:inset-0), so a click anywhere opens the case study.
  return (
    <button
      type="button"
      onClick={() => onOpen(project)}
      aria-label={`Open ${project.title} case study`}
      className={`m-0 cursor-pointer border-0 bg-transparent p-0 text-left text-inherit transition-colors group-hover:text-red after:absolute after:inset-0 after:content-[''] ${focusRing}`}
    >
      {children}
    </button>
  );
}

function CardFooter({ project }) {
  const hasLive = project.website && project.website !== '#';
  const isFigma = Boolean(project.websiteLabel);
  const pill = `relative z-10 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[0.68rem] font-medium tracking-[0.12em] transition-colors ${focusRing}`;
  return (
    <div className="font-mono flex flex-wrap items-center justify-between gap-3 border-t border-rule pt-4 text-xs uppercase tracking-[0.1em]">
      <span className="font-medium underline decoration-[1.5px] underline-offset-[5px] transition-colors group-hover:text-red">
        View case study →
      </span>
      <span className="flex flex-wrap items-center gap-2">
        {hasLive && (
          <a href={project.website} target="_blank" rel="noreferrer" className={`${pill} bg-ink text-cream hover:bg-red`}>
            {!isFigma && (
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
            )}
            {isFigma ? 'Figma file' : 'Live site'} <span aria-hidden="true">↗</span>
          </a>
        )}
        {project.link && (
          <a href={project.link} target="_blank" rel="noreferrer" className={`${pill} border border-ink/30 text-ink hover:border-ink hover:bg-ink hover:text-cream`}>
            GitHub <span aria-hidden="true">↗</span>
          </a>
        )}
      </span>
    </div>
  );
}

function FeaturedCard({ project, number, onOpen }) {
  return (
    <article className="group relative flex cursor-pointer flex-wrap items-stretch gap-10">
      <div className="min-w-0 flex-[1.5_1_520px]">
        <Media project={project} ratio="aspect-[3/2]" />
      </div>
      <div className="flex min-w-0 flex-[1_1_320px] flex-col justify-end gap-5">
        <div className="font-mono flex items-center gap-3.5 text-xs tracking-[0.14em] text-red">
          <span>#{pad(number)}</span>
          <span className="h-[1.5px] w-6 bg-red" />
          <span>FEATURED · THESIS</span>
        </div>
        <h3 className="font-display m-0 text-[clamp(56px,6vw,88px)] font-normal leading-[0.92] tracking-wide">
          <TitleLink project={project} onOpen={onOpen}>{project.title}</TitleLink>
        </h3>
        <p className="font-serif m-0 text-[1.35rem] italic text-muted">{project.subtitle}</p>
        <p className="m-0 max-w-[440px] text-[1rem] font-light leading-[1.7] text-muted">{project.description}</p>
        <TagList tags={project.tech} />
        <CardFooter project={project} />
      </div>
    </article>
  );
}

function ProjectCard({ project, number, onOpen }) {
  return (
    <article className="group relative flex min-w-0 cursor-pointer flex-col gap-[22px]">
      <Media project={project} ratio="aspect-[4/3]" />
      <div className="flex flex-col gap-3">
        <div className="flex items-baseline gap-4">
          <span className="font-mono text-xs tracking-[0.14em] text-red">#{pad(number)}</span>
          <h3 className="font-display m-0 text-[48px] font-normal leading-[0.95] tracking-wide">
            <TitleLink project={project} onOpen={onOpen}>{project.title}</TitleLink>
          </h3>
        </div>
        <p className="font-serif m-0 text-[1.2rem] italic text-muted">{project.subtitle}</p>
        <p className="m-0 max-w-[520px] text-[0.95rem] font-light leading-[1.7] text-muted">{project.description}</p>
        <TagList tags={project.tech} />
      </div>
      <CardFooter project={project} />
    </article>
  );
}

/* ---------- section ---------- */

export default function ProjectsSection({ onOpen }) {
  const [filter, setFilter] = useState('All');
  const reduceMotion = useReducedMotion();

  const featured = projects.find((p) => p.thesis);
  const ordered = GRID_ORDER.map((id) => projects.find((p) => p.id === id)).filter(Boolean);
  const rest = [...ordered, ...projects.filter((p) => p !== featured && !GRID_ORDER.includes(p.id))];

  const showFeatured = Boolean(featured) && (filter === 'All' || featured.category === filter);
  const gridItems = rest.filter((p) => filter === 'All' || p.category === filter);
  const offset = showFeatured ? 1 : 0;
  const total = offset + gridItems.length;

  const rise = {
    initial: reduceMotion ? false : { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.7, ease: [0.25, 1, 0.3, 1] },
  };

  return (
    <section id="projects" aria-labelledby="projects-heading" className="py-32">
      <div className="mx-auto flex max-w-7xl flex-col gap-14 px-5 md:px-12">
        <motion.header {...rise} className="flex flex-wrap items-end justify-between gap-8">
          <div className="flex max-w-[640px] flex-col gap-5">
            <div className="font-mono inline-flex items-center gap-3 text-[0.65rem] font-medium uppercase tracking-[0.35em] text-red before:h-px before:w-6 before:bg-red before:content-['']">
              Ch. 02
            </div>
            <h2 id="projects-heading" className="font-display m-0 text-[clamp(3.5rem,7vw,7rem)] leading-[0.9] tracking-wide text-ink">
              Projects
            </h2>
            <p className="m-0 max-w-[460px] text-[0.95rem] font-light leading-[1.8] text-muted">
              Full-stack, AI and mobile work, each one built independently.
            </p>
          </div>

          <div className="flex flex-col gap-3.5">
            <div className="font-mono text-xs tracking-[0.14em] text-muted" aria-live="polite">
              {pad(total)} {total === 1 ? 'PROJECT' : 'PROJECTS'}
            </div>
            <div role="group" aria-label="Filter projects" className="flex flex-wrap gap-2">
              {filters.map((f) => {
                const active = filter === f;
                return (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFilter(f)}
                    aria-pressed={active}
                    className={`font-mono min-h-11 cursor-pointer border-[1.5px] border-ink px-5 text-xs font-medium uppercase tracking-[0.1em] ${focusRing} ${
                      active ? 'bg-ink text-cream' : 'bg-transparent text-ink hover:bg-bone'
                    }`}
                  >
                    {f}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.header>

        {showFeatured && (
          <motion.div {...rise}>
            <FeaturedCard project={featured} number={1} onOpen={onOpen} />
          </motion.div>
        )}

        {gridItems.length > 0 && (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,440px),1fr))] gap-x-10 gap-y-16">
            {gridItems.map((project, i) => (
              <motion.div key={`${filter}-${project.id}`} {...rise}>
                <ProjectCard project={project} number={i + 1 + offset} onOpen={onOpen} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
