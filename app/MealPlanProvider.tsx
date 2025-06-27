import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

export type MealType = "breakfast" | "lunch" | "dinner" | "snacks";

type FoodItem = {
  id: string;
  name: string;
  calories: number;
  protein: number;
};

type MealPlan = {
  date: string;
  meals: {
    [key in MealType]: {
      items: FoodItem[];
      totalCalories: number;
      totalProtein: number;
    };
  };
  notes?: string;
};

interface MealPlanContextType {
  mealPlans: MealPlan[];
  addOrUpdateMealPlan: (plan: MealPlan) => Promise<void>;
  deleteMealPlan: (date: string) => Promise<void>;
  getMealPlanByDate: (date: string) => MealPlan | undefined;
  loading: boolean;
  getOrCreateDailyPlan: (date: string) => MealPlan;
}

const MealPlanContext = createContext<MealPlanContextType>({
  mealPlans: [],
  addOrUpdateMealPlan: async () => {},
  deleteMealPlan: async () => {},
  getMealPlanByDate: () => undefined,
  loading: true,
  getOrCreateDailyPlan: () => ({
    date: "",
    meals: {
      breakfast: { items: [], totalCalories: 0, totalProtein: 0 },
      lunch: { items: [], totalCalories: 0, totalProtein: 0 },
      dinner: { items: [], totalCalories: 0, totalProtein: 0 },
      snacks: { items: [], totalCalories: 0, totalProtein: 0 },
    },
  }),
});

const initialMealData = [
  {
    date: "2023-12-04",
    meals: {
      breakfast: {
        items: [
          { id: "1a", name: "Oatmeal", calories: 150, protein: 5 },
          { id: "1b", name: "Banana", calories: 89, protein: 1 },
          { id: "1c", name: "Almond Milk", calories: 30, protein: 1 },
        ],
        totalCalories: 269,
        totalProtein: 7,
      },
    },
  },
  {
    date: "2023-12-05",
    meals: {
      breakfast: {
        items: [
          { id: "2a", name: "Greek Yogurt", calories: 100, protein: 10 },
          { id: "2b", name: "Mixed Berries", calories: 50, protein: 1 },
          { id: "2c", name: "Granola", calories: 200, protein: 5 },
        ],
        totalCalories: 350,
        totalProtein: 16,
      },
    },
  },
  {
    date: "2023-12-06",
    meals: {
      breakfast: {
        items: [
          { id: "3a", name: "Scrambled Eggs", calories: 200, protein: 14 },
          { id: "3b", name: "Spinach", calories: 7, protein: 1 },
          { id: "3c", name: "Whole Wheat Toast", calories: 80, protein: 4 },
        ],
        totalCalories: 287,
        totalProtein: 19,
      },
    },
  },
  {
    date: "2023-12-07",
    meals: {
      breakfast: {
        items: [
          { id: "4a", name: "Smoothie", calories: 250, protein: 20 },
          { id: "4b", name: "Chia Seeds", calories: 60, protein: 3 },
          { id: "4c", name: "Peanut Butter", calories: 90, protein: 4 },
        ],
        totalCalories: 400,
        totalProtein: 27,
      },
    },
  },
  {
    date: "2023-12-08",
    meals: {
      breakfast: {
        items: [
          { id: "5a", name: "Avocado Toast", calories: 300, protein: 6 },
          { id: "5b", name: "Egg", calories: 70, protein: 6 },
          { id: "5c", name: "Tomato", calories: 20, protein: 1 },
        ],
        totalCalories: 390,
        totalProtein: 13,
      },
    },
  },

  {
    date: "2023-12-09",
    meals: {
      breakfast: {
        items: [
          { id: "6a", name: "Pancakes", calories: 350, protein: 8 },
          { id: "6b", name: "Maple Syrup", calories: 100, protein: 0 },
          { id: "6c", name: "Bacon", calories: 200, protein: 15 },
        ],
        totalCalories: 650,
        totalProtein: 23,
      },
    },
  },
  {
    date: "2023-12-10",
    meals: {
      breakfast: {
        items: [
          { id: "7a", name: "Fruit Salad", calories: 150, protein: 2 },
          { id: "7b", name: "Cottage Cheese", calories: 100, protein: 14 },
          { id: "7c", name: "Honey", calories: 60, protein: 0 },
        ],
        totalCalories: 310,
        totalProtein: 16,
      },
    },
  },
  // Add more days as needed...
];

export const MealPlanProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>(initialMealData);
  const [loading, setLoading] = useState(true);
  const STORAGE_KEY = "mealPlans";

  const getOrCreateDailyPlan = useCallback(
    (date: string) => {
      const existing = mealPlans.find((plan) => plan.date === date);
      if (existing) {
        return existing;
      }
      return {
        date,
        meals: {
          breakfast: { items: [], totalCalories: 0, totalProtein: 0 },
          lunch: { items: [], totalCalories: 0, totalProtein: 0 },
          dinner: { items: [], totalCalories: 0, totalProtein: 0 },
          snacks: { items: [], totalCalories: 0, totalProtein: 0 },
        },
      };
    },
    [mealPlans]
  );

  useEffect(() => {
    // Load from localStorage
    try {
      const savedPlans = localStorage.getItem(STORAGE_KEY);
      const parsedPlans = savedPlans ? JSON.parse(savedPlans) : [];
      const validPlans = parsedPlans.filter(
        (plan: any) => plan.date && typeof plan.date === "string" && plan.meals
      );
      setMealPlans(validPlans.length > 0 ? validPlans : initialMealData);
    } catch (error) {
      console.error("Error loading meal plans:", error);
      setMealPlans(initialMealData);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mealPlans));
      } catch (e) {
        console.error("Error saving meal plans:", e);
      }
    }
  }, [mealPlans, loading]);

  const addOrUpdateMealPlan = useCallback(async (plan: MealPlan) => {
    setMealPlans((prev) => {
      const existingIndex = prev.findIndex((p) => p.date === plan.date);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = plan;
        return updated;
      }
      return [...prev, plan];
    });
  }, []);

  const deleteMealPlan = useCallback(async (date: string) => {
    setMealPlans((prev) => prev.filter((plan) => plan.date !== date));
  }, []);

  const getMealPlanByDate = useCallback(
    (date: string) => {
      return mealPlans.find((plan) => plan.date === date);
    },
    [mealPlans]
  );

  return (
    <MealPlanContext.Provider
      value={{
        mealPlans,
        addOrUpdateMealPlan,
        deleteMealPlan,
        getMealPlanByDate,
        loading,
        getOrCreateDailyPlan,
      }}
    >
      {children}
    </MealPlanContext.Provider>
  );
};

export const useMealPlan = () => useContext(MealPlanContext);
