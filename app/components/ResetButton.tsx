import { Button } from "react-native";
import { useFood } from "../FoodProvider";
import React, { useState } from "react";

export const ResetButton = () => {
  const { resetFoods } = useFood();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleReset = async () => {
    await resetFoods();
    setShowConfirmation(false);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 2000); // Hide success message after 2 seconds
  };

  return (
    <div className="relative">
      <button
        onClick={() => {
          setShowConfirmation(true);
          setShowSuccess(false);
        }}
        className="w-full py-3 px-6 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
      >
        Reset Foods
      </button>

      {showConfirmation && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-medium mb-4">Confirm Reset</h2>
            <p>Are you sure you want to reset all foods?</p>
            <div className="mt-4">
              <button
                onClick={handleReset}
                className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              >
                Yes, Reset
              </button>
              <button
                onClick={() => setShowConfirmation(false)}
                className="py-2 px-4 ml-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-medium mb-4">Success!</h2>
            <p>All foods have been reset.</p>
            <button
              onClick={() => setShowSuccess(false)}
              className="mt-4 py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
