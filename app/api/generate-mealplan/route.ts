import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai"

const openAI = new OpenAI({
  apiKey: process.env.OPEN_ROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1"
})


interface WeeklyMealPlan {
  days: DayPlan[];
}

interface DayPlan {
  day: string; // e.g. "Monday", "Tuesday", etc.
  meals: Meals;
  totalCalories: number;
}

interface Meals {
  breakfast: string;
  lunch: string;
  dinner: string;
  snacks: string | null; // description or null if none
}


export async function POST(request: NextRequest){

  try {
    const {dietType, caloriesGoal, allergies, mealPreferences, snacks, days} = await request.json()

    const prompt = `
      You are a helpful assistant that generates personalized meal plans.

      Based on the following user input:
      - Diet type: ${dietType}
      - Daily calorie goal: ${caloriesGoal}
      - Allergies: ${allergies || "none"}
      - Meal preferences: ${mealPreferences || "none"}
      - Snacks included: ${snacks ? "yes" : "no"}
      - Number of days: ${days}

      Please create a meal plan for the given number of days. 

      Use simple ingedients and provide brief instructions. Include approximate calories count for each meal

      Return the meal plan as a JSON object with the following format:

      {
        "days": [
          {
            "day": "Monday",
            "meals": {
              "breakfast": "description of breakfast",
              "lunch": "description of lunch",
              "dinner": "description of dinner",
              "snacks": "description of snacks or null if none"
            },
            "totalCalories": number
          },
          {
            "day": "Tuesday",
            "meals": {
              "breakfast": "...",
              "lunch": "...",
              "dinner": "...",
              "snacks": "..."
            },
            "totalCalories": number
          }
          // Repeat for all days
        ]
      }

      Make sure the JSON is properly formatted and does not include any extra text and backticks outside the JSON object.

      Provide a balanced meal plan that respects the calorie goal, diet type, allergies, and preferences.
      `;

      const response = await openAI.chat.completions.create({
        model: "meta-llama/llama-3.3-70b-instruct:free",
        messages: [
          {
            role: "user",
            content: prompt
          },
        ],
        temperature: 0.7,
        max_completion_tokens: 1500
      })

      const aiContent = response.choices[0].message.content?.trim();

        if (!aiContent) {
        return NextResponse.json({ message: "No content from AI" }, { status: 500 });
       }

      let parsedMealPlan : WeeklyMealPlan

      try {
        parsedMealPlan = JSON.parse(aiContent)
      }
      catch(error){
        return NextResponse.json({message: error}, {status: 500})
      }

    if (typeof parsedMealPlan !== "object" || parsedMealPlan === null){
      return NextResponse.json(
        {error: "Failed to parse meal plan"}, {status: 500}
      )
    }
      return NextResponse.json({mealplan: parsedMealPlan})
  } catch (error){
    return NextResponse.json({error: error}, {status: 500})
  }

}
