"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import { Send } from "lucide-react";

type Msg = { id: string; role: "user" | "assistant"; content: string };

export default function ChatWidget() {
  const [messages, setMessages] = React.useState<Msg[]>([]);
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const abortRef = React.useRef<AbortController | null>(null);

  async function send(text: string) {
    const userMsg: Msg = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    };
    const asstMsg: Msg = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "",
    };
    setMessages((prev) => [...prev, userMsg, asstMsg]);

    setIsLoading(true);
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        signal: controller.signal,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          messages: [
            ...messages.map(({ role, content }) => ({ role, content })),
            { role: "user", content: text },
          ],
        }),
      });

      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          setMessages((prev) => {
            const next = [...prev];
            const last = next.length - 1;
            next[last] = { ...next[last], content: next[last].content + chunk };
            return next;
          });
        }
      }
    } catch (err) {
      setMessages((prev) => {
        const next = [...prev];
        const last = next.length - 1;
        next[last] = {
          ...next[last],
          content:
            next[last].content ||
            "Sorry—there was a problem generating a response.",
        };
        return next;
      });
      console.error(err);
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    void send(text);
  }

  function stop() {
    abortRef.current?.abort();
  }

  return (
    <div className="card">
      <div className="header">
        <div style={{ fontWeight: 600 }}>Chat with Sumedh&apos;s AI</div>
        <span className="badge" style={{ marginLeft: "auto" }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              background: isLoading ? "#6ee7b7" : "#64748b",
            }}
          />
          {isLoading ? "Thinking" : "Ready"}
        </span>
      </div>

      <div className="chat" style={{ minHeight: 280 }}>
        {messages.map((m: Msg) => (
          <div
            key={m.id}
            className={"msg " + (m.role === "user" ? "user" : "bot")}
          >
            <ReactMarkdown>{m.content}</ReactMarkdown>
          </div>
        ))}

        {messages.length === 0 && (
          <ul className="clean">
            <li>
              <small className="muted">
                Try: “What are your strongest skills?”
              </small>
            </li>
            <li>
              <small className="muted">Try: “Link to your resume”</small>
            </li>
            <li>
              <small className="muted">
                Try: “Tell me about a project you’re proud of”
              </small>
            </li>
          </ul>
        )}
      </div>

      <form onSubmit={handleSubmit} className="footer">
        <input
          className="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything about Sumedh…"
          autoComplete="off"
        />
        <button
          className="button"
          disabled={isLoading || !input.trim()}
          aria-label="Send"
        >
          <Send size={16} />
        </button>
        {isLoading && (
          <button type="button" className="button" onClick={stop}>
            Stop
          </button>
        )}
      </form>

      <div style={{ marginTop: 12 }}>
        <small className="muted">
          Privacy: questions are processed securely via OpenAI. No data is
          stored server-side beyond transient processing.
        </small>
      </div>
    </div>
  );
}
