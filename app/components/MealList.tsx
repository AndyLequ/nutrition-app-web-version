import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { FoodItem } from "../FoodProvider"; // Adjust the import based on your file structure

interface MealListProps {
  mealType: string;
  foodsForMealType: FoodItem[];
}

const MealList: React.FC<MealListProps> = ({ mealType, foodsForMealType }) => {
  return (
    <View className="bg-white shadow-md rounded-lg p-4 mb-4">
      {foodsForMealType.length > 0 ? (
        foodsForMealType.map((item) => (
          <View key={item.id} className="border-b border-gray-300 py-2">
            <Text className="text-lg font-semibold text-gray-800">
              {item.name}
            </Text>
            <Text className="text-gray-600">{item.amount}</Text>
            <Text className="text-gray-600">Protein: {item.protein}g</Text>
            <Text className="text-gray-600">Calories: {item.calories} cal</Text>
          </View>
        ))
      ) : (
        <Text className="text-center text-gray-500 mt-4">No items found</Text>
      )}
    </View>
  );
};

export default MealList;
