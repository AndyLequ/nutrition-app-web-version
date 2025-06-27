import React, { useState, useEffect } from "react";
import type { MealType } from "../../services/types";
import { foodApi } from "../../services/api";

interface Recipe {
  id: number;
  title: string;
  servings: number;
  nutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

const generateWeek = () => {
  const days = [];
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);

    days.push({
      date: currentDate.toISOString().split("T")[0],
      meals: {
        breakfast: { items: [], totalCalories: 0, totalProtein: 0 },
        lunch: { items: [], totalCalories: 0, totalProtein: 0 },
        dinner: { items: [], totalCalories: 0, totalProtein: 0 },
        snacks: { items: [], totalCalories: 0, totalProtein: 0 },
      },
    });
  }
  return days;
};

const initialMealData = generateWeek();

const MealPlanList = () => {
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<{
    [date: string]: MealType;
  }>({});
  const [mealPlans, setMealPlans] = useState(initialMealData);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [amount, setAmount] = useState("1");
  const displayPlans = mealPlans.length > 0 ? mealPlans : initialMealData;

  const STORAGE_KEY = "MealPlanList:mealPlans";

  useEffect(() => {
    try {
      const storedMealPlans = localStorage.getItem(STORAGE_KEY);
      if (storedMealPlans) {
        setMealPlans(JSON.parse(storedMealPlans));
      }
    } catch (error) {
      console.error("Failed to load meal plans from storage:", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mealPlans));
    } catch (error) {
      console.error("Failed to save meal plans to storage:", error);
    }
  }, [mealPlans]);

  // Recipe search handling
  useEffect(() => {
    const searchRecipes = async () => {
      if (searchQuery.length > 2) {
        setLoading(true);
        try {
          const response = await foodApi.searchRecipes({
            query: searchQuery,
            limit: 1,
          });
          setSearchResults(response);
        } catch (err) {
          setError("Failed to fetch recipes. Please try again.");
        } finally {
          setLoading(false);
        }
      }
    };
    const debounceTimer = setTimeout(searchRecipes, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Handle recipe select
  const handleRecipeSelect = async (recipe: Recipe) => {
    try {
      setError(null);
      const nutrition = await foodApi.getRecipeNutrition(recipe.id);
      setSelectedRecipe({
        ...recipe,
        nutrition: {
          calories: nutrition.calories,
          protein: nutrition.protein,
          carbs: nutrition.carbs,
          fat: nutrition.fat,
        },
      });
    } catch (error) {
      setError("Failed to fetch recipe nutrition. Please try again.");
    }
  };

  // Add recipe to meal plan
  const addRecipeToMealPlan = async () => {
    if (
      !selectedRecipe?.nutrition ||
      !selectedDay ||
      !selectedMealType[selectedDay]
    )
      return;
    try {
      const parsedAmount = parseFloat(amount) || 1;
      const newItem = {
        id: `recipe-${selectedRecipe.id}`,
        name: selectedRecipe.title,
        calories: selectedRecipe.nutrition.calories * parsedAmount,
        protein: selectedRecipe.nutrition.protein * parsedAmount,
      };

      setMealPlans((prev) =>
        prev.map((day) => {
          if (day.date === selectedDay) {
            const mealType = selectedMealType[selectedDay];
            return {
              ...day,
              meals: {
                ...day.meals,
                [mealType]: {
                  ...day.meals[mealType],
                  items: [...day.meals[mealType].items, newItem],
                  totalCalories:
                    day.meals[mealType].totalCalories + newItem.calories,
                  totalProtein:
                    day.meals[mealType].totalProtein + newItem.protein,
                },
              },
            };
          }
          return day;
        })
      );
      setSelectedRecipe(null);
      setSearchResults([]);
    } catch (error) {
      setError("Failed to add recipe to meal plan. Please try again.");
    }
  };

  const toggleDay = (date: string) => {
    setExpandedDay(expandedDay === date ? null : date);
    setSelectedDay(date);
  };

  const deleteMealItem = (day: string, mealType: MealType, mealId: string) => {
    setMealPlans((prev) =>
      prev.map((dayPlan) => {
        if (dayPlan.date === day) {
          const updatedItem = dayPlan.meals[mealType].items.filter(
            (item) => item.id !== mealId
          );
          const totalCalories = updatedItem.reduce(
            (sum, item) => sum + item.calories,
            0
          );
          const totalProtein = updatedItem.reduce(
            (sum, item) => sum + item.protein,
            0
          );
          return {
            ...dayPlan,
            meals: {
              ...dayPlan.meals,
              [mealType]: {
                ...dayPlan.meals[mealType],
                items: updatedItem,
                totalCalories,
                totalProtein,
              },
            },
          };
        }
        return dayPlan;
      })
    );
  };

  const clearAllMeals = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setMealPlans(initialMealData);
      setSelectedRecipe(null);
      setSearchResults([]);
      setSearchQuery("");
    } catch (error) {
      console.error("Failed to clear meal plans:", error);
    }
  };

  const confirmClear = () => {
    if (window.confirm("Are you sure you want to clear all meals?")) {
      clearAllMeals();
    }
  };

  return (
    <div className="flex-1 p-4 bg-gray-50">
      <div className="text-2xl font-bold text-center text-gray-800 mb-4">
        Weekly Meal Plan
      </div>

      {displayPlans.length === 0 && (
        <div className="bg-white p-6 rounded-xl items-center">
          <div className="text-gray-500 text-center">
            No meal plans created yet. Start by adding meals to days!
          </div>
        </div>
      )}

      {displayPlans.map((item) => (
        <div
          key={item.date}
          className="bg-white rounded-xl p-4 mb-4 shadow-md border border-gray-100"
          style={{
            borderLeftWidth: 5,
            borderLeftColor: expandedDay === item.date ? "#6366F1" : "#E5E7EB",
          }}
        >
          <button
            type="button"
            className="w-full text-left"
            onClick={() => toggleDay(item.date)}
          >
            <div className="flex flex-row justify-between items-center">
              <div className="text-lg font-bold text-gray-800">
                {new Date(item.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </div>
              <div className="text-gray-500 text-lg">
                {expandedDay === item.date ? "▼" : "▶"}
              </div>
            </div>
            <div className="flex flex-row justify-between mt-2">
              {["breakfast", "lunch", "dinner", "snacks"].map((meal) => (
                <div key={meal} className="items-center">
                  <div className="text-xs text-gray-500 capitalize">{meal}</div>
                  <div className="text-sm font-medium">
                    {item.meals[meal as MealType].items.length} items
                  </div>
                </div>
              ))}
            </div>
          </button>

          {expandedDay === item.date && (
            <div className="mt-4">
              {/* Search and Picker Section */}
              <div className="mb-4 bg-gray-50 rounded-lg p-3">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Add Recipe to Meal
                </div>
                <input
                  className="bg-white border border-gray-300 rounded-lg p-3 mb-3 w-full"
                  placeholder="Search for recipes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select
                  className="bg-white border border-gray-300 rounded-lg mb-3 w-full p-2"
                  value={selectedMealType[item.date] || ""}
                  onChange={(e) =>
                    setSelectedMealType((prev) => ({
                      ...prev,
                      [item.date]: e.target.value as MealType,
                    }))
                  }
                >
                  <option value="">Select Meal Type</option>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snacks">Snacks</option>
                </select>
                {loading && (
                  <div className="flex items-center">
                    <span className="animate-spin mr-2">⏳</span>
                    <span>Loading...</span>
                  </div>
                )}
                {error && (
                  <div className="text-red-500 text-sm mt-2">{error}</div>
                )}
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="max-h-40 mb-4 overflow-y-auto border border-gray-200 rounded-lg">
                  {searchResults.map((result) => (
                    <button
                      key={result.id}
                      className="w-full text-left p-3 bg-white border-b border-gray-200 hover:bg-indigo-50"
                      onClick={() => handleRecipeSelect(result)}
                    >
                      <div className="text-base font-medium text-gray-800">
                        {result.title}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {result.servings} servings
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Selected Recipe */}
              {selectedRecipe && (
                <div className="bg-indigo-50 rounded-lg p-4 mb-4">
                  <div className="font-medium text-gray-800 mb-2">
                    Add {selectedRecipe.title}
                  </div>
                  <input
                    className="bg-white border border-gray-300 rounded-lg p-3 mb-3 w-full"
                    placeholder="Amount (e.g., 2)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    type="number"
                  />
                  <button
                    className="bg-indigo-600 p-3 rounded-lg w-full text-white font-medium hover:bg-indigo-700"
                    onClick={addRecipeToMealPlan}
                  >
                    Add to Meal Plan
                  </button>
                </div>
              )}

              {/* Meal Sections */}
              {Object.entries(item.meals).map(([mealType, meal]) => (
                <div key={mealType} className="mt-4">
                  <div className="flex flex-row justify-between items-center mb-2">
                    <div className="font-bold text-gray-800 capitalize">
                      {mealType}
                    </div>
                    <div className="text-sm text-gray-500">
                      {meal.totalCalories} cal • {meal.totalProtein}g protein
                    </div>
                  </div>
                  {meal.items.length > 0 ? (
                    meal.items.map((food, index) => (
                      <div
                        key={`${food.id}-${index}`}
                        className="bg-white p-3 rounded-lg mb-2 flex flex-row justify-between items-center border border-gray-200"
                      >
                        <div className="flex-1">
                          <div className="text-gray-800 font-medium">
                            {food.name}
                          </div>
                          <div className="text-gray-500 text-sm mt-1">
                            {food.calories} cal • {food.protein}g protein
                          </div>
                        </div>
                        <button
                          className="bg-red-100 px-3 py-1 rounded-full ml-2 hover:bg-red-200"
                          onClick={() =>
                            deleteMealItem(
                              item.date,
                              mealType as MealType,
                              food.id
                            )
                          }
                        >
                          <span className="text-red-600 text-sm font-medium">
                            Remove
                          </span>
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 text-center py-3">
                      No items added yet
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <button
        onClick={confirmClear}
        className="bg-gray-200 px-4 py-3 rounded-lg w-full font-medium text-gray-800 hover:bg-gray-300"
      >
        Clear All Meals
      </button>
    </div>
  );
};

export default MealPlanList;
