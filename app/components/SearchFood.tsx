import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  Button,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Alert,
  Pressable,
  Keyboard,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFood } from "../FoodProvider";
import debounce from "lodash.debounce";
import axios from "axios";
import { foodApi } from "../../services/api";
import DropDownPicker from "react-native-dropdown-picker";

import { UnifiedFoodItem } from "../../services/types"; // Adjust the import path as necessary
import { FoodItem } from "../FoodProvider";

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

  // these states are for later use, not important right now
  // const [submittedFoods, setSubmittedFoods] = useState([]);
  // const [showFoodList, setShowFoodList] = useState(false);
  const { addFood } = useFood();

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
    if (!query) return setSearchResults([]);

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
      });

      setSearchQuery("");
      setAmount("");
      setUnit("g");
      setMealType("breakfast");
      setSelectedFood(null);

      await AsyncStorage.removeItem("@inputs"); // Clear saved data

      // Reset form...
    } catch (error) {
      Alert.alert("Error", "Failed to save food entry");
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
        { label: "oz", value: "oz" },
      ]);
    }
  }, [selectedFood?.type]);

  // useEffect to load data from async storage
  useEffect(() => {
    const loadData = async () => {
      // Load data here
      try {
        const savedData = await AsyncStorage.getItem("data");
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
          await AsyncStorage.setItem("@inputs", dataToSave);
        } catch (e) {
          console.error("Failed to save data");
        }
      };
      saveData();
    }
  }, [searchQuery, amount, mealType, isLoading, unit, selectedFood?.type]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const dismissKeyboardAndCloseDropdowns = () => {
    Keyboard.dismiss();
    closeAllDropdowns();
  };

  const closeAllDropdowns = () => {
    setUnitOpen(false);
    setMealTypeOpen(false);
  };

  // return the form to add food
  return (
    <Pressable
      style={{ flex: 1, backgroundColor: "white" }}
      onPress={dismissKeyboardAndCloseDropdowns}
    >
      <View className="flex-1 bg-gray-100 justify-center p-5">
        <View className="bg-white rounded-lg p-6 shadow-md">
          <Text className="text-xl font-semibold text-gray-800 mb-6 text-center">
            Add Food
          </Text>

          <View className="space-y-4">
            <View>
              <Text className="text-sm text-gray-600 mb-2">Search Food</Text>
              <TextInput
                className={`h-12 border rounded-lg px-4 text-base text-gray-900 ${
                  isFocused1 ? "border-indigo-500" : "border-gray-300"
                }`}
                placeholder="Search for food..."
                placeholderTextColor="#94a3b8"
                value={searchQuery}
                onChangeText={handleSearch}
                onFocus={() => {
                  setIsFocused1(true);
                  closeAllDropdowns();
                }}
                onBlur={() => setIsFocused1(false)}
              />
            </View>

            {searchResults.length > 0 && (
              <FlatList
                data={searchResults}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className="p-3 border-b border-gray-300"
                    onPress={() => {
                      handleFoodSelect(item);
                    }}
                  >
                    <Text className="text-gray-800">{item.name}</Text>
                    <Text className="text-gray-500 text-sm">
                      {item.type === "ingredient" ? "Ingredient" : "Recipe"}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            )}

            <View>
              <Text className="text-sm text-gray-600 mb-2">Amount</Text>
              <TextInput
                className={`h-12 border rounded-lg px-4 text-base text-gray-900 ${
                  isFocused2 ? "border-indigo-500" : "border-gray-300"
                }`}
                placeholder="Enter amount (e.g., 100)"
                placeholderTextColor="#94a3b8"
                value={amount}
                onChangeText={setAmount}
                onFocus={() => {
                  setIsFocused2(true);
                  closeAllDropdowns();
                }}
                onBlur={() => setIsFocused2(false)}
              />
            </View>

            <View style={{ zIndex: 1000, elevation: 1000 }}>
              <Text className="text-sm text-gray-600 mb-2">Units</Text>

              <DropDownPicker
                open={unitOpen}
                value={unit}
                items={unitItems}
                setOpen={(open) => {
                  Keyboard.dismiss();
                  setUnitOpen(open);
                }}
                setValue={setUnit}
                setItems={setUnitItems}
                style={{
                  borderColor: "#cbd5e1",
                  borderRadius: 8,
                }}
                dropDownContainerStyle={{
                  borderColor: "#cbd5e1",
                }}
              />
            </View>

            {/* Meal Type Dropdown */}
            <View style={{ zIndex: 999, elevation: 999 }}>
              <Text className="text-sm text-gray-600 mb-2">Meal Type</Text>
              <DropDownPicker
                open={mealTypeOpen}
                value={mealType}
                items={mealTypeItems}
                setOpen={(open) => {
                  Keyboard.dismiss();
                  setMealTypeOpen(open);
                }}
                setValue={setMealType}
                setItems={setMealTypeItems}
                style={{
                  borderColor: "#cbd5e1",
                  borderRadius: 8,
                }}
                dropDownContainerStyle={{
                  borderColor: "#cbd5e1",
                }}
              />
            </View>

            <View className="mt-4">
              <TouchableOpacity
                className="h-12 bg-indigo-500 rounded-lg justify-center items-center"
                onPress={handleSubmit}
              >
                <Text className="text-white text-base font-semibold">
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};
