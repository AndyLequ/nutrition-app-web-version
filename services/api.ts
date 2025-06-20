// api.ts - Updated with better typing and nutrition endpoint
import axios from 'axios';
// import * as Types from '../path/to/types'

// Define or import the Recipe type
interface Recipe {
    id: number;
    title: string;
    image: string;
    [key: string]: any; // Adjust based on actual API response
}


interface Ingredient {
    id: number;
    name: string;
    image: string;
}

interface IngredientResponse {
    results: Ingredient[];
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
    sortDirection?: 'asc' | 'desc'
}

const api = axios.create({
    baseURL: 'https://api.spoonacular.com',
    headers: {
        'x-api-key': process.env.EXPO_PUBLIC_API_KEY,
    },
});

export const foodApi = {
    searchIngredients: async ({
        query,
        limit=3,
        sort = 'calories',
        sortDirection = 'desc'
    }: IngredientSearchParams) : Promise<Ingredient[]> => {
        try{
            const response = await api.get<IngredientResponse>(
                '/food/ingredients/search',
                {
                    params: {
                        query,
                        number: limit,
                        sort,
                        sortDirection
                    }
                }
            );
            return response.data.results;
    } catch (error){
        console.error("Error searching ingredients:", error)
        throw new Error('Failed to search ingredients')
    }
},

    searchRecipes: async({
        query,
        limit = 3,
        sort = 'calories',
        sortDirection = 'desc'
    }: RecipeSearchParams): Promise<Recipe[]> => {
        try{
            const response = await api.get('/recipes/complexSearch', {
                params: {query, number: limit, sort, sortDirection}
            });
            return response.data.results;
        } catch (error) {
            console.error("Error searching recipes:", error);
            throw new Error('Failed to search recipes');
        }
    },


    getNutrition: async (ingredientId: number, amount: number, unit: string): Promise<NutritionInfo & { name: string }> => {
        try {
            const response = await api.get<{
                name: string;
                nutrition: {
                    nutrients: Array<{ name: string; amount: number; unit: string }>
                }
            }>(`/food/ingredients/${ingredientId}/information`, {
                params: { amount, unit }
            });

            const nutrients = response.data.nutrition.nutrients;
            return {
                name: response.data.name,
                protein: nutrients.find(n => n.name === 'Protein')?.amount || 0,
                calories: nutrients.find(n => n.name === 'Calories')?.amount || 0,
                carbs: nutrients.find(n => n.name === 'Carbohydrates')?.amount || 0,
                fat: nutrients.find(n => n.name === 'Fat')?.amount || 0,
                amount,
                unit
            };
        } catch (error) {
            console.error("Error fetching nutrition:", error);
            throw error;
        }
    },

    getRecipeInformation: async(recipeId: number) => {
        try {
            const response = await api.get(`/recipes/${recipeId}/information`)
            return {
                servings: response.data.servings,
                servingSizeGrams: response.data.nutrition.weightPerServing?.amount || 100 //default to 100 grams
            }
        } catch (error) {
            console.error("Error fetching recipe info:", error)
            throw error;
        }
    },

    getRecipeNutrition: async (recipeId: number): Promise<NutritionInfo> => {
        try {
            const response = await api.get(`/recipes/${recipeId}/nutritionWidget.json`);
            
            return {
                protein: parseFloat(response.data.protein.replace(/[^\d.]/g, "")),
                calories: parseFloat(response.data.calories.replace(/[^\d.]/g, "")),
                carbs: parseFloat(response.data.carbs.replace(/[^\d.]/g, "")),
                fat: parseFloat(response.data.fat.replace(/[^\d.]/g, "")),
                amount: 1, // Default amount
                unit: "serving" // Default unit
            };
        }  catch (error) {
            console.error("Error fetching recipe nutrition:", error);
            throw error;
        }
    }
};