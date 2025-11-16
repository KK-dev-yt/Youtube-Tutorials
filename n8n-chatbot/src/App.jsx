import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// ✅ Get webhook URL from .env (or hardcode for local testing)
const WEBHOOK_URL = "http://localhost:5678/webhook/n8n";

// ✅ Generate & persist session ID
const getSessionId = () => {
  const existingId = localStorage.getItem("chat_session_id");
  if (existingId) return existingId;
  const newId = crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  localStorage.setItem("chat_session_id", newId);
  return newId;
};

// persistent theme keys
const THEME_KEY = "ui_theme"; // 'light' or 'dark'
const CONTRAST_KEY = "ui_high_contrast"; // 'true' or 'false'

export default function App() {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "👋 **Hello!** I am your *n8n chatbot*.\n\nLet's get started! Type your question below. 🚀",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // session id
  const sessionId = getSessionId();

  // theme state (light | dark)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(THEME_KEY) || "light";
  });

  // high contrast state (boolean)
  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem(CONTRAST_KEY) === "true";
  });

  useEffect(() => {
    // apply or remove 'dark' class on root html/body wrapper
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(CONTRAST_KEY, highContrast ? "true" : "false");
  }, [highContrast]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          message: input,
        }),
      });

      const data = await response.json();
      const botReply = data.output || "🤖 (No reply from n8n)";

      setMessages((prev) => [...prev, { role: "bot", text: botReply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "❌ Unable to connect to the n8n server. Please check your workflow.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  // small helpers for theme-aware classes
  const userBubbleClasses = `max-w-[75%] p-3 rounded-2xl text-sm leading-relaxed prose prose-sm ${
    highContrast
      ? theme === "dark"
        ? "bg-blue-500 text-white rounded-br-none shadow-lg"
        : "bg-blue-600 text-white rounded-br-none shadow"
      : theme === "dark"
      ? "bg-blue-600 text-white rounded-br-none"
      : "bg-blue-600 text-white rounded-br-none"
  }`;

  const botBubbleClasses = `max-w-[75%] p-3 rounded-2xl text-sm leading-relaxed prose prose-sm ${
    highContrast
      ? theme === "dark"
        ? "bg-gray-700 text-white rounded-bl-none shadow-lg"
        : "bg-gray-100 text-gray-900 rounded-bl-none shadow"
      : theme === "dark"
      ? "bg-gray-800 text-gray-100 rounded-bl-none"
      : "bg-gray-200 text-gray-900 rounded-bl-none"
  }`;

  const containerBg = theme === "dark" ? (highContrast ? "bg-gray-900" : "bg-gray-900") : "bg-gray-50";
  const headerBg = theme === "dark" ? (highContrast ? "bg-gray-800" : "bg-white/5 dark:bg-gray-800") : "bg-white";
  const inputBg = theme === "dark" ? (highContrast ? "bg-gray-800" : "bg-gray-700/30 dark:bg-gray-700") : "bg-white";
  const inputText = theme === "dark" ? "text-white" : "text-gray-900";

  return (
    // root wrapper doesn't need explicit 'dark' because we toggle documentElement class,
    // but we'll keep outer container themed for additional classes
    <div className={`flex flex-col h-screen ${containerBg} transition-colors duration-200`}>
      {/* Header */}
      <header
        className={`flex items-center justify-between px-4 py-3 shadow ${headerBg} ${theme === "dark" ? "text-gray-100" : "text-gray-700"}`}
      >
        <div>
          <div className="text-lg font-semibold">🤖 n8n Chatbot</div>
          <div className="text-xs text-gray-400">Session: {sessionId.slice(0, 8)}...</div>
        </div>

        {/* Theme controls */}
        <div className="flex items-center space-x-3">
          {/* High contrast toggle */}
          <button
            title="Toggle high contrast"
            onClick={() => setHighContrast((s) => !s)}
            className={`px-2 py-1 rounded-md text-sm border ${
              highContrast ? "border-yellow-400" : "border-transparent"
            } ${theme === "dark" ? "text-gray-100" : "text-gray-700"} hover:opacity-80`}
          >
            {highContrast ? "⚡ Contrast" : "⚡"}
          </button>

          {/* Theme toggle */}
          <button
            title="Toggle dark mode"
            onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            className="px-3 py-1 rounded-md bg-transparent border hover:bg-white/5"
          >
            {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
          </button>
        </div>
      </header>

      {/* Chat Section */}
      <main className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex mb-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={msg.role === "user" ? userBubbleClasses : botBubbleClasses}>
              {/* prose classes adapt to dark automatically via the 'prose' + tailwind's prose-invert if needed */}
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-2 text-gray-400 text-sm">
            <div className="flex space-x-1">
              <div className="w-2 h-2 rounded-full animate-bounce bg-current opacity-60"></div>
              <div className="w-2 h-2 rounded-full animate-bounce bg-current opacity-60" style={{ animationDelay: "0.08s" }}></div>
              <div className="w-2 h-2 rounded-full animate-bounce bg-current opacity-60" style={{ animationDelay: "0.16s" }}></div>
            </div>
            <span>Bot is typing...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </main>

      {/* Input Section */}
      <div className={`p-3 border-t ${theme === "dark" ? "border-gray-700" : "border-gray-200"} bg-white/5`}>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            className={`flex-1 p-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBg} ${inputText}`}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className={`ml-2 px-4 py-2 rounded-lg ${highContrast ? "bg-yellow-500 text-black" : "bg-blue-600 text-white"} hover:opacity-95 disabled:opacity-50`}
          >
            Send
          </button>
        </div>

        {/* small hint about current mode */}
        <div className="mt-2 text-xs text-gray-400">
          Mode: <span className="font-medium">{theme === "dark" ? "Dark" : "Light"}</span>
          {highContrast ? " • High Contrast" : ""}
        </div>
      </div>
    </div>
  );
}
