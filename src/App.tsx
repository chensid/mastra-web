import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ThemeToggle } from "@/components/theme-toggle";
import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Send, CloudSun } from "lucide-react";

function App() {
  const { messages, status, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: `${import.meta.env.VITE_MASTRA_API_URL}/api/chat/weatherAgent`,
    }),
  });

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || status !== "ready") return;
    sendMessage({ text: input });
    setInput("");
  };

  return (
    <>
      <div className="flex h-screen flex-col bg-background">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <CloudSun className="size-6 text-primary" />
              <h1 className="text-lg font-semibold">天气助手</h1>
            </div>
            <ThemeToggle />
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-4xl">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center px-4 py-16 text-center">
                <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-muted">
                  <CloudSun className="size-10 text-foreground/70" />
                </div>
                <h2 className="mb-3 text-3xl font-semibold tracking-tight">
                  欢迎使用天气助手
                </h2>
                <p className="mb-8 max-w-md text-muted-foreground">
                  询问任何城市的天气情况，我会为您提供实时的天气信息和预报
                </p>
                <div className="grid w-full max-w-2xl gap-3 sm:grid-cols-2">
                  <button
                    onClick={() => sendMessage({ text: "深圳天气怎么样？" })}
                    className="group rounded-xl border bg-card p-4 text-left shadow-sm transition-all hover:border-primary/50 hover:shadow-md disabled:opacity-50"
                    disabled={status !== "ready"}
                  >
                    <div className="mb-1 text-2xl">🌤️</div>
                    <div className="text-sm font-medium group-hover:text-primary">
                      深圳天气怎么样？
                    </div>
                  </button>
                  <button
                    onClick={() => sendMessage({ text: "北京今天的天气如何？" })}
                    className="group rounded-xl border bg-card p-4 text-left shadow-sm transition-all hover:border-primary/50 hover:shadow-md disabled:opacity-50"
                    disabled={status !== "ready"}
                  >
                    <div className="mb-1 text-2xl">☀️</div>
                    <div className="text-sm font-medium group-hover:text-primary">
                      北京今天的天气如何？
                    </div>
                  </button>
                  <button
                    onClick={() => sendMessage({ text: "上海明天会下雨吗？" })}
                    className="group rounded-xl border bg-card p-4 text-left shadow-sm transition-all hover:border-primary/50 hover:shadow-md disabled:opacity-50"
                    disabled={status !== "ready"}
                  >
                    <div className="mb-1 text-2xl">🌧️</div>
                    <div className="text-sm font-medium group-hover:text-primary">
                      上海明天会下雨吗？
                    </div>
                  </button>
                  <button
                    onClick={() => sendMessage({ text: "广州的气温是多少？" })}
                    className="group rounded-xl border bg-card p-4 text-left shadow-sm transition-all hover:border-primary/50 hover:shadow-md disabled:opacity-50"
                    disabled={status !== "ready"}
                  >
                    <div className="mb-1 text-2xl">🌡️</div>
                    <div className="text-sm font-medium group-hover:text-primary">
                      广州的气温是多少？
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 px-4 py-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex max-w-[80%] gap-3 ${
                        message.role === "user" ? "flex-row-reverse" : ""
                      }`}
                    >
                      {/* Avatar */}
                      <div
                        className={`flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold shadow-sm ${
                          message.role === "user"
                            ? "bg-foreground text-background dark:bg-foreground/90"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {message.role === "user" ? "你" : "AI"}
                      </div>

                      {/* Message Content */}
                      <div
                        className={`rounded-2xl px-4 py-3 shadow-sm ${
                          message.role === "user"
                            ? "bg-foreground text-background dark:bg-foreground/90"
                            : "bg-muted"
                        }`}
                      >
                        {message.parts.map((part, index) => {
                          switch (part.type) {
                            case "text":
                              return (
                                <div
                                  key={index}
                                  className="whitespace-pre-wrap break-words text-[15px] leading-relaxed"
                                >
                                  {part.text}
                                </div>
                              );
                            default:
                              return null;
                          }
                        })}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Loading indicator */}
                {status === "streaming" && (
                  <div className="flex justify-start">
                    <div className="flex max-w-[80%] gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground shadow-sm">
                        AI
                      </div>
                      <div className="flex items-center rounded-2xl bg-muted px-4 py-3 shadow-sm">
                        <Spinner className="size-4" />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="mx-auto max-w-4xl px-4 py-4">
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="询问任何城市的天气..."
                disabled={status !== "ready"}
                className="w-full rounded-full border bg-background px-5 py-3.5 pr-14 text-sm shadow-sm outline-none transition-all placeholder:text-muted-foreground focus-visible:border-primary focus-visible:shadow-md focus-visible:ring-4 focus-visible:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <Button
                type="submit"
                size="icon-sm"
                disabled={!input.trim() || status !== "ready"}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full shadow-sm transition-all hover:scale-105 disabled:hover:scale-100"
              >
                {status === "streaming" ? (
                  <Spinner className="size-4" />
                ) : (
                  <Send className="size-4" />
                )}
              </Button>
            </form>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              由 Mastra AI 驱动
            </p>
          </div>
        </div>
      </div>
      <SpeedInsights />
    </>
  );
}

export default App;
