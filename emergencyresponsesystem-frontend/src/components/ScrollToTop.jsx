import { useState, useEffect } from "react";
import { ChevronUpIcon } from "./Icons";

function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 360);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      className="scroll-top-btn"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll back to top"
      style={{
        position: "fixed",
        insetBlockEnd: "6rem",
        insetInlineEnd: "1.5rem",
        inlineSize: "44px",
        blockSize: "44px",
        borderRadius: "50%",
        backgroundColor: "var(--color-primary)",
        color: "#FFFFFF",
        border: "2px solid #FFFFFF",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 997,
        boxShadow: "var(--shadow-md)",
      }}
    >
      <ChevronUpIcon size={18} />
    </button>
  );
}

export default ScrollToTop;
