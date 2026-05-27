import { useEffect, useRef, useState } from "react";
import { timeline } from "../../data/timeline";

export default function Timeline() {
  const canvasRef = useRef(null);
  const sectionRef = useRef(null);
  const [activePoint, setActivePoint] = useState(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [showHint, setShowHint] = useState(true);

  const animRef = useRef({
    progress: 0,
    started: false,
    points: [],
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const section = sectionRef.current;
    let animId;

    function resize() {
      const W = (animRef.current.width = canvas.width = section.clientWidth);
      const H = (animRef.current.height = canvas.height = section.clientHeight);
      computePoints(W, H);
      if (animRef.current.progress >= 1) drawCurve(1);
    }

    function titrationY(x, W, H) {
      const t = x / W;
      const padTop = H * 0.12;
      const padBottom = H * 0.82;
      const sigmoid = 1 / (1 + Math.exp(-18 * (t - 0.76)));
      return padBottom - sigmoid * (padBottom - padTop);
    }

    function computePoints(W, H) {
      const padL = W * 0.1;
      const usableW = W - padL - W * 0.1;
      animRef.current.points = timeline.map((item, i) => {
        const t = i / (timeline.length - 1);
        const x = padL + t * usableW;
        const y = titrationY(x, W, H);
        return { ...item, x, y, index: i };
      });
    }

    function drawCurve(progress) {
      const W = animRef.current.width;
      const H = animRef.current.height;
      if (!W || !H) return;

      ctx.clearRect(0, 0, W, H);
      const timeNow = Date.now();

      // Grid lines subtle
      ctx.save();
      ctx.strokeStyle = "rgba(248,187,217,0.03)";
      ctx.lineWidth = 1;
      for (let i = 1; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(W * 0.08, H * i * 0.18);
        ctx.lineTo(W * 0.92, H * i * 0.18);
        ctx.stroke();
      }
      ctx.restore();

      // X axis
      ctx.save();
      ctx.strokeStyle = "rgba(248,187,217,0.06)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(W * 0.08, H * 0.88);
      ctx.lineTo(W * 0.92, H * 0.88);
      ctx.stroke();
      ctx.restore();

      // Axis labels
      ctx.save();
      ctx.fillStyle = "rgba(248,187,217,0.18)";
      ctx.font = "10px DM Sans, sans-serif";
      ctx.fillText("TIME →", W * 0.88, H * 0.94);
      ctx.save();
      ctx.translate(W * 0.04, H * 0.5);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText("RESILIENCE →", 0, 0);
      ctx.restore();
      ctx.restore();

      // Equivalence point dashed line
      const eqPoint = animRef.current.points[animRef.current.points.length - 1];
      if (eqPoint && progress > 0.85) {
        const eqAlpha = Math.min((progress - 0.85) / 0.15, 1);
        ctx.save();
        ctx.setLineDash([3, 7]);
        ctx.strokeStyle = `rgba(201,168,76,${eqAlpha * 0.3})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(eqPoint.x, H * 0.88);
        ctx.lineTo(eqPoint.x, eqPoint.y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Equivalence label
        ctx.fillStyle = `rgba(201,168,76,${eqAlpha * 0.5})`;
        ctx.font = "8px DM Sans, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Equivalence", eqPoint.x, eqPoint.y - 22);
        ctx.fillText("Point ✦", eqPoint.x, eqPoint.y - 10);
        ctx.restore();
      }

      // Draw curve gradient
      const padL = W * 0.1;
      const usableW = W - padL - W * 0.1;
      const drawUpTo = padL + progress * usableW;

      // Glow pass
      ctx.save();
      ctx.shadowColor = "#C2185B";
      ctx.shadowBlur = 14;
      const grad = ctx.createLinearGradient(padL, 0, padL + usableW, 0);
      grad.addColorStop(0, "#4DD0C4");
      grad.addColorStop(0.55, "#C2185B");
      grad.addColorStop(1, "#C9A84C");
      ctx.beginPath();
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2.5;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      let first = true;
      for (let i = 0; i <= 300; i++) {
        const t = i / 300;
        const x = padL + t * usableW;
        if (x > drawUpTo) break;
        const y = titrationY(x, W, H);
        first ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        first = false;
      }
      ctx.stroke();
      ctx.restore();

      // Moving particle along curve tip
      if (progress < 1) {
        const tipX = drawUpTo;
        const tipY = titrationY(tipX, W, H);
        const pulse = (Math.sin(timeNow * 0.008) + 1) / 2;
        ctx.save();
        ctx.shadowColor = "#F8BBD9";
        ctx.shadowBlur = 10 + pulse * 8;
        ctx.fillStyle = "#F8BBD9";
        ctx.beginPath();
        ctx.arc(tipX, tipY, 3 + pulse * 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Draw milestone points
      animRef.current.points.forEach((pt, i) => {
        const ptProgress = i / (timeline.length - 1);
        if (ptProgress > progress) return;

        const isLast = i === timeline.length - 1;
        const isHovered = hoveredPoint === i;
        const isActive = activePoint === i;
        const rippleCycle = (timeNow * 0.0012 + i * 1.5) % 1;

        ctx.save();

        // Ripple
        if (!isActive) {
          ctx.strokeStyle = isLast ? "#C9A84C" : pt.color;
          ctx.lineWidth = 1;
          ctx.globalAlpha = (1 - rippleCycle) * (isHovered ? 0.6 : 0.3);
          ctx.beginPath();
          ctx.arc(
            pt.x,
            pt.y,
            (isHovered ? 8 : 6) + rippleCycle * 18,
            0,
            Math.PI * 2,
          );
          ctx.stroke();
        }

        ctx.globalAlpha = 1;

        if (isLast) {
          // Gold equivalence point
          const pulse2 = (Math.sin(timeNow * 0.0025 + i) + 1) / 2;
          ctx.shadowColor = "#C9A84C";
          ctx.shadowBlur = isHovered || isActive ? 30 : 14 + pulse2 * 12;

          // Outer ring
          ctx.strokeStyle = `rgba(201,168,76,${0.4 + pulse2 * 0.3})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, isHovered ? 13 : 11, 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = "#C9A84C";
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, isHovered || isActive ? 8 : 6.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#0D0A12";
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.shadowColor = pt.color;
          ctx.shadowBlur = isHovered || isActive ? 20 : 8;

          if (isActive) {
            // Active: filled + outer ring
            ctx.strokeStyle = pt.color;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 13, 0, Math.PI * 2);
            ctx.stroke();
          }

          ctx.fillStyle = isHovered || isActive ? pt.color : "#0D0A12";
          ctx.strokeStyle = pt.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, isHovered || isActive ? 8 : 5.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }

        // Year label with background pill
        const yearLabel = pt.year;
        const fontSize = isActive || isLast ? 11 : 10;
        ctx.font = `${isActive || isLast ? "600 " : ""}${fontSize}px DM Sans, sans-serif`;
        const labelWidth = ctx.measureText(yearLabel).width + 10;

        ctx.fillStyle = isActive ? `${pt.color}22` : "rgba(13,10,18,0.7)";
        ctx.beginPath();
        ctx.roundRect
          ? ctx.roundRect(pt.x - labelWidth / 2, pt.y + 16, labelWidth, 16, 3)
          : ctx.rect(pt.x - labelWidth / 2, pt.y + 16, labelWidth, 16);
        ctx.fill();

        ctx.fillStyle = isActive
          ? "#FFF"
          : isLast
            ? "#C9A84C"
            : `rgba(248,187,217,${isHovered ? 0.8 : 0.45})`;
        ctx.textAlign = "center";
        ctx.fillText(yearLabel, pt.x, pt.y + 27);

        // Hover tooltip: element symbol above dot
        if (isHovered && !isActive) {
          ctx.fillStyle = `${pt.color}cc`;
          ctx.font = `600 13px Cormorant Garamond, serif`;
          ctx.textAlign = "center";
          ctx.fillText(pt.element, pt.x, pt.y - 18);
          ctx.font = `9px DM Sans, sans-serif`;
          ctx.fillStyle = `${pt.color}88`;
          ctx.fillText(pt.title, pt.x, pt.y - 6);
        }

        ctx.restore();
      });

      // Hint arrow animation — only before any click
      if (progress >= 1 && animRef.current.points.length > 0) {
        const firstPt = animRef.current.points[0];
        const hintAlpha = 0.35 + 0.25 * Math.sin(timeNow * 0.003);
        const bounce = Math.sin(timeNow * 0.004) * 5;
        ctx.save();
        ctx.globalAlpha = hintAlpha;
        ctx.fillStyle = "#F8BBD9";
        ctx.font = "11px DM Sans, sans-serif";
        ctx.textAlign = "center";
        // Arrow pointing down to first node
        ctx.fillText("▼", firstPt.x, firstPt.y - 28 + bounce);
        ctx.restore();
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !animRef.current.started) {
          animRef.current.started = true;
          let start = null;
          const duration = 2400;
          function animate(ts) {
            if (!start) start = ts;
            const elapsed = ts - start;
            const p = Math.min(elapsed / duration, 1);
            animRef.current.progress = p;
            drawCurve(p);
            if (p < 1) animId = requestAnimationFrame(animate);
            else loop();
          }
          animId = requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(section);

    function loop() {
      drawCurve(1);
      animId = requestAnimationFrame(loop);
    }

    function handleMouseMove(e) {
      const W = animRef.current.width;
      const H = animRef.current.height;
      if (!W || !H) return;
      const rect = canvas.getBoundingClientRect();
      const mx = (e.clientX - rect.left) * (W / rect.width);
      const my = (e.clientY - rect.top) * (H / rect.height);
      let found = null;
      animRef.current.points.forEach((pt, i) => {
        if (Math.hypot(mx - pt.x, my - pt.y) < 24) found = i;
      });
      setHoveredPoint(found);
      canvas.style.cursor = found !== null ? "pointer" : "default";
    }

    function handleClick(e) {
      const W = animRef.current.width;
      const H = animRef.current.height;
      if (!W || !H) return;
      const rect = canvas.getBoundingClientRect();
      const mx = (e.clientX - rect.left) * (W / rect.width);
      const my = (e.clientY - rect.top) * (H / rect.height);
      animRef.current.points.forEach((pt, i) => {
        if (Math.hypot(mx - pt.x, my - pt.y) < 24) {
          setActivePoint((prev) => (prev === i ? null : i));
          setShowHint(false);
        }
      });
    }

    function handleTouch(e) {
      const W = animRef.current.width;
      const H = animRef.current.height;
      if (!W || !H) return;
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const mx = (touch.clientX - rect.left) * (W / rect.width);
      const my = (touch.clientY - rect.top) * (H / rect.height);
      animRef.current.points.forEach((pt, i) => {
        if (Math.hypot(mx - pt.x, my - pt.y) < 30) {
          setActivePoint((prev) => (prev === i ? null : i));
          setShowHint(false);
        }
      });
    }

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("touchstart", handleTouch);
    window.addEventListener("resize", resize);
    resize();

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("click", handleClick);
      canvas.removeEventListener("touchstart", handleTouch);
      window.removeEventListener("resize", resize);
    };
  }, [hoveredPoint, activePoint]);

  const active = activePoint !== null ? timeline[activePoint] : null;

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: "100vh",
        background: "#0D0A12",
        padding: "80px 0 60px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: "600px",
          height: "600px",
          background:
            "radial-gradient(circle, rgba(194,24,91,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Title */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "30px",
          padding: "0 20px",
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
            marginBottom: "12px",
          }}
        >
          TITRATION CURVE
        </p>
        <h2
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
            color: "#F8BBD9",
            fontWeight: 400,
            letterSpacing: "0.05em",
          }}
        >
          The Titration Curve of Resilience
        </h2>

        {/* Hint text — فقط لو مفيش active */}
        {showHint && (
          <p
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: "clamp(0.8rem,1.6vw,0.92rem)",
              color: "rgba(248,187,217,0.28)",
              fontStyle: "italic",
              marginTop: "10px",
              animation: "pulseText 2.5s infinite ease-in-out",
            }}
          >
            ✦ &nbsp; اضغط على أي نقطة على المنحنى لتكتشف القصة
          </p>
        )}
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "52vh",
          display: "block",
          minHeight: "320px",
          position: "relative",
          zIndex: 1,
        }}
      />

      {/* Detail card */}
      <div
        style={{
          maxWidth: "620px",
          margin: "20px auto 0",
          padding: "0 20px",
          minHeight: "160px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {active ? (
          <div
            style={{
              background: "rgba(255,255,255,0.015)",
              backdropFilter: "blur(10px)",
              border: `0.5px solid ${active.color}35`,
              borderRadius: "6px",
              padding: "clamp(20px,4vw,32px)",
              animation: "fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards",
              boxShadow: `0 20px 50px rgba(0,0,0,0.3), 0 0 40px ${active.color}08`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Color accent line */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "3px",
                height: "100%",
                background: `linear-gradient(180deg, ${active.color}, transparent)`,
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "18px",
              }}
            >
              <div>
                <p
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "10px",
                    letterSpacing: "0.25em",
                    color: active.color,
                    marginBottom: "6px",
                    fontWeight: 600,
                  }}
                >
                  {active.year}
                </p>
                <h3
                  style={{
                    fontFamily: "Cormorant Garamond, serif",
                    fontSize: "clamp(1.2rem,2.5vw,1.5rem)",
                    color: "#F8BBD9",
                    fontWeight: 400,
                  }}
                >
                  {active.title}
                </h3>
                <p
                  style={{
                    fontFamily: "Noto Naskh Arabic, serif",
                    fontSize: "clamp(0.85rem,1.6vw,0.95rem)",
                    color: `${active.color}90`,
                    direction: "rtl",
                    marginTop: "4px",
                  }}
                >
                  {active.titleAr}
                </p>
              </div>

              {/* Element box */}
              <div
                style={{
                  background: `${active.color}10`,
                  border: `1px solid ${active.color}40`,
                  borderRadius: "4px",
                  padding: "10px 14px",
                  textAlign: "center",
                  minWidth: "60px",
                  boxShadow: `0 0 20px ${active.color}15`,
                }}
              >
                <p
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "8px",
                    color: `${active.color}60`,
                    letterSpacing: "0.1em",
                    marginBottom: "4px",
                  }}
                >
                  {active.elementNumber}
                </p>
                <p
                  style={{
                    fontFamily: "Cormorant Garamond, serif",
                    fontSize: "1.3rem",
                    color: active.color,
                    fontWeight: 600,
                    lineHeight: 1,
                  }}
                >
                  {active.element}
                </p>
              </div>
            </div>

            <p
              style={{
                fontFamily: "Noto Naskh Arabic, serif",
                fontSize: "clamp(0.92rem,1.8vw,1.05rem)",
                color: "rgba(248,187,217,0.75)",
                direction: "rtl",
                marginBottom: "12px",
                lineHeight: 1.9,
                fontWeight: 300,
              }}
            >
              {active.descriptionAr}
            </p>

            <p
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontSize: "clamp(0.78rem,1.4vw,0.86rem)",
                color: "rgba(248,187,217,0.35)",
                lineHeight: 1.75,
              }}
            >
              {active.description}
            </p>
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              paddingTop: "30px",
              animation: "pulseText 2.5s infinite ease-in-out",
            }}
          >
            <p
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: "clamp(0.9rem,1.8vw,1rem)",
                color: "rgba(248,187,217,0.2)",
                fontStyle: "italic",
              }}
            >
              ← Select a reaction node to synthesize the data →
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseText {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 1; }
        }
      `}</style>
    </section>
  );
}
