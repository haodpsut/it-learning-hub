
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ApiConfig } from '../types';

async function callGemini(apiKey: string, prompt: string, systemInstruction: string): Promise<string> {
    if (!apiKey) {
        throw new Error("Gemini API key is not set.");
    }
    try {
        const ai = new GoogleGenAI({ apiKey });
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
            },
        });
        return response.text;
    } catch(error) {
        console.error("Gemini API Error:", error);
        if (error instanceof Error) {
           return `Error calling Gemini API: ${error.message}`;
        }
        return "An unknown error occurred with the Gemini API.";
    }
}

async function callOpenRouter(apiKey: string, model: string, prompt: string, systemInstruction: string): Promise<string> {
    if (!apiKey) {
        throw new Error("OpenRouter API key is not set.");
    }
    if (!model) {
        throw new Error("OpenRouter model is not selected.");
    }
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:3000", // Replace with your actual site URL in production
                "X-Title": "IT Learning Hub",
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { "role": "system", "content": systemInstruction },
                    { "role": "user", "content": prompt }
                ],
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;

    } catch(error) {
        console.error("OpenRouter API Error:", error);
        if (error instanceof Error) {
            return `Error calling OpenRouter API: ${error.message}`;
        }
        return "An unknown error occurred with the OpenRouter API.";
    }
}

export const generateText = async (prompt: string, systemInstruction: string): Promise<string> => {
    const configString = localStorage.getItem('apiConfig');
    if (!configString) {
        return Promise.reject("API configuration not found. Please set it up first.");
    }

    const config: ApiConfig = JSON.parse(configString);

    if (config.provider === 'gemini') {
        return callGemini(config.geminiApiKey, prompt, systemInstruction);
    } else if (config.provider === 'openrouter') {
        return callOpenRouter(config.openRouterApiKey, config.openRouterModel, prompt, systemInstruction);
    } else {
        return Promise.reject("Invalid AI provider selected.");
    }
};
