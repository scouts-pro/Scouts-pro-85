
import { GoogleGenAI } from "@google/genai";

// Fix: Refactored to directly use GoogleGenAI and process.env.API_KEY as per guidelines
export const generateStrategicReport = async (contextData: string): Promise<string> => {
  try {
    // Fix: Always use a named parameter for apiKey and obtain it exclusively from process.env.API_KEY
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
      بصفتك مستشارًا استراتيجيًا لفوج كشفي (Scouts Pro)، قم بتحليل البيانات التالية وقدم تقريرًا استراتيجيًا.
      البيانات:
      ${contextData}
      
      المطلوب:
      1. تحليل نقاط القوة والضعف في الفوج بناءً على البيانات (المالية، الأعضاء، الانضباط).
      2. اقتراح 3 أهداف استراتيجية للموسم القادم.
      3. نصائح لتحسين التمويل والمشاريع.
      
      الأسلوب: رسمي، مباشر، باللغة العربية.
    `;

    // Fix: Use ai.models.generateContent to query GenAI with both the model name and prompt directly
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    // Fix: Access the text property directly on the GenerateContentResponse object (do not use text())
    return response.text || "لم يتم إنشاء تقرير.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "حدث خطأ أثناء الاتصال بالذكاء الاصطناعي. يرجى التحقق من مفتاح API.";
  }
};
