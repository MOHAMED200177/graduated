import { useEffect, useRef, useState } from "react";
import { roseData } from "../../data/rose"; // تأكدي من مسار الملف

const PETAL_DIST = 130;

function easeOutElastic(x) {
  const c4 = (2 * Math.PI) / 4.5;
  return x === 0
    ? 0
    : x === 1
      ? 1
      : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
}

export default function RoseLab() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const bloomRef = useRef(0);
  const animRef = useRef(null);

  const [activePetal, setActivePetal] = useState(null);
  const [bloomed, setBloomed] = useState(false);
  const [, forceUpdate] = useState(0);

  // ── Floating petals canvas ──────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W, H, animId;
    let floatingPetals = [];

    const COLORS = roseData.petals.map((p) => p.color);

    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      initPetals();
    }

    function initPetals() {
      floatingPetals = Array.from({ length: 18 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.3,
        vy: Math.random() * 0.4 + 0.1,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        size: Math.random() * 12 + 5,
        alpha: Math.random() * 0.12 + 0.04,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }));
    }

    function drawPetalShape(ctx, w, h) {
      ctx.beginPath();
      ctx.moveTo(0, -h / 2);
      ctx.bezierCurveTo(w / 2, -h / 3, w / 2, h / 3, 0, h / 2);
      ctx.bezierCurveTo(-w / 2, h / 3, -w / 2, -h / 3, 0, -h / 2);
      ctx.closePath();
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      floatingPetals.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.rotSpeed;
        if (p.y > H + 30) {
          p.y = -30;
          p.x = Math.random() * W;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        drawPetalShape(ctx, p.size, p.size * 1.6);
        ctx.fill();
        ctx.restore();
      });
      animId = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // ── Scroll-triggered bloom ──────────────────────────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !bloomed) setBloomed(true);
      },
      { threshold: 0.3 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [bloomed]);

  // ── Bloom animation (drives forceUpdate to re-render petals) ───────────
  useEffect(() => {
    if (!bloomed) return;
    let start = null;
    const duration = 2200;

    function animate(ts) {
      if (!start) start = ts;
      bloomRef.current = Math.min((ts - start) / duration, 1);
      forceUpdate((n) => n + 1);
      if (bloomRef.current < 1)
        animRef.current = requestAnimationFrame(animate);
    }

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [bloomed]);

  // ── Active petal data ───────────────────────────────────────────────────
  const active = activePetal !== null ? roseData.petals[activePetal] : null;

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: "100vh",
        background: "#0D0A12",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 20px",
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(194,24,91,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Floating petals canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      />

      {/* ── Title ── */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "60px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <p
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: "10px",
            letterSpacing: "0.35em",
            color: "rgba(194,24,91,0.7)",
            marginBottom: "12px",
          }}
        >
          {roseData.titleLabel}
        </p>
        <h2
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "clamp(1.8rem, 4vw, 3rem)",
            color: "#F8BBD9",
            fontWeight: 300,
            letterSpacing: "0.08em",
          }}
        >
          {roseData.title}
        </h2>
        <p
          style={{
            fontFamily: "Noto Naskh Arabic, serif",
            fontSize: "clamp(0.85rem, 1.8vw, 1rem)",
            color: "rgba(248,187,217,0.35)",
            marginTop: "8px",
          }}
        >
          {roseData.subtitleAr}
        </p>
      </div>

      {/* ── Rose stage ── */}
      <div
        style={{
          position: "relative",
          width: "clamp(320px, 60vw, 500px)",
          height: "clamp(320px, 60vw, 500px)",
          zIndex: 1,
        }}
      >
        {/* Center bud */}
        <div
          onClick={() => setActivePetal(null)}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%,-50%)",
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 35% 35%, #E8A4C8, #C2185B 60%, #7B0D3A)",
            boxShadow:
              "0 0 30px rgba(194,24,91,0.5), 0 0 60px rgba(194,24,91,0.2)",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <span
            style={{
              fontSize: "28px",
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.4))",
              userSelect: "none",
            }}
          >
            {roseData.centerEmoji}
          </span>
        </div>

        {/* Petals */}
        {roseData.petals.map((petal, i) => {
          const delay = i * 0.12;
          const t = Math.max(0, Math.min(1, (bloomRef.current - delay) / 0.5));
          const ease = easeOutElastic(t);
          const rad = (petal.angle * Math.PI) / 180;
          const dist = PETAL_DIST * ease;
          const x = 50 + (Math.cos(rad) * dist * 100) / 500;
          const y = 50 + (Math.sin(rad) * dist * 100) / 500;
          const isActive = activePetal === i;

          return (
            <div
              key={petal.id}
              onClick={() => setActivePetal(isActive ? null : i)}
              style={{
                position: "absolute",
                left: `${x}%`,
                top: `${y}%`,
                transform: `translate(-50%,-50%) rotate(${petal.angle + 90}deg) scale(${isActive ? 1.15 : 1})`,
                opacity: ease,
                cursor: "pointer",
                transition: "transform 0.3s ease",
                zIndex: isActive ? 20 : 5,
              }}
            >
              <svg
                width="56"
                height="90"
                viewBox="0 0 56 90"
                style={{ display: "block", overflow: "visible" }}
              >
                <defs>
                  <radialGradient
                    id={`petalGrad${i}`}
                    cx="40%"
                    cy="25%"
                    r="65%"
                  >
                    <stop
                      offset="0%"
                      stopColor={petal.color}
                      stopOpacity="0.95"
                    />
                    <stop
                      offset="70%"
                      stopColor={petal.color}
                      stopOpacity="0.7"
                    />
                    <stop
                      offset="100%"
                      stopColor={petal.color}
                      stopOpacity="0.4"
                    />
                  </radialGradient>
                  <filter id={`glow${i}`}>
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <path
                  d="M28 5 C42 15, 52 35, 50 55 C48 72, 38 83, 28 88 C18 83, 8 72, 6 55 C4 35, 14 15, 28 5 Z"
                  fill={`url(#petalGrad${i})`}
                  filter={isActive ? `url(#glow${i})` : "none"}
                  stroke={isActive ? petal.color : "transparent"}
                  strokeWidth="1"
                />
                {/* Vein lines */}
                <path
                  d="M28 12 C28 40, 26 60, 28 85"
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="0.8"
                  fill="none"
                />
                <path
                  d="M28 25 C20 35, 15 48, 14 60"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="0.5"
                  fill="none"
                />
                <path
                  d="M28 25 C36 35, 41 48, 42 60"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="0.5"
                  fill="none"
                />
              </svg>

              {/* Year badge */}
              <div
                style={{
                  position: "absolute",
                  top: "38%",
                  left: "50%",
                  transform: `translate(-50%,-50%) rotate(${-(petal.angle + 90)}deg)`,
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "9px",
                  color: "rgba(255,255,255,0.8)",
                  letterSpacing: "0.05em",
                  whiteSpace: "nowrap",
                  textShadow: "0 1px 3px rgba(0,0,0,0.5)",
                  pointerEvents: "none",
                }}
              >
                {petal.year}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Active petal detail card ── */}
      <div
        style={{
          maxWidth: "480px",
          width: "100%",
          marginTop: "50px",
          minHeight: "120px",
          position: "relative",
          zIndex: 2,
          padding: "0 20px",
        }}
      >
        {active ? (
          <div
            key={activePetal}
            style={{
              background: "rgba(255,255,255,0.025)",
              border: `1px solid ${active.color}40`,
              borderRadius: "2px",
              padding: "28px 32px",
              animation: "petalReveal 0.5s cubic-bezier(.16,1,.3,1) forwards",
              boxShadow: `0 0 60px ${active.color}15`,
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "2px",
                background: active.color,
                margin: "0 auto 20px",
                opacity: 0.6,
              }}
            />
            <p
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontSize: "10px",
                letterSpacing: "0.25em",
                color: active.color,
                marginBottom: "10px",
              }}
            >
              {active.year}
            </p>
            <h3
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)",
                color: "#F8BBD9",
                fontWeight: 400,
                marginBottom: "14px",
              }}
            >
              {active.moment}
            </h3>
            <p
              style={{
                fontFamily: "Noto Naskh Arabic, serif",
                fontSize: "clamp(0.9rem, 1.8vw, 1.05rem)",
                color: "rgba(248,187,217,0.65)",
                direction: "rtl",
                lineHeight: 2,
              }}
            >
              {active.detail}
            </p>
          </div>
        ) : (
          <p
            style={{
              textAlign: "center",
              fontFamily: "Cormorant Garamond, serif",
              fontSize: "clamp(0.85rem, 1.8vw, 1rem)",
              color: "rgba(248,187,217,0.18)",
              fontStyle: "italic",
              paddingTop: "30px",
            }}
          >
            ✦ اضغط على أي بتلة لتقرأ اللحظة
          </p>
        )}
      </div>

      <style>{`
        @keyframes petalReveal {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
      `}</style>
    </section>
  );
}
