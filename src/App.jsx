import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { profile, projects, skills, timeline, marqueeItems, filters } from './data';
import { ICONS, skillIcons } from './icons';

// Framer motion variants
const fadeInUp = {
  hidden: { opacity: 0, y: 48 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

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
    if (!selectedProject) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedProject(null);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedProject]);

  const filteredProjects = activeFilter === 'All' ? projects : projects.filter(p => p.category === activeFilter);

  return (
    <>
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-red z-[2000] origin-left" style={{ scaleX }} />

      <nav className={`fixed top-0 w-full z-[1000] px-5 md:px-12 py-6 flex justify-between items-center transition-all duration-400 ${scrolled ? 'bg-cream/90 backdrop-blur-md py-4 border-b border-rule' : ''}`}>
        <div className="font-display text-3xl tracking-wide text-ink">{profile.name}<span className="text-red">.</span></div>
        <div className="flex gap-10 items-center">
          <a href="#projects" className="hidden md:block text-[0.7rem] font-medium tracking-[0.2em] uppercase text-muted hover:text-ink relative after:content-[''] after:absolute after:-bottom-[2px] after:left-0 after:w-0 after:h-[1px] after:bg-red hover:after:w-full after:transition-all after:duration-300">Projects</a>
          <a href="#skills" className="hidden md:block text-[0.7rem] font-medium tracking-[0.2em] uppercase text-muted hover:text-ink relative after:content-[''] after:absolute after:-bottom-[2px] after:left-0 after:w-0 after:h-[1px] after:bg-red hover:after:w-full after:transition-all after:duration-300">Skills</a>
          <a href="#story" className="hidden md:block text-[0.7rem] font-medium tracking-[0.2em] uppercase text-muted hover:text-ink relative after:content-[''] after:absolute after:-bottom-[2px] after:left-0 after:w-0 after:h-[1px] after:bg-red hover:after:w-full after:transition-all after:duration-300">Story</a>
          <a href="#contact" className="text-[0.68rem] font-bold tracking-[0.18em] uppercase text-white bg-red px-7 py-3 border border-red transition-colors hover:bg-ink hover:border-ink">Contact</a>
        </div>
      </nav>

      <section className="min-h-screen px-5 md:px-12 grid grid-cols-1 md:grid-cols-2 items-center gap-16 pt-28 relative overflow-hidden border-b border-rule">
        <div className="absolute inset-0 pointer-events-none opacity-40" style={{ backgroundImage: 'linear-gradient(rgba(13,13,13,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(13,13,13,0.04) 1px, transparent 1px)', backgroundSize: '5rem 5rem', maskImage: 'radial-gradient(ellipse 70% 80% at 50% 50%, black 40%, transparent 100%)' }}></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-7">
            <div className="w-1.5 h-1.5 bg-red rounded-full animate-pulse"></div>
            <span className="text-[0.65rem] font-medium tracking-[0.35em] uppercase text-muted font-mono">{profile.eyebrow}</span>
          </div>

          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.2, 1, 0.3, 1] }} className="font-display text-[clamp(4rem,10vw,9rem)] leading-[0.9] tracking-wide text-ink">
            AARYAN<br/><span className="text-red">BASNET</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.1, ease: [0.2, 1, 0.3, 1] }} className="font-serif text-[clamp(1.1rem,2vw,1.5rem)] italic text-muted leading-relaxed mt-6">
            {profile.title}
          </motion.p>

          <motion.p initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2, ease: [0.2, 1, 0.3, 1] }} className="mt-10 text-[0.95rem] font-light leading-[1.8] text-muted max-w-[480px]">
            {profile.tagline}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3, ease: [0.2, 1, 0.3, 1] }} className="flex items-center gap-8 mt-12">
            <a href="#projects" className="inline-flex items-center gap-2.5 px-9 py-4 bg-ink text-white text-[0.72rem] font-bold tracking-[0.18em] uppercase border border-ink transition-all hover:bg-red hover:border-red hover:-translate-y-0.5">
              Explore Work {ICONS.arrow}
            </a>
            <a href="#contact" className="inline-flex items-center gap-2 text-[0.72rem] font-bold tracking-[0.18em] uppercase text-muted border-b border-rule pb-0.5 transition-colors hover:text-ink hover:border-ink">
              Let's Talk {ICONS.arrow}
            </a>
            <div className="flex gap-4 ml-4">
              <a href={profile.social.github} className="text-ink hover:text-red transition-colors" aria-label="GitHub">{ICONS.gh}</a>
              <a href={profile.social.linkedin} className="text-ink hover:text-red transition-colors" aria-label="LinkedIn">{ICONS.li}</a>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4, ease: [0.2, 1, 0.3, 1] }} className="flex gap-12 mt-16 pt-8 border-t border-rule">
            {profile.stats.map((stat, idx) => (
              <div key={idx}>
                <div className="font-display text-4xl md:text-5xl leading-none text-ink">{stat.num}</div>
                <div className="text-[0.65rem] font-medium tracking-[0.2em] uppercase text-muted font-mono mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }} className="relative hidden md:flex justify-center items-center">
          <div className="w-[340px] h-[440px] bg-ink clip-polygon relative overflow-hidden shadow-[20px_20px_0_var(--bone)] group">
            <img src={profile.heroImage} alt={profile.name} className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.3,1)] group-hover:scale-105" />
          </div>

          <div className="absolute top-[-2rem] right-0 md:right-[10%] w-[130px] h-[130px] animate-[spin_18s_linear_infinite]">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path id="cp" fill="none" d="M50,50m-37,0a37,37,0,1,1,74,0a37,37,0,1,1,-74,0" />
              <text fontSize="9" fill="#0D0D0D" fontFamily="DM Mono, monospace" letterSpacing="2">
                <textPath href="#cp">• Full-Stack • AI Systems • Flutter •</textPath>
              </text>
            </svg>
            <div className="absolute top-1/2 left-1/2 w-2.5 h-2.5 bg-red rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          </div>

          <div className="absolute bottom-[2rem] left-0 md:left-[5%] bg-white border border-rule px-5 py-3 flex items-center gap-2.5 shadow-[8px_8px_0_var(--bone)] animate-[float_7s_ease-in-out_infinite]">
            <span className="text-red">{ICONS.pin}</span>
            <div>
              <div className="text-[0.6rem] font-medium tracking-[0.2em] uppercase text-muted font-mono">Based in</div>
              <div className="text-[0.8rem] font-bold tracking-[0.05em] uppercase text-ink">{profile.location}</div>
            </div>
          </div>

          <div className="absolute top-[3rem] left-0 md:left-[10%] bg-ink text-white px-5 py-3 text-[0.6rem] font-bold tracking-[0.2em] uppercase font-mono shadow-md">
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
          <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-12 md:gap-24 items-start">
            <div className="md:sticky md:top-28">
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
                  <div className="flex items-center justify-between mb-7">
                    <span className="font-mono text-[0.7rem] text-muted tracking-[0.15em]">#{p.id}</span>
                    <span className="text-[0.6rem] font-bold tracking-[0.2em] uppercase font-mono px-3.5 py-1.5 border border-ink text-ink">{p.category}</span>
                  </div>

                  <h3 className="font-display text-[clamp(2.5rem,5vw,5rem)] tracking-wide leading-[0.9] text-ink transition-colors group-hover:text-red">{p.title}</h3>
                  <p className="font-serif italic text-base text-muted mt-1.5">{p.subtitle}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8 items-start">
                    <div>
                      <p className="text-[0.95rem] leading-[1.85] text-muted font-light">{p.description}</p>
                      <div className="flex flex-wrap gap-2 mt-6">
                        {p.tech.map(t => (
                          <span key={t} className="text-[0.62rem] font-medium tracking-[0.15em] uppercase font-mono px-3 py-1 bg-bone text-muted border border-rule transition-colors group-hover:bg-ink group-hover:text-cream/70">{t}</span>
                        ))}
                      </div>
                      <button type="button" onClick={() => setSelectedProject(p)} className="inline-flex items-center gap-2.5 mt-6 bg-transparent border-0 border-b border-rule pb-0.5 p-0 text-[0.7rem] font-bold tracking-[0.18em] uppercase text-ink transition-colors hover:text-red hover:border-red">
                        View Case Study
                        <span className="transition-transform group-hover:translate-x-1">{ICONS.arrow}</span>
                      </button>
                    </div>

                    <div className="aspect-[16/9] overflow-hidden relative bg-bone border border-rule">
                      <img src={p.image} alt={p.title} className="w-full h-full object-contain grayscale-[0.25] contrast-105 transition-all duration-900 ease-[cubic-bezier(0.25,1,0.3,1)] group-hover:scale-[1.02] group-hover:grayscale-0 group-hover:contrast-105" />
                      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent from-70% to-ink/15"></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section id="skills" className="bg-ink text-white py-32">
        <div className="max-w-7xl mx-auto px-5 md:px-12">
          <div className="flex flex-wrap justify-between items-end gap-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
              <div className="inline-flex items-center gap-3 text-[0.65rem] font-medium tracking-[0.35em] uppercase font-mono text-red mb-6 before:content-[''] before:w-6 before:h-px before:bg-red">Ch. 03</div>
              <h2 className="font-display text-[clamp(3.5rem,7vw,7rem)] leading-[0.9] tracking-wide text-cream">Core Skills</h2>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-[0.88rem] text-cream/45 max-w-[340px] leading-[1.8] font-light md:text-right">
              The architectural stack powering the work — from database to deployment, architecture to interface.
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
        <div className="max-w-7xl mx-auto px-5 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32 items-start">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <div className="inline-flex items-center gap-3 text-[0.65rem] font-medium tracking-[0.35em] uppercase font-mono text-red mb-6 before:content-[''] before:w-6 before:h-px before:bg-red">Ch. 04</div>
            <h2 className="font-display text-[clamp(3.5rem,7vw,7rem)] leading-[0.9] tracking-wide text-ink">The<br/>Story</h2>
            <p className="mt-8 text-[0.95rem] leading-[1.9] text-muted font-light">
              A computing student who doesn't stay in one lane — building multilingual AI agents one semester,
              full-stack applications the next, and always designing something that catches your eye in the first five seconds.
            </p>
            <p className="mt-5 text-[0.95rem] leading-[1.9] text-muted font-light">
              Based in Kathmandu. Affiliated with Coventry University via Softwarica College of IT & E-Commerce.
              Thesis: a LangGraph ReAct agent with ChromaDB RAG and bilingual English/Nepali support for TIA airport passengers.
            </p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="mt-10 md:mt-0 relative before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-rule">
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
            <div className="inline-flex justify-center items-center gap-3 text-[0.65rem] font-medium tracking-[0.35em] uppercase font-mono text-red mb-6 before:content-[''] before:w-6 before:h-px before:bg-red">Ch. 05 — Open to Work</div>
            <h2 className="font-display text-[clamp(4rem,10vw,10rem)] leading-[0.85] tracking-wide text-ink mt-2">
              Let's<br/><em className="font-serif italic text-red">Build.</em>
            </h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-[1.1rem] font-light text-muted max-w-[520px] mx-auto mt-8 leading-[1.8] font-serif italic">
            Ready to architect something that matters? Reach out about full-stack projects, AI consulting, or just a good conversation about systems design.
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="flex justify-center items-center gap-6 mt-14 flex-wrap">
            <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-2.5 px-9 py-4 bg-ink text-white text-[0.72rem] font-bold tracking-[0.18em] uppercase border border-ink transition-all hover:bg-red hover:border-red hover:-translate-y-0.5">
              <span className="mr-2">{ICONS.mail}</span> Send Transmission
            </a>
            <a href={profile.social.github} className="w-[52px] h-[52px] inline-flex items-center justify-center border border-rule bg-white text-ink text-[1.1rem] transition-all hover:bg-ink hover:text-white hover:-translate-y-0.5" aria-label="GitHub">{ICONS.gh}</a>
            <a href={profile.social.linkedin} className="w-[52px] h-[52px] inline-flex items-center justify-center border border-rule bg-white text-ink text-[1.1rem] transition-all hover:bg-ink hover:text-white hover:-translate-y-0.5" aria-label="LinkedIn">{ICONS.li}</a>
          </motion.div>
        </div>
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 font-display text-[22vw] text-ink/5 whitespace-nowrap pointer-events-none select-none">AARYAN</div>
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
            className="relative max-w-6xl mx-auto bg-cream text-ink border border-rule shadow-[16px_16px_0_rgba(13,13,13,0.22)]"
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.28, ease: [0.25, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 z-10 w-11 h-11 inline-flex items-center justify-center border border-rule bg-white text-ink transition-colors hover:bg-ink hover:text-white"
              aria-label="Close case study"
            >
              {ICONS.close}
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="bg-bone border-b lg:border-b-0 lg:border-r border-rule p-4 md:p-6 flex items-center">
                <img src={selectedProject.image} alt={selectedProject.title} className="w-full max-h-[540px] object-contain border border-rule bg-white" />
              </div>

              <div className="p-6 md:p-10">
                <div className="font-mono text-[0.65rem] tracking-[0.25em] uppercase text-red mb-5">
                  Case Study / {selectedProject.category}
                </div>
                <h2 id="case-study-title" className="font-display text-[clamp(3rem,7vw,6rem)] leading-[0.9] tracking-wide text-ink pr-12">
                  {selectedProject.title}
                </h2>
                <p className="font-serif italic text-[1.1rem] text-muted mt-3">{selectedProject.subtitle}</p>
                <p className="text-[0.95rem] leading-[1.85] text-muted font-light mt-7">{selectedProject.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-9 pt-8 border-t border-rule">
                  <div>
                    <div className="font-mono text-[0.62rem] tracking-[0.2em] uppercase text-red mb-2">Role</div>
                    <p className="text-[0.88rem] leading-[1.7] text-muted font-light">{selectedProject.role}</p>
                  </div>
                  <div>
                    <div className="font-mono text-[0.62rem] tracking-[0.2em] uppercase text-red mb-2">Problem</div>
                    <p className="text-[0.88rem] leading-[1.7] text-muted font-light">{selectedProject.problem}</p>
                  </div>
                </div>

                <div className="mt-9">
                  <div className="font-mono text-[0.62rem] tracking-[0.2em] uppercase text-red mb-4">Key Work</div>
                  <ul className="list-none m-0 p-0 border-t border-rule">
                    {selectedProject.highlights.map(item => (
                      <li key={item} className="py-3 border-b border-rule text-[0.9rem] leading-[1.7] text-muted font-light flex gap-3 before:content-[''] before:w-1.5 before:h-1.5 before:bg-red before:rounded-full before:shrink-0 before:mt-2.5">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-2 mt-8">
                  {selectedProject.tech.map(t => (
                    <span key={t} className="text-[0.62rem] font-medium tracking-[0.15em] uppercase font-mono px-3 py-1 bg-bone text-muted border border-rule">{t}</span>
                  ))}
                </div>

                <a href={selectedProject.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2.5 mt-9 px-7 py-3 bg-ink text-white text-[0.68rem] font-bold tracking-[0.18em] uppercase border border-ink transition-all hover:bg-red hover:border-red">
                  View Repository {ICONS.arrow}
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      <footer className="px-5 md:px-12 py-8 border-t border-rule flex justify-between items-center gap-4 flex-wrap text-[0.65rem] font-medium tracking-[0.18em] uppercase text-muted font-mono">
        <span>© {new Date().getFullYear()} {profile.name}. All systems nominal.</span>
        <span>Built with React + Tailwind // {profile.location}</span>
      </footer>
    </>
  );
}
