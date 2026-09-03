import { useState, useRef, useEffect } from "react";
import api from "../services/api";

function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello! 👋 I'm your Smart Hospital AI Assistant. Ask me anything about hospitals, ambulances, or how to use this system." },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = input.trim();
    setMessages((prev) => [...prev, { from: "user", text: userMessage }]);
    setInput("");
    setSending(true);

    try {
      const response = await api.post("/ai/chatbot", { message: userMessage });
      setMessages((prev) => [...prev, { from: "bot", text: response.data.reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { from: "bot", text: "Sorry, I couldn't reach the server. Please try again." }]);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="chatbot-toggle"
        aria-label="AI Assistant"
      >
        {open ? "✕" : "🤖"}
      </button>

      {open && (
        <div className="chatbot-window glass-card animate-fade-up">
          <div className="chatbot-header">
            <span>🤖 AI Assistant</span>
            <span className="chatbot-live-dot" />
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chatbot-bubble ${msg.from}`}>
                {msg.text}
              </div>
            ))}
            {sending && <div className="chatbot-bubble bot">Typing...</div>}
            <div ref={bottomRef} />
          </div>

          <div className="chatbot-input-row">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              className="chatbot-input"
            />
            <button onClick={sendMessage} className="chatbot-send">➤</button>
          </div>
        </div>
      )}

      <style>{`
        .chatbot-toggle {
          position: fixed;
          bottom: 26px;
          left: 26px;
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: linear-gradient(135deg, #457b9d, #2d5a7a);
          border: 3px solid rgba(255,255,255,0.85);
          color: white;
          font-size: 24px;
          cursor: pointer;
          z-index: 998;
          box-shadow: 0 6px 20px rgba(69,123,157,0.5);
          transition: transform 0.15s ease;
        }
        .chatbot-toggle:hover { transform: scale(1.08); }
        .chatbot-toggle:active { transform: scale(0.96); }

        .chatbot-window {
          position: fixed;
          bottom: 96px;
          left: 26px;
          width: 320px;
          max-width: calc(100vw - 40px);
          height: 420px;
          display: flex;
          flex-direction: column;
          z-index: 998;
          padding: 0;
          overflow: hidden;
        }

        .chatbot-header {
          padding: 14px 18px;
          background: linear-gradient(135deg, #1a1a2e, #302b63);
          color: white;
          font-weight: 700;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .chatbot-live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #48dc82;
          animation: chatbotPulse 1.8s infinite;
        }
        @keyframes chatbotPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(72,220,130,0.6); }
          70% { box-shadow: 0 0 0 5px rgba(72,220,130,0); }
        }

        .chatbot-messages {
          flex: 1;
          overflow-y: auto;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .chatbot-bubble {
          max-width: 85%;
          padding: 9px 13px;
          border-radius: 14px;
          font-size: 13px;
          line-height: 1.4;
        }
        .chatbot-bubble.bot {
          background: rgba(69,123,157,0.12);
          color: #333;
          align-self: flex-start;
          border-bottom-left-radius: 4px;
        }
        .chatbot-bubble.user {
          background: linear-gradient(135deg, #e63946, #c1121f);
          color: white;
          align-self: flex-end;
          border-bottom-right-radius: 4px;
        }

        .chatbot-input-row {
          display: flex;
          gap: 8px;
          padding: 12px;
          border-top: 1px solid rgba(0,0,0,0.08);
          background: rgba(255,255,255,0.5);
        }

        .chatbot-input {
          flex: 1;
          padding: 9px 12px;
          border-radius: 10px;
          border: 1px solid rgba(0,0,0,0.1);
          font-size: 13px;
        }

        .chatbot-send {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(135deg, #457b9d, #2d5a7a);
          color: white;
          cursor: pointer;
          font-size: 14px;
        }

        @media (max-width: 600px) {
          .chatbot-toggle { width: 50px; height: 50px; bottom: 18px; left: 18px; }
          .chatbot-window { bottom: 80px; left: 12px; width: calc(100vw - 24px); height: 380px; }
        }
      `}</style>
    </>
  );
}

export default ChatbotWidget;