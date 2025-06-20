// types.ts
export type MealType = "breakfast" | "lunch" | "dinner" | "snacks";

export type FoodItem = {
  id: string;
  name: string;
  amount: string;
  mealType: MealType;
  protein: number;
  calories: number;
  carbs: number;
  fat: number;
  createdAt: Date;
};

export type NutritionInfo = {
  protein: number;
  calories: number;
  carbs: number;
  fat: number;
  amount: number;
  unit: string;
};

export type UnifiedFoodItem = {
  id: number;
  name: string;
  type: 'ingredient' | 'recipe';
  amount?: string;
  protein?: number;
  calories?: number;
  carbs?: number;
  fat?: number;
};

export type MealPlan = {
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

