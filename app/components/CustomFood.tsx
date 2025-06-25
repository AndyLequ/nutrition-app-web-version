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
    <div style={{ flex: 1, backgroundColor: "white" }}>
      <div className="flex-1 bg-gray-100 justify-center p-5">
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h1 className="text-xl font-semibold text-gray-800 mb-6 text-center">
            Add Food
          </h1>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* food name input */}
            <div>
              <label className="text-sm text-gray-600 mb-2">Enter Food</label>
              <input
                type="text"
                className={`h-12 border rounded-lg px-4 text-base text-gray-900 ${
                  isFocused1 ? "border-indigo-500" : "border-gray-300"
                }`}
                placeholder="Enter food..."
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                onFocus={() => {
                  setIsFocused1(true);
                  closeAllDropdowns();
                }}
                onBlur={() => setIsFocused1(false)}
              />
            </div>

            {/* amount input */}
            <div>
              <label className="text-sm text-gray-600 mb-2">Amount</label>
              <input
                className={`h-12 border rounded-lg px-4 text-base text-gray-900 ${
                  isFocused2 ? "border-indigo-500" : "border-gray-300"
                }`}
                placeholder="Enter amount (e.g., 100g)"
                type="text"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                onFocus={() => {
                  setIsFocused2(true);
                  closeAllDropdowns();
                }}
                onBlur={() => setIsFocused2(false)}
              />
            </div>

            {/* protein input */}
            <div className="text-sm text-gray-600 mb-2">
              <label className="text-sm text-gray-600 mb-2">Protein</label>
              <input
                className={`h-12 border rounded-lg px-4 text-base text-gray-900 ${
                  isFocused3 ? "border-indigo-500" : "border-gray-300"
                }`}
                placeholder="Enter protein in grams"
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

            {/* calorie input */}
            <div className="text-sm text-gray-600 mb-2">
              <label className="text-sm text-gray-600 mb-2">Calories</label>
              <input
                className={`h-12 border rounded-lg px-4 text-base text-gray-900 ${
                  isFocused4 ? "border-indigo-500" : "border-gray-300"
                }`}
                type="number"
                min="0"
                placeholder="Enter calories"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                onFocus={() => {
                  setIsFocused4(true);
                  closeAllDropdowns();
                }}
                onBlur={() => setIsFocused4(false)}
              />
            </div>

            <div className="text-sm text-gray-600 mb-2">
              <label className="text-sm text-gray-600 mb-2">Units</label>

              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className={`h-12 border rounded-lg px-4 text-base text-gray-900 ${
                  unitOpen ? "border-indigo-500" : "border-gray-300"
                }`}
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

            {/* Meal Type Dropdown */}
            <div className="text-sm text-gray-600 mb-2">
              <label className="text-sm text-gray-600 mb-2">Meal Type</label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                className={`h-12 border rounded-lg px-4 text-base text-gray-900 ${
                  mealTypeOpen ? "border-indigo-500" : "border-gray-300"
                }`}
                onFocus={() => {
                  setMealTypeOpen(true);
                  closeAllDropdowns();
                }}
                style={{
                  borderColor: "#cbd5e1",
                  borderRadius: 8,
                }}
              >
                {mealTypeItems.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              <button
                className="h-12 bg-indigo-500 rounded-lg justify-center items-center"
                type="submit"
              >
                Submit
              </button>

              {showSuccess && (
                <div className="mt-2 p-2 bg-green-100 rounded-md">
                  <label className="text-green-700">
                    Food added successfully!{" "}
                    <label className="text-green-500">✓</label>
                  </label>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
