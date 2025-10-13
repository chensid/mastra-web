import { MastraClient } from "@mastra/client-js";

export const mastraClient = new MastraClient({
  baseUrl: import.meta.env.VITE_MASTRA_API_URL,
});
