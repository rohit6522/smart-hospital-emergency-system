import { useEffect, useId, useRef } from "react";
import { CloseIcon } from "./Icons";

function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  onConfirm,
  onCancel,
}) {
  const dialogRef = useRef(null);
  const cancelBtnRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      if (!dialog.open) {
        dialog.showModal();
        cancelBtnRef.current?.focus();
      }
    } else if (dialog.open) {
      dialog.close();
    }
  }, [open]);

  const handleCancelEvent = (e) => {
    e.preventDefault();
    onCancel();
  };

  const handleBackdropClick = (e) => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const rect = dialog.getBoundingClientRect();
    const clickedOutside =
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom;
    if (clickedOutside) {
      onCancel();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="hc-dialog hc-dialog--sm"
      aria-labelledby={titleId}
      onCancel={handleCancelEvent}
      onClick={handleBackdropClick}
    >
      <div className="hc-dialog__header">
        <h2 id={titleId} style={{ margin: 0, fontSize: "1.125rem" }}>
          {title}
        </h2>
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={onCancel}
          aria-label="Close confirmation dialog"
          style={{ minInlineSize: "34px", padding: "0 0.5rem" }}
        >
          <CloseIcon size={16} />
        </button>
      </div>

      <div className="hc-dialog__body">
        <p style={{ margin: 0, color: "var(--color-text-secondary)", fontSize: "0.9375rem" }}>
          {message}
        </p>
      </div>

      <div className="hc-dialog__footer">
        <button
          ref={cancelBtnRef}
          type="button"
          className="btn btn-outline"
          onClick={onCancel}
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          className={`btn ${variant === "danger" ? "btn-danger" : "btn-primary"}`}
          onClick={onConfirm}
        >
          {confirmLabel}
        </button>
      </div>
    </dialog>
  );
}

export default ConfirmDialog;

