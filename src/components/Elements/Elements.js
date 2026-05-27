import { useEffect, useRef, useState } from "react";
import { herElements } from "../../data/elements";

export default function Elements() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const [active, setActive] = useState(null);

  // Background: floating DNA strands
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W, H, animId;
    let strands = [];

    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      initStrands();
    }

    function initStrands() {
      strands = [];
      for (let i = 0; i < 6; i++) {
        strands.push({
          x: Math.random() * W,
          y: Math.random() * H,
          length: Math.random() * 120 + 80,
          speed: Math.random() * 0.3 + 0.1,
          phase: Math.random() * Math.PI * 2,
          alpha: Math.random() * 0.07 + 0.03,
          color: ["#C2185B", "#4DD0C4", "#C9A84C"][
            Math.floor(Math.random() * 3)
          ],
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      strands.forEach((s) => {
        s.phase += s.speed * 0.02;
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.globalAlpha = 0.3;
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 1;

        // DNA double helix
        ctx.beginPath();
        for (let i = 0; i <= s.length; i += 2) {
          const y = i - s.length / 2;
          const x = Math.sin(i * 0.08 + s.phase) * 18;
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();

        ctx.beginPath();
        for (let i = 0; i <= s.length; i += 2) {
          const y = i - s.length / 2;
          const x = Math.sin(i * 0.08 + s.phase + Math.PI) * 18;
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Rungs
        for (let i = 0; i <= s.length; i += 12) {
          const y = i - s.length / 2;
          const x1 = Math.sin(i * 0.08 + s.phase) * 18;
          const x2 = Math.sin(i * 0.08 + s.phase + Math.PI) * 18;
          ctx.beginPath();
          ctx.moveTo(x1, y);
          ctx.lineTo(x2, y);
          ctx.stroke();
        }
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

  // Scroll reveal
  useEffect(() => {
    const cards = sectionRef.current.querySelectorAll(".el-card");
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.style.opacity = "1";
            e.target.style.transform = "translateY(0) scale(1)";
          }
        }),
      { threshold: 0.1 },
    );
    cards.forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: "100vh",
        background: "#0D0A12",
        padding: "100px 20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* DNA background canvas */}
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

      {/* Title */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "70px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <p
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: "10px",
            letterSpacing: "0.3em",
            color: "rgba(194,24,91,0.7)",
            marginBottom: "14px",
          }}
        >
          PERIODIC TABLE OF
        </p>
        <h2
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "clamp(1.8rem, 4vw, 3rem)",
            color: "#F8BBD9",
            fontWeight: 400,
            letterSpacing: "0.05em",
          }}
        >
          Her Elements
        </h2>
        <p
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "clamp(0.85rem, 1.8vw, 1rem)",
            color: "rgba(248,187,217,0.35)",
            fontStyle: "italic",
            marginTop: "10px",
          }}
        >
          The compound that makes her extraordinary
        </p>
      </div>

      {/* Elements grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(clamp(100px, 18vw, 130px), 1fr))",
          gap: "16px",
          maxWidth: "900px",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        {herElements.map((el, i) => (
          <div
            key={el.symbol}
            className="el-card"
            onClick={() => setActive(active === i ? null : i)}
            style={{
              background:
                active === i
                  ? `rgba(${el.color === "#C2185B" ? "194,24,91" : el.color === "#4DD0C4" ? "77,208,196" : "201,168,76"},0.12)`
                  : "rgba(255,255,255,0.02)",
              border: `1px solid ${active === i ? el.color : el.color + "30"}`,
              borderRadius: "4px",
              padding: "clamp(16px, 3vw, 24px) clamp(12px, 2vw, 18px)",
              cursor: "pointer",
              opacity: 0,
              transform: "translateY(24px) scale(0.95)",
              transition: `opacity 0.7s ease ${i * 0.08}s, transform 0.7s ease ${i * 0.08}s, border-color 0.3s, background 0.3s`,
              boxShadow: active === i ? `0 0 30px ${el.color}25` : "none",
              textAlign: "center",
              position: "relative",
            }}
          >
            <p
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontSize: "9px",
                color: `${el.color}80`,
                letterSpacing: "0.1em",
                marginBottom: "8px",
              }}
            >
              {el.number}
            </p>
            <p
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
                color: el.color,
                fontWeight: 600,
                lineHeight: 1,
                marginBottom: "8px",
                textShadow: active === i ? `0 0 20px ${el.color}` : "none",
                transition: "text-shadow 0.3s",
              }}
            >
              {el.symbol}
            </p>
            <p
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontSize: "clamp(0.6rem, 1.2vw, 0.72rem)",
                color: active === i ? "#F8BBD9" : "rgba(248,187,217,0.4)",
                letterSpacing: "0.08em",
                transition: "color 0.3s",
              }}
            >
              {el.name}
            </p>
            {active === i && (
              <p
                style={{
                  fontFamily: "Noto Naskh Arabic, serif",
                  fontSize: "clamp(0.8rem, 1.5vw, 0.95rem)",
                  color: el.color,
                  marginTop: "8px",
                  direction: "rtl",
                  animation: "fadeUp 0.3s ease forwards",
                }}
              >
                {el.nameAr}
              </p>
            )}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
