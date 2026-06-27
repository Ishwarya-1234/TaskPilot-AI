import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { HiOutlinePaperAirplane, HiOutlineUser, HiOutlineSparkles, HiOutlineTrash, HiOutlineDuplicate, HiOutlineRefresh } from "react-icons/hi";
import LoadingSpinner from "../components/LoadingSpinner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { postJson, getChatHistory, saveChatMessage, clearChatHistory } from "../services/api";

const WELCOME_MESSAGE = {
  role: "assistant",
  content: "Hi! I'm TaskPilot AI, your productivity coach. Ask me about prioritizing tasks, beating deadlines, staying focused, or planning your hackathon sprint.",
};

const SUGGESTED_PROMPTS = [
  "Plan my day",
  "Help me prioritize tasks",
  "Reduce procrastination",
  "Prepare for my deadline",
];

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [lastMessage, setLastMessage] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, isTyping]);

  const loadChatHistory = async () => {
    try {
      const history = await getChatHistory();
      if (history.length === 0) {
        setMessages([WELCOME_MESSAGE]);
      } else {
        setMessages(history);
      }
    } catch (error) {
      console.error("Failed to load chat history:", error);
      setMessages([WELCOME_MESSAGE]);
    } finally {
      setLoadingHistory(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const regenerateResponse = async () => {
    if (messages.length < 2 || loading) return;
    
    const lastUserMessage = messages[messages.length - 2];
    if (lastUserMessage.role !== "user") return;

    // Remove the last assistant message
    setMessages((prev) => prev.slice(0, -1));
    setInput(lastUserMessage.content);
    setLoading(true);
    setIsTyping(true);
    setError("");

    try {
      const history = messages
        .slice(0, -2)
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map(({ role, content }) => ({ role, content }));

      const data = await postJson("/chat", {
        message: lastUserMessage.content,
        history,
      });

      const assistantMessage = { role: "assistant", content: data.reply, timestamp: new Date().toISOString() };
      setMessages((prev) => [...prev, assistantMessage]);
      await saveChatMessage({ role: "assistant", content: data.reply, timestamp: assistantMessage.timestamp });
    } catch (err) {
      setError(err.message || "Failed to regenerate response.");
      toast.error(err.message || "Failed to regenerate response.");
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMessage = { role: "user", content: text, timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setIsTyping(true);
    setError("");
    setLastMessage(text);

    try {
      await saveChatMessage({ role: "user", content: text, timestamp: userMessage.timestamp });

      const history = messages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map(({ role, content }) => ({ role, content }));

      const data = await postJson("/chat", {
        message: text,
        history,
      });

      const assistantMessage = { role: "assistant", content: data.reply, timestamp: new Date().toISOString() };
      setMessages((prev) => [...prev, assistantMessage]);

      await saveChatMessage({ role: "assistant", content: data.reply, timestamp: assistantMessage.timestamp });
    } catch (err) {
      setError(err.message || "Failed to send message.");
      toast.error(err.message || "Failed to send message.");
      setMessages((prev) => prev.slice(0, -1));
      setInput(text);
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  const handleClearChat = async () => {
    try {
      await clearChatHistory();
      setMessages([WELCOME_MESSAGE]);
      toast.success("Chat history cleared");
    } catch (error) {
      toast.error("Failed to clear chat history");
      console.error(error);
    }
  };

  const handleSuggestedPrompt = (prompt) => {
    setInput(prompt);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
              <HiOutlineSparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">AI Productivity Coach</h2>
              <p className="text-sm text-slate-500">Powered by Gemini</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClearChat}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
          >
            <HiOutlineTrash className="h-4 w-4" />
            Clear Chat
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
        {loadingHistory ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    msg.role === "user"
                      ? "bg-indigo-600 text-white"
                      : "bg-violet-100 text-violet-600"
                  }`}
                >
                  {msg.role === "user" ? (
                    <HiOutlineUser className="h-4 w-4" />
                  ) : (
                    <HiOutlineSparkles className="h-4 w-4" />
                  )}
                </div>
                <div className={`flex max-w-[85%] flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                  <div
                    className={`rounded-2xl px-5 py-3 text-sm leading-relaxed prose prose-sm max-w-none ${
                      msg.role === "user"
                        ? "bg-indigo-600 text-white prose-invert"
                        : "bg-slate-100 text-slate-800 prose-slate"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                          ul: ({ children }) => <ul className="mb-2 ml-4 list-disc space-y-1">{children}</ul>,
                          ol: ({ children }) => <ol className="mb-2 ml-4 list-decimal space-y-1">{children}</ol>,
                          li: ({ children }) => <li className="pl-1">{children}</li>,
                          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                          em: ({ children }) => <em className="italic">{children}</em>,
                          code: ({ inline, children }) => 
                            inline ? (
                              <code className="rounded bg-slate-200 px-1.5 py-0.5 text-xs font-mono text-slate-700">{children}</code>
                            ) : (
                              <code className="block rounded-lg bg-slate-800 px-3 py-2 text-xs font-mono text-slate-100">{children}</code>
                            ),
                          pre: ({ children }) => <pre className="mb-2 overflow-x-auto rounded-lg bg-slate-800 p-3">{children}</pre>,
                          blockquote: ({ children }) => (
                            <blockquote className="mb-2 border-l-4 border-slate-300 pl-4 italic text-slate-600">{children}</blockquote>
                          ),
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    ) : (
                      msg.content
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {msg.timestamp && (
                      <span className="text-xs text-slate-400">
                        {formatTimestamp(msg.timestamp)}
                      </span>
                    )}
                    {msg.role === "assistant" && (
                      <button
                        onClick={() => copyToClipboard(msg.content)}
                        className="text-xs text-slate-400 hover:text-slate-600 transition"
                        title="Copy response"
                      >
                        <HiOutlineDuplicate className="h-3.5 w-3.5" />
                      </button>
                    )}
                    {msg.role === "assistant" && index === messages.length - 1 && !loading && (
                      <button
                        onClick={regenerateResponse}
                        className="text-xs text-slate-400 hover:text-slate-600 transition"
                        title="Regenerate response"
                      >
                        <HiOutlineRefresh className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                  <HiOutlineSparkles className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-1 rounded-2xl bg-slate-100 px-4 py-3">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:0ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:300ms]" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {error && (
        <div className="mx-6 mb-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="border-t border-slate-100 p-4">
        <form onSubmit={sendMessage} className="mb-3">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about tasks, deadlines, focus..."
              disabled={loading}
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100 disabled:opacity-60 transition-all"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="inline-flex items-center justify-center rounded-xl bg-violet-600 px-5 py-3 text-white transition-all duration-200 hover:bg-violet-700 hover:scale-105 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
            >
              <HiOutlinePaperAirplane className="h-5 w-5" />
            </button>
          </div>
        </form>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => handleSuggestedPrompt(prompt)}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
