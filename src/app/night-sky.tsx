import sky from "./night-sky.json";

// layers cut from assets/night-sky-1080p.png by scripts/split-night-sky.mjs.
// an svg with "slice" scales like background-size: cover. on a window wider
// than the art, cover crops the top or bottom, so the scene is two svgs: the
// sky and the stars on the clouds pinned to the bottom, and the moon, upper
// stars and dots pinned to the top so the header never cuts them off. on a
// window taller than the art nothing is cropped vertically and the two line
// up exactly.

// a sprite reaching into the clouds still has its lower tip baked into the
// sky, so it only grows, which keeps that tip covered
const CLOUD_TOP = 926;
// sprites below this stay with the clouds
const GROUND_LAYER_Y = 700;

// fixed, not random, so server and client render the same timings
const timing = (i: number, base: number, spread: number) => {
  const duration = base + ((i * 7) % 10) * (spread / 10);
  return { animationDuration: `${duration.toFixed(2)}s`, animationDelay: `${(-(((i * 13) % 17) / 17) * duration).toFixed(2)}s` };
};

type Sprite = (typeof sky.sprites)[number];

function Star({ star, i }: { star: Sprite; i: number }) {
  return (
    <g filter="url(#night-shadow)">
      <image
        className={star.y + star.h > CLOUD_TOP ? "night-star night-star-grounded" : "night-star"}
        href={`/night/${star.name}.webp`}
        x={star.x}
        y={star.y}
        width={star.w}
        height={star.h}
        style={timing(i, 4.5, 3)}
      />
    </g>
  );
}

export default function NightSky() {
  const viewBox = `0 0 ${sky.width} ${sky.height}`;
  const moon = sky.sprites.find((s) => s.name === "moon");
  const stars = sky.sprites.filter((s) => s.name !== "moon").map((star, i) => ({ star, i }));
  const grounded = stars.filter(({ star }) => star.y > GROUND_LAYER_Y);
  const raised = stars.filter(({ star }) => star.y <= GROUND_LAYER_Y);

  return (
    <div className="night-sky" aria-hidden="true">
      <svg viewBox={viewBox} preserveAspectRatio="xMidYMax slice">
        <defs>
          {/* stands in for the shadow painted out of the sky, so it moves with the sprite */}
          <filter id="night-shadow" x="-20%" y="-20%" width="150%" height="150%">
            <feDropShadow dx="5" dy="7" stdDeviation="3" floodColor="#0b0820" floodOpacity="0.55" />
          </filter>
          <radialGradient id="moon-glow">
            <stop offset="0%" stopColor="#fff6c8" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#fff6c8" stopOpacity="0" />
          </radialGradient>
        </defs>
        <image href="/night/sky.webp" width={sky.width} height={sky.height} />
        {grounded.map(({ star, i }) => (
          <Star key={star.name} star={star} i={i} />
        ))}
      </svg>

      <svg className="night-sky-raised" viewBox={viewBox} preserveAspectRatio="xMidYMin slice">
        {Array.from({ length: sky.dotLayers }, (_, i) => (
          <image
            key={i}
            className="night-dots"
            href={`/night/dots-${i}.webp`}
            width={sky.width}
            height={sky.height}
            style={timing(i, 3.4, 3)}
          />
        ))}
        {moon && (
          <>
            <circle
              className="night-moon-glow"
              cx={moon.x + moon.w / 2}
              cy={moon.y + moon.h / 2}
              r={moon.h * 0.8}
              fill="url(#moon-glow)"
            />
            <g filter="url(#night-shadow)">
              <image className="night-moon" href="/night/moon.webp" x={moon.x} y={moon.y} width={moon.w} height={moon.h} />
            </g>
          </>
        )}
        {raised.map(({ star, i }) => (
          <Star key={star.name} star={star} i={i} />
        ))}
      </svg>
    </div>
  );
}
