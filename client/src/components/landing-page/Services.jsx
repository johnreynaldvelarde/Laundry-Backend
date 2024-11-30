import React from "react";
import styles from "../../style"; // Assuming you have some global styles

const featuresData = [
  {
    title: "Easy Booking",
    description: "Book your laundry service in just a few clicks.",
    icon: "📅", // You can replace this with an actual icon or image
  },
  {
    title: "Track Your Orders",
    description: "Stay updated with real-time tracking of your laundry.",
    icon: "📦",
  },
  {
    title: "Quality Cleaning",
    description: "We ensure your clothes are cleaned with the best methods.",
    icon: "🧼",
  },
  {
    title: "Pickup & Delivery",
    description:
      "Enjoy hassle-free pickup and delivery right at your doorstep.",
    icon: "🚚", // Delivery truck icon
  },
];

// bg-gradient-to-r from-[#5787C8] to-[#447F8C]

const Services = () => {
  return (
    <div
      className="py-40 bg-gray-20  min-h-[915px] flex items-center"
      id="services"
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-500 text-center mb-10">
          Our Services
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-4">
          {featuresData.map((feature, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center transition-transform transform hover:scale-105 h-full"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-center">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
