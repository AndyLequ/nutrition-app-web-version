import React, { useState } from "react";
import { SearchFood } from "../components/SearchFood";
import { CustomFood } from "../components/CustomFood";

const AddFood = () => {
  const [activeTab, setActiveTab] = useState<"search" | "custom">("search");

  return (
    <div className="flex flex-col h-full">
      {/* Tab Buttons */}
      <div className="flex flex-row bg-slate-100 p-1 justify-center">
        <button
          className={`rounded-lg px-6 py-2 mx-2 text-base font-semibold transition-all duration-200
            ${
              activeTab === "search"
                ? "bg-indigo-600 text-white shadow ring-2 ring-indigo-400"
                : "bg-slate-200 text-gray-800 hover:bg-slate-300"
            }
          `}
          onClick={() => setActiveTab("search")}
        >
          Add Food
        </button>
        <button
          className={`rounded-lg px-6 py-2 mx-2 text-base font-semibold transition-all duration-200
            ${
              activeTab === "custom"
                ? "bg-indigo-600 text-white shadow ring-2 ring-indigo-400"
                : "bg-slate-200 text-gray-800 hover:bg-slate-300"
            }
          `}
          onClick={() => setActiveTab("custom")}
        >
          Custom Food
        </button>
      </div>
      {/* Tab Content */}
      <div className="flex-1">
        {activeTab === "search" ? <SearchFood /> : <CustomFood />}
      </div>
    </div>
  );
};

export default AddFood;
