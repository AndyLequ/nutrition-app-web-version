import { Button } from "react-native";
import { useFood } from "../FoodProvider";

export const ResetButton = () => {
  const { resetFoods } = useFood();
  


  return (
    <button
      onClick={async () => {
        await resetFoods();
      }}
      className="w-full py-3 px-6 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
    >
      Reset Foods
    </button>
  );
};
