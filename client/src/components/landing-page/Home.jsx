import React, { useState } from "react";
// import { motion } from "framer-motion";
import m_1 from "../../assets/images/1636.jpg";
import styles from "../../style";
import LandingCarousel from "./Slider/LandingCarousel";
import { imagesData } from "./Slider/images";

// import background_1 from "../../assets/images/background_1.jpg";
// import background_2 from "../../assets/images/background_2.jpg";
// import background_3 from "../../assets/images/b_1.jpg";
// import background_4 from "../../assets/images/b_2.jpg";

// const images = [background_1, background_2, background_3, background_4];

const Home = ({  HandleCreateAccountPopup }) => { 
  //  HandleLoginPopup,
  // const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // const handlePrevClick = () => {
  //   setCurrentImageIndex((prevIndex) =>
  //     prevIndex === 0 ? images.length - 1 : prevIndex - 1
  //   );
  // };

  // const handleNextClick = () => {
  //   setCurrentImageIndex((prevIndex) =>
  //     prevIndex === images.length - 1 ? 0 : prevIndex + 1
  //   );
  // };

  return (
    <div
      className="bg-green-100 py-10 lg:pt-24"
      style={{
        backgroundImage: `url(${m_1})`,
        backgroundSize: "cover", 
        backgroundPosition: "center",
        backgroundBlendMode: "overlay",
        backgroundColor: styles.divider,
      }}
    >

      <div className="container mx-auto flex flex-col items-center lg:items-start lg:flex-row min-h-[765px]">
        {/* Text content  (i remove - items-center when the screen was large )*/}
        <div className="lg:w-1/2 px-4 lg:px-0 lg:mr-20 flex flex-col items-center lg:items-start text-center lg:text-left mb-10 lg:mb-0">
          {/* Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl tracking-wide">
            <div>
              <span className="font-bold" style={{ color: styles.primary }}>
                LIZASO
              </span>
            </div>
            <div>
              <span className="font-bold" style={{ color: styles.secondary }}>
                QUALITY AND CONVENIENCE
              </span>
            </div>
          </h1>

          {/* Description */}
          <div className="mt-4 max-w-2xl">
            <p
              className="font-medium text-xl leading-relaxed"
              style={{ color: styles.primary }}
            >
              Discover our reliable laundry services, where we expertly wash,
              dry, and fold your clothes, ensuring they stay fresh, clean, and
              ready to wear.
            </p>
          </div>

          {/* Button */}
          <div className="mt-10">
            <button
              onClick={HandleCreateAccountPopup}
              className="inline-block text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 p-4 rounded-full shadow-md transition duration-300"
              style={{ background: styles.buttonColor1 }}
            >
              Get Service Now
            </button>
          </div>
        </div>
        <div className=" lg:w-1/2 lg:h-1/2 w-80 p-3 lg:px-5 relative flex justify-center bg-blue-50 rounded-xl shadow-xl ">
          <LandingCarousel>
               {imagesData.map((image) => (
                 <img key={image.id} src={image.img} alt={`Slide ${image.id}`} className="w-full h-auto rounded-md" />
              ))}
          </LandingCarousel>
        </div>

        {/* Image Container with Floating Box */}
        {/* <div className="lg:w-1/2 px-4 lg:px-0 relative flex justify-center">
          <div className="relative bg-white shadow-lg p-4 rounded-md flex items-center justify-center md:h-[500px] md:w-[700px] lg:h-[500px] lg:w-[650px]"> */}
            {/* Left Arrow */}
            {/* <button
              className="absolute left-[-30px] top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow-md p-2"
              onClick={handlePrevClick}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button> */}

            {/* Image */}
            {/* <img
              src={images[currentImageIndex]}
              alt="Laundry Service"
              className="w-full h-full object-cover rounded-md"
            /> */}

            {/* Right Arrow */}
            {/* <button
              className="absolute right-[-30px] top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow-md p-2"
              onClick={handleNextClick}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Home;
