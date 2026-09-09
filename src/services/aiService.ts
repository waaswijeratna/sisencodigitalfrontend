import api from "../api/axios";

type AIResponse = {
  answer?: string;
};

export const askAI = async (message: string) => {
  const response = await api.post<AIResponse>("/ai/chat", { message });
  return response.data.answer?.trim() || "AI cannot answer that question at this moment.";
};