import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import Intro from "./components/Intro/Intro";
import Prescription from "./components/Prescription/Prescription";
import Timeline from "./components/Timeline/Timeline";
import Elements from "./components/Elements/Elements";
import LabLedger from "./components/Elements/LabLedger";
import RoseLab from "./components/RoseLab/RoseLab";
import Gallery from "./components/Gallery/Gallery";
import Messages from "./components/Messages/Messages";
import FinalVial from "./components/FinalVial/FinalVial";

const SECTIONS = [
  Prescription,
  Timeline,
  Elements,
  LabLedger,
  RoseLab,
  Gallery,
  Messages,
  FinalVial,
];

function App() {
  const [introComplete, setIntroComplete] = useState(false);
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
      smoothTouch: true,
      touchMultiplier: 1.8,
      infinite: false,
    });

    lenisRef.current = lenis;

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <main
      style={{
        backgroundColor: "#0D0A12",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <Intro onComplete={() => setIntroComplete(true)} />
      {introComplete && SECTIONS.map((Section, i) => <Section key={i} />)}
    </main>
  );
}

export default App;
