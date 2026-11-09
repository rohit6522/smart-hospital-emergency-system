import { useState, useRef, useEffect, useId } from "react";
import api from "../services/api";
import { CloseIcon, MessageSquareIcon, SendIcon } from "./Icons";

function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hello! I am the SmartHospital Triage Assistant. Ask me about hospitals, ICU capacity, ambulances, or emergency routing.",
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const inputId = useId();
  const titleId = useId();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  const sendMessage = async () => {
    if (!input.trim() || sending) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { from: "user", text: userMessage }]);
    setInput("");
    setSending(true);

    try {
      const response = await api.post("/ai/chatbot", { message: userMessage });
      setMessages((prev) => [...prev, { from: "bot", text: response.data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Unable to reach the assistant right now. Please try again shortly." },
      ]);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="chatbot-toggle"
        aria-label={open ? "Close AI Assistant" : "Open AI Assistant"}
        aria-expanded={open}
      >
        {open ? <CloseIcon size={20} /> : <MessageSquareIcon size={20} />}
      </button>

      {open && (
        <section
          className="chatbot-window"
          role="dialog"
          aria-labelledby={titleId}
        >
          <div className="chatbot-header">
            <div>
              <div id={titleId} style={{ fontWeight: 700, fontSize: "0.9375rem", color: "#FFFFFF" }}>
                AI Triage Assistant
              </div>
              <div style={{ fontSize: "0.75rem", color: "#CBD5E1" }}>
                NLP rule-based hospital guidance
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
              <span className="chatbot-live-dot" title="Online" />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Minimize assistant"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#FFFFFF",
                  padding: "0.25rem",
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                <CloseIcon size={16} />
              </button>
            </div>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chatbot-bubble ${msg.from}`}>
                {msg.text}
              </div>
            ))}
            {sending && <div className="chatbot-bubble bot">Typing response...</div>}
            <div ref={bottomRef} />
          </div>

          <div className="chatbot-input-row">
            <label htmlFor={inputId} className="visually-hidden">
              Ask the AI Triage Assistant
            </label>
            <input
              ref={inputRef}
              id={inputId}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about hospitals or ambulances..."
              className="chatbot-input"
              enterKeyHint="send"
            />
            <button
              type="button"
              onClick={sendMessage}
              disabled={sending || !input.trim()}
              className="chatbot-send"
              aria-label="Send message"
            >
              <SendIcon size={16} />
            </button>
          </div>
        </section>
      )}

      <style>{`
        .chatbot-toggle {
          position: fixed;
          inset-block-end: 1.5rem;
          inset-inline-start: 1.5rem;
          inline-size: 52px;
          block-size: 52px;
          border-radius: 50%;
          background-color: var(--color-secondary);
          border: 2px solid #FFFFFF;
          color: #FFFFFF;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          z-index: 998;
          box-shadow: var(--shadow-md);
          transition: background-color 0.15s ease, transform 0.15s ease;
        }
        .chatbot-toggle:hover {
          background-color: var(--color-secondary-dark);
          transform: translateY(-2px);
        }

        .chatbot-window {
          position: fixed;
          inset-block-end: 5.5rem;
          inset-inline-start: 1.5rem;
          inline-size: 350px;
          max-inline-size: calc(100dvw - 2rem);
          block-size: 430px;
          max-block-size: calc(100dvh - 8rem);
          background-color: var(--color-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
          display: flex;
          flex-direction: column;
          z-index: 998;
          overflow: hidden;
        }

        .chatbot-header {
          padding: 0.875rem 1rem;
          background-color: var(--color-primary);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
        }

        .chatbot-live-dot {
          inline-size: 8px;
          block-size: 8px;
          border-radius: 50%;
          background-color: var(--color-success);
          display: inline-block;
        }

        .chatbot-messages {
          flex: 1;
          overflow-y: auto;
          overscroll-behavior: contain;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
          background-color: var(--color-bg);
        }

        .chatbot-bubble {
          max-inline-size: 85%;
          padding: 0.625rem 0.875rem;
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          line-height: 1.45;
          overflow-wrap: break-word;
        }

        .chatbot-bubble.bot {
          background-color: var(--color-card);
          color: var(--color-text);
          border: 1px solid var(--color-border);
          align-self: flex-start;
        }

        .chatbot-bubble.user {
          background-color: var(--color-secondary);
          color: #FFFFFF;
          align-self: flex-end;
        }

        .chatbot-input-row {
          display: flex;
          gap: 0.5rem;
          padding: 0.75rem;
          border-top: 1px solid var(--color-border);
          background-color: var(--color-card);
        }

        .chatbot-input {
          flex: 1;
          min-block-size: 42px !important;
          padding: 0.5rem 0.75rem !important;
          font-size: 1rem !important;
        }

        .chatbot-send {
          inline-size: 40px;
          block-size: 40px;
          border-radius: var(--radius-md);
          border: none;
          background-color: var(--color-primary);
          color: #FFFFFF;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .chatbot-send:hover:not(:disabled) {
          background-color: var(--color-primary-dark);
        }

        @media (max-width: 640px) {
          .chatbot-toggle {
            inset-block-end: 1rem;
            inset-inline-start: 1rem;
            inline-size: 46px;
            block-size: 46px;
          }
          .chatbot-window {
            inset-block-end: 4.5rem;
            inset-inline-start: 1rem;
            inline-size: calc(100dvw - 2rem);
            block-size: 380px;
          }
        }
      `}</style>
    </>
  );
}

export default ChatbotWidget;
