import React, { useState } from "react";
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

const Plans: React.FC = () => {
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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="text-3xl font-bold text-center text-slate-800 my-4">
        Meal Plans
      </div>

      <div className="flex flex-row justify-around bg-white mx-4 p-2 rounded-lg shadow-sm">
        <button
          className={`px-4 py-2 rounded-full ${
            activeTab === "plan" ? "bg-indigo-600" : "bg-transparent"
          }`}
          onClick={() => setActiveTab("plan")}
        >
          <span
            className={`font-medium ${
              activeTab === "plan" ? "text-white" : "text-slate-600"
            }`}
          >
            View Weekly Plan
          </span>
        </button>
        <button
          className={`px-4 py-2 rounded-full ${
            activeTab === "config" ? "bg-indigo-600" : "bg-transparent"
          }`}
          onClick={() => setActiveTab("config")}
        >
          <span
            className={`font-medium ${
              activeTab === "config" ? "text-white" : "text-slate-600"
            }`}
          >
            Nutrition Suggestions
          </span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 mt-4 pb-32">
        {activeTab === "config" ? (
          <>
            {mealConfigurations.map(({ meal, options }) => (
              <div
                key={meal}
                className="bg-white rounded-lg p-4 mb-3 shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => toggleMeal(meal)}
                  className="flex flex-row justify-between items-center w-full"
                >
                  <span className="text-lg font-semibold text-slate-800">
                    {meal}
                  </span>
                  <span className="text-sm text-slate-500 mt-1">
                    {selectedConfigs[meal]
                      ? `Selected: ${selectedConfigs[meal]?.label}`
                      : "Choose configuration"}
                  </span>
                </button>

                {expandedMeal === meal && (
                  <div className="mt-3 ml-2">
                    {options.map((config) => (
                      <button
                        key={config.id}
                        type="button"
                        onClick={() => selectConfiguration(meal, config)}
                        className={`p-3 rounded mb-2 text-left w-full ${
                          selectedConfigs[meal]?.id === config.id
                            ? "bg-indigo-50 border-l-4 border-indigo-500"
                            : "bg-slate-50"
                        }`}
                      >
                        <div className="text-indigo-600 font-medium text-base">
                          {config.label}
                        </div>
                        <div className="text-slate-600 text-sm mt-1">
                          {config.items}
                        </div>
                      </button>
                    ))}

                    {/* Description section */}
                    {selectedOption && selectedConfigs[meal] && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="text-blue-800 font-medium mb-2">
                          About the {selectedOption.label} Option:
                        </div>
                        <div className="text-slate-700">
                          {selectedOption.description}
                        </div>
                        <div className="mt-3">
                          <div className="text-blue-800 font-medium mb-1">
                            Best For:
                          </div>
                          <div className="flex flex-row flex-wrap">
                            {selectedOption.label.includes("Low-Carb") && (
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs mr-2 mb-2">
                                Weight Loss
                              </span>
                            )}
                            {selectedOption.label.includes("High-Protein") && (
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs mr-2 mb-2">
                                Muscle Building
                              </span>
                            )}
                            {selectedOption.label.includes("Vegetarian") && (
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs mr-2 mb-2">
                                Heart Health
                              </span>
                            )}
                            {selectedOption.label.includes("Keto") && (
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs mr-2 mb-2">
                                Ketogenic Diet
                              </span>
                            )}
                            {selectedOption.label.includes("Mediterranean") && (
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs mr-2 mb-2">
                                Longevity
                              </span>
                            )}
                            {selectedOption.label.includes("Gluten-Free") && (
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs mr-2 mb-2">
                                Digestive Health
                              </span>
                            )}
                            {selectedOption.label.includes("Low-Fat") && (
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs mr-2 mb-2">
                                Cholesterol Control
                              </span>
                            )}
                            {selectedOption.label.includes("Energy") && (
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs mr-2 mb-2">
                                Active Lifestyles
                              </span>
                            )}
                            {selectedOption.label.includes("Protein") && (
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs mr-2 mb-2">
                                Post-Workout
                              </span>
                            )}
                            {selectedOption.label.includes("Low-Calorie") && (
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs mr-2 mb-2">
                                Calorie Control
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Summary of selections */}
            {Object.keys(selectedConfigs).length > 0 && (
              <div className="bg-white rounded-lg p-4 mt-4 mb-6 shadow-sm">
                <div className="text-lg font-semibold text-slate-800 mb-3">
                  Your Selected Nutrition Plan
                </div>
                {Object.entries(selectedConfigs).map(([meal, config]) => (
                  <div key={meal} className="mb-3">
                    <div className="text-indigo-600 font-medium">
                      {meal}: {config?.label}
                    </div>
                    <div className="text-slate-600 text-sm">
                      {config?.items}
                    </div>
                  </div>
                ))}
                <div className="text-slate-700 mt-3">
                  This balanced nutrition plan supports your fitness goals by
                  providing optimal fuel for your activities and recovery.
                  Remember to stay hydrated and adjust portions based on your
                  energy needs.
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 mt-4">
            <MealPlanList />
          </div>
        )}
      </div>
    </div>
  );
};

export default Plans;
