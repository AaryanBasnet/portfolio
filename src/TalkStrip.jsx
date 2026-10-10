import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import BlockCharacter from './BlockCharacter';
import { CONTAINER } from './layout';

const TYPE_MS = 24;   // time per typed character
const HOLD_MS = 4200; // how long a finished fact stays before the next one
const HOLD_REDUCED_MS = 8000;

// What the block says when poked, one step per click. The last step also spins it and offers a link to Contact.
const POKES = ['Hey!', 'Careful.', 'That tickles.', 'Okay, okay.', 'Fine. Want to hire him?'];
const POKE_WINDOW_MS = 4500; // clicks closer together than this continue the same poke sequence
const POKE_FINALE_MS = 6000; // how long the final line stays before the facts resume

// A strip where the block "says" one short line at a time.
// By default it types a greeting, then facts about Aaryan, one at a time, and nothing scrolls.
// Poking it (clicking the block) switches to its personality lines; when the poking ends, the facts carry on.
// Hover or keyboard focus pauses everything.
export default function TalkStrip({ lines }) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState(0);
  const [paused, setPaused] = useState(false);
  const [pokeStep, setPokeStep] = useState(0); // 0 = not poking, 1..POKES.length = current poke line
  const [squint, setSquint] = useState(false);
  const [spin, setSpin] = useState(false);
  const lastPoke = useRef(0);
  const timers = useRef([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const poking = pokeStep > 0;
  const line = poking ? POKES[pokeStep - 1] : lines[index];
  const visibleCount = reduceMotion ? line.length : typed;
  const done = visibleCount >= line.length;
  const finale = pokeStep === POKES.length;

  // Type the current line.
  useEffect(() => {
    if (reduceMotion) return undefined;
    const id = setInterval(() => {
      setTyped((n) => {
        if (n + 1 >= line.length) clearInterval(id);
        return n + 1;
      });
    }, TYPE_MS);
    return () => clearInterval(id);
  }, [line, reduceMotion]);

  // Once a line is finished, wait, then move on (unless paused).
  // Facts advance to the next fact. A poke sequence ends after a quiet moment, and the facts resume.
  useEffect(() => {
    if (!done || paused) return undefined;
    const wait = poking
      ? (finale ? POKE_FINALE_MS : POKE_WINDOW_MS)
      : (reduceMotion ? HOLD_REDUCED_MS : HOLD_MS);
    const id = setTimeout(() => {
      setTyped(0);
      if (poking) setPokeStep(0);
      setIndex((i) => (i + 1) % lines.length);
    }, wait);
    return () => clearTimeout(id);
  }, [done, paused, poking, finale, index, lines.length, reduceMotion]);

  const poke = () => {
    const now = Date.now();
    const continuing = poking && pokeStep < POKES.length && now - lastPoke.current < POKE_WINDOW_MS;
    const step = continuing ? pokeStep + 1 : 1;
    lastPoke.current = now;
    setPokeStep(step);
    setTyped(0);
    setSquint(true);
    timers.current.push(setTimeout(() => setSquint(false), 180));
    if (step === POKES.length && !reduceMotion) {
      setSpin(true);
      timers.current.push(setTimeout(() => setSpin(false), 900));
    }
  };

  return (
    <div
      className="border-y border-ink/15 bg-bone"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className={`${CONTAINER} flex items-center gap-5 py-5 md:gap-7`}>
        <button
          type="button"
          onClick={poke}
          aria-label="Poke the block"
          className="shrink-0 cursor-pointer border-0 bg-transparent p-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
        >
          <span className={`block motion-safe:animate-[float_7s_ease-in-out_infinite] ${spin ? 'block-spin' : ''}`}>
            <BlockCharacter width={64} height={52} eyeSize={16} pupilSize={7} eyeGap={13} eyeTop={17} squint={squint} />
          </span>
        </button>

        <div className="relative flex min-h-[3.4rem] flex-1 items-center bg-ink px-5 py-3 text-cream before:absolute before:-left-2 before:top-1/2 before:-translate-y-1/2 before:border-y-[8px] before:border-r-[8px] before:border-y-transparent before:border-r-ink before:content-['']">
          {/* Screen readers get the full line once; the typed text below is decorative. */}
          <span className="sr-only" aria-live="polite">{line}</span>
          <span aria-hidden="true" className="font-mono text-[0.78rem] leading-relaxed tracking-[0.06em] md:text-[0.84rem]">
            {line.slice(0, visibleCount)}
            {finale && done && (
              <a href="#contact" className="ml-3 underline underline-offset-4 hover:text-red">Contact ↓</a>
            )}
            {!done && <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] bg-cream" />}
          </span>
        </div>

        <span className="font-mono hidden shrink-0 text-[0.62rem] uppercase tracking-[0.2em] text-muted lg:block">
          poke the block ↻
        </span>
      </div>
    </div>
  );
}
