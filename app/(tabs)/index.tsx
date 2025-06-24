import React, { useState, useEffect, useRef } from "react";
import { useFood } from "../FoodProvider";
import { NutritionGoals } from "../components/NutritionGoals";
import { ResetButton } from "../components/ResetButton";
import * as d3 from "d3";
import { useMemo } from "react";

export default function Index() {
  const [protein, setProtein] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [calories, setCalories] = useState(0);
  const [fat, setFat] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const { foods } = useFood();
  const safeFoods = Array.isArray(foods) ? foods : [];

  // Memoize DATA to avoid unnecessary recalculations
  const DATA = useMemo(() => {
    return [
      { name: "Protein", value: protein, color: "#FF6384" },
      { name: "Carbs", value: carbs, color: "#36A2EB" },
      { name: "Fat", value: fat, color: "#FFCE56" },
      { name: "Calories", value: calories, color: "#4BC0C0" },
    ];
  }, [protein, carbs, fat, calories]);

  //calculate container width for responsive design
  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }

    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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

  //create a pie chart useing D3
  useEffect(() => {
    if (!containerRef.current || containerWidth === 0) {
      return;
    }

    const radius = Math.min(containerWidth || 300, 300) / 2;
    const innerRadius = radius * 0.5;

    const svg = d3.select(containerRef.current).select("svg");
    svg.selectAll("*").remove(); // Clear previous content

    const newSvg = d3
      .select(containerRef.current)
      .append("svg")
      .attr("viewBox", `0 0 ${radius * 2} ${radius * 2}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .style("width", "100%")
      .style("height", "auto")
      .append("g")
      .attr("transform", `translate(${radius}, ${radius})`);

    const pie = d3
      .pie()
      .value((d) => d.value)
      .sort(null);

    const arc = d3.arc().innerRadius(innerRadius).outerRadius(radius);

    const arcs = pie(DATA as any);

    newSvg
      .selectAll("path")
      .data(arcs)
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d: any) => d.data.color)
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);

    newSvg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("font-size", "20px")
      .attr("font-weight", "bold")
      .text(`${calories.toFixed(0)} kcal`);
  }, [DATA, containerWidth, calories]);

  return (
    <div className="flex flex-col h-screen overflow-y-scroll bg-gray-100 p-4">
      <div className="p-4">
        <div className="text-lg font-bold mb-4 text-gray-800">Summary</div>
        <div className="flex flex-row justify-between mt-4">
          <div className="items-center px-3">
            <div className="text-sm text-gray-500 mb-1">Calories</div>
            <div className="text-base font-medium text-gray-800">
              {calories}
            </div>
          </div>
          <div className="items-center px-3">
            <div className="text-sm text-gray-500 mb-1">Protein</div>
            <div className="text-base font-medium text-gray-800">{protein}</div>
          </div>
          <div className="items-center px-3">
            <div className="text-sm text-gray-500 mb-1">Carbs</div>
            <div className="text-base font-medium text-gray-800">{carbs}</div>
          </div>
          <div className="items-center px-3">
            <div className="text-sm text-gray-500 mb-1">Fat</div>
            <div className="text-base font-medium text-gray-800">{fat}</div>
          </div>
        </div>

        <div className="mt-6">
          <ResetButton />
        </div>
      </div>


      {/* combining nutrition goals and pie chart to be side by side */}
      <div className="flex flex-row flex-wrap justify-between mt-4">
        {/* Nutrition Goals */}
        <div className="flex-1 min-w-[50%] md:min-w[55%] mb-4 md:mb-0 md:pr-4">
          <NutritionGoals />
        </div>

        {/* Pie Chart */}
        <div className="lg:w-1/3">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Macro Distribution
            </h3>

            <div className="flex justify-center">
              <div
                ref={containerRef}
                className="flex justify-center items-center w-full max-w-[300px] mx-auto"
              >
                {DATA.every((d) => d.value === 0) ? (
                  <div className="text-center text-gray-500 py-10">
                    <div className="text-lg mb-2">No data available</div>
                    <p className="text-sm">
                      Add foods to see your macro distribution
                    </p>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-md font-medium mb-3 text-gray-700">
                Macro Legend
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {DATA.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center p-2 bg-gray-50 rounded"
                  >
                    <div
                      className="w-4 h-4 rounded-sm mr-2"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-gray-700">{item.name}</span>
                    <span className="text-sm font-medium text-gray-800 ml-auto">
                      {item.value}g
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
