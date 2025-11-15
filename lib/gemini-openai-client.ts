// 📁 lib/gemini-openai-client.ts

import OpenAI from "openai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined in the environment variables.");
}

export const geminiOpenAIClient = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY, 
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});
