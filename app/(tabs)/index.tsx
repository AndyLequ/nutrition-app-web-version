import { View, Text, Dimensions } from "react-native";
import { useState, useEffect } from "react";
import { useFood } from "../FoodProvider";
import { NutritionGoals } from "../components/NutritionGoals";
import { ResetButton } from "../components/ResetButton";
import Svg, { G, Path, Text as SvgText } from "react-native-svg";
import * as d3Shape from "d3-shape";

export default function Index() {
  const [protein, setProtein] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [calories, setCalories] = useState(0);
  const [fat, setFat] = useState(0);

  const { foods } = useFood();
  const safeFoods = Array.isArray(foods) ? foods : [];

  useEffect(() => {
    const truncateToTwoDecimals = (num: number) => {
      return Math.trunc(num * 100) / 100;
    };

    const totalProtein = truncateToTwoDecimals(
      safeFoods.reduce((sum, food) => sum + (food.protein || 0), 0)
    );
    const totalCalories = truncateToTwoDecimals(
      safeFoods.reduce((sum, food) => sum + (food.calories || 0), 0)
    );
    const totalCarbs = truncateToTwoDecimals(
      safeFoods.reduce((sum, food) => sum + (food.carbs || 0), 0)
    );
    const totalFat = truncateToTwoDecimals(
      safeFoods.reduce((sum, food) => sum + (food.fat || 0), 0)
    );

    setProtein(totalProtein);
    setCalories(totalCalories);
    setCarbs(totalCarbs);
    setFat(totalFat);
  }, [safeFoods]);


  const DATA = [
    { name: "Protein", value: protein, color: "#FF6384" },
    { name: "Carbs", value: carbs, color: "#36A2EB" },
    { name: "Fat", value: fat, color: "#FFCE56" },
    { name: "Calories", value: calories, color: "#4BC0C0" },
  ];

  const screenWidth = Dimensions.get("window").width * 0.4;
  const radius = screenWidth * 0.5;
  const innerRadius = radius * 0.5;

  const totalValue = DATA.reduce((sum, item) => sum + item.value, 0);

  const pieGenerator = d3Shape.pie().value((d) => d.value);
  const arcs = pieGenerator(DATA);

  const arcGenerator = d3Shape
    .arc()
    .innerRadius(innerRadius)
    .outerRadius(radius);

  return (
    <View className="p-4 bg-white rounded-lg shadow-md">
      <View className="bg-white p-3 rounded-lg shadow-sm">
        <Text className="text-lg font-bold mb-4 text-gray-800">Summary</Text>
        <View className="flex-row justify-between">
          <View className="items-center px-3">
            <Text className="text-sm text-gray-500 mb-1">Calories</Text>
            <Text className="text-base font-medium text-gray-800">
              {calories}
            </Text>
          </View>
          <View className="items-center px-3">
            <Text className="text-sm text-gray-500 mb-1">Protein</Text>
            <Text className="text-base font-medium text-gray-800">
              {protein}
            </Text>
          </View>
          <View className="items-center px-3">
            <Text className="text-sm text-gray-500 mb-1">Carbs</Text>
            <Text className="text-base font-medium text-gray-800">{carbs}</Text>
          </View>
          <View className="items-center px-3">
            <Text className="text-sm text-gray-500 mb-1">Fat</Text>
            <Text className="text-base font-medium text-gray-800">{fat}</Text>
          </View>
        </View>
      </View>

      {/* combining nutrition goals and pie chart to be side by side */}
      <View className="flex-row flex-wrap justify-between mt-4">
        {/* Nutrition Goals */}
        <View className="flex-1 min-w-[50%] md:min-w[55%] mb-4 md:mb-0 md:pr-4">
          <NutritionGoals />
        </View>

        {/* Pie Chart */}

        <View className="flex-1 min-w-[45%] md:min-w-[45%] pl-2">
          <View className="bg-white p-3 rounded-lg shadow-sm">
            <View className="w-64 max-w-full aspect-square mx-auto">
              <Text className="text-2x1 font-bold mb-5 text-gray-800">
                Chart
              </Text>

              <Svg width={screenWidth} height={screenWidth}>
                <G transform={`translate(${radius}, ${radius})`}>
                  {arcs.map((arc, index) => (
                    <Path
                      key={index}
                      d={arcGenerator(arc)}
                      fill={DATA[index].color}
                    />
                  ))}
                  <SvgText
                    x={0}
                    y={0}
                    textAnchor="middle"
                    fontSize="20"
                    fill="#000"
                    fontWeight="bold"
                  ></SvgText>
                </G>
              </Svg>
            </View>
            <View className="mt-3 w-full px-2">
              <Text className="text-md font-medium mb-2 text-gray-700">
                Legend
              </Text>

              <View className="flex-row flex-wrap justify-center gap-1">
                {DATA.map((item, index) => (
                  <View
                    key={index}
                    className="flex-row items-center gap-2 px-3 py-1 bg-gray-100 rounded-full mb-2"
                  >
                    <View
                      className="w-4 h-4 rounded-sm"
                      style={{ backgroundColor: item.color }}
                    />
                    <Text className="text-sm text-gray-600">{item.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
      </View>

      <View className="mt-4">
        <ResetButton />
      </View>
    </View>
  );
}
