import React, { useEffect, useState, useRef } from "react";

import { useFood } from "../FoodProvider";
import debounce from "lodash.debounce";
import axios from "axios";
import { foodApi } from "../../services/api";

interface UnifiedSearchResult {
  id: number;
  name: string;
  type: "ingredient" | "recipe";
  baseAmount?: number;
  baseUnit?: string;
  servings?: number;
  nutrition?: any; // Adjust this type based on your API response
}

export const SearchFood = () => {
  //the state variables, these states are concerned with the food being searched and then added
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState("g");
  const [isFocused1, setIsFocused1] = useState(false);
  const [isFocused2, setIsFocused2] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mealType, setMealType] = useState<
    "breakfast" | "lunch" | "dinner" | "snacks"
  >("breakfast");
  const [unitOpen, setUnitOpen] = useState(false);
  const [mealTypeOpen, setMealTypeOpen] = useState(false);
  const [unitItems, setUnitItems] = useState([
    { label: "g", value: "g" },
    { label: "oz", value: "oz" },
    { label: "ml", value: "ml" },
    { label: "serving", value: "serving" },
  ]);
  const [mealTypeItems, setMealTypeItems] = useState([
    { label: "Breakfast", value: "breakfast" },
    { label: "Lunch", value: "lunch" },
    { label: "Dinner", value: "dinner" },
    { label: "Snacks", value: "snacks" },
  ]);

  //: state variables for handling data regarding the food that is written in the search bar
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UnifiedSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFood, setSelectedFood] = useState<
    (UnifiedSearchResult & { servingSizeGrams?: number }) | null
  >(null);

  const [showSuccess, setShowSuccess] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // these states are for later use, not important right now
  // const [submittedFoods, setSubmittedFoods] = useState([]);
  // const [showFoodList, setShowFoodList] = useState(false);
  const { addFood } = useFood();
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const convertToServings = (
    amount: number,
    unit: string,
    servingSizeGrams: number
  ): number => {
    const conversions: { [key: string]: number } = {
      g: 1,
      oz: 28.3495,
      ml: 1,
    };
    if (unit === "serving") return amount;
    if (!conversions[unit]) return 1;

    const grams = amount * conversions[unit];
    return grams / servingSizeGrams;
  };

  // function for searching for food, will be called when the user types in the search bar
  // this function will be debounced to avoid making too many requests to the API
  const debouncedSearch = debounce(async (query) => {
    if (query.length > 2) {
      try {
        const [ingredientsResponse, recipesResponse] = await Promise.all([
          foodApi.searchIngredients({
            query,
            limit: 1,
            sort: "calories",
            sortDirection: "desc",
          }),
          foodApi.searchRecipes({
            query,
            limit: 1,
            sort: "calories",
            sortDirection: "desc",
          }),
        ]);
        const ingredientResults = ingredientsResponse.map((item) => ({
          id: item.id,
          name: item.name,
          type: "ingredient",
          baseAmount: 100,
          baseUnit: "g",
        }));

        const recipeResults = recipesResponse.map((item) => ({
          id: item.id,
          name: item.title,
          type: "recipe",
          servings: item.servings,
          nutrition: item.nutrition,
        }));

        setSearchResults([...ingredientResults, ...recipeResults]);
        console.log("Search results:", [
          ...ingredientResults,
          ...recipeResults,
        ]);
      } catch (error) {
        console.error("Error fetching data from spoonacular API", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, 500);

  //
  // function to handle search input
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setShowResults(true);
    if (!query) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    debouncedSearch(query);
  };

  // function to handle food selection
  const handleFoodSelect = async (food: UnifiedSearchResult) => {
    setSelectedFood(food);
    setSearchQuery(food.name);
    setSearchResults([]);

    if (food.type === "recipe") {
      try {
        const recipeInfo = await foodApi.getRecipeInformation(food.id);
        setSelectedFood({
          ...food,
          servingSizeGrams: recipeInfo.servingSizeGrams,
        });
      } catch (error) {
        setSelectedFood(food);
      }
    } else {
      setSelectedFood(food);
    }
    setUnit(food.type === "recipe" ? "serving" : "g");
    console.log("Selected food:", food);
  };

  const parseNutritionValue = (value: string) => {
    parseFloat(value.replace(/[^\d.]/g, ""));
  };

  // function to handle form submission
  // this function will be called when the user clicks the submit button
  // this needs to be changed to account for the nutrition data being fetched from the API
  const handleSubmit = async () => {
    if (!selectedFood || !amount) return;

    try {
      let nutrition;
      // Get final nutrition for actual amount
      if (selectedFood.type === "ingredient") {
        nutrition = await foodApi.getNutrition(
          selectedFood.id,
          parseFloat(amount),
          unit
        );
      } else {
        const servings = convertToServings(
          parseFloat(amount),
          unit,
          selectedFood.servingSizeGrams || 100
        );
        const baseNutrition = await foodApi.getRecipeNutrition(selectedFood.id);
        nutrition = {
          calories: baseNutrition.calories * servings,
          protein: baseNutrition.protein * servings,
          carbs: baseNutrition.carbs * servings,
          fat: baseNutrition.fat * servings,
          amount: parseFloat(amount),
          unit,
        };
      }

      await addFood({
        name: selectedFood.name,
        amount:
          nutrition.unit === "serving"
            ? `${nutrition.amount} ${
                nutrition.amount === 1 ? "serving" : "servings"
              }`
            : `${nutrition.amount} ${nutrition.unit}`,
        mealType,
        protein: Number(nutrition.protein),
        calories: Number(nutrition.calories),
        carbs: Number(nutrition.carbs),
        fat: Number(nutrition.fat),
        createdAt: new Date(),
      });

      setSearchQuery("");
      setAmount("");
      setUnit("g");
      setMealType("breakfast");
      setSelectedFood(null);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000); // Hide success message after 2 seconds

      localStorage.removeItem("inputs"); // Clear saved data

      // Reset form...
    } catch (error) {
      alert("Error: Failed to save food entry");
    }
  };

  useEffect(() => {
    if (selectedFood?.type === "recipe") {
      setUnitItems([
        { label: "g", value: "g" },
        { label: "oz", value: "oz" },
        { label: "ml", value: "ml" },
        { label: "serving", value: "serving" },
      ]);
    } else {
      setUnitItems([
        { label: "g", value: "g" },
        { label: "oz", value: "oz" },
        { label: "ml", value: "ml" },
      ]);
    }
  }, [selectedFood?.type]);

  // useEffect to load data from async storage
  useEffect(() => {
    const loadData = async () => {
      // Load data here
      try {
        const savedData = localStorage.getItem("data");
        if (savedData !== null) {
          const { savedfoodName, savedAmount, savedMealType } =
            JSON.parse(savedData);
          setSearchQuery(savedfoodName);
          setAmount(savedAmount);
          setMealType(savedMealType || "breakfast");
        }
      } catch (e) {
        console.error("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // useEffect to save data to async storage
  useEffect(() => {
    if (!isLoading) {
      const saveData = async () => {
        try {
          const dataToSave = JSON.stringify({
            searchQuery,
            amount,
            mealType,
            unit,
            foodType: selectedFood?.type,
          });
          localStorage.setItem("inputs", dataToSave);
        } catch (e) {
          console.error("Failed to save data");
        }
      };
      saveData();
    }
  }, [searchQuery, amount, mealType, isLoading, unit, selectedFood?.type]);

  if (isLoading) {
    return (
      <div style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <span>Loading...</span>
      </div>
    );
  }
  // function to close all dropdowns and dismiss keyboard
  const closeAllDropdowns = () => {
    setUnitOpen(false);
    setMealTypeOpen(false);
    setShowResults(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

  // return the form to add food
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gray-50">
      <div className="w-full max-w-md">
        <div
          className="bg-white rounded-xl shadow-lg overflow-hidden"
          ref={formRef}
        >
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
              Add Food
            </h2>

            <form className="space-y-5" onSubmit={handleFormSubmit}>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Search Food
                </label>
                <input
                  className={`w-full h-12 px-4 rounded-lg ${
                    isFocused1
                      ? "border-indigo-500 ring-1 ring-indigo-200"
                      : "border-gray-300"
                  } text-base text-gray-900 focus:outline-none transition-colors`}
                  placeholder="Search for food..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => {
                    setIsFocused1(true);
                    closeAllDropdowns();
                    setShowResults(true); // show results on focus
                  }}
                  onBlur={(e) => {
                    if (
                      !e.relatedTarget ||
                      !e.relatedTarget.closest(".search-results")
                    ) {
                      setIsFocused1(false);
                    }
                  }}
                />
              </div>

              {showResults && searchResults.length > 0 && (
                <ul className="border rounded-lg mt-1 bg-white max-h-40 overflow-y-auto shadow">
                  {searchResults.map((item) => (
                    <li
                      key={item.id}
                      className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleFoodSelect(item)}
                    >
                      <div className="text-gray-800 font-medium">
                        {item.name}
                      </div>
                      <div className="text-gray-500 text-sm mt-1">
                        {item.type === "ingredient" ? "Ingredient" : "Recipe"}
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    placeholder="Enter amount (e.g., 100)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    onFocus={() => {
                      setIsFocused2(true);
                      closeAllDropdowns();
                    }}
                    onBlur={() => setIsFocused2(false)}
                    type="number"
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Units
                  </label>

                  <select
                    className="w-full h-12 px-4 rounded-lg border border-gray-300 text-base text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 focus:outline-none"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                  >
                    {unitItems.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Meal Type Dropdown */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Meal Type
                </label>
                <select
                  className="w-full h-12 px-4 rounded-lg border border-gray-300 text-base text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 focus:outline-none"
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value as any)}
                >
                  {mealTypeItems.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-6">
                <button
                  className={`w-full h-12 rounded-lg flex items-center justify-center ${
                    selectedFood && amount
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : "bg-gray-300 cursor-not-allowed"
                  } text-white font-medium transition-colors`}
                  type="submit"
                  disabled={!selectedFood || !amount}
                >
                  <div className="text-white text-base font-semibold">
                    Submit
                  </div>
                </button>

                {showSuccess && (
                  <div className="mt-4 p-3 bg-green-100 border border-green-200 rounded-lg text-center">
                    <div>
                      Food added successfully!{" "}
                      <span className="text-green-600">✓</span>
                    </div>
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
