import React, { useEffect, useState } from "react";
import { useFood } from "../FoodProvider"; // Adjust the import based on your file structure

export const NutritionGoals = () => {
  const { foods } = useFood();
  const [proteinGoal, setProteinGoal] = useState(150);
  const [calorieGoal, setCalorieGoal] = useState(2000);
  const [editing, setEditing] = useState(false);

  // Load saved goals on component mount
  useEffect(() => {
    try {
      const savedProtein = localStorage.getItem("proteinGoal");
      const savedCalories = localStorage.getItem("calorieGoal");

      if (savedProtein) setProteinGoal(Number(savedProtein));
      if (savedCalories) setCalorieGoal(Number(savedCalories));
    } catch (error) {
      console.error("Error loading goals:", error);
    }
  }, []);

  // Save goals whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("proteinGoal", proteinGoal.toString());
      localStorage.setItem("calorieGoal", calorieGoal.toString());
    } catch (error) {
      console.error("Error saving goals:", error);
    }
  }, [proteinGoal, calorieGoal]);

  const truncateToTwoDecimals = (num: number) => {
    return Math.trunc(num * 100) / 100;
  };

  const totalProtein = truncateToTwoDecimals(
    foods.reduce((total, item) => total + item.protein, 0)
  );
  const totalCalories = truncateToTwoDecimals(
    foods.reduce((total, item) => total + item.calories, 0)
  );

  const proteinProgress = Math.min((totalProtein / proteinGoal) * 100, 100);
  const calorieProgress = Math.min((totalCalories / calorieGoal) * 100, 100);

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm mb-4">
      <div className="text-2xl font-bold mb-5 text-gray-800">
        Nutrition Goals
      </div>

      <div className="mb-5">
        <div className="mb-4">
          <div className="text-lg mb-2.5 text-gray-700">
            Protein: {totalProtein}g / {proteinGoal}g
          </div>
          {editing && (
            <input
              className="border-b-2 border-teal-400 w-20 text-center"
              type="number"
              value={proteinGoal}
              onChange={(e) => setProteinGoal(Number(e.target.value) || 0)}
            />
          )}
          <div className="h-5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-400 rounded-full transition-all duration-300"
              style={{ width: `${proteinProgress}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="text-lg mb-2.5 text-gray-700">
            Calories: {totalCalories} cal / {calorieGoal} cal
          </div>
          {editing && (
            <input
              className="border-b-2 border-orange-400 w-20 text-center"
              type="number"
              value={calorieGoal}
              onChange={(e) => setCalorieGoal(Number(e.target.value) || 0)}
            />
          )}
          <div className="h-5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-400 rounded-full transition-all duration-300"
              style={{ width: `${calorieProgress}%` }}
            ></div>
          </div>
        </div>
      </div>
      <div>
        <button
          className="text-teal-600 text-center font-bold w-full py-2 hover:underline"
          onClick={() => setEditing(!editing)}
        >
          {editing ? "Save Goals" : "Edit Goals"}
        </button>
      </div>
    </div>
  );
};
