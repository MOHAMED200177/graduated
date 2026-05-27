import { useEffect, useRef, useState } from "react";
import { prescription } from "../../data/prescription";

export default function Prescription() {
  const sectionRef = useRef(null);
  // التعديل البرمجي: استخدام State واحدة للتحكم في ظهور الروشتة كلها
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true); // أول ما السكشن يظهر، فعل الأنيميشن
          observer.disconnect(); // وقف المراقبة خلاص عشان الأداء
        }
      },
      { threshold: 0.2 }, // يبدأ يظهر لما 20% من السكشن يكون في الشاشة
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef} // بنراقب السكشن ده بس
      style={{
        minHeight: "100vh",
        background: "#0D0A12",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background molecules */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.03,
          backgroundImage: `repeating-linear-gradient(0deg, #C2185B 0px, #C2185B 1px, transparent 1px, transparent 40px),
          repeating-linear-gradient(90deg, #C2185B 0px, #C2185B 1px, transparent 1px, transparent 40px)`,
        }}
      />

      {/* Prescription paper */}
      <div
        style={{
          width: "100%",
          maxWidth: "580px",
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(12px)", // لمسة جمالية: تأثير زجاجي
          border: "0.5px solid rgba(194,24,91,0.25)",
          borderRadius: "6px",
          padding: "clamp(30px, 5vw, 60px)",
          position: "relative",
          overflow: "hidden", // مهم جداً عشان الخط الأحمر ميبوظش الحواف الدائرية

          // ربط الأنيميشن بالـ State
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(40px)",
          transition:
            "opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1)",
          boxShadow:
            "0 0 80px rgba(194,24,91,0.06), inset 0 0 40px rgba(0,0,0,0.3)",
        }}
      >
        {/* Red corner accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "5px", // عرضته حاجة بسيطة عشان يظهر بوضوح
            height: "100%",
            background: "linear-gradient(180deg, #C2185B, transparent)",
          }}
        />

        {/* Header */}
        <div
          style={{
            borderBottom: "0.5px solid rgba(194,24,91,0.2)",
            paddingBottom: "20px",
            marginBottom: "32px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontSize: "10px",
                letterSpacing: "0.25em",
                color: "rgba(194,24,91,0.7)",
                marginBottom: "6px",
              }}
            >
              MEDICAL PRESCRIPTION
            </p>
            <h2
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: "clamp(1.4rem, 3vw, 2rem)",
                color: "#F8BBD9",
                fontWeight: 400,
                letterSpacing: "0.05em",
              }}
            >
              {prescription.header.hospital}
            </h2>
            <p
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontSize: "12px",
                color: "rgba(248,187,217,0.4)",
                marginTop: "4px",
                letterSpacing: "0.1em",
              }}
            >
              Dr. {prescription.header.doctorName}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                color: "rgba(194,24,91,0.5)",
                fontStyle: "italic",
              }}
            >
              Rx
            </p>
            <p
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontSize: "11px",
                color: "rgba(248,187,217,0.3)",
                letterSpacing: "0.1em",
              }}
            >
              {prescription.header.date}
            </p>
          </div>
        </div>

        {/* Patient */}
        <div style={{ marginBottom: "32px" }}>
          <p
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: "10px",
              letterSpacing: "0.2em",
              color: "rgba(248,187,217,0.35)",
              marginBottom: "8px",
            }}
          >
            PATIENT
          </p>
          <p
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)",
              color: "#F8BBD9",
              letterSpacing: "0.08em",
            }}
          >
            {prescription.patient}
          </p>
        </div>

        {/* Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {prescription.items.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "16px",
                alignItems: "flex-start",
                paddingBottom: "20px",
                borderBottom:
                  i < prescription.items.length - 1
                    ? "0.5px solid rgba(255,255,255,0.04)"
                    : "none",

                // الأنيميشن متصل بالـ State بس فيه delay متتالي
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(20px)",
                transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.3 + i * 0.15}s`,
              }}
            >
              <span
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontSize: "clamp(0.75rem, 1.5vw, 0.9rem)",
                  color: "#C2185B",
                  letterSpacing: "0.15em",
                  minWidth: "80px",
                  paddingTop: "2px",
                }}
              >
                {item.label}
              </span>
              <p
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontSize: "clamp(1rem, 2vw, 1.25rem)",
                  color: "rgba(248,187,217,0.85)",
                  fontStyle: "italic",
                  lineHeight: 1.5,
                }}
              >
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Signature & Stamp */}
        <div
          style={{
            marginTop: "40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "0.5px solid rgba(194,24,91,0.15)",
            paddingTop: "24px",

            // بيظهر في النهاية خالص بعد كل العناصر
            opacity: isVisible ? 1 : 0,
            transition: `opacity 1s ease ${0.5 + prescription.items.length * 0.15}s`,
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontSize: "10px",
                letterSpacing: "0.2em",
                color: "rgba(248,187,217,0.3)",
                marginBottom: "8px",
              }}
            >
              SIGNED BY
            </p>
            <p
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
                color: "rgba(248,187,217,0.6)",
                fontStyle: "italic",
              }}
            >
              {prescription.signature}
            </p>
          </div>
          <div
            style={{
              background: "rgba(194,24,91,0.05)",
              border: "1.5px solid rgba(194,24,91,0.4)",
              borderRadius: "50%",
              width: "clamp(60px, 10vw, 80px)",
              height: "clamp(60px, 10vw, 80px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: "rotate(-15deg)", // لمسة واقعية: الختم مايل شوية كأنه مطبوع بالإيد
            }}
          >
            <p
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: "clamp(0.55rem, 1.2vw, 0.7rem)",
                color: "#C2185B",
                letterSpacing: "0.1em",
                textAlign: "center",
                lineHeight: 1.6,
                fontWeight: "bold",
              }}
            >
              {prescription.stamp}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
