import React from "react";

const services = [
  { id: 1, label: "Wash" },
  { id: 2, label: "Wash/Dry" },
  { id: 3, label: "Wash/Dry/Fold" },
];

const SelectionService = () => {
  return (
    <div className="py-8 px-4 md:px-6 lg:px-8 mb-20">
      <h2 className="text-2xl font-bold text-center mb-6">
        Select a Laundry Service
      </h2>
      <div className="flex flex-wrap justify-center gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="flex flex-col items-center bg-white border rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 ease-in-out w-full sm:w-64"
          >
            <span className="text-lg font-medium">{service.label}</span>
            <p className="mt-2 text-gray-600">
              Details about {service.label} service.
            </p>
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 ease-in-out">
              Select
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectionService;
