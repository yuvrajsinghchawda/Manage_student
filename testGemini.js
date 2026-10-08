require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

async function test() {
  try {
    console.log("1. Testing Gemini...");

    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: "Say hello in one sentence."
    });

    console.log("2. Gemini response received:");
    console.log(result.text);

  } catch (error) {
    console.error("3. Gemini error:");
    console.error(error);
  }
}

test();