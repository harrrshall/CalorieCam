import { NextResponse } from 'next/server';
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error('GEMINI_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    temperature: 0.7,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
  },
});

function parseBase64Image(base64String: string) {
  const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid base64 string');
  }
  return {
    type: matches[1],
    data: matches[2],
  };
}

export async function POST(req: Request) {
  try {
    console.log('Received POST request to /api/chat');
    const body = await req.json();
    const { image } = body;

    if (!image) {
      console.error('No image provided in request body');
      return NextResponse.json({ error: 'Image is required' }, { status: 400 });
    }

    console.log('Image received, preparing to send to Gemini');

    const { data: imageData, type: mimeType } = parseBase64Image(image);

    const prompt = "You are an expert nutritionist and food scientist. You have been given an image of food, and your task is to analyze it to determine its nutritional content. Please provide the following information in JSON format:\n\n- Total calories in the food.\n- Amounts of carbohydrates, protein, fat, and fiber (in grams).\n- List of vitamins present.\n\nOnly reply with the following JSON structure:\n\n{\n  \"calories\": number,\n  \"carbohydrates\": number,\n  \"protein\": number,\n  \"fat\": number,\n  \"fiber\": number,\n  \"vitamins\": [ \"A\", \"C\", ... ]\n}\n\nHere is the image: ";

    console.log('Sending request to Gemini model');
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType,
          data: imageData,
        },
      },
    ]);

    const response = result.response;
    const responseText = response.text();
    console.log('Received response from Gemini:', responseText);

    // Parse the JSON response
    const nutritionInfo = JSON.parse(responseText);

    return NextResponse.json(nutritionInfo);
  } catch (error) {
    console.error('Error in chat route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}