import React from "react";
import bigSaleGif from "../../assets/images/big-sale.gif";
import freeGif from "../../assets/images/free.gif";
import priceTagGif from "../../assets/images/price-tag.gif";
import moreGif from "../../assets/images/more.gif";
import mustHaveGif from "../../assets/images/must-have.gif";
import background from "../../assets/images/background_3.jpg";

const Pricing = () => {
  return (
    <div
      className="bg-slate-200 py-4  min-h-[915px] flex items-center "
      id="pricing"
    >
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-10 text-[#5787C8]">
          Service and Product Prices
        </h2>
        {/* Main Grid */}
        <div className="w-full mx-auto ">
          <div className="grid grid-cols-1 md:grid-cols-2  px-2 gap-5 lg:px-40 md:px-4 w-full">
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md w-full">
              <div className="flex items-center mb-4 bg-white rounded-xl">
                <img
                  src={bigSaleGif}
                  alt="Big Sale"
                  className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 hover:scale-110 transition-transform duration-300 mr-2 rounded-l-xl" // Adjust the size as needed
                />
                <h3 className="text-2xl font-bold text-black">Promo Day</h3>
              </div>
              <ul className="mt-2 text-gray-600 grid grid-cols-2  sm:flex items-center sm:justify-evenly sm:gap-5">
                <li>Monday</li>
                <li>Tuesday</li>
                <li>Wednesday</li>
              </ul>
              <div className="flex items-center justify-evenly space-x-5">
                <ul className="items-center mt-4 gap-5 text-xl font-semibold mb-4">
                  <li className="py-1">Wash</li>
                  <li className="py-1">Dry</li>
                  <li className="py-1">Fold</li>
                </ul>
                <ul className="items-center mt-4 gap-5 text-xl font-semibold mb-4">
                  <li className="py-1">--</li>
                  <li className="py-1">--</li>
                  <li className="py-1">--</li>
                </ul>
                <ul className="items-center mt-4 gap-5 text-2xl font-bold text-[#5787C8] mb-4">
                  <li className="py-1">₱55.00</li>
                  <li className="py-1">₱55.00</li>
                  <li className="py-1">₱30.00</li>
                </ul>
              </div>
            </div>
            {/* Card 2 */}
            <div className=" bg-white p-6 rounded-lg shadow-md w-full">
              <div className="flex items-center mb-4 bg-white rounded-xl">
                <img
                  src={priceTagGif}
                  alt="Big Sale"
                  className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 hover:scale-110 transition-transform duration-300 mr-2 rounded-l-xl" // Adjust the size as needed
                />
                <h3 className="text-2xl font-bold text-black">Regular Day</h3>
              </div>
              <ul className="mt-2 text-gray-600 grid grid-cols-2 md:flex items-center justify-evenly gap-5">
                <li>Thursday</li>
                <li>Friday</li>
                <li>Saturday</li>
                <li>Sunday</li>
              </ul>
              <div className="flex items-center justify-evenly space-x-5">
                <ul className="items-center mt-4 gap-5 text-xl font-semibold mb-4">
                  <li className="py-1">Wash</li>
                  <li className="py-1">Dry</li>
                  <li className="py-1">Fold</li>
                </ul>
                <ul className="items-center mt-4 gap-5 text-xl font-semibold mb-4">
                  <li className="py-1">--</li>
                  <li className="py-1">--</li>
                  <li className="py-1">--</li>
                </ul>
                <ul className="items-center mt-4 gap-5 text-2xl font-bold text-[#5787C8] mb-4">
                  <li className="py-1">₱65.00</li>
                  <li className="py-1">₱60.00</li>
                  <li className="py-1">₱30.00</li>
                </ul>
              </div>
            </div>
          </div>
          {/* Secondary Grid */}
          <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 py-5 px-2 md:px-4 w-full">
              {/* Card 3 */}
              <div className="bg-white p-6 rounded-lg shadow-md w-full">
                <div className="flex items-center mb-4 bg-white rounded-xl">
                  <img
                    src={freeGif}
                    alt="Big Sale"
                    className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 hover:scale-110 transition-transform duration-300 mr-2 rounded-l-xl" // Adjust the size as needed
                  />
                  <h3 className="text-2xl font-bold text-black">
                    Special Promo
                  </h3>
                </div>
                <p className="mt-2 text-gray-600">
                  Loyal customers with 8 times service availed get our +1 free
                  laundry
                </p>
                <div className="flex items-center justify-start pt-3">
                  <ul className="text-white flex gap-1">
                    <li className="bg-blue-500 text-sm text-center rounded-full w-5">
                      1
                    </li>
                    <li className="bg-blue-500 text-sm text-center rounded-full w-5">
                      2
                    </li>
                    <li className="bg-blue-500 text-sm text-center rounded-full w-5">
                      3
                    </li>
                    <li className="bg-blue-500 text-sm text-center rounded-full w-5">
                      4
                    </li>
                    <li className="bg-blue-500 text-sm text-center rounded-full w-5">
                      5
                    </li>
                    <li className="bg-blue-500 text-sm text-center rounded-full w-5">
                      6
                    </li>
                    <li className="bg-blue-500 text-sm text-center rounded-full w-5">
                      7
                    </li>
                    <li className="bg-blue-500 text-sm text-center rounded-full w-5">
                      8
                    </li>
                    <li className="bg-red-500 text-sm text-center rounded-full w-6">
                      9
                    </li>
                  </ul>
                </div>
                <div className="flex items-center pl-10 sm:pl-0 gap-1">
                  <p className="mt-2 text-black font-semibold font-mono text-[30px]">
                    8 + 1
                  </p>
                  <p className="mt-2 text-red-600 font-semibold font-mono text-[30px]">
                    Free
                  </p>
                </div>

                <p className="mt-2 text-blue-800 font-bold font-serif pl-10 sm:pl-0">
                  Wash & Dry, Wash or Dry
                </p>
              </div>
              {/* Card 4 */}
              <div className=" bg-white p-6 rounded-lg shadow-md w-full">
                <div className="flex items-center mb-4 bg-white rounded-xl">
                  <img
                    src={mustHaveGif}
                    alt="Big Sale"
                    className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 hover:scale-110 transition-transform duration-100 mr-2 rounded-l-xl" // Adjust the size as needed
                  />
                  <h3 className="text-2xl font-bold text-black">
                    Other Necessities
                  </h3>
                </div>
                <p className="mt-2 text-gray-600">
                  We also sell and offers different type of:
                </p>
                <div className="flex items-center justify-evenly space-x-5">
                  <ul className="items-center mt-4 gap-5 text-xl font-semibold mb-4">
                    <li className="py-1">Soap</li>
                    <li className="py-1">Downy</li>
                    <li className="py-1">Bleach</li>
                  </ul>
                  <ul className="items-center mt-4 gap-5 text-xl font-semibold mb-4">
                    <li className="py-1">--</li>
                    <li className="py-1">--</li>
                    <li className="py-1">--</li>
                  </ul>
                  <ul className="items-center mt-4 gap-5 text-2xl font-bold text-[#5787C8] mb-4">
                    <li className="py-1">₱8.00</li>
                    <li className="py-1">₱8.00</li>
                    <li className="py-1">₱5.00</li>
                  </ul>
                </div>
              </div>
              {/* Card 5 */}
              <div className=" bg-white p-6 rounded-lg shadow-md w-full">
                <div className="flex items-center mb-4 bg-white rounded-xl">
                  <img
                    src={moreGif}
                    alt="Big Sale"
                    className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 hover:scale-110 transition-transform duration-300 mr-2 rounded-l-xl" // Adjust the size as needed
                  />
                  <h3 className="text-2xl font-bold text-black">
                    Other Service
                  </h3>
                </div>
                <p className="mt-2 text-gray-600">
                  Other services we offer are:{" "}
                </p>
                <div className="flex items-center justify-evenly space-x-5">
                  <ul className="list-disc list-inside items-center mt-4 gap-5 text-xl font-semibold mb-4">
                    <li className="py-1">Iron</li>
                    <li className="py-1">Bounce</li>
                  </ul>
                  <ul className="list-disc list-inside items-center mt-4 gap-5 text-xl font-semibold mb-4">
                    <li className="py-1">Pickup</li>
                    <li className="py-1">Delivery</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;

{
  /* return (
    <div className="bg-slate-200 sm:p-10 pt-20 py-4  min-h-[915px] flex items-center "
      id="pricing">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-10 text-[#5787C8]">
          Pricing
        </h2>
      </div> */
}
{
  /* Main Grid */
}
{
  /* <div className="w-full mx-auto ">
        <div className="grid grid-cols-1 md:grid-cols-2  px-2 gap-2 lg:px-40 md:px-4 w-full"> */
}
{
  /* Card 1 */
}
{
  /* <div className="bg-[#f9f9f9] p-6 rounded-lg shadow-md w-full">
            <h3 className="text-2xl font-bold text-black mb-4">Promo Day</h3>
            <ul className="mt-2 text-gray-600 grid grid-cols-2  sm:flex items-center sm:justify-evenly sm:gap-5">
              <li>Monday</li>
              <li>Tuesday</li>
              <li>Wednesday</li>
            </ul>
            <div className="flex items-center justify-evenly space-x-5">
              <ul className="items-center mt-4 gap-5 text-xl font-semibold mb-4">
                <li className="py-1">Wash</li>
                <li className="py-1">Dry</li>
                <li className="py-1">Fold</li>
              </ul>
              <ul className="items-center mt-4 gap-5 text-xl font-semibold mb-4">
                <li className="py-1">--</li>
                <li className="py-1">--</li>
                <li className="py-1">--</li>
              </ul>
              <ul className="items-center mt-4 gap-5 text-2xl font-bold text-[#5787C8] mb-4">
                <li className="py-1">₱55.00</li>
                <li className="py-1">₱55.00</li>
                <li className="py-1">₱30.00</li>
              </ul>
            </div>
          </div> */
}
{
  /* Card 2
          <div className="bg-[#f9f9f9] p-6 rounded-lg shadow-md w-full">
            <h3 className="text-2xl font-bold text-black mb-4">Regular Day</h3>
            <ul className="mt-2 text-gray-600 grid grid-cols-2 md:flex items-center justify-evenly gap-5">
              <li>Thursday</li>
              <li>Friday</li>
              <li>Saturday</li>
              <li>Sunday</li>
            </ul>
            <div className="flex items-center justify-evenly space-x-5">
              <ul className="items-center mt-4 gap-5 text-xl font-semibold mb-4">
                <li className="py-1">Wash</li>
                <li className="py-1">Dry</li>
                <li className="py-1">Fold</li>
              </ul>
              <ul className="items-center mt-4 gap-5 text-xl font-semibold mb-4">
                <li className="py-1">--</li>
                <li className="py-1">--</li>
                <li className="py-1">--</li>
              </ul>
              <ul className="items-center mt-4 gap-5 text-2xl font-bold text-[#5787C8] mb-4">
                <li className="py-1">₱65.00</li>
                <li className="py-1">₱60.00</li>
                <li className="py-1">₱30.00</li>
              </ul>
            </div>
          </div>
        </div> */
}
{
  /* Secondary Grid */
}
{
  /* <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 py-2 px-2 md:px-4 w-full"> */
}
{
  /* Card 3 */
}
{
  /* <div className="bg-[#f9f9f9] p-6 rounded-lg shadow-md w-full">
              <h3 className="text-2xl font-bold text-black mb-4">Special Promo</h3>
              <p className="mt-2 text-gray-600">Loyal customers with 7 times service availed get our +1 free laundry</p>
              <div className="flex items-center pl-10 sm:pl-0 gap-1">
                <p className="mt-2 text-black font-semibold font-mono text-[30px]">7 + 1</p>
                <p className="mt-2 text-red-600 font-semibold font-mono text-[30px]">Free</p>
              </div>
              <p className="mt-2 text-blue-800 font-bold font-serif pl-10 sm:pl-0">Wash & Dry, Wash or Dry</p>
            </div> */
}
{
  /* Card 4 */
}
{
  /* <div className="bg-[#f9f9f9] p-6 rounded-lg shadow-md w-full">
              <h3 className="text-2xl font-bold text-black mb-4">Other Necessities</h3>
              <p className="mt-2 text-gray-600">We also sell and offers different type of:</p>
              <div className="flex items-center justify-evenly space-x-5">
                <ul className="items-center mt-4 gap-5 text-xl font-semibold mb-4">
                  <li className="py-1">Soap</li>
                  <li className="py-1">Downy</li>
                  <li className="py-1">Bleach</li>
                </ul>
                <ul className="items-center mt-4 gap-5 text-xl font-semibold mb-4">
                  <li className="py-1">--</li>
                  <li className="py-1">--</li>
                  <li className="py-1">--</li>
                </ul>
                <ul className="items-center mt-4 gap-5 text-2xl font-bold text-[#5787C8] mb-4">
                  <li className="py-1">₱8.00</li>
                  <li className="py-1">₱8.00</li>
                  <li className="py-1">₱5.00</li>
                </ul>
              </div>
            </div> */
}
{
  /* Card 5 */
}
{
  /* <div className="bg-[#f9f9f9] p-6 rounded-lg shadow-md w-full">
              <h3 className="text-2xl font-bold text-black mb-4">Other Services</h3>
              <p className="mt-2 text-gray-600">Other services we offer are: </p>
              <div className="flex items-center justify-evenly space-x-5">
                <ul className="list-disc list-inside items-center mt-4 gap-5 text-xl font-semibold mb-4">
                  <li className="py-1">Iron</li>
                  <li className="py-1">Bounce</li>
                </ul>
                <ul className="list-disc list-inside items-center mt-4 gap-5 text-xl font-semibold mb-4">
                  <li className="py-1">Pickup</li>
                  <li className="py-1">Delivery</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing; */
}

{
  /* // src/components/landing-page/Pricing.jsx
// import React from "react";
// import styles from "../../style"; // Assuming you have styles defined

// const Pricing = () => { */
}
{
  /* //   const pricingPlans = [ */
}
{
  /* //     { */
}
{
  /* //       title: "Basic Plan",
//       price: "₱55.00",
//       features: ["Washing", "Drying", "Folding", "Basic customer support"],
//     },
    // { */
}
{
  /* //   title: "Standard Plan",
    //   price: "₱65.00",
    //   features: [
    //     "Washing",
    //     "Drying",
    //     "Folding",
    //     "Priority customer support",
    //     "Discounts on bulk orders",
    //   ],
    // },
    // { */
}
{
  /* //       title: "Premium Plan",
//       price: "$49.99",
//       features: [
//         "Washing",
//         "Drying",
//         "Folding",
//         "24/7 customer support",
//         "Free pickup and delivery",
//         "Special discounts",
//       ],
//     },
//   ];

//   return (
//     <div className=" ">
//       <div */
}
{
  /* //         className="bg-white py-4  min-h-[915px] flex items-center "
//         id="pricing"
//       >
//         <div className="max-w-7xl mx-auto px-4">
//           <h2 className="text-4xl font-bold text-center mb-10 text-[#5787C8]">
//             Pricing Plans
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {pricingPlans.map((plan, index) => (
//               <div key={index} className="bg-white rounded-lg shadow-lg p-6">
//                 <h3 className="text-xl font-semibold mb-4">{plan.title}</h3>
//                 <p className="text-2xl font-bold text-[#5787C8] mb-4">
//                   {plan.price}
//                 </p>
//                 <ul className="list-disc list-inside mb-6">
//                   {plan.features.map((feature, featureIndex) => (
//                     <li key={featureIndex} className="text-gray-700">
//                       {feature}
//                     </li>
//                   ))}
//                 </ul> */
}
{
  /* <button className="w-full bg-[#5787C8] text-white font-semibold py-2 rounded-md hover:bg-[#4a6c9e]">
                  Choose Plan
                </button> */
}
{
  /* //               </div> */
}
{
  /* //             ))}
//           </div>
//         </div>
//       </div>
//       <div className="bg-white">
//         7 + 1
//       </div>
//   </div>
   
    
//   );
// };

// export default Pricing; */
}

{
  /* // import React from "react";
// import styles from "../../style";

// const Pricing = () => {
//   return ( */
}
{
  /* //     <div className="mt-52 min-h-[500px] bg-white mx-20 shadow-lg rounded-lg flex items-center justify-center">
//       {/* Add your pricing content here */
}
{
  /* //       <div className="p-10 flex flex-col items-center">
//         <h2 className="text-2xl font-bold mb-6 text-center">Pricing Plans</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           {/* Example Pricing Card */
}
{
  /* //           <div className="bg-[#f9f9f9] p-6 rounded-lg shadow-md">
//             <h3 className="text-xl font-semibold">Basic Plan</h3>
//             <p className="mt-2 text-gray-600">$10/month</p>
//             <ul className="mt-4">
//               <li className="py-1">✔️ Feature 1</li>
//               <li className="py-1">✔️ Feature 2</li>
//               <li className="py-1">✔️ Feature 3</li>
//             </ul>
//             <button className="mt-4 py-2 px-4 bg-blue-500 text-white rounded-lg">
//               Choose Plan
//             </button>
//           </div> */
}

{
  /* //           Add more pricing cards as needed */
}
{
  /* //           <div className="bg-[#f9f9f9] p-6 rounded-lg shadow-md">
//             <h3 className="text-xl font-semibold">Standard Plan</h3>
//             <p className="mt-2 text-gray-600">$20/month</p>
//             <ul className="mt-4">
//               <li className="py-1">✔️ Feature 1</li>
//               <li className="py-1">✔️ Feature 2</li>
//               <li className="py-1">✔️ Feature 3</li>
//               <li className="py-1">✔️ Feature 4</li>
//             </ul>
//             <button className="mt-4 py-2 px-4 bg-blue-500 text-white rounded-lg">
//               Choose Plan
//             </button>
//           </div>

//           <div className="bg-[#f9f9f9] p-6 rounded-lg shadow-md">
//             <h3 className="text-xl font-semibold">Premium Plan</h3>
//             <p className="mt-2 text-gray-600">$30/month</p>
//             <ul className="mt-4">
//               <li className="py-1">✔️ Feature 1</li>
//               <li className="py-1">✔️ Feature 2</li>
//               <li className="py-1">✔️ Feature 3</li>
//               <li className="py-1">✔️ Feature 4</li>
//               <li className="py-1">✔️ Feature 5</li>
//             </ul>
//             <button className="mt-4 py-2 px-4 bg-blue-500 text-white rounded-lg">
//               Choose Plan
//             </button>
//           </div>
//         </div>
//       </div>
//     </div> */
}
{
  /* //   );
// };

// export default Pricing; */
}
