import { useEffect, useRef, useState } from "react";
import { messages } from "../../data/messages";

const FONT_LINK =
  "https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Lateef:wght@400;600&family=Cormorant+Garamond:ital,wght@0,300;1,300;1,400&family=DM+Sans:wght@300;400&display=swap";

// ── Wax Seal ──────────────────────────────────────────────────────
function WaxSeal({ color, emoji, size = 32, pulse = false }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle at 33% 30%, ${color}ff, ${color}cc 55%, ${color}88)`,
        boxShadow: pulse
          ? `0 0 0 2px ${color}30, 0 0 18px ${color}60, 0 4px 12px rgba(0,0,0,0.4)`
          : `0 0 0 1.5px ${color}40, 0 4px 10px rgba(0,0,0,0.35)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: `1px solid ${color}99`,
        flexShrink: 0,
        animation: pulse
          ? "waxPulse 2.2s ease-in-out infinite alternate"
          : "none",
      }}
    >
      <span
        style={{ fontSize: size * 0.38, lineHeight: 1, userSelect: "none" }}
      >
        {emoji}
      </span>
    </div>
  );
}

// ── Password Modal ────────────────────────────────────────────────
function PasswordModal({ msg, onSuccess, onClose }) {
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  function handleSubmit() {
    const correct =
      answer.trim().toLowerCase() === msg.passwordAnswer.trim().toLowerCase();
    if (correct) {
      setUnlocking(true);
      setTimeout(() => onSuccess(), 1200);
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => {
        setShake(false);
        setError(false);
        setAnswer("");
      }, 1000);
    }
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(5,3,10,0.85)",
        backdropFilter: "blur(20px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "420px",
          width: "100%",
          background: "linear-gradient(145deg, #100c18, #0d0a14)",
          border: `1px solid ${unlocking ? "#C9A84C" : "rgba(201,168,76,0.25)"}`,
          borderRadius: "8px",
          padding: "clamp(28px,5vw,44px)",
          position: "relative",
          boxShadow: `0 0 80px rgba(201,168,76,${unlocking ? 0.3 : 0.08})`,
          transition: "border-color 0.5s, box-shadow 0.5s",
          animation: shake
            ? "shake 0.5s ease"
            : unlocking
              ? "unlockGlow 1.2s ease forwards"
              : "modalIn 0.4s cubic-bezier(.16,1,.3,1)",
        }}
      >
        {/* Gold corner accents */}
        {[
          ["top", "left"],
          ["top", "right"],
          ["bottom", "left"],
          ["bottom", "right"],
        ].map(([v, h], i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              [v]: "10px",
              [h]: "10px",
              width: "16px",
              height: "16px",
              borderTop:
                v === "top" ? "1px solid rgba(201,168,76,0.4)" : "none",
              borderBottom:
                v === "bottom" ? "1px solid rgba(201,168,76,0.4)" : "none",
              borderLeft:
                h === "left" ? "1px solid rgba(201,168,76,0.4)" : "none",
              borderRight:
                h === "right" ? "1px solid rgba(201,168,76,0.4)" : "none",
            }}
          />
        ))}

        {/* Lock icon */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div
            style={{
              fontSize: unlocking ? "2.8rem" : "2.2rem",
              transition: "font-size 0.5s ease",
              animation: unlocking ? "lockOpen 0.6s ease forwards" : "none",
              marginBottom: "16px",
            }}
          >
            {unlocking ? "🔓" : "🔒"}
          </div>
          <p
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: "9px",
              letterSpacing: "0.3em",
              color: "rgba(201,168,76,0.5)",
              marginBottom: "16px",
            }}
          >
            PRIVATE · مؤمّنة
          </p>
          <p
            style={{
              fontFamily: "Amiri, serif",
              fontSize: "clamp(1rem,2.2vw,1.25rem)",
              color: "#F8BBD9",
              direction: "rtl",
              lineHeight: 1.8,
            }}
          >
            {msg.passwordQuestion}
          </p>
        </div>

        {/* Input */}
        <div style={{ position: "relative", marginBottom: "20px" }}>
          <input
            ref={inputRef}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="اكتب إجابتك..."
            dir="rtl"
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${error ? "#C2185B" : "rgba(201,168,76,0.2)"}`,
              borderRadius: "4px",
              padding: "14px 18px",
              fontFamily: "Amiri, serif",
              fontSize: "1.1rem",
              color: "#F8BBD9",
              outline: "none",
              textAlign: "right",
              transition: "border-color 0.3s",
              boxSizing: "border-box",
            }}
          />
          {error && (
            <p
              style={{
                fontFamily: "Amiri, serif",
                fontSize: "0.85rem",
                color: "#C2185B",
                textAlign: "right",
                marginTop: "8px",
                direction: "rtl",
                animation: "fadeIn 0.2s ease",
              }}
            >
              إجابة غلط — حاول تاني ✕
            </p>
          )}
        </div>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          style={{
            width: "100%",
            background: unlocking
              ? "linear-gradient(135deg, #C9A84C, #E8C96A)"
              : "transparent",
            border: "1px solid rgba(201,168,76,0.35)",
            borderRadius: "4px",
            padding: "13px",
            fontFamily: "Amiri, serif",
            fontSize: "1rem",
            color: unlocking ? "#0D0A12" : "rgba(201,168,76,0.8)",
            cursor: "pointer",
            letterSpacing: "0.05em",
            transition: "all 0.4s ease",
            direction: "rtl",
          }}
        >
          {unlocking ? "✦ جاري الفتح..." : "افتح الرسالة ✦"}
        </button>
      </div>
    </div>
  );
}

// ── Envelope ──────────────────────────────────────────────────────
function Envelope({ msg, index, onClick, visible }) {
  const [hovered, setHovered] = useState(false);
  const isSpecial = msg.isForMe;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateY(0) rotate(0deg)"
          : `translateY(60px) rotate(${index % 2 === 0 ? -4 : 4}deg)`,
        transition: `opacity 0.9s cubic-bezier(.16,1,.3,1) ${index * 0.13}s,
                     transform 0.9s cubic-bezier(.16,1,.3,1) ${index * 0.13}s`,
        cursor: "pointer",
        position: "relative",
      }}
    >
      {/* Special aura */}
      {isSpecial && (
        <div
          style={{
            position: "absolute",
            inset: "-18px",
            borderRadius: "12px",
            background:
              "radial-gradient(ellipse, rgba(201,168,76,0.15) 0%, transparent 68%)",
            animation: "auraBreath 3s ease-in-out infinite alternate",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      )}

      <div
        style={{
          position: "relative",
          transform: hovered
            ? "translateY(-10px) rotate(0.8deg) scale(1.03)"
            : "none",
          transition: "transform 0.4s cubic-bezier(.16,1,.3,1)",
          zIndex: 1,
        }}
      >
        {isSpecial ? (
          // ── Special envelope — dark gold mysterious ──
          <div
            style={{
              width: "100%",
              borderRadius: "3px",
              border: "1px solid rgba(201,168,76,0.45)",
              background: "linear-gradient(150deg, #12100A, #1C1810, #0E0C08)",
              boxShadow: hovered
                ? "0 28px 70px rgba(201,168,76,0.25), 0 8px 30px rgba(0,0,0,0.6), inset 0 0 30px rgba(201,168,76,0.04)"
                : "0 8px 28px rgba(201,168,76,0.12), 0 2px 12px rgba(0,0,0,0.5)",
              transition: "box-shadow 0.4s ease",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* Gold shimmer line top */}
            <div
              style={{
                height: "1px",
                background:
                  "linear-gradient(90deg, transparent, rgba(201,168,76,0.6), transparent)",
                animation: "shimmer 2.5s ease-in-out infinite",
              }}
            />

            {/* Flap */}
            <div
              style={{
                position: "relative",
                width: "100%",
                paddingBottom: "38%",
              }}
            >
              <svg
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                }}
                viewBox="0 0 200 76"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient
                    id="flapGold"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#1a1610" />
                    <stop offset="100%" stopColor="#221d12" />
                  </linearGradient>
                </defs>
                <polygon points="0,0 200,0 100,76" fill="url(#flapGold)" />
                <line
                  x1="0"
                  y1="0"
                  x2="100"
                  y2="76"
                  stroke="rgba(201,168,76,0.25)"
                  strokeWidth="0.8"
                />
                <line
                  x1="200"
                  y1="0"
                  x2="100"
                  y2="76"
                  stroke="rgba(201,168,76,0.25)"
                  strokeWidth="0.8"
                />
              </svg>

              {/* Mystery stamp */}
              <div
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "10px",
                  width: "28px",
                  height: "34px",
                  border: "1.5px solid rgba(201,168,76,0.5)",
                  borderRadius: "1px",
                  background: "rgba(201,168,76,0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 2,
                }}
              >
                <span style={{ fontSize: "12px" }}>✦</span>
              </div>

              {/* Postmark */}
              <p
                style={{
                  position: "absolute",
                  top: "10px",
                  left: "12px",
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "6px",
                  letterSpacing: "0.15em",
                  color: "rgba(201,168,76,0.3)",
                  margin: 0,
                  zIndex: 2,
                }}
              >
                PRIVATE · 2026
              </p>
            </div>

            {/* Body */}
            <div style={{ padding: "16px 18px 22px", position: "relative" }}>
              <svg
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  height: "45%",
                  pointerEvents: "none",
                  opacity: 0.15,
                }}
                viewBox="0 0 200 60"
                preserveAspectRatio="none"
              >
                <line
                  x1="0"
                  y1="60"
                  x2="100"
                  y2="0"
                  stroke="#C9A84C"
                  strokeWidth="0.6"
                />
                <line
                  x1="200"
                  y1="60"
                  x2="100"
                  y2="0"
                  stroke="#C9A84C"
                  strokeWidth="0.6"
                />
              </svg>

              <div style={{ textAlign: "center", marginBottom: "18px" }}>
                <p
                  style={{
                    fontFamily: "Cormorant Garamond, serif",
                    fontSize: "clamp(0.85rem,2vw,1rem)",
                    fontStyle: "italic",
                    letterSpacing: "0.25em",
                    color: "rgba(201,168,76,0.6)",
                    margin: 0,
                  }}
                >
                  ✦ &nbsp; لكِ &nbsp; ✦
                </p>
              </div>

              <div style={{ display: "flex", justifyContent: "center" }}>
                <WaxSeal color="#C9A84C" emoji="🤍" size={38} pulse={true} />
              </div>

              {/* Lock indicator */}
              <p
                style={{
                  textAlign: "center",
                  marginTop: "12px",
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "9px",
                  letterSpacing: "0.2em",
                  color: "rgba(201,168,76,0.35)",
                }}
              >
                🔒 مؤمّنة
              </p>
            </div>
          </div>
        ) : (
          // ── Regular envelope ──
          <div
            style={{
              width: "100%",
              borderRadius: "3px",
              border: "1px solid rgba(175,148,100,0.5)",
              background: "linear-gradient(160deg, #F7EDD8, #EDE0BF, #F2E8CF)",
              boxShadow: hovered
                ? "0 22px 50px rgba(0,0,0,0.3), 0 6px 20px rgba(0,0,0,0.18)"
                : "0 3px 16px rgba(0,0,0,0.18)",
              transition: "box-shadow 0.4s ease",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                paddingBottom: "38%",
              }}
            >
              <svg
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                }}
                viewBox="0 0 200 76"
                preserveAspectRatio="none"
              >
                <polygon points="0,0 200,0 100,76" fill="#E8D9B8" />
                <line
                  x1="0"
                  y1="0"
                  x2="100"
                  y2="76"
                  stroke="rgba(175,148,100,0.4)"
                  strokeWidth="0.7"
                />
                <line
                  x1="200"
                  y1="0"
                  x2="100"
                  y2="76"
                  stroke="rgba(175,148,100,0.4)"
                  strokeWidth="0.7"
                />
              </svg>
              <div
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  width: "26px",
                  height: "32px",
                  border: `1.5px solid ${msg.color}75`,
                  borderRadius: "1px",
                  background: `${msg.color}18`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 2,
                }}
              >
                <span style={{ fontSize: "11px" }}>⚕️</span>
              </div>
              <p
                style={{
                  position: "absolute",
                  top: "11px",
                  left: "12px",
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "6.5px",
                  letterSpacing: "0.12em",
                  color: "rgba(110,80,40,0.5)",
                  margin: 0,
                  zIndex: 2,
                }}
              >
                2026 · PHARMACY
              </p>
            </div>

            <div style={{ padding: "16px 18px 20px", position: "relative" }}>
              <svg
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  height: "45%",
                  pointerEvents: "none",
                  opacity: 0.22,
                }}
                viewBox="0 0 200 60"
                preserveAspectRatio="none"
              >
                <line
                  x1="0"
                  y1="60"
                  x2="100"
                  y2="0"
                  stroke="#B8A07A"
                  strokeWidth="0.6"
                />
                <line
                  x1="200"
                  y1="60"
                  x2="100"
                  y2="0"
                  stroke="#B8A07A"
                  strokeWidth="0.6"
                />
              </svg>

              <div style={{ textAlign: "center", marginBottom: "18px" }}>
                <p
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "7.5px",
                    letterSpacing: "0.18em",
                    color: "rgba(110,80,40,0.45)",
                    margin: "0 0 5px",
                    textTransform: "uppercase",
                  }}
                >
                  من
                </p>
                <p
                  style={{
                    fontFamily: "Amiri, serif",
                    fontSize: "clamp(1rem,2.2vw,1.2rem)",
                    color: "#3A2410",
                    direction: "rtl",
                    margin: 0,
                    letterSpacing: "0.02em",
                    lineHeight: 1.3,
                  }}
                >
                  {msg.sender}
                </p>
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <WaxSeal color={msg.waxColor} emoji="✉" size={28} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Relation label */}
      <div style={{ textAlign: "center", marginTop: "14px" }}>
        <p
          style={{
            fontFamily: "Amiri, serif",
            fontSize: "clamp(0.85rem,1.5vw,0.95rem)",
            color: isSpecial
              ? "rgba(201,168,76,0.5)"
              : "rgba(248,187,217,0.42)",
            direction: "rtl",
            margin: 0,
          }}
        >
          {isSpecial ? "✦" : msg.relation}
        </p>
      </div>
    </div>
  );
}

// ── Letter Modal ──────────────────────────────────────────────────
function LetterModal({ msg, onClose }) {
  const isSpecial = msg.isForMe;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(8,5,14,0.6)",
        zIndex: 100,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        backdropFilter: "blur(18px)",
        padding: "40px 20px",
        overflowY: "auto",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "560px",
          width: "100%",
          maxHeight: "92vh",
          overflowY: "scroll",
          overscrollBehavior: "contain",
          borderRadius: "10px",
          position: "relative",
          background: isSpecial
            ? "linear-gradient(165deg, #13100A 0%, #1C1810 50%, #0E0C08 100%)"
            : "linear-gradient(165deg, #FBF5E6 0%, #F4E8CC 50%, #EDE0BA 100%)",
          boxShadow: isSpecial
            ? "0 40px 100px rgba(0,0,0,0.7), 0 0 60px rgba(201,168,76,0.15)"
            : "0 40px 100px rgba(0,0,0,0.55)",
          border: isSpecial ? "1px solid rgba(201,168,76,0.3)" : "none",
          animation: "letterUnfold 0.5s cubic-bezier(.16,1,.3,1) forwards",
        }}
      >
        {/* Gold top border for special */}
        {isSpecial && (
          <div
            style={{
              height: "2px",
              background:
                "linear-gradient(90deg, transparent, #C9A84C, transparent)",
              borderRadius: "10px 10px 0 0",
            }}
          />
        )}

        {/* Image */}
        <div
          style={{
            width: "100%",
            aspectRatio: "16/9",
            overflow: "hidden",
            borderRadius: isSpecial ? "0" : "10px 10px 0 0",
            position: "relative",
          }}
        >
          {isSpecial && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 1,
                background:
                  "linear-gradient(180deg, transparent 40%, rgba(13,10,8,0.8))",
              }}
            />
          )}
          <img
            src={msg.image}
            alt={msg.sender}
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: msg.imagePosition || "center",
              filter: isSpecial ? "brightness(0.6) sepia(0.3)" : "none",
            }}
            onError={(e) => {
              e.target.src = "/images/fallback.jpg";
            }}
          />
        </div>

        {/* Content */}
        <div style={{ padding: "clamp(24px,4vw,36px)" }}>
          {isSpecial ? (
            <p
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: "clamp(0.75rem,1.5vw,0.85rem)",
                letterSpacing: "0.3em",
                color: "rgba(201,168,76,0.5)",
                marginBottom: "20px",
                textAlign: "center",
              }}
            >
              ✦ &nbsp; لكِ وحدِك &nbsp; ✦
            </p>
          ) : (
            <h3
              style={{
                fontFamily: "Amiri, serif",
                fontSize: "clamp(1.3rem,3vw,1.7rem)",
                marginBottom: "20px",
                direction: "rtl",
                color: "#5C3A20",
              }}
            >
              {msg.sender}
            </h3>
          )}

          <p
            style={{
              fontFamily: "Amiri, serif",
              fontSize: "clamp(1rem,2.2vw,1.25rem)",
              lineHeight: 2.1,
              direction: "rtl",
              whiteSpace: "pre-line",
              color: isSpecial ? "rgba(248,235,200,0.88)" : "#2A1A08",
            }}
          >
            {msg.content}
          </p>

          {isSpecial && (
            <p
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: "clamp(0.75rem,1.5vw,0.85rem)",
                letterSpacing: "0.2em",
                color: "rgba(201,168,76,0.35)",
                marginTop: "32px",
                textAlign: "center",
                fontStyle: "italic",
              }}
            >
              ✦
            </p>
          )}
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "sticky",
            bottom: "16px",
            display: "block",
            margin: "0 auto 16px",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            border: isSpecial ? "1px solid rgba(201,168,76,0.3)" : "none",
            background: isSpecial ? "rgba(13,10,8,0.8)" : "rgba(0,0,0,0.5)",
            color: isSpecial ? "rgba(201,168,76,0.8)" : "white",
            cursor: "pointer",
            fontSize: "16px",
            zIndex: 10,
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────
export default function Messages() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [openLetter, setOpenLetter] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [unlockedSpecial, setUnlockedSpecial] = useState(false);
  const data = messages?.length ? messages : [];

  // Background: floating rose petals + pharmacy crosses
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W, H, animId;
    let petals = [];

    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      initPetals();
    }

    function initPetals() {
      petals = [];
      for (let i = 0; i < 20; i++) {
        petals.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.2,
          vy: -Math.random() * 0.15 - 0.05,
          r: Math.random() * 12 + 6,
          rot: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.008,
          alpha: Math.random() * 0.07 + 0.02,
          type: Math.random() > 0.6 ? "cross" : "petal",
          color: Math.random() > 0.5 ? "#C2185B" : "#C9A84C",
        });
      }
    }

    function drawPetal(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      if (p.type === "petal") {
        ctx.beginPath();
        ctx.ellipse(0, 0, p.r, p.r * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(-p.r, 0);
        ctx.lineTo(p.r, 0);
        ctx.moveTo(0, -p.r);
        ctx.lineTo(0, p.r);
        ctx.stroke();
      }
      ctx.restore();
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      petals.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.rotSpeed;
        if (p.y < -30) p.y = H + 30;
        if (p.x < -30) p.x = W + 30;
        if (p.x > W + 30) p.x = -30;
        drawPetal(p);
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

  useEffect(() => {
    if (!document.querySelector('link[href*="Amiri"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = FONT_LINK;
      document.head.appendChild(link);
    }
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 },
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  function handleEnvelopeClick(i) {
    const msg = data[i];
    if (msg.isForMe) {
      if (unlockedSpecial) {
        setOpenLetter(i);
      } else {
        setShowPassword(true);
      }
    } else {
      setOpenLetter(openLetter === i ? null : i);
    }
  }

  const activeLetter = openLetter !== null ? data[openLetter] : null;
  const specialMsg = data.find((m) => m.isForMe);

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: "100vh",
        background: "#0D0A12",
        padding: "100px 20px 90px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background canvas */}
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

      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 65% 55% at 50% 60%, rgba(194,24,91,0.06) 0%, transparent 70%)",
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
            letterSpacing: "0.35em",
            color: "rgba(194,24,91,0.7)",
            marginBottom: "12px",
          }}
        >
          LETTERS & WORDS
        </p>
        <h2
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "clamp(1.8rem,4vw,3rem)",
            color: "#F8BBD9",
            fontWeight: 300,
            letterSpacing: "0.08em",
            margin: 0,
          }}
        >
          رسائل
        </h2>
        <p
          style={{
            fontFamily: "Amiri, serif",
            fontSize: "clamp(0.95rem,2vw,1.1rem)",
            color: "rgba(248,187,217,0.3)",
            marginTop: "8px",
            direction: "rtl",
          }}
        >
          كلمات من ناس بتحبك — اضغط على الجواب
        </p>
      </div>

      {/* Envelopes grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill, minmax(clamp(150px,22vw,200px), 1fr))",
          gap: "clamp(28px,4vw,52px)",
          maxWidth: "960px",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
          paddingBottom: "30px",
          alignItems: "start",
        }}
      >
        {data.map((msg, i) => (
          <Envelope
            key={msg.id ?? i}
            msg={msg}
            index={i}
            onClick={() => handleEnvelopeClick(i)}
            visible={visible}
          />
        ))}
      </div>

      {/* Password modal */}
      {showPassword && specialMsg && (
        <PasswordModal
          msg={specialMsg}
          onSuccess={() => {
            setShowPassword(false);
            setUnlockedSpecial(true);
            setTimeout(
              () => setOpenLetter(data.findIndex((m) => m.isForMe)),
              400,
            );
          }}
          onClose={() => setShowPassword(false)}
        />
      )}

      {/* Letter modal */}
      {activeLetter && (
        <LetterModal msg={activeLetter} onClose={() => setOpenLetter(null)} />
      )}

      <style>{`
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes letterUnfold {
          from{opacity:0;transform:scale(0.92) translateY(24px)}
          to{opacity:1;transform:scale(1) translateY(0)}
        }
        @keyframes auraBreath {
          from{opacity:0.35;transform:scale(0.97)}
          to{opacity:1;transform:scale(1.03)}
        }
        @keyframes waxPulse {
          from{box-shadow:0 0 0 2px #C9A84C25,0 0 12px #C9A84C40}
          to{box-shadow:0 0 0 3px #C9A84C40,0 0 28px #C9A84C70,0 0 50px #C9A84C25}
        }
        @keyframes shimmer { from{opacity:0.5} to{opacity:1} }
        @keyframes shake {
          0%,100%{transform:translateX(0)}
          20%{transform:translateX(-8px)}
          40%{transform:translateX(8px)}
          60%{transform:translateX(-5px)}
          80%{transform:translateX(5px)}
        }
        @keyframes modalIn {
          from{opacity:0;transform:scale(0.95) translateY(16px)}
          to{opacity:1;transform:scale(1) translateY(0)}
        }
        @keyframes unlockGlow {
          0%{box-shadow:0 0 80px rgba(201,168,76,0.08)}
          100%{box-shadow:0 0 120px rgba(201,168,76,0.4)}
        }
        @keyframes lockOpen {
          0%{transform:rotate(0deg) scale(1)}
          50%{transform:rotate(-15deg) scale(1.2)}
          100%{transform:rotate(0deg) scale(1.1)}
        }
        @keyframes stampSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>
    </section>
  );
}
