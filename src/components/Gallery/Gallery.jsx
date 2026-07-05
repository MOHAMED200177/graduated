import { useEffect, useRef, useState } from "react";
import { gallery } from "../../data/gallery";

// مواضع النجوم
const STAR_POSITIONS = [
  { x: 20, y: 30 },
  { x: 45, y: 15 },
  { x: 75, y: 25 },
  { x: 85, y: 60 },
  { x: 55, y: 80 },
  { x: 25, y: 70 },
];

// خطوط الكوكبة
const CONSTELLATION_LINES = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 0],
  [1, 4],
];

function StarField() {
  const stars = Array.from({ length: 100 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    delay: Math.random() * 5,
    duration: 3 + Math.random() * 4,
  }));

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {stars.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            background: i % 10 === 0 ? "#F8BBD9" : "white",
            opacity: 0.3,
            animation: `twinkle ${s.duration}s ${s.delay}s infinite ease-in-out alternate`,
          }}
        />
      ))}
    </div>
  );
}

export default function Gallery() {
  const sectionRef = useRef(null);

  const [visibleStars, setVisibleStars] = useState(0);
  const [linesDrawn, setLinesDrawn] = useState(false);
  const [activePhoto, setActivePhoto] = useState(null);
  const [lineProgress, setLineProgress] = useState(0);

  const data = gallery || [];
  const positions = STAR_POSITIONS.slice(0, data.length);

  // ظهور الصور تدريجي
  useEffect(() => {
    let interval;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let count = 0;

          interval = setInterval(() => {
            count++;
            setVisibleStars(count);

            if (count >= data.length) {
              clearInterval(interval);

              setTimeout(() => {
                setLinesDrawn(true);
              }, 500);
            }
          }, 400);

          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();

      if (interval) clearInterval(interval);
    };
  }, [data.length]);

  // رسم الخطوط
  useEffect(() => {
    if (!linesDrawn) return;

    let start = null;
    const duration = 2500;

    function animate(ts) {
      if (!start) start = ts;

      const p = Math.min((ts - start) / duration, 1);

      setLineProgress(p);

      if (p < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, [linesDrawn]);

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: "120vh",
        background: "#0D0A12",
        position: "relative",
        overflow: "hidden",
        padding: "100px 20px",
      }}
    >
      <StarField />

      {/* خلفية ضوء */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 50%, rgba(194,24,91,0.05) 0%, transparent 80%)",
          pointerEvents: "none",
        }}
      />

      {/* العنوان */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "60px",
          position: "relative",
          zIndex: 10,
        }}
      >
        <p
          style={{
            fontFamily: "monospace",
            fontSize: "11px",
            letterSpacing: "0.4em",
            color: "#C9A84C",
            marginBottom: "10px",
          }}
        >
          MEMORIES IN THE STARS
        </p>

        <h2
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            color: "#F8BBD9",
            fontWeight: 300,
          }}
        >
          Dr. Mariam's Journey
        </h2>
      </div>

      {/* الكوكبة */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "1000px",
          margin: "0 auto",
          aspectRatio: "16/9",
        }}
      >
        {/* الخطوط */}
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 1,
          }}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {linesDrawn &&
            CONSTELLATION_LINES.map(([a, b], i) => {
              if (!positions[a] || !positions[b]) return null;

              const p = Math.max(0, Math.min(1, lineProgress * 1.5 - i * 0.1));

              const x2 = positions[a].x + (positions[b].x - positions[a].x) * p;

              const y2 = positions[a].y + (positions[b].y - positions[a].y) * p;

              return (
                <line
                  key={i}
                  x1={positions[a].x}
                  y1={positions[a].y}
                  x2={x2}
                  y2={y2}
                  stroke="rgba(201,168,76,0.25)"
                  strokeWidth="0.2"
                />
              );
            })}
        </svg>

        {/* الصور */}
        {positions.map((pos, i) => {
          const item = data[i];
          const isVisible = i < visibleStars;

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: "translate(-50%, -50%)",
                zIndex: 5,
              }}
            >
              <div
                onClick={() => setActivePhoto(i)}
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  border: "2px solid rgba(248,187,217,0.3)",
                  overflow: "hidden",
                  cursor: "pointer",
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "scale(1)" : "scale(0)",
                  transition: "all 0.5s ease",
                  background: "#1A1625",
                }}
              >
                <img
                  src={item.src}
                  alt=""
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: "grayscale(0.4) brightness(0.7)",
                    transition: "0.3s",
                  }}
                />
              </div>

              {/* النواة */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%,-50%)",
                  width: "6px",
                  height: "6px",
                  background: "#C9A84C",
                  borderRadius: "50%",
                  boxShadow: "0 0 10px #C9A84C",
                  pointerEvents: "none",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* نافذة تكبير الصورة */}
      {activePhoto !== null && (
        <div
          onClick={() => setActivePhoto(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.92)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            backdropFilter: "blur(8px)",
            animation: "fadeIn 0.4s ease",
            padding: "20px",
          }}
        >
          <img
            src={data[activePhoto].src}
            alt=""
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "auto",
              maxWidth: "95%",
              maxHeight: "90vh",
              objectFit: "contain",
              borderRadius: "20px",
              boxShadow: "0 0 60px rgba(201,168,76,0.35)",
              animation: "zoomIn 0.4s ease",
            }}
          />

          {/* زر إغلاق */}
          <button
            onClick={() => setActivePhoto(null)}
            style={{
              position: "absolute",
              top: "25px",
              right: "25px",
              width: "45px",
              height: "45px",
              borderRadius: "50%",
              border: "none",
              background: "rgba(255,255,255,0.1)",
              color: "white",
              fontSize: "22px",
              cursor: "pointer",
              backdropFilter: "blur(5px)",
            }}
          >
            ✕
          </button>
        </div>
      )}

      <style>{`
        @keyframes twinkle {
          from {
            opacity: 0.2;
            transform: scale(0.8);
          }
          to {
            opacity: 0.8;
            transform: scale(1.2);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes zoomIn {
          from {
            transform: scale(0.7);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
}
