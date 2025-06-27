import React from "react";
import { useFood } from "../FoodProvider";
import MealList from "../components/MealList";

export default function LogScreen() {
  const { foods, loading } = useFood();

  if (loading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 overflow-y-auto px-4 pb-32">
        {/* Meal Sections */}
        <div className="border-b border-gray-300 py-4">
          <h2 className="text-lg font-bold mb-2">Breakfast</h2>
          <MealList
            mealType="breakfast"
            foodsForMealType={foods.filter(
              (food) => food.mealType === "breakfast"
            )}
          />
        </div>

        <div className="border-b border-gray-300 py-4">
          <h2 className="text-lg font-bold mb-2">Lunch</h2>
          <MealList
            mealType="lunch"
            foodsForMealType={foods.filter((food) => food.mealType === "lunch")}
          />
        </div>

        <div className="border-b border-gray-300 py-4">
          <h2 className="text-lg font-bold mb-2">Dinner</h2>
          <MealList
            mealType="dinner"
            foodsForMealType={foods.filter(
              (food) => food.mealType === "dinner"
            )}
          />
        </div>

        <div className="border-b border-gray-300 py-4">
          <h2 className="text-lg font-bold mb-2">Snacks</h2>
          <MealList
            mealType="snacks"
            foodsForMealType={foods.filter(
              (food) => food.mealType === "snacks"
            )}
          />
        </div>
      </div>
    </div>
  );
}
