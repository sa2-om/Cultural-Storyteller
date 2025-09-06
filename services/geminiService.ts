import { GoogleGenAI, Type } from "@google/genai";
import type { StoryResult } from '../types';

// Ensure the API_KEY is available in the environment variables.
if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateStoryContent(
  prompt: string,
  category: string,
): Promise<StoryResult> {
  try {
    const storyPrompt = `You are a masterful cultural storyteller. Generate a story in the category of '${category}'. The user wants a story about: '${prompt}'.
    Your response must be a JSON object containing a title, the story itself, and a moral for the story.
    Keep the story well-structured, culturally respectful, and captivating.`;

    const textPromise = ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: storyPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING, description: "The title of the story." },
                story: { type: Type.STRING, description: "The full text of the story." },
                moral: { type: Type.STRING, description: "A short moral or lesson from the story." },
            },
            required: ["title", "story", "moral"],
        },
      },
    });

    const imagePrompt = `Create a vibrant and evocative image representing a scene from a '${category}' story. The scene should depict: '${prompt}'. The style should be artistic and fitting for a cultural tale.`;
    
    const imagePromise = ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: imagePrompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '16:9',
      },
    });

    const [textResponse, imageResponse] = await Promise.all([textPromise, imagePromise]);

    const storyData = JSON.parse(textResponse.text);
    const title = storyData.title;
    const text = storyData.story;
    const moral = storyData.moral;
    
    if (!imageResponse.generatedImages || imageResponse.generatedImages.length === 0) {
      throw new Error('Image generation failed to produce an image.');
    }
    const base64ImageBytes = imageResponse.generatedImages[0].image.imageBytes;
    const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;

    return { title, text, moral, imageUrl };

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate story: ${error.message}`);
    }
    throw new Error('An unexpected error occurred while generating the story.');
  }
}
