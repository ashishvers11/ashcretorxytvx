/**
 * AI Engine Configuration & Provider Detection
 * ASH Creator Studio — Phase K: Multi-Provider AI Architecture
 */

export interface AIProviderConfig {
  activeProvider: "gemini" | "openai" | "groq" | "anthropic" | "algorithmic";
  isAIConfigured: boolean;
  providerName: string;
}

export function getAIProviderConfig(): AIProviderConfig {
  if (process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes("placeholder")) {
    return {
      activeProvider: "gemini",
      isAIConfigured: true,
      providerName: "Google Gemini 1.5 Flash",
    };
  }

  if (process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes("placeholder")) {
    return {
      activeProvider: "openai",
      isAIConfigured: true,
      providerName: "OpenAI GPT-4o Mini",
    };
  }

  if (process.env.GROQ_API_KEY && !process.env.GROQ_API_KEY.includes("placeholder")) {
    return {
      activeProvider: "groq",
      isAIConfigured: true,
      providerName: "Groq Llama 3.3 70B",
    };
  }

  if (process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_API_KEY.includes("placeholder")) {
    return {
      activeProvider: "anthropic",
      isAIConfigured: true,
      providerName: "Anthropic Claude 3.5 Sonnet",
    };
  }

  return {
    activeProvider: "algorithmic",
    isAIConfigured: false,
    providerName: "ASH Algorithmic Engine V2 (Rule-Based Fallback)",
  };
}
