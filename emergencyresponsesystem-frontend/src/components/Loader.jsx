function Loader({ text = "Loading..." }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 20px",
        gap: "16px",
      }}
    >
      <div className="loader-spinner" />
      <p style={{ color: "#6c757d", fontSize: "14px", fontWeight: "500" }}>{text}</p>

      <style>{`
        .loader-spinner {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: 3px solid rgba(230, 57, 70, 0.15);
          border-top-color: #e63946;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default Loader;