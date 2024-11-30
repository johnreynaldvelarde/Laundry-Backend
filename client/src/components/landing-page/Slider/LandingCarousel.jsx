import { useState, useEffect, useRef  } from "react"

export default function LandingCarousel({
  children: imagesData,
  autoSlide = false,
  autoSlideInterval = 5000,
}) {
  const [curr, setCurr] = useState(0)   // curr == current image
  const intervalRef = useRef(null); // Ref to store the interval

  const prev = () =>
    setCurr((curr) => (curr === 0 ? imagesData.length - 1 : curr - 1))
  const next = () =>
    setCurr((curr) => (curr === imagesData.length - 1 ? 0 : curr + 1))

  const resetTimer = () => { // reset the timer for the slider
    if (intervalRef.current) {
      clearInterval(intervalRef.current); // Clear the previous interval
    }
    intervalRef.current = setInterval(next, autoSlideInterval); // Start a new interval
  };
    
// Reset timer on component mount and when autoSlide/interval changes
useEffect(() => {
  resetTimer(); // Set the interval when the component mounts

  return () => {
    clearInterval(intervalRef.current);
  };
}, [autoSlide, autoSlideInterval]);
// Reset timer when curr (current slide) changes
useEffect(() => {
  if (autoSlide) {
    resetTimer();
  }
}, [curr, autoSlide]);

  return (
    <div className="relative flex items-center  p-5 md:gap:20  md:pr-20">
      <div className="overflow-hidden flex items-center justify-center">
        <div
          className="flex  items-center transition-transform ease-out duration-500 "
          style={{ transform: `translateX(-${curr * 100}%)` }}
        >
          {imagesData}
        </div>

        {/* <div className="absolute inset-0 flex items-center justify-between p-4">
          <button
            onClick={prev}
            className="p-1 rounded-full shadow bg-white/80 text-gray-800 hover:bg-white"
            resetTimer(); 
          >
            <FaChevronLeft size={40} />
          </button>
          <button
            onClick={next}
            className="p-1 rounded-full shadow bg-white/80 text-gray-800 hover:bg-white"
            resetTimer(); 
          >
          <FaChevronRight size={40} />
          </button>
        </div> */}
         
      </div>
          {/* Clickable Dots */}
        {imagesData.length > 0 && (
          <div className="absolute bottom-0 right-0 left-0 md:pt-0  md:flex md:top-0 md:bottom-0 md:right-0 md:left-auto md:pr-5">
            <div className="flex items-center justify-center gap-2 md:flex-col">
              {imagesData.map((_, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setCurr(i); // Change the current slide
                    resetTimer(); // Reset the timer when clicked
                  }}
                  className={`cursor-pointer transition-all w-2 h-2 lg:w-3 lg:h-3 bg-blue-600 rounded-full ${
                    curr === i
                      ? "bg-white border border-blue-600"
                      : "bg-blue-600"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
    </div>
    
  )
}