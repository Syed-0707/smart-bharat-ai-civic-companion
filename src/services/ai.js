import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Helper to fetch the VITE_GEMINI_API_KEY from environment variables.
 */
const getApiKey = () => {
  return import.meta.env.VITE_GEMINI_API_KEY;
};

/**
 * Reusable function to generate content from Google Gemini API.
 * 
 * @param {string} prompt - The user prompt to send to the model.
 * @param {string} systemInstruction - Optional system instructions/persona to configure the model.
 * @returns {Promise<string>} - The text response from Gemini.
 */
export async function generateResponse(prompt, systemInstruction = "", files = []) {
  const apiKey = getApiKey();

  // Validate API key presence
  if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE" || apiKey.trim() === "") {
    throw new Error(
      "Google Gemini API Key is missing. Please configure VITE_GEMINI_API_KEY inside your .env file to enable live AI responses."
    );
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // We utilize gemini-2.5-flash as the default cost-efficient, low-latency model for civic queries.
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      ...(systemInstruction && { systemInstruction })
    });

    // Handle multimodal file payloads
    let contentParts = [];
    if (files && files.length > 0) {
      const fileParts = await Promise.all(files.map(async (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              inlineData: {
                data: reader.result.split(',')[1],
                mimeType: file.type
              }
            });
          };
          reader.onerror = (e) => reject(new Error("Failed to read the uploaded document: " + e.message));
          reader.readAsDataURL(file);
        });
      }));
      contentParts = [...fileParts, prompt];
    } else {
      contentParts = [prompt];
    }

    const result = await model.generateContent(contentParts);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error("Received empty response from the AI engine.");
    }

    return text;
  } catch (error) {
    console.error("Gemini Service Error:", error);
    
    // Friendly user-facing error message mapping
    let userFriendlyMessage = "We encountered an issue communicating with the AI server. Please try again.";
    
    if (error.message?.includes("API_KEY_INVALID") || error.message?.includes("key is invalid")) {
      userFriendlyMessage = "The configured Gemini API Key is invalid. Please check your credentials in the .env file.";
    } else if (error.message?.includes("quota") || error.message?.includes("429")) {
      userFriendlyMessage = "The AI service is currently receiving too many requests. Please try again in a few moments.";
    } else if (error.message?.includes("network") || error.message?.includes("fetch")) {
      userFriendlyMessage = "Network error. Please verify your internet connection and try again.";
    } else if (error.message) {
      userFriendlyMessage = error.message; // Passthrough local validation message
    }
    
    throw new Error(userFriendlyMessage);
  }
}
