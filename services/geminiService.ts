import { GoogleGenAI, Modality } from "@google/genai";
import type { Part } from "@google/genai";
import { ModelType } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const getMimeType = (base64: string): string => {
    return base64.substring(base64.indexOf(":") + 1, base64.indexOf(";"));
}

const base64ToPart = (base64: string): Part => {
    return {
        inlineData: {
            mimeType: getMimeType(base64),
            data: base64.split(",")[1],
        },
    };
};

type BackgroundOption = {
    type: 'custom' | 'predefined' | 'none';
    value: string | null;
};

export const generateMockup = async (
  productBase64: string,
  designBase64: string,
  modelType: ModelType,
  background: BackgroundOption,
  variationPrompt: string
): Promise<string | null> => {
  try {
    const parts: Part[] = [];

    parts.push(base64ToPart(productBase64));
    parts.push(base64ToPart(designBase64));

    let backgroundDescription: string;
    if (background.type === 'custom' && background.value) {
      parts.push(base64ToPart(background.value));
      backgroundDescription = 'The third image is the background scene. Integrate the model and product seamlessly into this background.';
    } else if (background.type === 'predefined' && background.value) {
      backgroundDescription = `Use a high-quality, professional '${background.value}' background that complements the product and design.`;
    } else { // 'none'
      backgroundDescription = 'Use a clean, neutral, professional studio background that complements the product and design.';
    }

    let viewOrModelDescription: string;
    if (modelType === ModelType.Unisex) {
      viewOrModelDescription = 'The product must be worn by BOTH a male and a female model, shown together in the same image frame. They can be standing side-by-side or interacting naturally.';
    } else if (modelType === ModelType.Product3D) {
      viewOrModelDescription = 'This is a 3D product render. DO NOT show any human models. Focus on creating a high-quality 3D visualization of the product itself.';
    } else if (modelType === ModelType.Product3DAnimated) {
      viewOrModelDescription = 'This is an animated 3D product render. The final output must be a short, seamlessly looping animated GIF. DO NOT show any human models. The animation should smoothly rotate the product to showcase the design.';
    } else {
      viewOrModelDescription = `The product must be worn by a ${modelType} model.`;
    }

    const prompt = `
      You are an expert AI mockup generator. Your task is to create a single, photorealistic mockup image or animation.
      - **Product:** The first image is the product (e.g., t-shirt, hoodie, mug).
      - **Design:** The second image is the design. Place this design prominently and realistically onto the product, paying attention to texture, lighting, and wrinkles for physical products, or mapping it perfectly for 3D renders.
      - **View/Model:** ${viewOrModelDescription}
      - **Background:** ${backgroundDescription}
      - **Style:** The final output must be a high-quality, professional product photograph or render. ${variationPrompt}
      - **IMPORTANT:** Only return the final image or animation. Do not include any text, explanations, or any other content in your response. Just the image/animation.
    `;
    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: { parts: parts },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        const mimeType = part.inlineData.mimeType;
        return `data:${mimeType};base64,${base64ImageBytes}`;
      }
    }

    return null;

  } catch (error) {
    console.error("Error generating mockup with Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`AI generation failed: ${error.message}`);
    }
    throw new Error("An unexpected error occurred during AI image generation.");
  }
};