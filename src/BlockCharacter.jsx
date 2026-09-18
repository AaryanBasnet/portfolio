import { useEffect, useRef, useState } from 'react';

// Offsets a pupil toward the cursor, decaying to 0 at `falloff` px away.
// `falloff` defaults to the viewport diagonal so the eyes read the cursor
// anywhere on screen, not just within a tight radius of the character.
function useCursorTracking(ref, { maxOffset = 7, falloff = null, enabled = true } = {}) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) return;
    const handleMove = (e) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const effectiveFalloff = falloff ?? Math.hypot(window.innerWidth, window.innerHeight);
      const t = Math.max(0, 1 - dist / effectiveFalloff);
      const scale = maxOffset * t;
      const ux = dist > 0 ? dx / dist : 0;
      const uy = dist > 0 ? dy / dist : 0;
      setOffset({ x: ux * scale, y: uy * scale });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [ref, maxOffset, falloff, enabled]);

  return offset;
}

// The chamfered-slab character used in the hero, contact section, and 404 page.
// Pure div/CSS (clip-path), no SVG. Always pointer-events:none since it's decorative.
export default function BlockCharacter({
  width = 124,
  height = 104,
  eyeSize = 30,
  pupilSize = 13,
  eyeGap = 26,
  eyeTop = 34,
  squint = false,
  trackCursor = true,
  className = '',
  style = {},
}) {
  const eyesRef = useRef(null);
  const offset = useCursorTracking(eyesRef, { enabled: trackCursor });

  return (
    <div className={`block-char ${className}`} style={style} aria-hidden="true">
      <div className="block-char__head" style={{ width, height }}>
        <div ref={eyesRef} className="block-char__eyes" style={{ top: eyeTop, gap: eyeGap }}>
          {[0, 1].map(i => (
            <span key={i} className="block-char__eye" style={{ width: eyeSize, height: squint ? 7 : eyeSize }}>
              <span
                className="block-char__pupil"
                style={{
                  width: pupilSize,
                  height: pupilSize,
                  transform: `translate(${offset.x}px, ${offset.y}px)`,
                }}
              />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
