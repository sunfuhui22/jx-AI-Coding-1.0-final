import { ChatOpenAI } from "@langchain/openai";

export const model = new ChatOpenAI({
  model: process.env.AGENT_MODEL_ID ?? "deepseek-chat",
  apiKey: process.env.DEEPSEEK_API_KEY ?? "",
  configuration: { baseURL: "https://api.deepseek.com/v1" },
});
