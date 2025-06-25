import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
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
  startDate.setHours(0, 0, 0, 0); // Set time to midnight

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
    const loadMealPlans = async () => {
      console.log("[DEBUG] Loading meal plans from storage...");
      try {
        const storedMealPlans = localStorage.getItem(STORAGE_KEY);
        console.log("[DEBUG] Stored meal plans:", storedMealPlans);
        if (storedMealPlans) {
          console.log("[DEBUG] Meal plans loaded successfully.");
          setMealPlans(JSON.parse(storedMealPlans));
        }
      } catch (error) {
        console.error("Failed to load meal plans from storage:", error);
      }
    };
    loadMealPlans();
  }, []);

  useEffect(() => {
    const saveMealPlans = async () => {
      console.log("[DEBUG] Saving meal plans to storage...", mealPlans);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mealPlans));
        console.log("[DEBUG] Meal plans saved successfully.");
      } catch (error) {
        console.error("Failed to save meal plans to storage:", error);
      }
    };
    saveMealPlans();
  }, [mealPlans]);

  //recipe search handling
  useEffect(() => {
    const searchRecipes = async () => {
      if (searchQuery.length > 2) {
        console.log("[DEBUG] Searching for recipes:", searchQuery);
        setLoading(true);
        try {
          const response = await foodApi.searchRecipes({
            query: searchQuery,
            limit: 1,
          });
          console.log("[DEBUG] Search results:", response);
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

  //handle recipe select
  const handleRecipeSelect = async (recipe: Recipe) => {
    console.log("[DEBUG] Recipe selected:", recipe);
    try {
      setError(null);
      console.log("[DEBUG] Fetching recipe nutrition for:", recipe.id);
      const nutrition = await foodApi.getRecipeNutrition(recipe.id);
      console.log("[DEBUG] Recipe nutrition:", nutrition);
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

  //add recipe to meal plan
  const addRecipeToMealPlan = async () => {
    if (!selectedRecipe?.nutrition || !selectedDay || !selectedMealType) return;
    console.log("[DEBUG] Adding recipe to meal plan:", selectedRecipe);
    console.log("[DEBUG] Current state:", {
      selectedRecipe,
      selectedDay,
      selectedMealType,
      amount,
    });

    try {
      const parsedAmount = parseFloat(amount) || 1;
      console.log("[DEBUG] Parsed amount:", parsedAmount);
      const newItem = {
        id: `recipe-${selectedRecipe.id}`,
        name: selectedRecipe.title,
        calories: selectedRecipe.nutrition.calories * parsedAmount,
        protein: selectedRecipe.nutrition.protein * parsedAmount,
      };
      console.log("[DEBUG] New meal item:", newItem);

      setMealPlans((prev) =>
        prev.map((day) => {
          if (day.date === selectedDay) {
            return {
              ...day,
              meals: {
                ...day.meals,
                [selectedMealType]: {
                  ...day.meals[selectedMealType],
                  items: [...day.meals[selectedMealType].items, newItem],
                  totalCalories:
                    day.meals[selectedMealType].totalCalories +
                    newItem.calories,
                  totalProtein:
                    day.meals[selectedMealType].totalProtein + newItem.protein,
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
      console.log("[DEBUG] Error adding recipe to meal plan:", error);
      setError("Failed to add recipe to meal plan. Please try again.");
    }
  };

  const toggleDay = (date: string) => {
    setExpandedDay(expandedDay === date ? null : date);
    setSelectedMealType(null);
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
                totalCalories: totalCalories,
                totalProtein: totalProtein,
              },
            },
          };
        }
        return dayPlan;
      })
    );
  };

  const clearAllMeals = async () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setMealPlans(initialMealData);
      //reset any related states
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

  const renderDay = ({ item }: { item: (typeof mealPlans)[0] }) => (
    <View
      className="bg-white rounded-xl p-4 mb-4 shadow-md border border-gray-100"
      style={{
        borderLeftWidth: 5,
        borderLeftColor: expandedDay === item.date ? "#6366F1" : "#E5E7EB",
      }}
    >
      <TouchableOpacity
        onPress={() => {
          toggleDay(item.date);
          setSelectedDay(item.date);
        }}
      >
        <View className="flex-row justify-between items-center">
          <Text className="text-lg font-bold text-gray-800">
            {new Date(item.date).toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </Text>
          <Text className="text-gray-500 text-lg">
            {expandedDay === item.date ? "▼" : "▶"}
          </Text>
        </View>

        {/* Daily summary bar */}
        <View className="flex-row justify-between mt-2">
          <View className="items-center">
            <Text className="text-xs text-gray-500">Breakfast</Text>
            <Text className="text-sm font-medium">
              {item.meals.breakfast.items.length} items
            </Text>
          </View>
          <View className="items-center">
            <Text className="text-xs text-gray-500">Lunch</Text>
            <Text className="text-sm font-medium">
              {item.meals.lunch.items.length} items
            </Text>
          </View>
          <View className="items-center">
            <Text className="text-xs text-gray-500">Dinner</Text>
            <Text className="text-sm font-medium">
              {item.meals.dinner.items.length} items
            </Text>
          </View>
          <View className="items-center">
            <Text className="text-xs text-gray-500">Snacks</Text>
            <Text className="text-sm font-medium">
              {item.meals.snacks.items.length} items
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {expandedDay === item.date && (
        <View className="mt-4">
          {/* Search and Picker Section */}
          <View className="mb-4 bg-gray-50 rounded-lg p-3">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Add Recipe to Meal
            </Text>

            <TextInput
              className="bg-white border border-gray-300 rounded-lg p-3 mb-3"
              placeholder="Search for recipes..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            <View className="bg-white border border-gray-300 rounded-lg mb-3">
              <Picker
                selectedValue={selectedMealType}
                onValueChange={(itemValue) => setSelectedMealType(itemValue)}
              >
                <Picker.Item label="Select Meal Type" value="" />
                <Picker.Item label="Breakfast" value="breakfast" />
                <Picker.Item label="Lunch" value="lunch" />
                <Picker.Item label="Dinner" value="dinner" />
                <Picker.Item label="Snacks" value="snacks" />
              </Picker>
            </View>

            {loading && <ActivityIndicator size="small" color="#6366F1" />}
            {error && (
              <Text className="text-red-500 text-sm mt-2">{error}</Text>
            )}
          </View>

          {/* Search Results */}
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="p-3 bg-white border-b border-gray-200"
                onPress={() => handleRecipeSelect(item)}
              >
                <Text className="text-base font-medium text-gray-800">
                  {item.title}
                </Text>
                <Text className="text-sm text-gray-500 mt-1">
                  {item.servings} servings
                </Text>
              </TouchableOpacity>
            )}
            className="max-h-40 mb-4"
          />

          {/* Selected Recipe */}
          {selectedRecipe && (
            <View className="bg-indigo-50 rounded-lg p-4 mb-4">
              <Text className="font-medium text-gray-800 mb-2">
                Add {selectedRecipe.title}
              </Text>

              <TextInput
                className="bg-white border border-gray-300 rounded-lg p-3 mb-3"
                placeholder="Amount (e.g., 2)"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
              />

              <TouchableOpacity
                className="bg-indigo-600 p-3 rounded-lg items-center"
                onPress={addRecipeToMealPlan}
              >
                <Text className="text-white font-medium">Add to Meal Plan</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Meal Sections */}
          {Object.entries(item.meals).map(([mealType, meal]) => (
            <View key={mealType} className="mt-4">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="font-bold text-gray-800">
                  {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                </Text>
                <Text className="text-sm text-gray-500">
                  {meal.totalCalories} cal • {meal.totalProtein}g protein
                </Text>
              </View>

              {meal.items.length > 0 ? (
                meal.items.map((food, index) => (
                  <View
                    key={`${food.id}-${index}`}
                    className="bg-white p-3 rounded-lg mb-2 flex-row justify-between items-center border border-gray-200"
                  >
                    <View className="flex-1">
                      <Text className="text-gray-800 font-medium">
                        {food.name}
                      </Text>
                      <Text className="text-gray-500 text-sm mt-1">
                        {food.calories} cal • {food.protein}g protein
                      </Text>
                    </View>
                    <TouchableOpacity
                      className="bg-red-100 px-3 py-1 rounded-full"
                      onPress={() =>
                        deleteMealItem(item.date, mealType as MealType, food.id)
                      }
                    >
                      <Text className="text-red-600 text-sm font-medium">
                        Remove
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text className="text-gray-500 text-center py-3">
                  No items added yet
                </Text>
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <View className="flex-1 p-4 bg-gray-50">
      <Text className="text-2xl font-bold text-center text-gray-800 mb-4">
        Weekly Meal Plan
      </Text>

      <FlatList
        data={mealPlans}
        renderItem={renderDay}
        keyExtractor={(item) => item.date}
        ListEmptyComponent={
          <View className="bg-white p-6 rounded-xl items-center">
            <Text className="text-gray-500 text-center">
              No meal plans created yet. Start by adding meals to days!
            </Text>
          </View>
        }
        className="mb-4"
      />

      <TouchableOpacity
        onPress={confirmClear}
        className="bg-gray-200 px-4 py-3 rounded-lg items-center"
      >
        <Text className="text-gray-800 font-medium">Clear All Meals</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MealPlanList;
