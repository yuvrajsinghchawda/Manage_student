const express = require("express");
const router = express.Router();

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

router.post("/analyze", async (req, res) => {
  try {
    const student = req.body;

    const prompt = `
You are an AI Academic and Career Planner for a college student.

Analyze the student's information carefully.

STUDENT DATA:
${JSON.stringify(student, null, 2)}

IMPORTANT:
- Give practical and realistic recommendations.
- Use the student's actual subjects and marks.
- Do not invent subjects or marks.
- Respect the student's college time, sleep time and available daily study time.
- Create a realistic fixed daily routine.
- The total study time in the routine should approximately match the student's dailyTime.
- Do not put study tasks during college hours or sleep hours.
- Prioritize weak subjects and pending work.
- Consider the student's career goal.
- Keep recommendations beginner-friendly and actionable.

Return ONLY valid JSON in exactly this structure:

{
  "overallProgress": 0,
  "summary": "short overall analysis",

  "strengths": [
    "strength 1",
    "strength 2"
  ],

  "weakAreas": [
    "weak area 1",
    "weak area 2"
  ],

  "skillGaps": [
    "skill gap 1",
    "skill gap 2"
  ],

  "improvements": [
    "improvement 1",
    "improvement 2",
    "improvement 3"
  ],

  "priorityTasks": [
    {
      "task": "task name",
      "reason": "why this should be done",
      "priority": "High"
    },
    {
      "task": "task name",
      "reason": "why this should be done",
      "priority": "Medium"
    }
  ],

  "routine": [
    {
      "time": "6:30 AM - 7:30 AM",
      "activity": "DSA Practice",
      "type": "DSA"
    }
  ],

  "dailyGoals": [
    "goal 1",
    "goal 2",
    "goal 3"
  ],

  "careerAdvice": "short career advice"
}

For overallProgress:
- Calculate an approximate percentage based mainly on academic performance, completed skills/projects and career readiness.
- Return only a number between 0 and 100.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt
    });

    let text = response.text;

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const analysis = JSON.parse(text);

    res.json({
      success: true,
      analysis
    });

  } catch (error) {
    console.error("Gemini Error:", error);

    res.status(500).json({
      success: false,
      message: "AI analysis failed",
      error: error.message
    });
  }
});

module.exports = router;