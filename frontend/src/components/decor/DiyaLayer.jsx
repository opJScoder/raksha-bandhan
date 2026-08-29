import { useMemo } from "react";
import Diya from "./Diya.jsx";

function distance(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;

  return Math.sqrt(dx * dx + dy * dy);
}

function generateDiyas(count) {
  const diyas = [];

  /*
   * Minimum percentage-distance between two diyas.
   *
   * Increase this if you want them more spread out.
   */
  const MIN_DISTANCE = 18;

  /*
   * Central area reserved for important content.
   *
   * No diya will be generated inside this rectangle.
   */
  const SAFE_ZONE = {
    left: 25,
    right: 75,
    top: 24,
    bottom: 76,
  };

  /*
   * Prevent diyas from appearing right against
   * the viewport edges.
   */
  const PADDING = {
    left: 5,
    right: 5,
    top: 7,
    bottom: 7,
  };

  /*
   * Prevent the algorithm from trying forever
   * when there isn't enough space.
   */
  const MAX_ATTEMPTS = 200;

  for (let i = 0; i < count; i++) {
    let placed = false;

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      const candidate = {
        x: PADDING.left + Math.random() * (100 - PADDING.left - PADDING.right),

        y: PADDING.top + Math.random() * (100 - PADDING.top - PADDING.bottom),
      };

      /*
       * Don't put diyas behind the central content.
       */
      const insideSafeZone =
        candidate.x >= SAFE_ZONE.left &&
        candidate.x <= SAFE_ZONE.right &&
        candidate.y >= SAFE_ZONE.top &&
        candidate.y <= SAFE_ZONE.bottom;

      if (insideSafeZone) {
        continue;
      }

      /*
       * Don't put this diya too close to another diya.
       */
      const tooClose = diyas.some(
        (diya) => distance(candidate, diya) < MIN_DISTANCE,
      );

      if (tooClose) {
        continue;
      }

      /*
       * Everything is acceptable.
       */
      diyas.push({
        id: i,

        x: candidate.x,
        y: candidate.y,

        /*
         * Slight random size.
         */
        scale: 0.55 + Math.random() * 0.45,

        /*
         * Gives every flame a different starting phase.
         */
        delay: Math.random() * 1.5,

        /*
         * Gives every diya a different floating speed.
         */
        floatDuration: 4 + Math.random() * 2,

        /*
         * Slightly different vertical movement.
         */
        floatDistance: 4 + Math.random() * 4,
      });

      placed = true;
      break;
    }

    /*
     * Don't force a bad position if the available
     * space is already occupied.
     */
    if (!placed) {
      console.warn(`Could not find a suitable position for diya ${i}.`);
    }
  }

  return diyas;
}

export default function DiyaLayer({ count = 5 }) {
  /*
   * Positions are generated once per mounted scene.
   *
   * They won't jump around because of normal React
   * re-renders.
   */
  const diyas = useMemo(() => generateDiyas(count), [count]);

  return (
    <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
      {diyas.map((diya) => (
        <Diya
          key={diya.id}
          style={{
            left: `${diya.x}%`,
            top: `${diya.y}%`,
          }}
          scale={diya.scale}
          delay={diya.delay}
          floatDuration={diya.floatDuration}
          floatDistance={diya.floatDistance}
        />
      ))}
    </div>
  );
}
