import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import MealPlanList from "../components/MealPlanList";

interface MealOption {
  id: number;
  label: string;
  items: string;
  description: string;
}

interface MealConfig {
  meal: string;
  options: MealOption[];
}

type SelectedConfigs = Record<string, MealOption | undefined>;

// Meal configurations with detailed descriptions
const mealConfigurations: MealConfig[] = [
  {
    meal: "Breakfast",
    options: [
      {
        id: 1,
        label: "Low-Carb",
        items: "Eggs, Avocado, Spinach",
        description:
          "Low-carb breakfasts help stabilize blood sugar levels, promote fat burning, and reduce cravings. Ideal for weight loss, managing diabetes, and ketogenic diets. This option provides sustained energy without the mid-morning crash.",
      },
      {
        id: 2,
        label: "Vegetarian",
        items: "Oatmeal, Fruits, Almond Butter",
        description:
          "Vegetarian breakfasts are rich in fiber, antioxidants, and plant-based proteins. Perfect for heart health, digestion, and maintaining steady energy. Great for those following plant-based diets or looking to reduce cholesterol levels.",
      },
      {
        id: 3,
        label: "High-Protein",
        items: "Greek Yogurt, Chia Seeds, Protein Shake",
        description:
          "High-protein breakfasts support muscle growth and repair, increase satiety, and boost metabolism. Excellent for athletes, bodybuilders, or anyone looking to build lean muscle mass. Helps control appetite throughout the morning.",
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
        description:
          "Paleo lunches focus on whole, unprocessed foods that our ancestors might have eaten. Supports healthy digestion, reduces inflammation, and provides balanced energy. Ideal for those seeking natural, gluten-free options or managing autoimmune conditions.",
      },
      {
        id: 5,
        label: "Vegan",
        items: "Quinoa Salad, Chickpeas, Tahini",
        description:
          "Vegan lunches are packed with plant-based nutrients, fiber, and antioxidants. Supports heart health, weight management, and environmental sustainability. Perfect for those following a plant-based lifestyle or looking to reduce inflammation.",
      },
      {
        id: 6,
        label: "Keto",
        items: "Salmon, Asparagus, Cauliflower Rice",
        description:
          "Keto lunches are high in healthy fats and very low in carbs, putting your body in a state of ketosis for efficient fat burning. Ideal for weight loss, mental clarity, and managing blood sugar levels. Great for those following ketogenic diets.",
      },
    ],
  },
  {
    meal: "Dinner",
    options: [
      {
        id: 7,
        label: "Mediterranean",
        items: "Falafel, Hummus, Tabbouleh",
        description:
          "Mediterranean dinners emphasize plant-based foods, healthy fats, and lean proteins. Proven to support heart health, longevity, and cognitive function. Ideal for those seeking a balanced, sustainable approach to eating with diverse flavors.",
      },
      {
        id: 8,
        label: "Gluten-Free",
        items: "Turkey Meatballs, Zoodles, Marinara Sauce",
        description:
          "Gluten-free dinners eliminate wheat-based products, reducing inflammation and digestive discomfort. Essential for those with celiac disease or gluten sensitivity. Supports gut health and may help with autoimmune conditions and skin health.",
      },
      {
        id: 9,
        label: "Low-Fat",
        items: "Tilapia, Brown Rice, Steamed Broccoli",
        description:
          "Low-fat dinners focus on lean proteins and complex carbs, reducing overall calorie intake. Ideal for weight management, heart health, and reducing cholesterol levels. Best for those following doctor-recommended low-fat diets or managing gallstones.",
      },
    ],
  },
  {
    meal: "Snacks",
    options: [
      {
        id: 10,
        label: "Energy Boosting",
        items: "Nuts, Seeds, Fresh Fruit",
        description:
          "Energy-boosting snacks provide sustained fuel without crashes. Perfect for athletes, busy professionals, or anyone needing a pick-me-up between meals. Helps maintain stable blood sugar levels and prevents overeating at main meals.",
      },
      {
        id: 11,
        label: "Protein Packed",
        items: "Cottage Cheese, Hard-Boiled Eggs, Jerky",
        description:
          "Protein-packed snacks support muscle recovery and keep you feeling full longer. Ideal for post-workout recovery, weight management, and maintaining muscle mass. Great for fitness enthusiasts and those looking to reduce snacking frequency.",
      },
      {
        id: 12,
        label: "Low-Calorie",
        items: "Vegetable Sticks, Greek Yogurt, Rice Cakes",
        description:
          "Low-calorie snacks provide volume without excessive calories. Perfect for weight loss journeys, portion control, and mindful eating. Helps satisfy cravings while staying within daily calorie goals.",
      },
    ],
  },
];

export default function Plans() {
  const [selectedConfigs, setSelectedConfigs] = useState<SelectedConfigs>({});
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"config" | "plan">("plan");
  const [selectedOption, setSelectedOption] = useState<MealOption | null>(null);

  const toggleMeal = (meal: string) => {
    setExpandedMeal((current) => (current === meal ? null : meal));
    setSelectedOption(null);
  };

  const selectConfiguration = (meal: string, config: MealOption) => {
    setSelectedConfigs((prev) => ({
      ...prev,
      [meal]: config,
    }));
    setSelectedOption(config);
  };

  return (
    <View className="flex-1 bg-slate-50">
      <Text className="text-3xl font-bold text-center text-slate-800 my-4">
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
            className={`font-medium ${
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
            Nutrition Suggestions
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
                      className={`p-3 rounded mb-2 ${
                        selectedConfigs[meal]?.id === config.id
                          ? "bg-indigo-50 border-l-4 border-indigo-500"
                          : "bg-slate-50"
                      }`}
                    >
                      <Text className="text-indigo-600 font-medium text-base">
                        {config.label}
                      </Text>
                      <Text className="text-slate-600 text-sm mt-1">
                        {config.items}
                      </Text>
                    </TouchableOpacity>
                  ))}

                  {/* Description section */}
                  {selectedOption && selectedConfigs[meal] && (
                    <View className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <Text className="text-blue-800 font-medium mb-2">
                        About the {selectedOption.label} Option:
                      </Text>
                      <Text className="text-slate-700">
                        {selectedOption.description}
                      </Text>
                      <View className="mt-3">
                        <Text className="text-blue-800 font-medium mb-1">
                          Best For:
                        </Text>
                        <View className="flex-row flex-wrap">
                          {selectedOption.label.includes("Low-Carb") && (
                            <Text className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs mr-2 mb-2">
                              Weight Loss
                            </Text>
                          )}
                          {selectedOption.label.includes("High-Protein") && (
                            <Text className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs mr-2 mb-2">
                              Muscle Building
                            </Text>
                          )}
                          {selectedOption.label.includes("Vegetarian") && (
                            <Text className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs mr-2 mb-2">
                              Heart Health
                            </Text>
                          )}
                          {selectedOption.label.includes("Keto") && (
                            <Text className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs mr-2 mb-2">
                              Ketogenic Diet
                            </Text>
                          )}
                          {selectedOption.label.includes("Mediterranean") && (
                            <Text className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs mr-2 mb-2">
                              Longevity
                            </Text>
                          )}
                          {selectedOption.label.includes("Gluten-Free") && (
                            <Text className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs mr-2 mb-2">
                              Digestive Health
                            </Text>
                          )}
                          {selectedOption.label.includes("Low-Fat") && (
                            <Text className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs mr-2 mb-2">
                              Cholesterol Control
                            </Text>
                          )}
                          {selectedOption.label.includes("Energy") && (
                            <Text className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs mr-2 mb-2">
                              Active Lifestyles
                            </Text>
                          )}
                          {selectedOption.label.includes("Protein") && (
                            <Text className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs mr-2 mb-2">
                              Post-Workout
                            </Text>
                          )}
                          {selectedOption.label.includes("Low-Calorie") && (
                            <Text className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs mr-2 mb-2">
                              Calorie Control
                            </Text>
                          )}
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              )}
            </View>
          ))}

          {/* Summary of selections */}
          {Object.keys(selectedConfigs).length > 0 && (
            <View className="bg-white rounded-lg p-4 mt-4 mb-6 shadow-sm">
              <Text className="text-lg font-semibold text-slate-800 mb-3">
                Your Selected Nutrition Plan
              </Text>
              {Object.entries(selectedConfigs).map(([meal, config]) => (
                <View key={meal} className="mb-3">
                  <Text className="text-indigo-600 font-medium">
                    {meal}: {config?.label}
                  </Text>
                  <Text className="text-slate-600 text-sm">
                    {config?.items}
                  </Text>
                </View>
              ))}
              <Text className="text-slate-700 mt-3">
                This balanced nutrition plan supports your fitness goals by
                providing optimal fuel for your activities and recovery.
                Remember to stay hydrated and adjust portions based on your
                energy needs.
              </Text>
            </View>
          )}
        </ScrollView>
      ) : (
        <View className="flex-1 mt-4">
          <MealPlanList />
        </View>
      )}
    </View>
  );
}
