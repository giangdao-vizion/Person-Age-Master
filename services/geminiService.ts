
import { GoogleGenAI, Type } from "@google/genai";
import { FunFacts } from "../types";

export const fetchFunFacts = async (birthDate: Date): Promise<FunFacts> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const dateStr = birthDate.toLocaleDateString('vi-VN', { month: 'long', day: 'numeric', year: 'numeric' });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Cung cấp các sự thật thú vị và hiểu biết cho một người sinh ngày ${dateStr}. 
    Tất cả câu trả lời phải bằng tiếng Việt.
    Bao gồm các sự kiện lịch sử, đặc điểm tính cách dựa trên ngày sinh và một vài người nổi tiếng có cùng ngày sinh.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          historicalEvents: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Danh sách 3 sự kiện lịch sử lớn đã xảy ra vào ngày/tháng/năm cụ thể này."
          },
          personalityTraits: {
            type: Type.STRING,
            description: "Một đoạn văn ngắn, tích cực về tính cách của người sinh vào ngày này dựa trên thần số học và chiêm tinh học."
          },
          famousBirthdays: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Danh sách 3-4 người nổi tiếng sinh vào ngày này."
          },
          zodiacWisdom: {
            type: Type.STRING,
            description: "Một lời khuyên hoặc trí tuệ cụ thể dựa trên cung hoàng đạo của họ cho năm hiện tại."
          }
        },
        required: ["historicalEvents", "personalityTraits", "famousBirthdays", "zodiacWisdom"]
      }
    }
  });

  try {
    return JSON.parse(response.text.trim()) as FunFacts;
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    throw new Error("Không thể tải thông tin thú vị vào lúc này.");
  }
};
