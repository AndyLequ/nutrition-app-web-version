import axios from 'axios';

interface Recipe {
  id: number;
  title: string;
  image: string;
  [key: string]: any;
}

interface Ingredient {
  id: number;
  name: string;
  image: string;
}

interface NutritionInfo {
  protein: number;
  calories: number;
  carbs: number;
  fat: number;
  amount: number;
  unit: string;
}

interface IngredientSearchParams {
  query: string;
  limit?: number;
  sort?: string;
  sortDirection?: 'asc' | 'desc';
}

interface RecipeSearchParams {
  query: string;
  limit?: number;
  sort?: string;
  sortDirection?: 'asc' | 'desc';
}

const API_BASE_URL = 'https://nutrition-app-backend-4795.onrender.com'

const api = axios.create({
  baseURL: API_BASE_URL, // or replace with your deployed server URL
});

export const foodApi = {
  searchIngredients: async ({
    query,
    limit = 3,
    sort = 'calories',
    sortDirection = 'desc'
  }: IngredientSearchParams): Promise<Ingredient[]> => {
    const response = await api.get('/api/ingredients', {
      params: { query, limit, sort, sortDirection }
    });
    return response.data;
  },

  searchRecipes: async ({
    query,
    limit = 3,
    sort = 'calories',
    sortDirection = 'desc'
  }: RecipeSearchParams): Promise<Recipe[]> => {
    const response = await api.get('/api/recipes', {
      params: { query, limit, sort, sortDirection }
    });
    return response.data;
  },

  getNutrition: async (
    ingredientId: number,
    amount: number,
    unit: string
  ): Promise<NutritionInfo & { name: string }> => {
    const response = await api.get(`/api/ingredients/${ingredientId}/nutrition`, {
      params: { amount, unit }
    });
    return response.data;
  },

  getRecipeInformation: async (recipeId: number) => {
    const response = await api.get(`/api/recipes/${recipeId}/information`);
    return response.data;
  },

  getRecipeNutrition: async (recipeId: number): Promise<NutritionInfo> => {
    const response = await api.get(`/api/recipes/${recipeId}/nutrition`);
    return response.data;
  }
};
