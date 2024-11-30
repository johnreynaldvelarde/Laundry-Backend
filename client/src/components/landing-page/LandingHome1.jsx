import React from "react";

const LandingHome = () => {
  return (
    <div className="text-center py-20 bg-gray-50">
      <h1 className="text-4xl font-bold text-[#5787C8]">
        Welcome to Lizaso Laundry Hub
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        Your one-stop solution for all your laundry needs. Experience
        convenience and quality like never before.
      </p>

      <div className="mt-10">
        <h2 className="text-3xl font-semibold text-gray-800">Our Services</h2>
        <ul className="mt-4 space-y-2 text-left max-w-lg mx-auto">
          <li className="flex items-center space-x-2">
            <span className="text-xl text-[#5787C8]">🧺</span>
            <span>Wash and Fold</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="text-xl text-[#5787C8]">🧼</span>
            <span>Dry Cleaning</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="text-xl text-[#5787C8]">🧴</span>
            <span>Stain Removal</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="text-xl text-[#5787C8]">👕</span>
            <span>Alterations and Repairs</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="text-xl text-[#5787C8]">🚚</span>
            <span>Pickup and Delivery</span>
          </li>
        </ul>
      </div>

      <div className="mt-10">
        <h2 className="text-3xl font-semibold text-gray-800">Why Choose Us?</h2>
        <p className="mt-4 text-lg text-gray-600">
          <ul className="list-disc list-inside space-y-2">
            <li>- Reliable service with a satisfaction guarantee.</li>
            <li>- Eco-friendly products and methods.</li>
            <li>- Flexible pickup and delivery options.</li>
            <li>- Competitive pricing and loyalty rewards.</li>
          </ul>
        </p>
      </div>

      <div className="mt-10">
        <button
          onClick={() => alert("Get Started!")}
          className="bg-[#5787C8] text-white py-2 px-6 rounded-full hover:bg-[#456E9D] transition duration-300 ease-in-out shadow-lg"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default LandingHome;
