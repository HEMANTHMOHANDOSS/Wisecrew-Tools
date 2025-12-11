import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Safely initialize the AI client
const getAiClient = () => {
  if (!apiKey) {
    console.warn("API Key is missing for Gemini Service");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateAIContent = async (
  prompt: string, 
  systemInstruction?: string
): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "Error: API Key not configured.";

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "An error occurred while communicating with the AI. Please try again.";
  }
};
