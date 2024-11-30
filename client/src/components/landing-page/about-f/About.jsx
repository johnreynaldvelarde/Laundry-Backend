
import React from "react";
import CustomerSatisfaction from "./CustomerSatisfaction";
import EcoFriendly from "./EcoFriendly";
import QualityService from "./QualityService";

const About = () => {
  return ( 
    <div
      className="bg-blue-50   min-h-[915px] flex items-center pt-10 lg:pt-0"
      id="about"
    >
      <div className="max-w-7xl mx-auto px-4 pt-10 lg:pt-5">
        <h2 className="text-4xl font-bold text-center mb-6 text-[#5787C8]">
          About Us
        </h2>
        <p className="text-center text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
          At Lizaso Laundry Hub, we are committed to providing exceptional
          laundry services that make your life easier and more convenient. Our
          team is dedicated to ensuring your clothes are cleaned and cared for
          with the utmost attention to detail.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-1 lg:gap-6 px-5">
        <div className="bg-white rounded-lg shadow-lg flex items-center justify-center">
          <QualityService />
        </div>
        <div className="bg-white rounded-lg shadow-lg flex items-center justify-center">
          <EcoFriendly />
        </div>
        <div className="bg-white rounded-lg shadow-lg flex items-center justify-center">
          <CustomerSatisfaction />
        </div>
      </div>
      </div>
    </div>
  );
};

export default About;



// src/components/landing-page/about-f/About.jsx
// import React from "react";

// const About = () => {
//   return (
//     <div
//       className="bg-gray-50 py-40  min-h-[915px] flex items-center"
//       id="about"
//     >
//       <div className="max-w-7xl mx-auto px-4">
//         <h2 className="text-4xl font-bold text-center mb-6 text-[#5787C8]">
//           About Us
//         </h2>
//         <p className="text-center text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
//           At Lizaso Laundry Hub, we are committed to providing exceptional
//           laundry services that make your life easier and more convenient. Our
//           team is dedicated to ensuring your clothes are cleaned and cared for
//           with the utmost attention to detail.
//         </p>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="bg-white p-6 rounded-lg shadow-lg text-center">
//             <h3 className="text-2xl font-semibold text-[#5787C8] mb-2">
//               Quality Service
//             </h3>
//             <p className="text-gray-600">
//               We use high-quality detergents and equipment to ensure your
//               laundry is spotless and fresh.
//             </p>
//           </div>
//           <div className="bg-white p-6 rounded-lg shadow-lg text-center">
//             <h3 className="text-2xl font-semibold text-[#5787C8] mb-2">
//               Eco-Friendly
//             </h3>
//             <p className="text-gray-600">
//               Our processes are designed to be environmentally friendly,
//               reducing waste and conserving water.
//             </p>
//           </div>
//           <div className="bg-white p-6 rounded-lg shadow-lg text-center">
//             <h3 className="text-2xl font-semibold text-[#5787C8] mb-2">
//               Customer Satisfaction
//             </h3>
//             <p className="text-gray-600">
//               Your satisfaction is our top priority, and we strive to exceed
//               your expectations with every service.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default About;
