import React from "react";

const CustomFilter = () => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md w-full max-w-md mx-auto">
      {/* Filter Title */}
      <div className="mb-4 text-xl font-semibold text-gray-700">Filters</div>

      {/* Dropdown Filter */}
      <div className="mb-4">
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-600"
        >
          Category
        </label>
        <select
          id="category"
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select a Category</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="books">Books</option>
        </select>
      </div>

      {/* Checkbox Filter */}
      <div className="mb-4">
        <span className="block text-sm font-medium text-gray-600">
          Availability
        </span>
        <div className="flex items-center mt-2">
          <input
            id="in-stock"
            type="checkbox"
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="in-stock" className="ml-2 text-sm text-gray-700">
            In Stock
          </label>
        </div>
        <div className="flex items-center mt-2">
          <input
            id="out-of-stock"
            type="checkbox"
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="out-of-stock" className="ml-2 text-sm text-gray-700">
            Out of Stock
          </label>
        </div>
      </div>

      {/* Date Picker Filter */}
      <div className="mb-4">
        <label
          htmlFor="date"
          className="block text-sm font-medium text-gray-600"
        >
          Date
        </label>
        <input
          type="date"
          id="date"
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Filter Buttons */}
      <div className="flex items-center justify-between">
        <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
          Clear
        </button>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default CustomFilter;
