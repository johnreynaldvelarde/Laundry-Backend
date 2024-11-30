import React from "react";
import {
  FaClock,
  FaLeaf,
  FaTruck,
  FaUsers,
  FaHeart,
  FaMoneyBillWave,
  FaCheckCircle,
} from "react-icons/fa"; // Importing additional icons
import background from "../../assets/images/background_3.jpg";

const Features = () => {
  return (
    <div
      className="py-40 min-h-[800px] flex flex-col items-center"
      id="features"
      style={{
        background: `linear-gradient(to right, rgba(68, 127, 140, 0.8), rgba(87, 135, 200, 0.8)), url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h2 className="text-4xl font-bold text-white mb-8 flex items-center justify-center mx-auto px-10 ">
        Features of Lizaso Laundry Hub
      </h2>
      <div className="container mx-auto flex flex-wrap justify-center">
        {/* Feature 1 */}
        <div className="bg-white rounded-lg shadow-lg p-6 m-4 w-[300px] flex flex-col items-center">
          <FaClock className="text-[#447F8C] text-4xl mb-4" />
          <h3 className="text-xl font-semibold text-[#5787C8] mb-2 text-center">
            Quick Turnaround
          </h3>
          <p className="text-gray-700 text-center">
            Enjoy swift laundry services that ensure your clothes are cleaned,
            dried, and folded in no time.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="bg-white rounded-lg shadow-lg p-6 m-4 w-[300px] flex flex-col items-center">
          <FaLeaf className="text-[#447F8C] text-4xl mb-4" />
          <h3 className="text-xl font-semibold text-[#5787C8] mb-2 text-center">
            Eco-Friendly Products
          </h3>
          <p className="text-gray-700 text-center">
            We use environmentally friendly detergents to protect your clothes
            and the planet.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="bg-white rounded-lg shadow-lg p-6 m-4 w-[300px] flex flex-col items-center">
          <FaTruck className="text-[#447F8C] text-4xl mb-4" />
          <h3 className="text-xl font-semibold text-[#5787C8] mb-2 text-center">
            Flexible Pickup & Delivery
          </h3>
          <p className="text-gray-700 text-center">
            Enjoy the convenience of our flexible pickup and delivery options
            tailored to your schedule.
          </p>
        </div>

        {/* Feature 4 */}
        <div className="bg-white rounded-lg shadow-lg p-6 m-4 w-[300px] flex flex-col items-center">
          <FaUsers className="text-[#447F8C] text-4xl mb-4" />
          <h3 className="text-xl font-semibold text-[#5787C8] mb-2 text-center">
            Professional Team
          </h3>
          <p className="text-gray-700 text-center">
            Our dedicated staff are trained professionals committed to providing
            the highest quality laundry services.
          </p>
        </div>

        {/* Feature 5 */}
        <div className="bg-white rounded-lg shadow-lg p-6 m-4 w-[300px] flex flex-col items-center">
          <FaHeart className="text-[#447F8C] text-4xl mb-4" />
          <h3 className="text-xl font-semibold text-[#5787C8] mb-2 text-center">
            Customer Satisfaction
          </h3>
          <p className="text-gray-700 text-center">
            We prioritize your satisfaction and ensure your laundry needs are
            met with care and precision.
          </p>
        </div>

        {/* Feature 6 */}
        <div className="bg-white rounded-lg shadow-lg p-6 m-4 w-[300px] flex flex-col items-center">
          <FaMoneyBillWave className="text-[#447F8C] text-4xl mb-4" />
          <h3 className="text-xl font-semibold text-[#5787C8] mb-2 text-center">
            Affordable Pricing
          </h3>
          <p className="text-gray-700 text-center">
            Enjoy competitive pricing on all our services without compromising
            on quality.
          </p>
        </div>

        {/* Feature 7 */}
        <div className="bg-white rounded-lg shadow-lg p-6 m-4 w-[300px] flex flex-col items-center">
          <FaCheckCircle className="text-[#447F8C] text-4xl mb-4" />
          <h3 className="text-xl font-semibold text-[#5787C8] mb-2 text-center">
            Quality Assurance
          </h3>
          <p className="text-gray-700 text-center">
            Each item is handled with care and thoroughly checked to ensure the
            best results.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Features;
