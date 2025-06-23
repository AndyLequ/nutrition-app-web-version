import React, { createContext, useContext, useState, useEffect } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { AppState } from "react-native";
type MealType = "breakfast" | "lunch" | "dinner" | "snacks";

export type FoodItem = {
  id: string;
  name: string;
  amount: string; // Add the amount property
  mealType: MealType;
  protein: number;
  calories: number;
  carbs: number;
  fat: number;
  createdAt: Date;
};

interface FoodContextType {
  foods: FoodItem[];
  addFood: (food: Omit<FoodItem, "id" | "createdAt">) => void;
  resetFoods: () => void;
  loading: boolean;
}

const FoodContext = createContext<FoodContextType>({
  foods: [],
  addFood: () => {},
  resetFoods: () => {},
  loading: true,
});

export const FoodProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);

  const STORAGE_KEY = "foods";

  const resetFoods = async () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setFoods([]); // Reset state to empty array
    } catch (error) {
      console.error("Error resetting foods:", error);
    }
  };

  // Load saved foods on mount
  useEffect(() => {
    const loadFoods = () => {
      try {
        const savedFoods = localStorage.getItem(STORAGE_KEY);

        let parsedFoods = [];

        if (savedFoods) {
          try {
            parsedFoods = JSON.parse(savedFoods, (key, value) => {
              if (key === "createdAt") return new Date(value);
              return value;
            });

            if (!Array.isArray(parsedFoods)) {
              console.warn(
                "Invalid food data found - resetting to empty array."
              );
              parsedFoods = [];
              localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
            }
          } catch (error) {
            console.error("Error parsing saved foods:", error);
            parsedFoods = []; // Reset to empty array on error
            localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
          }
        }
        setFoods(parsedFoods);
      } catch (error) {
        console.error("Error loading foods from localStorage:", error);
        setFoods([]); // Reset to empty array on error
      } finally {
        setLoading(false); // Set loading to false after attempting to load
      }
    };

    loadFoods();
  }, []);

  // Save foods whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(foods));
    }
  }, [foods]);

  const addFood = (food: Omit<FoodItem, "id" | "createdAt">) => {
    const newFood: FoodItem = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2),
      ...food,
      createdAt: new Date(),
    };

    setFoods((prev) => {
      const updatedFoods = [...prev, newFood];
      return updatedFoods;
    });
  };

  useEffect(() => {
    const checkDailyReset = () => {
      try {
        const LAST_RESET_KEY = "last_reset_date";
        const today = new Date().toLocaleDateString("en-CA");
        const lastReset = localStorage.getItem(LAST_RESET_KEY);

        if (lastReset !== today) {
          resetFoods();
          localStorage.setItem(LAST_RESET_KEY, today);
        }
      } catch (error) {
        console.error("Error checking daily reset:", error);
      }
    };

    checkDailyReset(); // Check for daily reset on mount

    const handleVisibilityChange = () => {
      //check only when page become visible
      if (document.visibilityState === "visible") {
        checkDailyReset();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <FoodContext.Provider value={{ foods, addFood, resetFoods, loading }}>
      {children}
    </FoodContext.Provider>
  );
};

export const useFood = () => useContext(FoodContext);
