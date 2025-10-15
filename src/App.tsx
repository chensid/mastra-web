import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { mastraClient } from "@/lib/mastra-client";
import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { SpeedInsights } from "@vercel/speed-insights/react"

function App() {
  const [loading, setLoading] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>("");
  const handleClick = async () => {
    setLoading(true);
    const agent = mastraClient.getAgent("weatherAgent");
    const stream = await agent.stream({
      messages: [{ role: "user", content: "深圳天气" }],
    });
    stream.processDataStream({
      onChunk: async (chunk) => {
        console.log(chunk);
        if (chunk.type === "step-finish") {
          setMsg(chunk.payload.output.text ?? "");
        }
      },
    });
    setLoading(false);
  };

  const { messages, status, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: `${import.meta.env.VITE_MASTRA_API_URL}/chat/weatherAgent`,
    }),
  });

  const [input, setInput] = useState("");
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage({ text: input });
    setInput("");
  };

  return (
    <>
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-4xl">
          <Button disabled={loading} onClick={handleClick}>
            {loading && <Spinner />}
            Test Agent
          </Button>
          <pre>{msg}</pre>
          <Button onClick={() => sendMessage({ text: "深圳天气" })}>
            Test AI SDK
          </Button>
          {messages.map((message) => (
            <div key={message.id}>
              <strong>{`${message.role}: `}</strong>
              {message.parts.map((part, index) => {
                switch (part.type) {
                  case "text":
                    return <div key={index}>{part.text}</div>;
                }
              })}
            </div>
          ))}

          <form onSubmit={handleSubmit}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={status !== "ready"}
            />
          </form>
        </div>
      </div>
      <SpeedInsights />
    </>
  );
}

export default App;
