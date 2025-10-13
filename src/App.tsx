import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { mastraClient } from "@/lib/mastra-client";
import { useState } from "react";

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

  return (
    <>
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-4xl">
          <Button disabled={loading} onClick={handleClick}>
            {loading && <Spinner />}
            Test Agent
          </Button>
          <pre>{msg}</pre>
        </div>
      </div>
    </>
  );
}

export default App;
