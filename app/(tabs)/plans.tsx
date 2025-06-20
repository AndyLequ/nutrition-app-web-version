import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import MealPlanList from "../components/MealPlanList"; // Assuming you have a MealPlanList component

interface MealOption {
  id: number;
  label: string;
  items: string;
}

interface MealConfig {
  meal: string;
  options: MealOption[];
}

type SelectedConfigs = Record<string, MealOption | undefined>;

const mealConfigurations: MealConfig[] = [
  {
    meal: "Breakfast",
    options: [
      { id: 1, label: "Low-Carb", items: "Eggs, Avocado, Spinach" },
      { id: 2, label: "Vegetarian", items: "Oatmeal, Fruits, Almond Butter" },
      {
        id: 3,
        label: "High-Protein",
        items: "Greek Yogurt, Chia Seeds, Protein Shake",
      },
    ],
  },
  {
    meal: "Lunch",
    options: [
      {
        id: 4,
        label: "Paleo",
        items: "Grilled Chicken, Sweet Potato, Broccoli",
      },
      { id: 5, label: "Vegan", items: "Quinoa Salad, Chickpeas, Tahini" },
      { id: 6, label: "Keto", items: "Salmon, Asparagus, Cauliflower Rice" },
    ],
  },
  {
    meal: "Dinner",
    options: [
      { id: 7, label: "Mediterranean", items: "Falafel, Hummus, Tabbouleh" },
      {
        id: 8,
        label: "Gluten-Free",
        items: "Turkey Meatballs, Zoodles, Marinara Sauce",
      },
      {
        id: 9,
        label: "Low-Fat",
        items: "Tilapia, Brown Rice, Steamed Broccoli",
      },
    ],
  },
  // Add configurations for other meals...
];

export default function Plans() {
  const [selectedConfigs, setSelectedConfigs] = useState<SelectedConfigs>({});
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"config" | "plan">("plan");

  const toggleMeal = (meal: string) => {
    setExpandedMeal((current) => (current === meal ? null : meal));
  };

  const selectConfiguration = (meal: string, config: MealOption) => {
    setSelectedConfigs((prev) => ({
      ...prev,
      [meal]: config,
    }));
  };

  return (
    <View className="flex-1 bg-slate-50">
      <Text className="text-3x1 font-bold text-center text-sate-800 my-4">
        Meal Plans
      </Text>

      <View className="flex-row justify-around bg-white mx-4 p-2 rounded-lg shadow-sm">
        <TouchableOpacity
          className={`px-4 py-2 rounded-full ${
            activeTab === "plan" ? "bg-indigo-600" : "bg-transparent"
          }`}
          onPress={() => setActiveTab("plan")}
        >
          <Text
            className={`ont-medium ${
              activeTab === "plan" ? "text-white" : "text-slate-600"
            }`}
          >
            View Weekly Plan
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`px-4 py-2 rounded-full ${
            activeTab === "config" ? "bg-indigo-600" : "bg-transparent"
          }`}
          onPress={() => setActiveTab("config")}
        >
          <Text
            className={`font-medium ${
              activeTab === "config" ? "text-white" : "text-slate-600"
            }`}
          >
            Suggestions
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === "config" ? (
        <ScrollView className="flex-1 px-4 mt-4">
          {mealConfigurations.map(({ meal, options }) => (
            <View key={meal} className="bg-white rounded-lg p-4 mb-3 shadow-sm">
              <TouchableOpacity
                onPress={() => toggleMeal(meal)}
                className="flex-row justify-between items-center"
              >
                <Text className="text-lg font-semibold text-slate-800">
                  {meal}
                </Text>
                <Text className="text-sm text-slate-500 mt-1">
                  {selectedConfigs[meal]
                    ? `Selected: ${selectedConfigs[meal]?.label}`
                    : "Choose configuration"}
                </Text>
              </TouchableOpacity>

              {expandedMeal === meal && (
                <View className="mt-3 ml-2">
                  {options.map((config) => (
                    <TouchableOpacity
                      key={config.id}
                      onPress={() => selectConfiguration(meal, config)}
                      className={`bg-slate-50 p-3 rounded mb-2 border ${
                        selectedConfigs[meal]?.id === config.id
                          ? "border-indigo-300 bg-indigo-50"
                          : "border-slate-200"
                      }`}
                    >
                      <Text className="text-indigo-600 mt-1 text-sm">
                        {config.label}
                      </Text>
                      <Text className="text-indigo-600 mt-1 text-sm">
                        {config.items}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      ) : (
        <View className="flex-1 mt-4">
          <MealPlanList />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 20,
    textAlign: "center",
    width: "100%",
  },
  mealContainer: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 20,
  },
  mealSection: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  mealHeader: {
    paddingVertical: 15,
  },
  mealText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
  },
  mealStatus: {
    fontSize: 14,
    color: "#7f8c8d",
    marginTop: 5,
  },
  configContainer: {
    marginVertical: 10,
    marginLeft: 10,
  },
  configOption: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  selectedConfig: {
    backgroundColor: "#e3f2fd",
    borderColor: "#2196f3",
  },
  configLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2196f3",
    marginBottom: 5,
  },
  configItems: {
    fontSize: 14,
    color: "#607d8b",
  },
});
