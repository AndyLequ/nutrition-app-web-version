import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { useFood } from "../FoodProvider"; // Adjust the import based on your file structure
import AsyncStorage from "@react-native-async-storage/async-storage";

export const NutritionGoals = () => {
  const { foods } = useFood();
  const [proteinGoal, setProteinGoal] = useState(150);
  const [calorieGoal, setCalorieGoal] = useState(2000);
  const [editing, setEditing] = useState(false);

  //Load saved goals on component mount
  useEffect(() => {
    const loadGoals = async () => {
      try {
        const savedProtein = await AsyncStorage.getItem("proteinGoal");
        const savedCalories = await AsyncStorage.getItem("calorieGoal");

        if (savedProtein) setProteinGoal(Number(savedProtein));
        if (savedCalories) setCalorieGoal(Number(savedCalories));
      } catch (error) {
        console.error("Error loading goals:", error);
      }
    };
    loadGoals();
  }, []);

  //save goals whenever they change
  useEffect(() => {
    const saveGoals = async () => {
      try {
        await AsyncStorage.multiSet([
          ["proteinGoal", proteinGoal.toString()],
          ["calorieGoal", calorieGoal.toString()],
        ]);
      } catch (error) {
        console.error("Error saving goals:", error);
      }
    };
    saveGoals();
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
    <View className="bg-white p-5 rounded-lg shadow-sm mb-4">
      <Text className="text-2x1 font-bold mb-5 text-gray-800">
        Nutrition Goals
      </Text>

      <View className="mb-5">
        <View className="mb-4">
          <Text className="text-lg mb-2.5 text-gray-700">
            Protein: {totalProtein}g / {proteinGoal}g
          </Text>
          {editing && (
            <TextInput
              className="border-b-2 border-teal-400 w-20 text-center"
              keyboardType="numeric"
              value={proteinGoal.toString()}
              onChangeText={(text) => setProteinGoal(Number(text) || 0)}
            />
          )}
          <View className="h-5 bg-gray-200 rounded-full overflow-hidden">
            <View
              className="h-full bg-teal-400 rounded-full"
              style={{ width: `${proteinProgress}%` }}
            ></View>
          </View>
        </View>

        <View>
          <Text className="text-lg mb-2.5 text-gray-700">
            Calories: {totalCalories} cal / {calorieGoal} cal
          </Text>
          {editing && (
            <TextInput
              className="border-b-2 border-orange-400 w-20 text-center"
              keyboardType="numeric"
              value={calorieGoal.toString()}
              onChangeText={(text) => setCalorieGoal(Number(text) || 0)}
            />
          )}
          <View className="h-5 bg-gray-200 rounded-full overflow-hidden">
            <View
              className="h-full bg-orange-400 rounded-full"
              style={{ width: `${calorieProgress}%` }}
            ></View>
          </View>
        </View>
      </View>
      <View>
        <Text
          className="text-teal-600 text-center font-bold"
          onPress={() => setEditing(!editing)}
        >
          {editing ? "Save Goals" : "Edit Goals"}
        </Text>
      </View>
    </View>
  );
};
