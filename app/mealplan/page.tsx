'use client'
import ErrorDisplay from "@/components/error-display";
import Spinner from "@/components/spinner";
import WeeklyMealPlanDisplay from "@/components/WeeklyMealPlanDisplay"
import { useMutation } from "@tanstack/react-query";
import React from "react";

interface MealPlanInput {
  dietType: string;
  caloriesGoal: number;
  allergies: string;
  mealPreferences: string;
  snacks: boolean;
  days: number;
}

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


interface MealPlanResponse {
  mealplan? : WeeklyMealPlan;
  error?: string;
}

const generateMealPlan = async (payload: MealPlanInput) => {
  const response = await fetch("/api/generate-mealplan", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })

  return response.json()
}

const MealPlanDashboard = () => {

  const {mutate, isPending, data, isSuccess, isError} = useMutation<MealPlanResponse, Error, MealPlanInput>({
    mutationFn: generateMealPlan
  })
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const payload: MealPlanInput = {
      dietType: formData.get("dietType") as string,
      caloriesGoal: Number(formData.get("caloriesGoal")) || 2000,
      allergies: (formData.get("allergies") as string) || "None",
      mealPreferences: formData.get("mealPreferences") as string,
      snacks: formData.get("snacks") === "on",
      days: 7,
    };

    mutate(payload)
  };

  if (data) {
    console.log(data)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-10">
        Meal Plan Dashboard
      </h1>

      {/* Two column layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_1.8fr] gap-10">
        {/* Left: AI Meal Plan Generator Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-lg border border-gray-200"
        >
          <h2 className="text-xl font-semibold mb-6 text-gray-900">
            AI Meal Plan Generator
          </h2>

          <div className="mb-6">
            <label
              htmlFor="dietType"
              className="block mb-2 text-sm font-semibold text-gray-700"
            >
              Diet Type
            </label>
            <input
              type="text"
              placeholder="e.g., Vegetarian, Vegan, Keto"
              id="dietType"
              name="dietType"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="caloriesGoal"
              className="block mb-2 text-sm font-semibold text-gray-700"
            >
              Daily Calories Goal
            </label>
            <input
              type="number"
              placeholder="e.g., 2000"
              min={500}
              max={5000}
              id="caloriesGoal"
              name="caloriesGoal"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="allergies"
              className="block mb-2 text-sm font-semibold text-gray-700"
            >
              Allergies
            </label>
            <input
              type="text"
              placeholder="e.g., Nuts, Dairy, None"
              id="allergies"
              name="allergies"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="mealPreferences"
              className="block mb-2 text-sm font-semibold text-gray-700"
            >
              Meal Preferences
            </label>
            <textarea
              placeholder="e.g., No red meat, Prefer gluten-free options"
              id="mealPreferences"
              name="mealPreferences"
              required
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
            />
          </div>

          <div className="flex items-center mb-8">
            <input
              type="checkbox"
              id="snacks"
              name="snacks"
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition"
            />
            <label
              htmlFor="snacks"
              className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer select-none"
            >
              Include Snacks
            </label>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            {
              isPending ? "Generating..." : "Generate Meal Plan"
            }
          </button>
        </form>

        {/* Right: Weekly Meal Plan */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Weekly Meal Plan
          </h2>
          {/* Replace below with actual meal plan content */}
            {
              data?.mealplan && isSuccess ? (
                <WeeklyMealPlanDisplay mealplan={data.mealplan}/>
              ) :  isPending ?
              (
                <Spinner/>
              ) : isError ? (
                <ErrorDisplay message="Failed to load meal plan. Please try again." />
              ) : <p>Generate Meal Plan</p>
            }
        </div>
      </div>
    </div>
  );
};

export default MealPlanDashboard;
