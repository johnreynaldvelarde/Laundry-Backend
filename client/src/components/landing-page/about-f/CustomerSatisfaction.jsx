import React, { useState, useEffect } from 'react';
import arrow from "../Slider/arrow.png";
import logo from "../Slider/ImagesCollection/0logo.jpg";

const CustomerSatisfaction = () => {

    const [isOwnerAbouts, setOwnerAbouts] = useState(false); // State to control showing/hiding
    const [timeLeft, setTimeLeft] = useState(0); // State to track countdown time
    const [intervalId, setIntervalId] = useState(null); // To store the interval ID

  const toggleForms = () => {
    if (isOwnerAbouts) {
      // If the timer is running and `isOwnerAbouts` is true, stop the timer
      clearInterval(intervalId); // Clear the interval to stop the timer
      setOwnerAbouts(false); // Hide the text when clicked
      setTimeLeft(0); // Reset the timer to 0
    } else {
      // If `isOwnerAbouts` is false, start the timer and show the text
      setOwnerAbouts(true);
      setTimeLeft(25000); // Set the countdown timer to 10 seconds

      const newIntervalId = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime > 100) {
            return prevTime - 100; // Decrease the time by 1 every second
          } else {
            setOwnerAbouts(false); // Hide the text when the countdown reaches 0
            clearInterval(newIntervalId); // Clear the interval when done
            return 0;
          }
        });
      }, 100); // Update every 1 second

      setIntervalId(newIntervalId); // Save the interval ID for later clearing
    }
  };

  useEffect(() => {
    // Clear the interval when the component unmounts or `isOwnerAbouts` is toggled
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);
  
  return (
    <div className='p-6 lg:p-10 w-[500px] md:w-[700px] lg:w-[900px] h-full flex items-center justify-center'>
        <div className='w-full h-auto bg-blue-50 rounded-xl '>
            <div className='items-center'>
                <div className='bg-slate-200 rounded-t-xl'>
                    <div className='flex items-center justify-between'>
                        <div className='p-2'>
                            <button onClick={toggleForms} type="submit">
                                <div className=''>
                                {isOwnerAbouts ? (
                                    <div className={`items-center px-2 ${isOwnerAbouts ? ' ' : 'hidden'} `}>
                                    <div className='flex items-center bg-slate-700 rounded-full p-1'>
                                        <img src={arrow}alt="arrow back" className="size-4" />
                                    </div>
                                    </div>
                                ) : (                  
                                    <div className='flex items-center justify-start p-3 bg-slate-700 rounded-full'>
                                    </div>
                                )}
                                </div>
                            </button>
                        </div>
                        <div>
                            <div className='h-5 w-20 bg-slate-700 rounded-lg flex items-center justify-center'>
                                {isOwnerAbouts ? (
                                // Show countdown instead of static text
                                <p className="text-white text-center text-[10px] tracking-wide uppercase">
                                    {timeLeft}
                                </p>
                                ) : (
                                <p className='text-white text-center text-[10px] tracking-wide uppercase'>
                                    LAUNDRY
                                </p>
                                )}
                            </div>
                        </div>
                        {isOwnerAbouts ? (
                            <div className='flex items-center justify-end space-x-4 px-5'>
                                <div className='p-2 rounded-full animate-running-color-1'></div>
                                <div className='p-2 rounded-full animate-running-color-2'></div>
                                <div className='p-2 rounded-full animate-running-color-3'></div>
                            </div>
                            
                        ) : (
                            <div className='flex items-center justify-end space-x-4 px-5'>
                                <div className='p-2 bg-green-600 rounded-full'></div>
                                <div className='p-2 bg-red-600 rounded-full'></div>
                                <div className='p-2 bg-orange-600 rounded-full'></div>
                            </div>
                        )}
                    </div>
                    <div className='flex items-center justify-center bg-blue-200 p-5 h-52'>
                        {isOwnerAbouts ? (
                            <p className="text-gray-600">
                                Your satisfaction is our top priority, and we strive to exceed
                                your expectations with every service.
                            </p>
                        ) : (
                            <div className='items-center p-2 bg-slate-600 rounded-full'>
                                <button onClick={toggleForms} type="submit"  disabled={isOwnerAbouts} >
                                    <img src={logo} alt="logo" className="w-40 rounded-full " />
                                </button>
                            </div>
                        )}

                    </div>
                </div>
                <div className='w-auto h-auto border-none overflow-hidden rounded-b-xl bg-slate-200 flex items-center justify-center '>
                    <button onClick={toggleForms} type="submit"  disabled={isOwnerAbouts} >
                        <div className='p-2'>
                        {isOwnerAbouts ? (
                            <p className="py-5 px-4 flex items-center text-[19px] font-bold text-black tracking-wide uppercase">
                            Customer Satisfaction 
                            </p>
                        ) : (
                            <p className="py-5 px-4 flex items-center text-[20px] font-bold text-black tracking-wide uppercase">
                            about Customer?
                            </p>
                        )}
                        </div>
                    </button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default CustomerSatisfaction
