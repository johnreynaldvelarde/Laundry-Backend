import React from 'react';
import fb from "../../assets/images/facebook.png";
import comunicate from "../../assets/images/communicate.png";
import email from "../../assets/images/email.png";


const Contact = () => {

  return (
    <div
      className="bg-white py-40 min-h-[915px] flex items-center"
      id="contact"
    >
      <div className="justify-center items-center max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-6 text-[#5787C8]">
          Contact Us
        </h2>
        <p className="text-center text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
          We would love to hear from you! and we
          will get back to you as soon as possible.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white p-10 rounded-lg shadow-lg border border-gray-200">
            <p className="text-center text-lg text-gray-700 font-bold  mb-8 max-w-2xl mx-auto">
              If you have any questions and concerns, message us on:
            </p>
            <div className=" items-center gap-1 mb-5">
              <p className=" text-lg text-gray-700 max-w-2xl ">
                You can messsage or contact us on: 
              </p>
              <div className='px-0 md:px-10 pt-5 space-y-2'>
                <div className='flex items-center justify-center sm:justify-start'>
                  <a
                    href="https://web.facebook.com/pages/Lizaso-Laundry-Hub/371159776994348/?_rdc=1&_rdr"
                    target="_blank"
                    id="facebook-link"
                    className=' text-blue-700 hover:text-blue-500 text-sm xs:text-lg flex items-center'
                  >
                    <img 
                    src={fb} 
                    alt="Big Sale" 
                    className="bg-gray-100 rounded-xl  p-2 w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 hover:scale-110 transition-transform duration-100 mr-2 rounded-l-xl" // Adjust the size as needed
                  />
                    Lizaso Laundry Hub
                  </a>
                </div>
                <div className='flex items-center justify-center sm:justify-start'>
                  <img 
                    src={comunicate} 
                    alt="Big Sale" 
                    className="bg-gray-100 rounded-xl p-2 w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 hover:scale-110 transition-transform duration-100 mr-2 rounded-l-xl" // Adjust the size as needed
                  />
                  <p className=" text-blue-700 hover:text-blue-500 text-sm xs:text-lg">
                    +63-931-006-4466 
                  </p>
                </div>
                <div className='flex items-center justify-center sm:justify-start'>
                  <img 
                    src={email} 
                    alt="Big Sale" 
                    className="bg-gray-100 rounded-xl flex items-center justify-center p-2 w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 hover:scale-110 transition-transform duration-100 mr-2 rounded-l-xl" // Adjust the size as needed
                  />
                  <p className=" text-blue-700 hover:text-blue-500 text-sm xs:text-lg px-2">
                    lizazolaundryhub@gmail.com
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white p-10 rounded-lg shadow-lg border border-gray-200">
            {/* Google Map link */}
            <div className="w-full  text-center md:text-left items-center"> 
              <h2 className="text-lg  text-gray-700 font-bold  mb-8">You can visit us on:</h2>
              <p className=" text-lg text-gray-700 max-w-2xl mb-5 ">
                512 MacArthur Highway, San Juan, Balagtas, Bulacan 
              </p>
              <div className="relative w-full" style={{ paddingBottom: '30%' }}> 
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d246860.06540026376!2d120.62288761138919!3d14.814673868218325!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397ad3ba49ce853%3A0xc6554a9f835aeea1!2sLIZASO%20LAUNDRY%20HUB!5e0!3m2!1sen!2sph!4v1731408134298!5m2!1sen!2sph" 
                  className="absolute top-0 left-0 w-full h-full border-0"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

{/* <form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label
                  className="block text-sm font-semibold mb-2 text-gray-800"
                  htmlFor="name"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#5787C8] transition duration-200"
                  placeholder="Your Name"
                  required
                />
              </div>
              <div>
                <label
                  className="block text-sm font-semibold mb-2 text-gray-800"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#5787C8] transition duration-200"
                  placeholder="Your Email"
                  required
                />
              </div>
            </div>
            <div className="mb-6">
              <label
                className="block text-sm font-semibold mb-2 text-gray-800"
                htmlFor="message"
              >
                Message
              </label>
              <textarea
                id="message"
                className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#5787C8] transition duration-200"
                rows="6"
                placeholder="Your Message"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-[#5787C8] text-white font-semibold py-3 rounded-md hover:bg-[#4a6c9e] transition duration-200"
            >
              Send Message
            </button>
          </form> */}
// import React from "react";

// const Contact = () => {
//   return (
//     <div
//       className="bg-gray-50 py-40  min-h-[915px] flex items-center"
//       id="contact"
//     >
//       <div className="max-w-7xl mx-auto px-4">
//         <h2 className="text-4xl font-bold text-center mb-6 text-[#5787C8]">
//           Contact Us
//         </h2>
//         <p className="text-center text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
//           We would love to hear from you! Please fill out the form below, and we
//           will get back to you as soon as possible.
//         </p>
//         <div className="bg-white p-8 rounded-lg shadow-lg">
//           <form>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
//               <div>
//                 <label
//                   className="block text-sm font-semibold mb-2"
//                   htmlFor="name"
//                 >
//                   Name
//                 </label>
//                 <input
//                   type="text"
//                   id="name"
//                   className="w-full p-3 border border-gray-300 rounded-md"
//                   placeholder="Your Name"
//                   required
//                 />
//               </div>
//               <div>
//                 <label
//                   className="block text-sm font-semibold mb-2"
//                   htmlFor="email"
//                 >
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   id="email"
//                   className="w-full p-3 border border-gray-300 rounded-md"
//                   placeholder="Your Email"
//                   required
//                 />
//               </div>
//             </div>
//             <div className="mb-4">
//               <label
//                 className="block text-sm font-semibold mb-2"
//                 htmlFor="message"
//               >
//                 Message
//               </label>
//               <textarea
//                 id="message"
//                 className="w-full p-3 border border-gray-300 rounded-md"
//                 rows="5"
//                 placeholder="Your Message"
//                 required
//               ></textarea>
//             </div>
//             <button
//               type="submit"
//               className="w-full bg-[#5787C8] text-white font-semibold py-3 rounded-md hover:bg-[#4a6c9e]"
//             >
//               Send Message
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Contact;
