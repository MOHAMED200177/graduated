import { useEffect, useRef } from "react";
import { personalInfo } from "../../data/personalInfo";

const ELEMENTS = [
  { s: "H", n: 1 },
  { s: "He", n: 2 },
  { s: "Li", n: 3 },
  { s: "Be", n: 4 },
  { s: "B", n: 5 },
  { s: "C", n: 6 },
  { s: "N", n: 7 },
  { s: "O", n: 8 },
  { s: "F", n: 9 },
  { s: "Ne", n: 10 },
  { s: "Na", n: 11 },
  { s: "Mg", n: 12 },
  { s: "Al", n: 13 },
  { s: "Si", n: 14 },
  { s: "P", n: 15 },
  { s: "S", n: 16 },
  { s: "Cl", n: 17 },
  { s: "Ar", n: 18 },
  { s: "K", n: 19 },
  { s: "Ca", n: 20 },
  { s: "Sc", n: 21 },
  { s: "Ti", n: 22 },
  { s: "V", n: 23 },
  { s: "Cr", n: 24 },
  { s: "Mn", n: 25 },
  { s: "Fe", n: 26 },
  { s: "Co", n: 27 },
  { s: "Ni", n: 28 },
  { s: "Cu", n: 29 },
  { s: "Zn", n: 30 },
  { s: "Ga", n: 31 },
  { s: "Ge", n: 32 },
  { s: "As", n: 33 },
  { s: "Se", n: 34 },
  { s: "Br", n: 35 },
  { s: "Kr", n: 36 },
  { s: "Rb", n: 37 },
  { s: "Sr", n: 38 },
  { s: "Y", n: 39 },
  { s: "Zr", n: 40 },
  { s: "Nb", n: 41 },
  { s: "Mo", n: 42 },
  { s: "Ru", n: 44 },
  { s: "Rh", n: 45 },
  { s: "Pd", n: 46 },
  { s: "Ag", n: 47 },
  { s: "Cd", n: 48 },
  { s: "In", n: 49 },
  { s: "Sn", n: 50 },
  { s: "Sb", n: 51 },
  { s: "Te", n: 52 },
  { s: "I", n: 53 },
  { s: "Xe", n: 54 },
  { s: "Cs", n: 55 },
  { s: "Ba", n: 56 },
  { s: "Er", n: 68 },
  { s: "Eu", n: 63 },
  { s: "Hf", n: 72 },
  { s: "W", n: 74 },
  { s: "Re", n: 75 },
  { s: "Ir", n: 77 },
  { s: "Pt", n: 78 },
  { s: "Au", n: 79 },
  { s: "Hg", n: 80 },
  { s: "Pb", n: 82 },
  { s: "Bi", n: 83 },
  { s: "Ra", n: 88 },
  { s: "Ac", n: 89 },
];

const HERO = ["Ar", "Be", "Er"];
const PALETTE = ["#C2185B", "#4DD0C4", "#F8BBD9", "#C9A84C"];

export default function Intro({ onComplete }) {
  const canvasRef = useRef(null);
  const stageRef = useRef(null);
  const stateRef = useRef({
    started: false,
    act: 0,
    t: 0,
    last: 0,
    elements: [],
    particles: [],
    molecules: [],
    nameVisible: false,
    subtitleVisible: false,
    arSplitting: false,
    arSplitT: 0,
    arSplitDone: false,
    showSmallA: false,
    showSmallR: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const stage = stageRef.current;
    const S = stateRef.current;
    let W, H, animId;

    function resize() {
      W = canvas.width = stage.clientWidth;
      H = canvas.height = stage.clientHeight;
    }

    function initMolecules() {
      S.molecules = [];
      for (let i = 0; i < 22; i++) {
        S.molecules.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.12,
          r: Math.random() * 20 + 10,
          rot: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.004,
          type: Math.floor(Math.random() * 2),
          alpha: Math.random() * 0.06 + 0.025,
          color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
        });
      }
    }

    function drawMolecules() {
      S.molecules.forEach((m) => {
        m.x += m.vx;
        m.y += m.vy;
        m.rot += m.rotSpeed;
        if (m.x < -60) m.x = W + 60;
        if (m.x > W + 60) m.x = -60;
        if (m.y < -60) m.y = H + 60;
        if (m.y > H + 60) m.y = -60;
        ctx.save();
        ctx.translate(m.x, m.y);
        ctx.rotate(m.rot);
        ctx.strokeStyle = m.color;
        ctx.globalAlpha = 0.6;
        ctx.lineWidth = 0.8;
        if (m.type === 0) {
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            ctx.lineTo(
              Math.cos((i * Math.PI) / 3) * m.r,
              Math.sin((i * Math.PI) / 3) * m.r,
            );
          }
          ctx.closePath();
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, 0, m.r * 0.4, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, m.r * 0.28, 0, Math.PI * 2);
          ctx.stroke();
          for (let i = 0; i < 3; i++) {
            const a = (i * Math.PI * 2) / 3;
            ctx.beginPath();
            ctx.moveTo(Math.cos(a) * m.r * 0.28, Math.sin(a) * m.r * 0.28);
            ctx.lineTo(Math.cos(a) * m.r, Math.sin(a) * m.r);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(
              Math.cos(a) * m.r,
              Math.sin(a) * m.r,
              m.r * 0.18,
              0,
              Math.PI * 2,
            );
            ctx.stroke();
          }
        }
        ctx.restore();
      });
    }

    function initElements() {
      S.elements = [];
      const cols = 9,
        rows = 8;
      // التعديل الأول: تكبير الحد الأقصى للمربع لـ 65 بدلاً من 58 لتكبير بساط
      const cellW = Math.min((W * 0.92) / cols, 65);
      const cellH = cellW * 1.12;
      const startX = (W - cols * cellW) / 2;
      const startY = (H - rows * cellH) / 2;
      let idx = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (idx >= ELEMENTS.length) break;
          const d = ELEMENTS[idx++];
          const isHero = HERO.includes(d.s);
          S.elements.push({
            s: d.s,
            n: d.n,
            x: startX + c * cellW + cellW / 2,
            y: startY + r * cellH + cellH / 2,
            originX: startX + c * cellW + cellW / 2,
            originY: startY + r * cellH + cellH / 2,
            finalX: 0,
            finalY: 0,
            cellW,
            cellH,
            isHero,
            opacity: 0,
            scale: 0.2,
            eliminating: false,
            eliminated: false,
            elimT: 0,
            glowPhase: Math.random() * Math.PI * 2,
            displayOverride: null,
          });
        }
      }
    }

    function spawnBurst(x, y) {
      for (let i = 0; i < 10; i++) {
        const angle = ((Math.PI * 2) / 10) * i;
        const speed = Math.random() * 2 + 0.8;
        S.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          r: Math.random() * 2 + 0.8,
          color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
          life: 1,
          decay: Math.random() * 0.03 + 0.018,
        });
      }
    }

    function spawnFinalBurst() {
      for (let i = 0; i < 80; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 1;
        S.particles.push({
          x: W / 2,
          y: H / 2,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          r: Math.random() * 3 + 1,
          color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
          life: 1,
          decay: Math.random() * 0.01 + 0.006,
        });
      }
    }

    function computeHeroTargets() {
      const arEl = S.elements.find((e) => e.s === "Ar");
      const beEl = S.elements.find((e) => e.s === "Be");
      const erEl = S.elements.find((e) => e.s === "Er");

      const spacing = Math.min(W * 0.18, 100);
      const startX = W / 2 - spacing;

      if (arEl) {
        arEl.finalX = startX;
        arEl.finalY = H / 2;
      }
      if (beEl) {
        beEl.finalX = startX + spacing;
        beEl.finalY = H / 2;
      }
      if (erEl) {
        erEl.finalX = startX + spacing * 2;
        erEl.finalY = H / 2;
      }
    }

    let elimDelay = 0,
      convProgress = 0;

    function update(dt) {
      S.t += dt;

      S.particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.035;
        p.life -= p.decay;
      });
      S.particles = S.particles.filter((p) => p.life > 0);

      if (S.act === 0) {
        S.elements.forEach((e) => {
          e.opacity = Math.min(e.opacity + dt * 0.7, 1);
          e.scale = Math.min(e.scale + dt * 0.5, 1);
        });
        if (S.t > 2) {
          S.act = 1;
          elimDelay = 0;
        }
      }

      if (S.act === 1) {
        const arEl = S.elements.find((e) => e.s === "Ar");

        if (!S.arSplitting && !S.arSplitDone && S.t > 2.5) {
          if (arEl) arEl.glowPhase = 0;
          S.arSplitting = true;
          S.arSplitT = 0;
        }

        if (S.arSplitting) {
          S.arSplitT += dt;
          if (arEl) {
            arEl.glowPhase += dt * 3;
            if (S.arSplitT > 1.2) {
              arEl.displayOverride = "A";
              spawnBurst(arEl.x - arEl.cellW * 0.2, arEl.y);
            }
            if (S.arSplitT > 2.0) {
              S.arSplitting = false;
              S.arSplitDone = true;
            }
          }
        }

        if (S.arSplitDone) {
          elimDelay += dt;
          const nonHero = S.elements.filter(
            (e) => !e.isHero && !e.eliminated && !e.eliminating,
          );
          if (elimDelay > 0.04 && nonHero.length > 0) {
            elimDelay = 0;
            const target = nonHero[Math.floor(Math.random() * nonHero.length)];
            target.eliminating = true;
            target.elimT = 0;
          }
          S.elements.forEach((e) => {
            if (e.eliminating) {
              e.elimT += dt * 2.8;
              e.opacity = Math.max(0, 1 - e.elimT);
              e.scale = 1 + e.elimT * 0.4;
              if (e.elimT > 0.6) {
                spawnBurst(e.x, e.y);
                e.eliminated = true;
                e.eliminating = false;
              }
            }
            if (e.isHero) {
              e.glowPhase += dt * 2;
              e.opacity = Math.min(e.opacity + dt * 0.5, 1);
            }
          });
          if (nonHero.length === 0 && !S.elements.some((e) => e.eliminating)) {
            S.act = 2;
            convProgress = 0;
            computeHeroTargets();
          }
        }
      }

      if (S.act === 2) {
        convProgress = Math.min(convProgress + dt * 0.35, 1);
        const ease =
          convProgress < 0.5
            ? 4 * convProgress ** 3
            : 1 - (-2 * convProgress + 2) ** 3 / 2;
        S.elements
          .filter((e) => e.isHero)
          .forEach((e) => {
            e.x = e.originX + (e.finalX - e.originX) * ease;
            e.y = e.originY + (e.finalY - e.originY) * ease;
            e.scale = 1 + ease * 0.5;
          });
        if (convProgress >= 1) {
          S.act = 3;
          spawnFinalBurst();
          S.nameVisible = true;
          setTimeout(() => {
            S.subtitleVisible = true;
          }, 900);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 4000);
        }
      }

      if (S.act === 3) {
        S.elements
          .filter((e) => e.isHero)
          .forEach((e) => {
            e.opacity = Math.max(e.opacity - dt * 0.6, 0);
          });
      }
    }

    function drawElement(e) {
      if (e.eliminated) return;
      ctx.save();
      ctx.translate(e.x, e.y);
      ctx.scale(e.scale, e.scale);
      ctx.globalAlpha = e.opacity;

      // التعديل الثاني: زيادة نسبة الامتلاء لـ 90% بدل 86%
      const cw = e.cellW * 0.9,
        ch = e.cellH * 0.9;

      if (e.isHero) {
        const glow = (Math.sin(e.glowPhase) + 1) / 2;
        ctx.shadowColor = "#C2185B";
        ctx.shadowBlur = 12 + glow * 14;
        ctx.strokeStyle = `rgba(194,24,91,${0.6 + glow * 0.4})`;
        ctx.lineWidth = 1.5;
        ctx.fillStyle = "rgba(194,24,91,0.08)";
      } else {
        // التعديل الثالث: تقليل الشفافية (يعني زيادة الأرقام عشان تكون أوضح وأبرز)
        ctx.strokeStyle = "rgba(248,187,217,0.25)"; // كانت 0.12
        ctx.lineWidth = 0.8; // كانت 0.5
        ctx.fillStyle = "rgba(255,255,255,0.05)"; // كانت 0.02
      }

      ctx.fillRect(-cw / 2, -ch / 2, cw, ch);
      ctx.strokeRect(-cw / 2, -ch / 2, cw, ch);
      ctx.shadowBlur = 0;

      const displaySym = e.displayOverride || e.s;
      ctx.fillStyle = e.isHero
        ? "rgba(248,187,217,1)"
        : "rgba(255,255,255,0.45)"; // كانت 0.3 (أوضحنا لون الرمز)
      ctx.font = `${e.isHero ? "600 " : ""}${Math.round(cw * 0.34)}px Cormorant Garamond, serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(displaySym, 0, 2);

      ctx.fillStyle = e.isHero
        ? "rgba(248,187,217,0.65)"
        : "rgba(255,255,255,0.3)"; // كانت 0.2 (أوضحنا لون الرقم)
      ctx.font = `${Math.round(cw * 0.17)}px DM Sans, sans-serif`;
      ctx.fillText(e.n, 0, -cw * 0.27);
      ctx.restore();
    }

    function loop(ts) {
      const dt = Math.min((ts - S.last) / 1000, 0.05);
      S.last = ts;
      ctx.clearRect(0, 0, W, H);
      drawMolecules();
      S.elements.forEach(drawElement);
      S.particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.globalAlpha = 1;
      });
      if (S.started) update(dt);
      animId = requestAnimationFrame(loop);
    }

    resize();
    initMolecules();
    initElements();
    animId = requestAnimationFrame(loop);
    window.addEventListener("resize", () => {
      resize();
      initMolecules();
      initElements();
    });
    return () => cancelAnimationFrame(animId);
  }, []);

  function handleClick() {
    if (!stateRef.current.started) {
      stateRef.current.started = true;
      stateRef.current.t = 0;
      stateRef.current.act = 0;
    }
  }

  return (
    <section
      ref={stageRef}
      onClick={handleClick}
      style={{
        width: "100%",
        height: "100vh",
        background: "#0D0A12",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <h1
          id="name-reveal"
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "clamp(2rem, 6vw, 5rem)",
            color: "#F8BBD9",
            letterSpacing: "0.18em",
            textShadow:
              "0 0 40px rgba(194,24,91,0.6), 0 0 80px rgba(194,24,91,0.3)",
            opacity: stateRef.current.nameVisible ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        >
          {"Abeer".split("").map((char, i) => (
            <span
              key={i}
              style={{
                opacity: 0,
                animation: stateRef.current.nameVisible
                  ? `typeIn 0.6s cubic-bezier(.16,1,.3,1) forwards ${i * 0.16}s`
                  : "none",
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h1>
        <p
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: "clamp(0.6rem, 1.5vw, 0.85rem)",
            color: "rgba(248,187,217,0.55)",
            letterSpacing: "0.3em",
            marginTop: "12px",
            opacity: stateRef.current.subtitleVisible ? 1 : 0,
            transition: "opacity 1.2s ease",
          }}
        >
          {personalInfo.title.en.toUpperCase()} · {personalInfo.year}
        </p>
      </div>

      <p
        style={{
          position: "absolute",
          bottom: "24px",
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "DM Sans, sans-serif",
          fontSize: "11px",
          letterSpacing: "0.2em",
          color: "rgba(255,255,255,0.25)",
          animation: "pulse 2s infinite",
        }}
      >
        CLICK TO BEGIN
      </p>

      <style>{`
  @keyframes pulse{0%,100%{opacity:0.25}50%{opacity:0.55}}
  @keyframes typeIn{
    0%{
      opacity:0;
      transform: translateY(20px) scale(0.8);
      filter: blur(8px);
      text-shadow: 0 0 20px rgba(194,24,91,0.8);
    }
    60%{
      opacity:1;
      filter: blur(0px);
      text-shadow: 0 0 40px rgba(194,24,91,0.6);
    }
    100%{
      opacity:1;
      transform: translateY(0) scale(1);
      filter: blur(0px);
      text-shadow: 0 0 10px rgba(194,24,91,0.3);
    }
  }
`}</style>
    </section>
  );
}
