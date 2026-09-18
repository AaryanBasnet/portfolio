import { ICONS } from './icons';
import BlockCharacter from './BlockCharacter';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex items-center px-5 md:px-12 py-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 min-[900px]:grid-cols-2 gap-16 items-center w-full">
        <div>
          <div className="font-mono text-[11px] tracking-[0.1em] uppercase text-red mb-6">404 · Page Not Found</div>
          <h1
            className="font-display text-ink leading-[0.82] tracking-[-0.045em]"
            style={{ fontWeight: 900, fontSize: 'clamp(90px, 14vw, 190px)' }}
          >
            4<span className="text-red">0</span>4
          </h1>
          <p className="font-serif italic text-[21px] mt-4" style={{ color: '#57534A' }}>
            This one got away from me.
          </p>
          <p className="text-[15.5px] leading-[1.65] text-muted mt-5 max-w-[400px]">
            The page you're looking for doesn't exist, moved, or never did. Everything that does exist is back on the main page.
          </p>
          <a
            href="/"
            className="group inline-flex items-center gap-2.5 mt-10 px-[17px] py-[13px] bg-ink text-cream text-[13px] font-bold tracking-[0.05em] uppercase transition-colors hover:bg-red"
          >
            <span className="inline-flex rotate-180 transition-transform duration-300 group-hover:-translate-x-[5px]">{ICONS.arrow}</span> Back to Safety
          </a>
        </div>

        <div className="hidden min-[900px]:flex justify-center items-center">
          <div className="relative w-[300px] h-[300px] flex items-center justify-center">
            <span className="notfound-question absolute top-8 right-10 font-mono font-bold text-[26px] text-red">?</span>
            <BlockCharacter
              width={140}
              height={118}
              eyeSize={34}
              pupilSize={14}
              eyeGap={28}
              eyeTop={38}
              className="notfound-drift"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
