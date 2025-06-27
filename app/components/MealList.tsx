import React from "react";
import { FoodItem } from "../FoodProvider"; // Adjust the import based on your file structure

interface MealListProps {
  mealType: string;
  foodsForMealType: FoodItem[];
}

const MealList: React.FC<MealListProps> = ({ mealType, foodsForMealType }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      {foodsForMealType.length > 0 ? (
        foodsForMealType.map((item) => (
          <div key={item.id} className="border-b border-gray-300 py-2">
            <div className="text-lg font-semibold text-gray-800">
              {item.name}
            </div>
            <div className="text-gray-600">{item.amount}</div>
            <div className="text-gray-600">Protein: {item.protein}g</div>
            <div className="text-gray-600">Calories: {item.calories} cal</div>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500 mt-4">No items found</div>
      )}
    </div>
  );
};

export default MealList;
