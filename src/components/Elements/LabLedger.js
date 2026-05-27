import { useEffect, useRef, useState } from "react";

const PAGES = [
  {
    type: "formula",
    formula: "C₆H₅NH₂ + HCl → C₆H₅NH₃⁺Cl⁻",
    formulaLabel: "Aniline Hydrochloride Synthesis",
    note: "الساعة 4 فجراً، تايهة بين جزيئات السموم، لكن وجه أبي في مخيلتي بينور الطريق",
    year: "Year I · 2021",
    inkSpots: [
      { x: 25, y: 65 },
      { x: 75, y: 25 },
    ],
  },
  {
    type: "structure",
    formula: "Paracetamol · C₈H₉NO₂\nMW: 151.16 g/mol",
    formulaLabel: "Pharmacological Analysis",
    note: "أول امتحان pharmacology — حفظت 40 drug في ليلة واحدة ",
    year: "Year II · 2022",
    inkSpots: [{ x: 40, y: 45 }],
  },
  {
    type: "formula",
    formula: "Vd = Dose / Cp₀\nCl = k · Vd",
    formulaLabel: "Pharmacokinetics — Drug Distribution",
    note: "لما فهمت إزاي الدواء بيتوزع في جسم الإنسان، حسيت إن الصيدلة سحر حقيقي",
    year: "Year III · 2023",
    inkSpots: [
      { x: 30, y: 35 },
      { x: 80, y: 75 },
    ],
  },
  {
    type: "structure",
    formula: "LD₅₀ · Therapeutic Index\nTI = TD₅₀ / ED₅₀",
    formulaLabel: "Clinical Toxicology",
    note: "أصعب سنة — بس هي اللي علمتني إن الضغط مش بيكسر، بيصقّل",
    year: "Year IV · 2024",
    inkSpots: [{ x: 65, y: 20 }],
  },
  {
    type: "final",
    formula: "Abeer Elafandy\nPharm.D. · 2026",
    formulaLabel: "✦ Equivalence Point Reached",
    note: "وصلنا. كل دمعة، كل ليلة، كل معادلة — كانت بتوصلنا لهنا",
    year: "2026 · الخلاصة",
    inkSpots: [{ x: 50, y: 50 }],
  },
];

export default function LabLedger() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const pageRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(0);
  const isFlipping = useRef(false);

  // تأثير جزيئات الحبر المتطايرة في الخلفية (دخان خفيف عتيق)
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W, H, animId;
    let symbols = [];

    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      initSymbols();
    }

    function initSymbols() {
      symbols = [];
      const chemSymbols = ["Rx", "⚗", "pH", "∆G", "Vd", "O=", "HO-"];
      for (let i = 0; i < 12; i++) {
        symbols.push({
          text: chemSymbols[Math.floor(Math.random() * chemSymbols.length)],
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.1,
          vy: (Math.random() - 0.5) * 0.08,
          alpha: Math.random() * 0.04 + 0.02,
          size: Math.random() * 16 + 12,
          color: "#4A3B32", // لون بني مائل للرمادي متناسق مع الطابع القديم
          rot: Math.random() * 0.4 - 0.2,
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      symbols.forEach((s) => {
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < -40) s.x = W + 40;
        if (s.x > W + 40) s.x = -40;
        if (s.y < -40) s.y = H + 40;
        if (s.y > H + 40) s.y = -40;

        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rot);
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = s.color;
        ctx.font = `${s.size}px Georgia, serif`;
        ctx.textAlign = "center";
        ctx.fillText(s.text, 0, 0);
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

  function renderPage(page) {
    if (!page) return null;
    const isFinal = page.type === "final";
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "clamp(25px, 5vw, 45px)",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* بقع الحبر العتيقة (Sepia/Retro Ink Spots) */}
        {page.inkSpots.map((spot, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${spot.x}%`,
              top: `${spot.y}%`,
              width: `${Math.random() * 15 + 10}px`,
              height: `${Math.random() * 15 + 10}px`,
              borderRadius: "40% 60% 50% 50%",
              background: "rgba(66, 40, 24, 0.18)", // لون حبر بني جاف
              filter: "blur(3px)",
              transform: `rotate(${Math.random() * 360}deg)`,
              pointerEvents: "none",
            }}
          />
        ))}

        {/* سنة التدوين - خط آلة كاتبة قديمة */}
        <p
          style={{
            fontFamily: "Courier New, monospace",
            fontWeight: "bold",
            fontSize: "11px",
            color: isFinal ? "#8C6239" : "#6B5A4B",
            marginBottom: "16px",
            opacity: 0.8,
          }}
        >
          {page.year}
        </p>

        {/* قسم المعادلات الكيميائية والمحتوى العلمي */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            borderLeft: `1px dashed rgba(107, 90, 75, 0.4)`,
            paddingLeft: "20px",
            marginBottom: "20px",
          }}
        >
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(0.85rem, 1.8vw, 1.1rem)",
              color: isFinal ? "#362315" : "#11100f", // حبر داكن عتيق
              letterSpacing: "0.02em",
              lineHeight: 1.8,
              whiteSpace: "pre-line",
              marginBottom: "10px",
            }}
          >
            {page.formula}
          </p>
          <p
            style={{
              fontFamily: "Courier New, monospace",
              fontSize: "10px",
              color: "rgba(92, 58, 33, 0.6)",
              fontStyle: "italic",
            }}
          >
            {page.formulaLabel}
          </p>
        </div>

        {/* الملاحظة المكتوبة بخط اليد العربي (الحبر الكلاسيكي) */}
        <div
          style={{
            background: "rgba(92, 58, 33, 0.03)",
            borderRadius: "1px",
            padding: "14px 16px",
            borderRight: "3px solid rgba(140, 98, 57, 0.4)",
          }}
        >
          <p
            style={{
              fontFamily: "Noto Naskh Arabic, serif",
              fontSize: "clamp(0.9rem, 1.8vw, 1.1rem)",
              color: "#3D2B1F", // حبر كحل/بني داكن جداً للتدوين اليدوي
              direction: "rtl",
              lineHeight: 2,
              fontWeight: "500",
            }}
          >
            {page.note}
          </p>
        </div>
      </div>
    );
  }

  function flipNext() {
    if (isFlipping.current || currentPage >= PAGES.length - 1) return;
    flip(1);
  }

  function flipPrev() {
    if (isFlipping.current || currentPage <= 0) return;
    flip(-1);
  }

  function flip(dir) {
    isFlipping.current = true;
    const page = pageRef.current;
    if (!page) return;

    page.style.transition =
      "transform 0.4s cubic-bezier(.4,0,.2,1), opacity 0.2s ease";
    page.style.transform = `rotateY(${dir * -90}deg)`;
    page.style.opacity = "0.3";

    setTimeout(() => {
      setCurrentPage((prev) => prev + dir);
      page.style.transition = "none";
      page.style.transform = `rotateY(${dir * 90}deg)`;
      page.getBoundingClientRect();

      page.style.transition =
        "transform 0.4s cubic-bezier(.4,0,.2,1), opacity 0.3s ease";
      page.style.transform = "rotateY(0deg)";
      page.style.opacity = "1";

      setTimeout(() => {
        isFlipping.current = false;
      }, 400);
    }, 400);
  }

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: "100vh",
        background: "#0D0A12", // غامق دافئ يشبه غرف المعامل القديمة وطاولات الخشب
        padding: "60px 20px",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
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

      {/* العنوان العلوي بتصميم كلاسيكي */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "40px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <p
          style={{
            fontFamily: "Courier New, monospace",
            fontSize: "11px",
            letterSpacing: "0.4em",
            color: "#8C6239",
            marginBottom: "10px",
            fontWeight: "bold",
          }}
        >
          THE ALCHEMIST'S
        </p>
        <h2
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(2rem, 4vw, 3.2rem)",
            color: "#D9C3B0",
            fontWeight: "400",
            fontStyle: "italic",
            letterSpacing: "1px",
          }}
        >
          Lab Ledger
        </h2>
        <p
          style={{
            fontFamily: "Noto Naskh Arabic, serif",
            fontSize: "clamp(0.9rem, 1.8vw, 1.1rem)",
            color: "rgba(217, 195, 176, 0.4)",
            marginTop: "8px",
          }}
        ></p>
      </div>

      {/* حاوية الكتاب المفتوح */}
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          position: "relative",
          zIndex: 1,
          perspective: "1500px",
        }}
      >
        {/* الغلاف الخارجي للكتاب (الجلد الطبيعي القديم والسميك) */}
        <div
          style={{
            background: "#2B1E17", // لون جلد بني محروق
            padding: "12px", // هذا الفراغ يظهر كحواف الغلاف الجلدي للكتاب بوضوح
            borderRadius: "8px 16px 16px 8px",
            boxShadow:
              "0 50px 100px rgba(0,0,0,0.85), inset 0 0 40px rgba(0,0,0,0.6)",
            border: "1px solid #1c140f",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0",
              background: "#EEDCBE", // لون الورق الأصفر القديم (Parchment)
              borderRadius: "4px",
              overflow: "hidden",
              minHeight: "clamp(360px, 55vw, 520px)",
              position: "relative",
              boxShadow: "inset 0 0 60px rgba(130, 90, 50, 0.3)", // ظل داخلي يعطي الورق عمقاً وتعثقاً
            }}
          >
            {/* في المنتصف تماماً: فاصل كتاب حقيقي (Book Spine / Binding) */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: 0,
                bottom: 0,
                width: "30px",
                transform: "translateX(-50%)",
                background:
                  "linear-gradient(90deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.4) 30%, rgba(255,255,255,0.1) 50%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.2) 100%)",
                zIndex: 10,
                borderLeft: "1px solid rgba(0,0,0,0.15)",
                borderRight: "1px solid rgba(0,0,0,0.15)",
                pointerEvents: "none",
              }}
            />

            {/* الجانب الأيسر: لوحة البيانات والمؤشر (ورقة قديمة ثابتة مائلة للصفرة الداكنة) */}
            <div
              style={{
                background: "linear-gradient(to right, #E5D3B3, #EEDCBE)",
                borderRight: "1px solid rgba(0,0,0,0.1)",
                padding: "clamp(25px, 4vw, 40px)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
              }}
            >
              <div>
                <p
                  style={{
                    fontFamily: "Courier New, monospace",
                    fontSize: "10px",
                    fontWeight: "bold",
                    letterSpacing: "0.2em",
                    color: "#7A5C43",
                    marginBottom: "25px",
                  }}
                >
                  💾 LOGGED INDEX // OPERATIONAL
                </p>

                {[
                  { label: "RESEARCHER", value: "Abeer El-Afandy" },
                  { label: "MOLECULE REFS", value: "C₅H₁₀N₂O₃ · Pharm.D" },
                  { label: "RECORD PURITY", value: "99.9% Pure Essence" },
                  { label: "FINAL STATUS", value: "✦ EQUIVALENCE POINT" },
                ].map((r, i) => (
                  <div
                    key={i}
                    style={{
                      marginBottom: "18px",
                      paddingBottom: "14px",
                      borderBottom: "1px dashed rgba(122, 92, 67, 0.25)",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "Courier New, monospace",
                        fontSize: "9px",
                        color: "#8A735E",
                        marginBottom: "4px",
                        fontWeight: "bold",
                      }}
                    >
                      {r.label}
                    </p>
                    <p
                      style={{
                        fontFamily: "Georgia, serif",
                        fontSize: "clamp(0.9rem, 1.8vw, 1.1rem)",
                        color: i === 3 ? "#8C5227" : "#4A3625",
                        fontWeight: i === 3 ? "bold" : "normal",
                      }}
                    >
                      {r.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* نقاط الفهرس الكلاسيكية أسفل اليسار */}
              <div
                style={{ display: "flex", gap: "8px", alignItems: "center" }}
              >
                {PAGES.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: "7px",
                      height: "7px",
                      borderRadius: "50%",
                      background:
                        i === currentPage ? "#5C3A21" : "rgba(92, 58, 33, 0.2)",
                      border: "1px solid rgba(0,0,0,0.1)",
                      transition: "background 0.3s",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* الجانب الأيمن: الورقة العتيقة المتحركة (تتغير مع حركة التقليب) */}
            <div
              ref={pageRef}
              style={{
                background: "linear-gradient(to left, #E5D3B3, #EEDCBE)",
                position: "relative",
                transformStyle: "preserve-3d",
                transform: "rotateY(0deg)",
              }}
            >
              {/* تسطير خفيف جداً يحاكي الدفاتر القديمة (Notebook Ruled Lines) */}
              {Array.from({ length: 13 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: "25px",
                    right: "25px",
                    top: `${10 + i * 7}%`,
                    height: "1px",
                    background: "rgba(168, 140, 111, 0.15)",
                  }}
                />
              ))}

              {renderPage(PAGES[currentPage])}
            </div>
          </div>
        </div>

        {/* أزرار التنقل بتصميم كلاسيكي دافئ */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            marginTop: "35px",
          }}
        >
          <button
            onClick={flipPrev}
            style={{
              background: "#2B1E17",
              border: "1px solid #423024",
              borderRadius: "4px",
              padding: "12px 32px",
              color: "#D9C3B0",
              fontFamily: "Courier New, monospace",
              fontSize: "12px",
              fontWeight: "bold",
              letterSpacing: "0.15em",
              cursor: "pointer",
              boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#423024";
              e.target.style.color = "#FFF";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "#2B1E17";
              e.target.style.color = "#D9C3B0";
            }}
          >
            ← PREV PAGE
          </button>
          <button
            onClick={flipNext}
            style={{
              background: "#2B1E17",
              border: "1px solid #423024",
              borderRadius: "4px",
              padding: "12px 32px",
              color: "#D9C3B0",
              fontFamily: "Courier New, monospace",
              fontSize: "12px",
              fontWeight: "bold",
              letterSpacing: "0.15em",
              cursor: "pointer",
              boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#423024";
              e.target.style.color = "#FFF";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "#2B1E17";
              e.target.style.color = "#D9C3B0";
            }}
          >
            NEXT PAGE →
          </button>
        </div>
      </div>
    </section>
  );
}
