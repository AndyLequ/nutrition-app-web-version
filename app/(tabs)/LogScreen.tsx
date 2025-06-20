import { Text, View, StyleSheet, FlatList, ScrollView } from "react-native";
import React from "react";
import { useFood } from "../FoodProvider";
import MealList from "../components/MealList";

export default function LogScreen() {
  const { foods, loading } = useFood();

  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <View className="flex-1 bg-white">
        <View className="flex-1 px-4">
          {/* Meal Sections */}
          <View className="flex-1 border-b border-gray-300 py-4">
            <Text className="text-lg font-bold mb-2">Breakfast</Text>
            <MealList
              mealType="breakfast"
              foodsForMealType={foods.filter(
                (food) => food.mealType === "breakfast"
              )}
            />
          </View>

          <View className="flex-1 border-b border-gray-300 py-4">
            <Text className="text-lg font-bold mb-2">Lunch</Text>
            <MealList
              mealType="lunch"
              foodsForMealType={foods.filter(
                (food) => food.mealType === "lunch"
              )}
            />
          </View>

          <View className="flex-1 border-b border-gray-300 py-4">
            <Text className="text-lg font-bold mb-2">Dinner</Text>
            <MealList
              mealType="dinner"
              foodsForMealType={foods.filter(
                (food) => food.mealType === "dinner"
              )}
            />
          </View>

          <View className="flex-1 border-b border-gray-300 py-4">
            <Text className="text-lg font-bold mb-2">Snacks</Text>
            <MealList
              mealType="snacks"
              foodsForMealType={foods.filter(
                (food) => food.mealType === "snacks"
              )}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   columnContainer: {
//     flex: 1,
//     paddingHorizontal: 10,
//   },
//   mealContainer: {
//     flex: 1,
//     borderBottomWidth: 1,
//     borderColor: "#ccc",
//     paddingVertical: 10,
//   },
//   titlename: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 8,
//   },
//   list: {
//     flex: 1,
//   },
//   listItem: {
//     paddingVertical: 4,
//   },
// });
