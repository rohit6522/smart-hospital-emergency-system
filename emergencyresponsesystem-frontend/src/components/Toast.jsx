import { CheckCircleIcon, AlertIcon, CloseIcon } from "./Icons";

function Toast({ toast, onDismiss }) {
  if (!toast) return null;

  const isError = toast.type === "error";

  return (
    <div
      role={isError ? "alert" : "status"}
      aria-live={isError ? "assertive" : "polite"}
      style={{
        position: "fixed",
        insetBlockStart: "5.25rem",
        insetInlineEnd: "1.25rem",
        zIndex: 2500,
        display: "flex",
        alignItems: "center",
        gap: "0.625rem",
        padding: "0.75rem 1rem",
        borderRadius: "var(--radius-md)",
        backgroundColor: isError ? "var(--color-danger-bg)" : "var(--color-primary)",
        color: isError ? "var(--color-danger-text)" : "#FFFFFF",
        border: `1px solid ${isError ? "var(--color-danger-border)" : "var(--color-primary-dark)"}`,
        boxShadow: "var(--shadow-md)",
        fontSize: "0.875rem",
        fontWeight: 600,
        maxInlineSize: "min(90vw, 380px)",
      }}
    >
      {isError ? <AlertIcon size={18} /> : <CheckCircleIcon size={18} />}
      <span>{toast.message}</span>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss notification"
          style={{
            marginInlineStart: "0.25rem",
            background: "transparent",
            border: "none",
            color: "inherit",
            padding: "0.125rem",
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          <CloseIcon size={14} />
        </button>
      )}
    </div>
  );
}

export default Toast;

