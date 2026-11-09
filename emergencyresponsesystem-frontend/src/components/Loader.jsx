function Loader({ text = "Loading..." }) {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "4.5rem 1.25rem",
        gap: "0.875rem",
      }}
    >
      <div className="hc-loader-ring" aria-hidden="true" />
      <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9375rem", fontWeight: 500, margin: 0 }}>
        {text}
      </p>

      <style>{`
        .hc-loader-ring {
          inline-size: 40px;
          block-size: 40px;
          border-radius: 50%;
          border: 3px solid var(--color-border);
          border-top-color: var(--color-secondary);
          animation: hcSpin 0.8s linear infinite;
        }
        @keyframes hcSpin {
          to { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hc-loader-ring {
            animation: hcSpin 3s linear infinite !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Loader;
