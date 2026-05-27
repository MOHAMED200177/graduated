import { useEffect, useRef, useState } from "react";
import { personalInfo } from "../../data/personalInfo";

function useParticles(canvasRef, active) {
  useEffect(() => {
    if (!active || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let raf;

    const resize = () => {
      canvas.width = canvas.offsetWidth * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;
    const COLORS = ["#C2185B", "#F8BBD9", "#4DD0C4", "#C9A84C", "#F48FB1"];

    const confetti = Array.from({ length: 55 }, () => ({
      x: Math.random() * (typeof W === "function" ? 800 : W),
      y: -Math.random() * 600,
      w: Math.random() * 8 + 3,
      h: Math.random() * 4 + 2,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.07,
      vx: (Math.random() - 0.5) * 1.2,
      vy: Math.random() * 1.4 + 0.6,
      alpha: Math.random() * 0.7 + 0.3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.035 + 0.01,
    }));

    const sparkles = Array.from({ length: 18 }, () => ({
      x: Math.random() * 800,
      y: Math.random() * 600,
      r: Math.random() * 1.5 + 0.5,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.04 + 0.015,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));

    // Burst ring — مرة واحدة عند البداية
    let burst = [];
    let burstDone = false;
    setTimeout(() => {
      if (burstDone) return;
      burstDone = true;
      const cx = W() / 2,
        cy = H() / 2;
      for (let i = 0; i < 36; i++) {
        const angle = ((Math.PI * 2) / 36) * i;
        const speed = Math.random() * 5 + 3;
        burst.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          r: Math.random() * 2 + 0.8,
          alpha: 1,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          gravity: 0.05,
          decay: 0.014,
        });
      }
    }, 100);

    const tick = () => {
      ctx.clearRect(0, 0, W(), H());

      // Burst
      burst.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.97;
        p.alpha -= p.decay;
        if (p.alpha <= 0) return;
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      burst = burst.filter((p) => p.alpha > 0);

      // Confetti
      confetti.forEach((p) => {
        p.wobble += p.wobbleSpeed;
        p.x += p.vx + Math.sin(p.wobble) * 0.4;
        p.y += p.vy;
        p.rot += p.rotSpeed;
        if (p.y > H() + 20) {
          p.y = -20;
          p.x = Math.random() * W();
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 2;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });

      // Sparkles
      sparkles.forEach((p) => {
        p.phase += p.speed;
        const alpha = ((Math.sin(p.phase) + 1) / 2) * 0.5;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [active, canvasRef]);
}

function Countdown({ onComplete }) {
  const [count, setCount] = useState(3);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (count === 0) {
      const t = setTimeout(onComplete, 700);
      return () => clearTimeout(t);
    }
    const out = setTimeout(() => setFade(false), 700);
    const next = setTimeout(() => {
      setCount((c) => c - 1);
      setFade(true);
    }, 1000);
    return () => {
      clearTimeout(out);
      clearTimeout(next);
    };
  }, [count, onComplete]);

  return (
    <div style={{ textAlign: "center", padding: "60px 0" }}>
      <p
        style={{
          fontFamily: "DM Sans, sans-serif",
          fontSize: "10px",
          letterSpacing: "0.35em",
          color: "rgba(194,24,91,0.7)",
          textTransform: "uppercase",
          marginBottom: "24px",
        }}
      >
        compound synthesis in
      </p>
      <div
        key={count}
        style={{
          fontSize: "clamp(80px,15vw,120px)",
          color: "#C2185B",
          fontWeight: 300,
          lineHeight: 1,
          fontFamily: "Cormorant Garamond, serif",
          opacity: fade ? 1 : 0,
          transform: fade ? "scale(1)" : "scale(1.6)",
          transition: "opacity 0.35s ease, transform 0.35s ease",
          textShadow: "0 0 60px rgba(194,24,91,0.6)",
        }}
      >
        {count === 0 ? "✦" : count}
      </div>
    </div>
  );
}

function Vial({ fillPct }) {
  const liquidH = 160 * (fillPct / 100);
  const liquidY = 200 - liquidH;
  return (
    <svg
      viewBox="0 0 80 240"
      width="80"
      height="240"
      style={{
        overflow: "visible",
        filter: "drop-shadow(0 0 20px rgba(194,24,91,0.5))",
      }}
    >
      <defs>
        <linearGradient id="liquidGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F8BBD9" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#C2185B" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#7B0A35" stopOpacity="1" />
        </linearGradient>
        <clipPath id="vialClip">
          <path d="M22 40 L18 200 Q18 218 40 218 Q62 218 62 200 L58 40 Z" />
        </clipPath>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect
        x="24"
        y="18"
        width="32"
        height="8"
        rx="3"
        fill="#C9A84C"
        opacity="0.9"
      />
      <rect x="26" y="14" width="28" height="6" rx="2" fill="#A8893A" />
      <path
        d="M22 40 L18 200 Q18 218 40 218 Q62 218 62 200 L58 40 Z"
        fill="rgba(255,255,255,0.02)"
        stroke="rgba(194,24,91,0.45)"
        strokeWidth="1.5"
      />
      <g clipPath="url(#vialClip)">
        <rect
          x="18"
          y={liquidY}
          width="44"
          height={liquidH + 20}
          fill="url(#liquidGrad)"
          style={{ transition: "y 0.06s ease, height 0.06s ease" }}
        />
        {fillPct > 3 && (
          <ellipse
            cx="40"
            cy={liquidY}
            rx="18"
            ry="3"
            fill="#F8BBD9"
            opacity="0.5"
          />
        )}
      </g>
      <path
        d="M27 44 L24 195"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.1"
      />
      {[0.25, 0.5, 0.75].map((t, i) => (
        <g key={i}>
          <line
            x1="58"
            y1={200 - 160 * t}
            x2="65"
            y2={200 - 160 * t}
            stroke="#C2185B"
            strokeWidth="1"
            opacity="0.4"
          />
          <text
            x="67"
            y={200 - 160 * t + 3.5}
            fill="rgba(248,187,217,0.3)"
            fontSize="5"
            fontFamily="DM Sans, sans-serif"
          >
            {Math.round(t * 100)}%
          </text>
        </g>
      ))}
      {fillPct >= 98 && (
        <ellipse
          cx="40"
          cy="130"
          rx="36"
          ry="80"
          fill="#C2185B"
          opacity="0.1"
          filter="url(#glow)"
        />
      )}
    </svg>
  );
}

const FORMULA_PARTS = [
  { sym: "5", label: "years of dedication" },
  { sym: "∞", label: "sleepless nights" },
  { sym: "✦", label: "brilliant moments" },
  { sym: "1", label: "extraordinary soul" },
];

export default function FinalVial() {
  const [phase, setPhase] = useState("idle");
  const [fillPct, setFillPct] = useState(0);
  const [btnHovered, setBtnHovered] = useState(false);
  const canvasRef = useRef(null);
  const fillRef = useRef(null);
  const sectionRef = useRef(null);

  useParticles(canvasRef, phase === "exploding" || phase === "complete");

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && phase === "idle") setPhase("ready");
      },
      { threshold: 0.35 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [phase]);

  const startFilling = () => {
    setPhase("filling");
    setFillPct(0);
    let pct = 0;
    const step = () => {
      pct += 0.55;
      setFillPct(Math.min(pct, 100));
      if (pct < 100) {
        fillRef.current = requestAnimationFrame(step);
      } else {
        setTimeout(() => {
          setPhase("exploding");
          setTimeout(() => setPhase("complete"), 1400);
        }, 300);
      }
    };
    fillRef.current = requestAnimationFrame(step);
  };

  useEffect(() => () => cancelAnimationFrame(fillRef.current), []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 24px 100px",
        overflow: "hidden",
        backgroundColor: "#0D0A12",
      }}
    >
      {/* Ambient orbs */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "15%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(194,24,91,0.06) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "15%",
          right: "10%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(77,208,196,0.06) 0%, transparent 70%)",
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "60px", zIndex: 2 }}>
        <p
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: "10px",
            letterSpacing: "0.3em",
            color: "rgba(194,24,91,0.7)",
            textTransform: "uppercase",
            marginBottom: "14px",
          }}
        >
          FINAL SYNTHESIS · LAB REPORT Nº 001
        </p>
        <h2
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "clamp(1.8rem,5vw,3.2rem)",
            fontWeight: 400,
            color: "#F8BBD9",
            fontStyle: "italic",
            letterSpacing: "0.04em",
            margin: 0,
          }}
        >
          The Compound is Complete
        </h2>
        <p
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "clamp(0.85rem,1.8vw,1rem)",
            color: "rgba(248,187,217,0.3)",
            fontStyle: "italic",
            marginTop: "10px",
          }}
        >
          خمس سنين في قارورة واحدة
        </p>
      </div>

      {/* Scene */}
      <div
        style={{
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: "680px",
        }}
      >
        {/* READY */}
        {phase === "ready" && (
          <div
            style={{
              textAlign: "center",
              animation: "fadeUp 0.8s cubic-bezier(.16,1,.3,1) forwards",
            }}
          >
            <p
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: "clamp(0.9rem,1.8vw,1.05rem)",
                color: "rgba(248,187,217,0.35)",
                fontStyle: "italic",
                marginBottom: "36px",
              }}
            >
              اضغط لتبدأ عملية التخليق النهائية
            </p>
            <button
              onClick={() => setPhase("countdown")}
              onMouseEnter={() => setBtnHovered(true)}
              onMouseLeave={() => setBtnHovered(false)}
              style={{
                background: btnHovered
                  ? "linear-gradient(135deg, rgba(194,24,91,0.18), rgba(194,24,91,0.06))"
                  : "transparent",
                border: `1px solid ${btnHovered ? "#C2185B" : "rgba(194,24,91,0.3)"}`,
                borderRadius: "4px",
                padding: "18px 56px",
                fontFamily: "Cormorant Garamond, serif",
                fontSize: "clamp(1rem,2vw,1.3rem)",
                fontStyle: "italic",
                color: btnHovered ? "#F8BBD9" : "rgba(248,187,217,0.55)",
                cursor: "pointer",
                letterSpacing: "0.12em",
                transition: "all 0.4s ease",
                boxShadow: btnHovered
                  ? "0 0 40px rgba(194,24,91,0.2), inset 0 0 20px rgba(194,24,91,0.04)"
                  : "none",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {btnHovered && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(90deg, transparent, rgba(248,187,217,0.06), transparent)",
                    animation: "shimmerBtn 1.5s ease infinite",
                  }}
                />
              )}
              ✦ &nbsp; Synthesize &nbsp; ✦
            </button>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "8px",
                marginTop: "32px",
              }}
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    background: "#C2185B",
                    opacity: 0.3,
                    animation: `pulseDot 1.5s ease-in-out infinite ${i * 0.2}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* COUNTDOWN */}
        {phase === "countdown" && <Countdown onComplete={startFilling} />}

        {/* FILLING */}
        {phase === "filling" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
              padding: "40px 0",
              animation: "fadeUp 0.5s ease forwards",
            }}
          >
            <Vial fillPct={fillPct} />
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "10px",
                  letterSpacing: "0.3em",
                  color: "rgba(194,24,91,0.7)",
                  marginBottom: "8px",
                }}
              >
                SYNTHESIZING
              </p>
              <p
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontSize: "2.2rem",
                  color: "#F8BBD9",
                  letterSpacing: "0.1em",
                  textShadow:
                    fillPct > 80 ? "0 0 30px rgba(194,24,91,0.6)" : "none",
                  transition: "text-shadow 0.5s ease",
                }}
              >
                {Math.round(fillPct)}%
              </p>
            </div>
          </div>
        )}

        {/* EXPLODING */}
        {phase === "exploding" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
              padding: "40px 0",
            }}
          >
            <div
              style={{
                animation: "vialExplode 0.4s cubic-bezier(.16,1,.3,1) forwards",
              }}
            >
              <Vial fillPct={100} />
            </div>
            <p
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: "1.5rem",
                color: "#C9A84C",
                letterSpacing: "0.2em",
                fontStyle: "italic",
                animation: "fadeUp 0.4s ease forwards",
                textShadow: "0 0 30px rgba(201,168,76,0.6)",
              }}
            >
              100% ✦
            </p>
          </div>
        )}

        {/* COMPLETE */}
        {phase === "complete" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "40px",
              width: "100%",
              opacity: 0,
              animation:
                "burstReveal 1s cubic-bezier(.16,1,.3,1) forwards 0.2s",
            }}
          >
            {/* Name */}
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "9px",
                  letterSpacing: "0.35em",
                  color: "rgba(248,187,217,0.45)",
                  textTransform: "uppercase",
                  marginBottom: "10px",
                }}
              >
                synthesized for
              </p>
              <h3
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontSize: "clamp(2.5rem,8vw,5rem)",
                  color: "#F8BBD9",
                  fontStyle: "italic",
                  fontWeight: 400,
                  letterSpacing: "0.06em",
                  textShadow: "0 0 60px rgba(194,24,91,0.6)",
                  margin: 0,
                  lineHeight: 1.1,
                }}
              >
                {personalInfo.name.en}
              </h3>
            </div>

            {/* Formula */}
            <div style={{ width: "100%", textAlign: "center" }}>
              <p
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "9px",
                  letterSpacing: "0.35em",
                  color: "#C2185B",
                  textTransform: "uppercase",
                  marginBottom: "16px",
                }}
              >
                Final Compound
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                {FORMULA_PARTS.map((p, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      padding: "12px 18px",
                      border: "1px solid rgba(194,24,91,0.3)",
                      borderRadius: "4px",
                      minWidth: "90px",
                      background: "rgba(194,24,91,0.06)",
                      opacity: 0,
                      animation: `fadeUp 0.6s cubic-bezier(.16,1,.3,1) forwards ${i * 0.15 + 0.5}s`,
                    }}
                  >
                    <span
                      style={{
                        fontSize: "1.5rem",
                        color: "#4DD0C4",
                        lineHeight: 1,
                        marginBottom: "6px",
                        fontFamily: "Cormorant Garamond, serif",
                        textShadow: "0 0 12px rgba(77,208,196,0.5)",
                      }}
                    >
                      {p.sym}
                    </span>
                    <span
                      style={{
                        fontSize: "8px",
                        color: "rgba(248,187,217,0.6)",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        textAlign: "center",
                        fontFamily: "DM Sans, sans-serif",
                      }}
                    >
                      {p.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Message card */}
            <div
              style={{
                maxWidth: "520px",
                width: "100%",
                padding: "clamp(28px,5vw,44px)",
                border: "1px solid rgba(194,24,91,0.25)",
                borderRadius: "4px",
                background:
                  "linear-gradient(135deg, rgba(13,10,18,0.8), rgba(23,10,17,0.9))",
                position: "relative",
                textAlign: "center",
                boxShadow:
                  "0 20px 60px rgba(0,0,0,0.4), inset 0 0 40px rgba(194,24,91,0.03)",
                opacity: 0,
                animation: "fadeUp 0.8s cubic-bezier(.16,1,.3,1) forwards 0.9s",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "60%",
                  height: "1px",
                  background:
                    "linear-gradient(90deg, transparent, rgba(194,24,91,0.5), transparent)",
                }}
              />
              <p
                style={{
                  position: "absolute",
                  top: "10px",
                  left: "20px",
                  fontSize: "50px",
                  color: "rgba(194,24,91,0.2)",
                  lineHeight: 1,
                  fontFamily: "Georgia, serif",
                  margin: 0,
                }}
              >
                "
              </p>
              <p
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontSize: "clamp(1rem,2vw,1.15rem)",
                  lineHeight: 1.9,
                  color: "rgba(248,187,217,0.85)",
                  fontStyle: "italic",
                  margin: "0 0 24px",
                }}
              >
                Five years of formulas, late nights, and quiet brilliance — and
                you turned every single one into something rare. This isn't just
                a degree. It's proof of what you're made of.
              </p>
              <p
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontSize: "clamp(0.85rem,1.6vw,1rem)",
                  color: "#C9A84C",
                  letterSpacing: "0.12em",
                  margin: 0,
                }}
              >
                Congratulations, Sis ✦
              </p>
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "60%",
                  height: "1px",
                  background:
                    "linear-gradient(90deg, transparent, rgba(194,24,91,0.5), transparent)",
                }}
              />
            </div>

            {/* Stamp */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "12px 32px",
                border: "1.5px solid rgba(194,24,91,0.5)",
                borderRadius: "2px",
                gap: "4px",
                opacity: 0,
                transform: "rotate(-1.5deg)",
                animation:
                  "stampIn 0.6s cubic-bezier(.16,1,.3,1) forwards 1.2s",
                background: "rgba(194,24,91,0.04)",
              }}
            >
              <p
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "20px",
                  letterSpacing: "0.45em",
                  color: "#C2185B",
                  textTransform: "uppercase",
                  margin: 0,
                }}
              >
                F=m🤝a
              </p>
              <p
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontSize: "1.4rem",
                  color: "#F8BBD9",
                  letterSpacing: "0.2em",
                  fontWeight: 300,
                  margin: 0,
                }}
              >
                2026
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      {phase === "complete" && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginTop: "80px",
            zIndex: 2,
            width: "100%",
            maxWidth: "400px",
            opacity: 0,
            animation: "fadeUp 0.8s ease forwards 1.5s",
          }}
        >
          <div
            style={{
              flex: 1,
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, rgba(194,24,91,0.4), transparent)",
            }}
          />
          <p
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: "9px",
              letterSpacing: "0.35em",
              color: "rgba(248,187,217,0.3)",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            end of experiment
          </p>
          <div
            style={{
              flex: 1,
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, rgba(194,24,91,0.4), transparent)",
            }}
          />
        </div>
      )}

      {/* ── Signature ── */}
      {phase === "complete" && (
        <div
          style={{
            marginTop: "60px",
            zIndex: 2,
            textAlign: "center",
            opacity: 0,
            animation: "fadeUp 1s ease forwards 2s",
            width: "100%",
            maxWidth: "500px",
          }}
        >
          {/* Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "28px",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "0.5px",
                background: "rgba(201,168,76,0.3)",
              }}
            />
            <span
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: "1rem",
                letterSpacing: "0.2em",
                color: "rgba(255, 212, 20, 0.94)",
                fontStyle: "italic",
              }}
            >
              crafted with love
            </span>
            <div
              style={{
                width: "40px",
                height: "0.5px",
                background: "rgba(201, 76, 145, 0.3)",
              }}
            />
          </div>

          <p
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: "12px",
              letterSpacing: "0.25em",
              color: "rgb(233, 196, 116)",
              marginBottom: "16px",
              textTransform: "uppercase",
            }}
          >
            by
          </p>

          {/* Credits */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "12px 32px",
            }}
          >
            {personalInfo.credits.map((person, i) => (
              <div
                key={i}
                style={{
                  textAlign: "center",
                  opacity: 0,
                  animation: `fadeUp 0.7s ease forwards ${2.3 + i * 0.18}s`,
                }}
              >
                <p
                  style={{
                    fontFamily: "Cormorant Garamond, serif",
                    fontSize: "clamp(1.2rem,1.8vw,1.1rem)",
                    color: "rgba(236,255,130,0.94)",
                    fontStyle: "italic",
                    letterSpacing: "0.05em",
                    margin: "0 0 6px",
                    textShadow: `
    0 0 20px rgba(236,255,130,0.6),
    0 0 40px rgba(255, 179, 15, 0.88),
    0 0 80px rgba(236,255,130,0.15),
    2px 2px 0px rgba(218, 166, 72, 0.4)
  `,
                    filter: "drop-shadow(0 0 8px rgba(236,255,130,0.4))",
                  }}
                >
                  {person.name}
                </p>
                <p
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "10px",
                    letterSpacing: "0.22em",
                    color: "rgba(188, 201, 76, 0.35)",
                    textTransform: "uppercase",
                    margin: 0,
                  }}
                >
                  {person.role}
                </p>
              </div>
            ))}
          </div>

          {/* Final mark */}
          <p
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: "0.8rem",
              color: "rgba(248, 223, 0, 0.94)",
              marginTop: "28px",
              letterSpacing: "0.35em",
              margin: "10px 10px 10px",
              textShadow: `
    0 0 20px rgba(219, 255, 12, 0.6),
    0 0 40px rgba(255, 179, 15, 0.88),
    0 0 80px rgb(221, 206, 0),
    1px 1px 0px rgb(230, 255, 2)
  `,
            }}
          >
            ✦ We are so proud of you, 3aboshiiyy ✦
          </p>
        </div>
      )}

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes burstReveal {
          0%   { opacity: 0; transform: scale(0.85) translateY(30px); filter: blur(8px); }
          60%  { filter: blur(0px); }
          100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0px); }
        }
        @keyframes vialExplode {
          0%   { transform: scale(1); filter: brightness(1); }
          40%  { transform: scale(1.3); filter: brightness(2) blur(2px); }
          100% { transform: scale(0) rotate(20deg); opacity: 0; }
        }
        @keyframes stampIn {
          from { opacity: 0; transform: rotate(-1.5deg) scale(1.3); }
          to   { opacity: 0.65; transform: rotate(-1.5deg) scale(1); }
        }
        @keyframes shimmerBtn {
          from { transform: translateX(-100%); }
          to   { transform: translateX(100%); }
        }
        @keyframes pulseDot {
          0%,100% { opacity: 0.3; transform: scale(1); }
          50%     { opacity: 0.8; transform: scale(1.4); }
        }
      `}</style>
    </section>
  );
}
