import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion';
import { profile, projects, currentProject, skills, timeline, marqueeItems, filters } from './data';
import { ICONS, skillIcons } from './icons';
import BlockCharacter from './BlockCharacter';

// Hero entrance: fade in + rise 20px, per-element stagger delay, skipped entirely under reduced motion.
const heroEnter = (delay, reduceMotion) => ({
  initial: reduceMotion ? false : { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] },
});

// Buckets cursor distance from a ref's top-center point into 3 named states.
function usePeekState(ref, { far = 300, medium = 150 } = {}) {
  const [state, setState] = useState('far');

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const handleMove = (e) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const dist = Math.hypot(e.clientX - (rect.left + rect.width / 2), e.clientY - rect.top);
      setState(dist > far ? 'far' : dist > medium ? 'medium' : 'close');
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [ref, far, medium]);

  return state;
}

const PEEK_TRANSFORM = {
  far: 'translate(-50%, -78%)',
  medium: 'translate(-50%, -44%)',
  close: 'translate(-50%, 18%)',
};

// Per-letter hover rotation (deg), one set per word so they don't mirror each other.
const AARYAN_ROT = [8, -10, 6, -7, 9, -5];
const BASNET_ROT = [-9, 7, -6, 10, -8, 6];

// Splits a word into per-letter hover-reactive spans. Screen readers get the whole word via
// aria-label on the wrapper; the letters themselves are aria-hidden so it isn't read out twice.
function WigglyWord({ word, rotations }) {
  return (
    <span aria-label={word}>
      {word.split('').map((ch, i) => (
        <span key={i} aria-hidden="true" className="letter" style={{ '--rot': `${rotations[i]}deg` }}>{ch}</span>
      ))}
    </span>
  );
}

// Framer motion variants
const fadeInUp = {
  hidden: { opacity: 0, y: 48 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

// Drops a trailing title word that just repeats the category shown in the kicker above it (e.g. "VENURE WEB" + Web -> "VENURE").
function modalTitle(title, category) {
  const words = title.split(' ');
  if (words.length > 1 && words[words.length - 1].toLowerCase() === category.toLowerCase()) {
    return words.slice(0, -1).join(' ');
  }
  return title;
}

// Live HH:MM in Kathmandu, ticking every second, e.g. "21:42 · KTM".
function KathmanduTime() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const format = () => {
      setTime(new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Kathmandu',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(new Date()));
    };
    format();
    const id = setInterval(format, 1000);
    return () => clearInterval(id);
  }, []);

  if (!time) return null;
  return <span>{time} · KTM</span>;
}

// Shared body for a project card. Thesis work (p.thesis) gets an extra dashed "Thesis" tag next to
// its normal category pill, but still participates in the Web/Mobile/AI filter like every other project.
function ProjectCardBody({ p, tag, onOpen }) {
  return (
    <>
      <div className="flex items-center justify-between mb-7">
        <span className="font-mono text-[0.7rem] text-muted tracking-[0.15em]">#{p.id}</span>
        <div className="flex items-center gap-2">
          {p.thesis && (
            <span className="text-[0.6rem] font-bold tracking-[0.2em] uppercase font-mono px-3.5 py-1.5 border border-dashed border-ink/35 text-muted">Thesis</span>
          )}
          <span className="text-[0.6rem] font-bold tracking-[0.2em] uppercase font-mono px-3.5 py-1.5 border border-ink text-ink">{tag}</span>
        </div>
      </div>

      <h3 className="font-display text-[clamp(2.5rem,5vw,5rem)] tracking-wide leading-[0.9] text-ink transition-colors group-hover:text-red">{p.title}</h3>
      <p className="font-serif italic text-base text-muted mt-1.5">{p.subtitle}</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8 items-start">
        <div>
          <p className="text-[0.95rem] leading-[1.85] text-muted font-light">{p.description}</p>
          <div className="flex flex-wrap gap-2 mt-6">
            {p.tech.map(t => (
              <span key={t} className="text-[0.62rem] font-medium tracking-[0.15em] uppercase font-mono px-3 py-1 bg-bone text-muted border border-rule transition-colors group-hover:bg-ink group-hover:text-cream/70">{t}</span>
            ))}
          </div>
          <button type="button" onClick={() => onOpen(p)} className="inline-flex items-center gap-2.5 mt-6 bg-transparent border-0 border-b border-rule pb-0.5 p-0 text-[0.7rem] font-bold tracking-[0.18em] uppercase text-ink transition-colors hover:text-red hover:border-red">
            View Case Study
            <span className="transition-transform group-hover:translate-x-1">{ICONS.arrow}</span>
          </button>
        </div>

        <div className="overflow-hidden relative bg-bone border border-rule flex items-center justify-center">
          <img src={p.image} alt={p.title} loading="lazy" className="block w-full h-auto max-h-[440px] object-contain grayscale-[0.25] contrast-105 transition-all duration-900 ease-[cubic-bezier(0.25,1,0.3,1)] group-hover:scale-[1.02] group-hover:grayscale-0 group-hover:contrast-105" />
        </div>
      </div>
    </>
  );
}

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);
  const [emailSquint, setEmailSquint] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const reduceMotion = useReducedMotion();
  const photoRef = useRef(null);
  const peekState = usePeekState(photoRef);
  const closeButtonRef = useRef(null);
  const lastFocusedRef = useRef(null);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!selectedProject) return;

    lastFocusedRef.current = document.activeElement;
    closeButtonRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedProject(null);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
      lastFocusedRef.current?.focus();
    };
  }, [selectedProject]);

  const filteredProjects = activeFilter === 'All' ? projects : projects.filter(p => p.category === activeFilter);

  return (
    <>
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-red z-[2000] origin-left" style={{ scaleX }} />

      <motion.a
        href={profile.consoleSite}
        target="_blank"
        rel="noreferrer"
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
        title="An alternate version of this portfolio, styled as a handheld game console"
        className="group fixed bottom-5 right-5 md:bottom-8 md:right-8 z-[900] inline-flex items-center gap-0 sm:gap-2.5 bg-ink text-white p-3.5 sm:pl-4 sm:pr-5 border border-ink shadow-[6px_6px_0_var(--bone)] transition-all hover:bg-red hover:border-red hover:-translate-y-1 hover:shadow-[8px_8px_0_var(--bone)] animate-[float_5s_ease-in-out_infinite]"
      >
        <span className="text-red transition-colors group-hover:text-cream">{ICONS.gamepad}</span>
        <span className="hidden sm:inline text-[0.65rem] font-bold tracking-[0.14em] uppercase whitespace-nowrap">Play Console Version</span>
      </motion.a>

      <nav className={`fixed top-0 w-full z-[1000] px-5 md:px-12 py-6 flex justify-between items-center transition-all duration-400 ${scrolled ? 'bg-cream/90 backdrop-blur-md py-4 border-b border-rule' : ''}`}>
        <div className="font-display text-3xl tracking-wide text-ink">{profile.name}<span className="text-red">.</span></div>
        <div className="flex gap-4 md:gap-10 items-center">
          <a href="#projects" className="hidden md:block text-[0.7rem] font-medium tracking-[0.2em] uppercase text-muted hover:text-ink relative after:content-[''] after:absolute after:-bottom-[2px] after:left-0 after:w-full after:h-[1px] after:bg-red after:scale-x-0 after:origin-left hover:after:scale-x-100 after:transition-transform after:duration-[280ms]">Projects</a>
          <a href="#skills" className="hidden md:block text-[0.7rem] font-medium tracking-[0.2em] uppercase text-muted hover:text-ink relative after:content-[''] after:absolute after:-bottom-[2px] after:left-0 after:w-full after:h-[1px] after:bg-red after:scale-x-0 after:origin-left hover:after:scale-x-100 after:transition-transform after:duration-[280ms]">Skills</a>
          <a href="#story" className="hidden md:block text-[0.7rem] font-medium tracking-[0.2em] uppercase text-muted hover:text-ink relative after:content-[''] after:absolute after:-bottom-[2px] after:left-0 after:w-full after:h-[1px] after:bg-red after:scale-x-0 after:origin-left hover:after:scale-x-100 after:transition-transform after:duration-[280ms]">Story</a>
          <a href="#contact" className="text-[0.68rem] font-bold tracking-[0.18em] uppercase text-white bg-red px-7 py-3 border border-red transition-colors hover:bg-red-dim hover:border-red-dim">Contact</a>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(v => !v)}
            className="md:hidden inline-flex items-center justify-center w-9 h-9 text-ink"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? ICONS.close : ICONS.menu}
          </button>
        </div>

        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 md:hidden bg-cream border-b border-rule px-5 py-6 flex flex-col gap-6 shadow-[0_12px_24px_rgba(13,13,13,0.08)]"
          >
            <a href="#projects" onClick={() => setMobileMenuOpen(false)} className="font-display text-2xl tracking-wide text-ink">Projects</a>
            <a href="#skills" onClick={() => setMobileMenuOpen(false)} className="font-display text-2xl tracking-wide text-ink">Skills</a>
            <a href="#story" onClick={() => setMobileMenuOpen(false)} className="font-display text-2xl tracking-wide text-ink">Story</a>
          </motion.div>
        )}
      </nav>

      <section className="min-h-screen px-5 md:px-12 grid grid-cols-1 lg:grid-cols-2 items-center gap-16 pt-28 pb-20 lg:pb-0 relative overflow-hidden border-b border-rule">
        <div className="absolute inset-0 pointer-events-none opacity-40" style={{ backgroundImage: 'linear-gradient(rgba(13,13,13,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(13,13,13,0.04) 1px, transparent 1px)', backgroundSize: '5rem 5rem', maskImage: 'radial-gradient(ellipse 70% 80% at 50% 50%, black 40%, transparent 100%)' }}></div>
        
        <div className="relative z-10">
          <h1 className="font-display text-[clamp(4rem,10vw,9rem)] leading-[0.9] tracking-wide text-ink">
            <motion.span {...heroEnter(0.04, reduceMotion)} className="block"><WigglyWord word="AARYAN" rotations={AARYAN_ROT} /></motion.span>
            <motion.span {...heroEnter(0.16, reduceMotion)} className="block text-red"><WigglyWord word="BASNET" rotations={BASNET_ROT} /></motion.span>
          </h1>

          <motion.p {...heroEnter(0.28, reduceMotion)} className="font-serif text-[clamp(1.1rem,2vw,1.5rem)] italic text-muted leading-relaxed mt-6">
            {profile.title}
          </motion.p>

          <motion.p {...heroEnter(0.28, reduceMotion)} className="mt-10 text-[0.95rem] font-light leading-[1.8] text-muted max-w-[480px]">
            {profile.tagline}
          </motion.p>

          <motion.div {...heroEnter(0.40, reduceMotion)} className="flex flex-wrap items-center gap-x-8 gap-y-5 mt-12">
            <a href="#projects" className="group inline-flex items-center gap-2.5 px-9 py-4 bg-ink text-white text-[0.72rem] font-bold tracking-[0.18em] uppercase border border-ink transition-all hover:bg-red hover:border-red hover:-translate-y-0.5">
              Explore Work <span className="inline-flex transition-transform duration-300 group-hover:translate-x-[5px]">{ICONS.arrow}</span>
            </a>
            <a href="#contact" className="group inline-flex items-center gap-2 text-[0.72rem] font-bold tracking-[0.18em] uppercase text-muted border-b border-rule pb-0.5 transition-colors hover:text-ink hover:border-red">
              Let's Talk {ICONS.arrow}
            </a>
            <div className="flex gap-4 sm:ml-4">
              <a href={profile.social.github} className="inline-block text-ink transition-all duration-[280ms] ease-[cubic-bezier(.34,1.56,.64,1)] hover:text-red hover:-translate-y-[3px]" aria-label="GitHub">{ICONS.gh}</a>
              <a href={profile.social.linkedin} className="inline-block text-ink transition-all duration-[280ms] ease-[cubic-bezier(.34,1.56,.64,1)] hover:text-red hover:-translate-y-[3px]" aria-label="LinkedIn">{ICONS.li}</a>
            </div>
          </motion.div>

          <motion.div {...heroEnter(0.40, reduceMotion)} className="flex gap-8 sm:gap-12 mt-16 pt-8 border-t border-rule">
            {profile.stats.map((stat, idx) => (
              <div key={idx}>
                <div className="font-display text-4xl md:text-5xl leading-none text-ink">{stat.num}</div>
                <div className="text-[0.65rem] font-medium tracking-[0.2em] uppercase text-muted font-mono mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div ref={photoRef} {...heroEnter(0.20, reduceMotion)} className="relative flex justify-center items-center w-fit mx-auto lg:w-auto lg:mx-0">
          <BlockCharacter
            width={124}
            height={104}
            eyeSize={30}
            pupilSize={13}
            eyeGap={26}
            eyeTop={34}
            className="hidden md:block absolute top-0 left-1/2 z-[1]"
            style={{ transform: PEEK_TRANSFORM[peekState], transition: 'transform .4s cubic-bezier(.34,1.3,.4,1)' }}
            trackCursor={!reduceMotion}
          />

          <div className="w-[min(340px,72vw)] aspect-[340/440] bg-ink clip-polygon relative z-[2] overflow-hidden shadow-[20px_20px_0_var(--bone)] group transition-transform duration-[600ms] ease-in-out hover:scale-[1.012]">
            <img src={profile.heroImage} alt={profile.name} className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.3,1)] group-hover:scale-105" />
          </div>

          <div className="absolute bottom-[2rem] -left-4 sm:-left-8 lg:left-[5%] z-[3] bg-white border border-rule px-5 py-3 flex items-center gap-2.5 shadow-[8px_8px_0_var(--bone)] animate-[float_7s_ease-in-out_infinite]">
            <span className="text-red">{ICONS.pin}</span>
            <div>
              <div className="text-[0.6rem] font-medium tracking-[0.2em] uppercase text-muted font-mono">Based in</div>
              <div className="text-[0.8rem] font-bold tracking-[0.05em] uppercase text-ink">{profile.location}</div>
            </div>
          </div>

          <div className="absolute -top-9 left-1/2 -translate-x-1/2 sm:top-[3rem] sm:-left-5 sm:translate-x-0 lg:-left-8 z-[3] bg-ink text-white px-4 py-2 sm:px-5 sm:py-3 text-[0.55rem] sm:text-[0.6rem] font-bold tracking-[0.2em] uppercase font-mono shadow-md whitespace-nowrap">
            {profile.stack.split('/').map((s, i) => (
              <React.Fragment key={i}>
                {s.trim()} {i < profile.stack.split('/').length - 1 && <span className="text-red"> / </span>}
              </React.Fragment>
            ))}
          </div>
        </motion.div>
      </section>

      <div className="bg-ink py-4 overflow-hidden border-y border-white/10">
        <div className="flex w-max animate-[marquee_22s_linear_infinite]">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="flex items-center gap-10 px-10 text-[0.68rem] font-medium tracking-[0.3em] uppercase text-cream/50 font-mono whitespace-nowrap">
              {item}
              <span className="text-red opacity-70">//</span>
            </span>
          ))}
        </div>
      </div>

      <section id="projects" className="py-32">
        <div className="max-w-7xl mx-auto px-5 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-12 lg:gap-24 items-start">
            <div className="lg:sticky lg:top-28">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}>
                <div className="inline-flex items-center gap-3 text-[0.65rem] font-medium tracking-[0.35em] uppercase font-mono text-red mb-6 before:content-[''] before:w-6 before:h-px before:bg-red">Ch. 02</div>
                <h2 className="font-display text-[clamp(3.5rem,7vw,7rem)] leading-[0.9] tracking-wide text-ink">Projects</h2>
                <p className="mt-6 text-[0.88rem] leading-[1.8] text-muted font-light">
                  Digital narratives spanning full-stack systems, AI integrations, and mobile experiences.
                </p>

                <div className="mt-10 border-l-2 border-rule">
                  {filters.map(f => (
                    <button key={f} className={`flex items-center gap-4 w-full px-5 py-3 bg-transparent border-none font-display text-[2.4rem] tracking-wide transition-all text-left group ${activeFilter === f ? 'text-ink' : 'text-ink/20 hover:text-ink/50 hover:translate-x-1.5'}`} onClick={() => setActiveFilter(f)}>
                      <span className={`w-2 h-2 bg-red rounded-full shrink-0 transition-opacity animate-pulse ${activeFilter === f ? 'opacity-100' : 'opacity-0'}`} />
                      {f}
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>

            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} key={activeFilter}>
              {filteredProjects.map((p) => (
                <motion.div variants={fadeInUp} key={p.id} className="project-card py-12 border-b border-rule first:border-t group">
                  <ProjectCardBody p={p} tag={p.category} onOpen={setSelectedProject} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section id="ripe" className="py-32 border-t border-rule">
        <div className="max-w-7xl mx-auto px-5 md:px-12">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="flex flex-wrap items-end justify-between gap-x-8 gap-y-6">
            <div>
              <div className="inline-flex items-center gap-3 text-[0.65rem] font-medium tracking-[0.35em] uppercase font-mono text-red mb-6 before:content-[''] before:w-6 before:h-px before:bg-red">Ch. 03 · Currently Building</div>
              <h2 className="font-display text-[clamp(3.5rem,7vw,7rem)] leading-[0.9] tracking-wide text-ink">{currentProject.title}</h2>
              <p className="font-serif italic text-base text-muted mt-3">{currentProject.subtitle}</p>
            </div>
            <span className="inline-flex items-center gap-2 text-[0.6rem] font-bold tracking-[0.2em] uppercase font-mono px-3.5 py-1.5 border border-dashed border-ink/35 text-muted">
              <span className="w-1.5 h-1.5 rounded-full border border-red shrink-0" />
              {currentProject.status}
            </span>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-12 lg:gap-20 items-start mt-14 pt-12 border-t border-rule">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp}>
              <p className="text-[0.95rem] leading-[1.85] text-muted font-light max-w-[560px]">{currentProject.description}</p>
              <div className="flex flex-wrap gap-2 mt-6">
                {currentProject.tech.map(t => (
                  <span key={t} className="text-[0.62rem] font-medium tracking-[0.15em] uppercase font-mono px-3 py-1 bg-bone text-muted border border-rule">{t}</span>
                ))}
              </div>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp} className="grid grid-cols-2 gap-3 sm:gap-4">
              {currentProject.media.map(m => (
                <figure key={m.label} className="m-0">
                  <div className="aspect-[16/9] overflow-hidden bg-bone border border-dashed border-ink/20 flex items-center justify-center">
                    {m.src ? (
                      <img src={m.src} alt={`${currentProject.title}: ${m.label}`} loading="lazy" className="w-full h-full object-cover" />
                    ) : (
                      <span className="px-3 text-center font-mono text-[0.55rem] sm:text-[0.6rem] tracking-[0.2em] uppercase text-ink/30">Media coming soon</span>
                    )}
                  </div>
                  <figcaption className="font-mono text-[0.62rem] tracking-[0.2em] uppercase text-muted mt-2.5">{m.label}</figcaption>
                </figure>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section id="skills" className="bg-ink text-white py-32">
        <div className="max-w-7xl mx-auto px-5 md:px-12">
          <div className="flex flex-wrap justify-between items-end gap-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
              <div className="inline-flex items-center gap-3 text-[0.65rem] font-medium tracking-[0.35em] uppercase font-mono text-red mb-6 before:content-[''] before:w-6 before:h-px before:bg-red">Ch. 04</div>
              <h2 className="font-display text-[clamp(3.5rem,7vw,7rem)] leading-[0.9] tracking-wide text-cream">Core Skills</h2>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-[0.88rem] text-cream/45 max-w-[340px] leading-[1.8] font-light md:text-right">
              The architectural stack powering the work, from database to deployment, architecture to interface.
            </motion.div>
          </div>

          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1px] mt-20 bg-white/10 border border-white/10">
            {skills.map((s, i) => (
              <motion.div variants={fadeInUp} key={i} className="skill-panel bg-ink p-10 relative overflow-hidden transition-colors hover:bg-white/5 group before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-full before:h-[2px] before:bg-red before:scale-x-0 before:origin-left before:transition-transform before:duration-400 hover:before:scale-x-100">
                <span className="text-[1.5rem] text-red mb-6 block">{skillIcons[s.title]}</span>
                <span className="absolute top-6 right-8 font-mono text-[0.65rem] text-cream/20 tracking-[0.1em]">0{i + 1}</span>
                <div className="font-display text-[1.6rem] tracking-[0.05em] text-cream mb-6">{s.title}</div>
                <ul className="list-none m-0 p-0">
                  {s.items.map(item => (
                    <li key={item} className="text-[0.82rem] font-mono text-cream/50 py-2 border-b border-white/5 flex items-center gap-2.5 transition-colors group-hover:text-cream/80 last:border-none before:content-[''] before:w-1 before:h-1 before:bg-red before:rounded-full before:shrink-0 before:opacity-0 group-hover:before:opacity-100 before:transition-opacity">
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="story" className="py-32">
        <div className="max-w-7xl mx-auto px-5 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-start">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <div className="inline-flex items-center gap-3 text-[0.65rem] font-medium tracking-[0.35em] uppercase font-mono text-red mb-6 before:content-[''] before:w-6 before:h-px before:bg-red">Ch. 05</div>
            <h2 className="font-display text-[clamp(3.5rem,7vw,7rem)] leading-[0.9] tracking-wide text-ink">The<br/>Story</h2>
            <p className="mt-8 text-[0.95rem] leading-[1.9] text-muted font-light">
              A computing student who moved between multilingual AI agents, full-stack builds, and interface design depending on the semester.
            </p>
            <p className="mt-5 text-[0.95rem] leading-[1.9] text-muted font-light">
              Based in Kathmandu, graduated from Softwarica College of IT & E-Commerce under Coventry University.
              Thesis: a LangGraph ReAct agent with ChromaDB RAG for bilingual English/Nepali support at Tribhuvan International Airport.
            </p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="mt-10 lg:mt-0 relative before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-rule">
            {timeline.map((t, i) => (
              <div key={i} className="pl-12 pb-14 relative last:pb-0 group">
                <div className="absolute -left-[5px] top-1.5 w-[11px] h-[11px] bg-cream border-2 border-ink rounded-full transition-colors group-hover:bg-red group-hover:border-red"></div>
                <div className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-muted mb-2">{t.date}</div>
                <div className="font-serif text-[1.4rem] text-ink mb-1">{t.role}</div>
                <div className="text-[0.75rem] font-bold tracking-[0.15em] uppercase text-red mb-3">{t.org}</div>
                <p className="text-[0.9rem] leading-[1.8] text-muted font-light max-w-[560px]">{t.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="contact" className="bg-bone text-center relative overflow-hidden py-32">
        <div className="max-w-7xl mx-auto px-5 md:px-12 relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="pt-8">
            <div className="inline-flex justify-center items-center gap-3 text-[0.65rem] font-medium tracking-[0.35em] uppercase font-mono text-red mb-6 before:content-[''] before:w-6 before:h-px before:bg-red">Ch. 06 · Open to Work</div>
            <h2 className="font-display text-[clamp(4rem,10vw,10rem)] leading-[0.85] tracking-wide text-ink mt-2">
              Let's<br/><em className="font-serif italic text-red">Build.</em>
            </h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-[1.1rem] font-light text-muted max-w-[520px] mx-auto mt-8 leading-[1.8] font-serif italic">
            Ready to architect something that matters? Reach out about full-stack projects, AI consulting, or just a good conversation about systems design.
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="flex justify-center items-center gap-6 mt-14 flex-wrap">
            <a
              href={`mailto:${profile.email}`}
              className="group relative inline-flex items-center gap-2.5 px-9 py-4 bg-ink text-white text-[0.72rem] font-bold tracking-[0.18em] uppercase border border-ink transition-all hover:bg-red hover:border-red hover:-translate-y-0.5"
              onClick={() => { setEmailSquint(true); setTimeout(() => setEmailSquint(false), 1200); }}
            >
              <BlockCharacter
                width={72}
                height={62}
                eyeSize={19}
                pupilSize={8}
                eyeGap={15}
                eyeTop={20}
                squint={emailSquint}
                trackCursor={!reduceMotion}
                className="hidden md:block absolute z-[1] group-hover:animate-[block-nod_1.2s_ease-in-out]"
                style={{ left: -82, bottom: 2 }}
              />
              <span className="mr-2">{ICONS.mail}</span> Email Me
            </a>
            <a href={profile.social.github} className="w-[52px] h-[52px] inline-flex items-center justify-center border border-rule bg-white text-ink text-[1.1rem] transition-all hover:bg-ink hover:text-white hover:-translate-y-0.5" aria-label="GitHub">{ICONS.gh}</a>
            <a href={profile.social.linkedin} className="w-[52px] h-[52px] inline-flex items-center justify-center border border-rule bg-white text-ink text-[1.1rem] transition-all hover:bg-ink hover:text-white hover:-translate-y-0.5" aria-label="LinkedIn">{ICONS.li}</a>
          </motion.div>
        </div>
        <div className="absolute bottom-[-0.12em] left-1/2 -translate-x-1/2 max-w-full font-display text-[clamp(6rem,22vw,24rem)] leading-none text-ink/5 whitespace-nowrap pointer-events-none select-none">AARYAN</div>
      </section>

      {selectedProject && (
        <motion.div
          className="fixed inset-0 z-[3000] bg-ink/75 backdrop-blur-sm px-5 py-6 md:px-12 md:py-10 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedProject(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="case-study-title"
        >
          <motion.div
            className="relative max-w-6xl mx-auto bg-cream text-ink border border-rule shadow-[16px_16px_0_rgba(13,13,13,0.22)] min-[900px]:h-[88vh] min-[900px]:overflow-hidden"
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.28, ease: [0.25, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              ref={closeButtonRef}
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 z-10 w-11 h-11 inline-flex items-center justify-center border border-rule bg-white text-ink transition-colors hover:bg-ink hover:text-white"
              aria-label="Close case study"
            >
              {ICONS.close}
            </button>

            <div className="grid grid-cols-1 min-[900px]:grid-cols-2 min-[900px]:h-full">
              <div className="order-2 min-[900px]:order-1 bg-bone min-[900px]:h-full min-[900px]:overflow-y-auto">
                {selectedProject.images.length > 1 ? (
                  <div className="p-4 pt-8 md:p-8 md:pt-10 flex flex-col gap-8">
                    {selectedProject.images.map((img, i) => (
                      <figure key={img.src} className="m-0">
                        <div className="relative border border-rule bg-white">
                          <span className="absolute top-3 left-3 font-mono text-[0.62rem] tracking-[0.15em] bg-ink text-white px-2 py-1">0{i + 1}</span>
                          <img src={img.src} alt={`${selectedProject.title}: ${img.caption}`} loading="lazy" className="block w-full h-auto" />
                        </div>
                        <figcaption className="mt-3 font-mono text-[0.68rem] tracking-[0.05em] text-muted">{img.caption}</figcaption>
                      </figure>
                    ))}
                  </div>
                ) : (
                  <div className="min-h-full p-4 pt-16 md:p-8 md:pt-16 flex flex-col justify-center">
                    <figure className="m-0">
                      <img src={selectedProject.images[0].src} alt={`${selectedProject.title}: ${selectedProject.images[0].caption}`} className="block w-full h-auto border border-rule bg-white" />
                      {selectedProject.images[0].caption && (
                        <figcaption className="mt-3 font-mono text-[0.68rem] tracking-[0.05em] text-muted">{selectedProject.images[0].caption}</figcaption>
                      )}
                    </figure>
                  </div>
                )}
              </div>

              <div className="order-1 min-[900px]:order-2 min-[900px]:h-full min-[900px]:overflow-y-auto p-6 pt-16 md:p-10 md:pt-16">
                <div className="font-mono text-[0.65rem] tracking-[0.25em] uppercase text-red mb-5">
                  Case Study / {selectedProject.category}
                </div>
                <h2 id="case-study-title" className="font-display text-[clamp(3rem,7vw,6rem)] leading-[0.9] tracking-wide text-ink break-words">
                  {modalTitle(selectedProject.title, selectedProject.category)}
                </h2>
                <p className="font-serif italic text-[1.1rem] text-muted mt-3">{selectedProject.subtitle}</p>
                <p className="text-[0.95rem] leading-[1.85] text-muted font-light mt-7">{selectedProject.overview}</p>

                <div className="grid grid-cols-2 gap-6 mt-8 pt-7 border-t border-rule">
                  <div>
                    <div className="font-mono text-[0.62rem] tracking-[0.2em] uppercase text-red mb-2">Role</div>
                    <p className="text-[0.88rem] leading-[1.7] text-muted font-light">{selectedProject.role}</p>
                  </div>
                  <div>
                    <div className="font-mono text-[0.62rem] tracking-[0.2em] uppercase text-red mb-2">Year</div>
                    <p className="text-[0.88rem] leading-[1.7] text-muted font-light">{selectedProject.year}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-8">
                  {selectedProject.tech.map(t => (
                    <span key={t} className="text-[0.62rem] font-medium tracking-[0.15em] uppercase font-mono px-3 py-1 bg-bone text-muted border border-rule">{t}</span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 mt-9">
                  <a
                    href={selectedProject.website}
                    target={selectedProject.website === '#' ? undefined : '_blank'}
                    rel={selectedProject.website === '#' ? undefined : 'noreferrer'}
                    onClick={selectedProject.website === '#' ? (e) => e.preventDefault() : undefined}
                    aria-disabled={selectedProject.website === '#' || undefined}
                    title={selectedProject.website === '#' ? 'Not deployed yet' : undefined}
                    className={`inline-flex items-center gap-2.5 px-7 py-3 bg-ink text-white text-[0.68rem] font-bold tracking-[0.18em] uppercase border border-ink transition-all hover:bg-red hover:border-red ${selectedProject.website === '#' ? 'opacity-40 cursor-not-allowed hover:bg-ink hover:border-ink' : ''}`}
                  >
                    {selectedProject.websiteLabel || 'View Website'} {ICONS.arrow}
                  </a>
                  {selectedProject.link && (
                    <a href={selectedProject.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2.5 px-7 py-3 bg-transparent text-ink text-[0.68rem] font-bold tracking-[0.18em] uppercase border border-ink transition-all hover:bg-ink hover:text-white">
                      {selectedProject.linkLabel || 'View Repository'} {ICONS.arrow}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      <footer className="px-5 md:px-12 py-8 border-t border-rule flex justify-between items-center gap-4 flex-wrap text-[0.65rem] font-medium tracking-[0.18em] uppercase text-muted font-mono">
        <span>© {new Date().getFullYear()} {profile.name}.</span>
        <KathmanduTime />
      </footer>
    </>
  );
}
