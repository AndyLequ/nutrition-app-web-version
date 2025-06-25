import React, { useEffect, useState } from "react";

import { useFood } from "../FoodProvider";
import debounce from "lodash.debounce";
import axios from "axios";
import { foodApi } from "../../services/api";

import { FoodItem } from "../FoodProvider";

export const CustomFood = () => {
  const [customFood, setCustomFood] = useState<
    {
      name: string;
      amount: string;
      unit: string;
      protein: number;
      calories: number;
      mealType: "breakfast" | "lunch" | "dinner" | "snacks";
    }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [protein, setProtein] = useState("");
  const [calories, setCalories] = useState("");
  const [isFocused1, setIsFocused1] = useState(false);
  const [isFocused2, setIsFocused2] = useState(false);
  const [isFocused3, setIsFocused3] = useState(false);
  const [isFocused4, setIsFocused4] = useState(false);
  const [foodName, setFoodName] = useState("");
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState("g");
  const [unitItems, setUnitItems] = useState([
    { label: "g", value: "g" },
    { label: "oz", value: "oz" },
    { label: "ml", value: "ml" },
  ]);
  const [unitOpen, setUnitOpen] = useState(false);
  const [mealType, setMealType] = useState<
    "breakfast" | "lunch" | "dinner" | "snacks"
  >("breakfast");
  const [mealTypeOpen, setMealTypeOpen] = useState(false);
  const [mealTypeItems, setMealTypeItems] = useState([
    { label: "Breakfast", value: "breakfast" },
    { label: "Lunch", value: "lunch" },
    { label: "Dinner", value: "dinner" },
    { label: "Snacks", value: "snacks" },
  ]);

  const [showSuccess, setShowSuccess] = useState(false);

  const { addFood } = useFood();

  const closeAllDropdowns = () => {
    setUnitOpen(false);
    setMealTypeOpen(false);
  };

  // function to handle custom food submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!foodName || !amount || !protein || !calories) {
      alert("Please fill in all fields");
      return;
    }

    const proteinValue = parseFloat(protein);
    const caloriesValue = parseFloat(calories);

    if (isNaN(proteinValue) || isNaN(caloriesValue)) {
      alert("Please enter valid numbers for protein and calories");
      return;
    }
    try {
      const newFood: FoodItem = {
        id: Date.now().toString(),
        name: foodName,
        amount: amount,
        mealType: mealType,
        protein: proteinValue,
        calories: caloriesValue,
        carbs: 0,
        fat: 0,
        createdAt: new Date(),
      };

      addFood(newFood);
    } catch (error) {
      console.error("Error adding food:", error);
      alert("Error adding food. Please try again.");
    } finally {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000); // Hide success message after 2 seconds
      setFoodName("");
      setAmount("");
      setProtein("");
      setCalories("");
      setUnit("g");
      setMealType("breakfast");
      closeAllDropdowns();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <h1 className="text-xl font-semibold text-gray-800 mb-6 text-center">
              Add Custom Food
            </h1>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Food Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Food Name
                </label>
                <input
                  className={`w-full h-12 px-4 rounded-lg border ${
                    isFocused1
                      ? "border-indigo-500 ring-1 ring-indigo-200"
                      : "border-gray-300"
                  } text-base text-gray-900 focus:outline-none transition-colors`}
                  placeholder="Enter food name..."
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  onFocus={() => {
                    setIsFocused1(true);
                    closeAllDropdowns();
                  }}
                  onBlur={() => setIsFocused1(false)}
                />
              </div>

              {/* Amount and Units - Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Amount */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Amount
                  </label>
                  <input
                    className={`w-full h-12 px-4 rounded-lg border ${
                      isFocused2
                        ? "border-indigo-500 ring-1 ring-indigo-200"
                        : "border-gray-300"
                    } text-base text-gray-900 focus:outline-none transition-colors`}
                    placeholder="e.g., 100"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    onFocus={() => {
                      setIsFocused2(true);
                      closeAllDropdowns();
                    }}
                    onBlur={() => setIsFocused2(false)}
                    type="text"
                  />
                </div>

                {/* Units */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Units
                  </label>
                  <select
                    className="w-full h-12 px-4 rounded-lg border border-gray-300 text-base text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 focus:outline-none"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    onFocus={() => {
                      setUnitOpen(true);
                      closeAllDropdowns();
                    }}
                    onBlur={() => setUnitOpen(false)}
                  >
                    {unitItems.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Protein and Calories - Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Protein */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Protein (g)
                  </label>
                  <input
                    className={`w-full h-12 px-4 rounded-lg border ${
                      isFocused3
                        ? "border-indigo-500 ring-1 ring-indigo-200"
                        : "border-gray-300"
                    } text-base text-gray-900 focus:outline-none transition-colors`}
                    placeholder="Protein in grams"
                    type="number"
                    min="0"
                    value={protein}
                    onChange={(e) => setProtein(e.target.value)}
                    onFocus={() => {
                      setIsFocused3(true);
                      closeAllDropdowns();
                    }}
                    onBlur={() => setIsFocused3(false)}
                  />
                </div>

                {/* Calories */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Calories
                  </label>
                  <input
                    className={`w-full h-12 px-4 rounded-lg border ${
                      isFocused4
                        ? "border-indigo-500 ring-1 ring-indigo-200"
                        : "border-gray-300"
                    } text-base text-gray-900 focus:outline-none transition-colors`}
                    type="number"
                    min="0"
                    placeholder="Calories"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    onFocus={() => {
                      setIsFocused4(true);
                      closeAllDropdowns();
                    }}
                    onBlur={() => setIsFocused4(false)}
                  />
                </div>
              </div>

              {/* Meal Type */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Meal Type
                </label>
                <select
                  className="w-full h-12 px-4 rounded-lg border border-gray-300 text-base text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 focus:outline-none"
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value as any)}
                  onFocus={() => {
                    setUnitOpen(true);
                    closeAllDropdowns();
                  }}
                  onBlur={() => setUnitOpen(false)}
                >
                  {mealTypeItems.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <div className="mt-6">
                <button
                  className={`w-full h-12 rounded-lg flex items-center justify-center ${
                    foodName && amount && protein && calories
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : "bg-gray-300 cursor-not-allowed"
                  } text-white font-medium transition-colors`}
                  type="submit"
                  disabled={!foodName || !amount || !protein || !calories}
                >
                  Add Custom Food
                </button>

                {showSuccess && (
                  <div className="mt-4 p-3 bg-green-100 border border-green-200 rounded-lg text-center">
                    Food added successfully!{" "}
                    <span className="text-green-600">✓</span>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
