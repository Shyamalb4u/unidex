import { useEffect } from "react";

export default function FlashMessage({
  message,
  duration = 2000,
  onClose,
  isError,
}) {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        padding: "12px 20px",
        background: isError ? "red" : "green",
        color: "white",
        borderRadius: "6px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        zIndex: 9999,
      }}
    >
      {message}
    </div>
  );
}
