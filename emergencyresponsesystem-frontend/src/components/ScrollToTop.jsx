import { useState, useEffect } from "react";

function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      style={{
        position: "fixed",
        bottom: "96px",
        right: "26px",
        width: "42px",
        height: "42px",
        borderRadius: "50%",
        background: "rgba(26,26,46,0.85)",
        color: "white",
        border: "1px solid rgba(255,255,255,0.2)",
        cursor: "pointer",
        fontSize: "16px",
        zIndex: 997,
        boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
      }}
      aria-label="Scroll to top"
    >
      ↑
    </button>
  );
}

export default ScrollToTop;