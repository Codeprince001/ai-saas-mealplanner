import React, {JSX} from "react";
import { FiCalendar, FiCoffee, FiSun, FiMoon, FiHeart } from "react-icons/fi";

interface WeeklyMealPlanProps {
  mealplan: {
    days: {
      day: string;
      meals: {
        breakfast: string;
        lunch: string;
        dinner: string;
        snacks: string | null;
      };
      totalCalories: number;
    }[];
  };
}

const extractCalories = (mealDesc: string | null) => {
  if (!mealDesc) return 0;
  const match = mealDesc.match(/\((\d+)\s*calories?\)/i);
  return match ? parseInt(match[1], 10) : 0;
};

const mealIcons: Record<string, JSX.Element> = {
  breakfast: <FiCoffee className="inline mr-2 text-yellow-500" />,
  lunch: <FiSun className="inline mr-2 text-orange-400" />,
  dinner: <FiMoon className="inline mr-2 text-purple-600" />,
  snacks: <FiHeart className="inline mr-2 text-pink-500" />,
};

const WeeklyMealPlanDisplay: React.FC<WeeklyMealPlanProps> = ({ mealplan }) => {
  const days = mealplan.days;

  // Calculate weekly total and average calories
  const weeklyTotalCalories = days.reduce((sum, day) => sum + day.totalCalories, 0);
  const averageCalories = Math.round(weeklyTotalCalories / days.length);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <FiCalendar className="text-blue-600" /> Weekly Summary
      </h3>
      <p className="mb-6 text-gray-700 flex items-center gap-3">
        <span>
          🔥 Total Calories: <strong>{weeklyTotalCalories}</strong> kcal
        </span>{" "}
        |{" "}
        <span>
          🔥 Average per day: <strong>{averageCalories}</strong> kcal
        </span>
      </p>

      {days.map(({ day, meals, totalCalories }) => (
        <div key={day} className="mb-8 p-6 border rounded-lg shadow-sm bg-white">
          <h4 className="text-xl font-bold mb-3 flex items-center gap-2">
            <FiCalendar className="text-blue-600" /> {day}
          </h4>

          <ul className="space-y-2 text-gray-800">
            {["breakfast", "lunch", "dinner", "snacks"].map((mealType) => {
              const mealText = meals[mealType as keyof typeof meals];
              if (!mealText) return null;

              const calories = extractCalories(mealText);
              return (
                <li key={mealType} className="flex justify-between items-center">
                  <span className="capitalize font-medium flex items-center">
                    {mealIcons[mealType]} {mealType}:
                  </span>
                  <span className="flex-1 mx-2">{mealText.replace(/\(\d+\s*calories?\)/i, "").trim()}</span>
                  <span className="font-semibold text-blue-600 flex items-center gap-1">
                    <span>🔥</span> {calories} kcal
                  </span>
                </li>
              );
            })}
          </ul>

          <p className="mt-4 font-semibold text-gray-900 flex items-center gap-2">
            <span>🔥</span> Total Calories: {totalCalories} kcal
          </p>
        </div>
      ))}
    </div>
  );
};

export default WeeklyMealPlanDisplay;
