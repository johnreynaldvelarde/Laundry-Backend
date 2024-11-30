import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const C_Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-3">
      <div className="container mx-auto px-4">
        {/* <div className="flex flex-col md:flex-row justify-center md:justify-between items-center"> */}
          {/* Company Info */}
          {/* <div className="mb-6 md:mb-0 text-center md:text-left w-full md:w-1/3">
            <h2 className="text-xl font-bold">Lizaso Laundry Hub</h2>
            <p className="text-sm mt-2">
            RW76+VG Balagtas, Bulacan
            </p>
            <p className="text-sm mt-1">Email: info@lizasohub.com</p>
            <p className="text-sm mt-1">Phone: +63-931-006-4466</p>
          </div> */}
          {/* Resources Section */}
          {/* <div className="mb-6 md:mb-0 w-full md:w-1/3 text-center">
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:underline">
                  About us
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Services
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div> */}
          {/* Social Media Icons */}
          {/* <div className="w-full md:w-1/3 text-center md:text-right">
            <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
            <div className="flex justify-center md:justify-end gap-4">
              <a
                href="#"
                aria-label="Facebook"
                className="text-gray-400 hover:text-white"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="text-gray-400 hover:text-white"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="text-gray-400 hover:text-white"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="text-gray-400 hover:text-white"
              >
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>
        </div> */}
        <div className="p-4 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} Lizaso Laundry Hub. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default C_Footer;

// import React from "react";

// const Footer = () => {
//   return (
//     <footer className="bg-gray-800 text-white py-8">
//       <div className="max-w-7xl mx-auto px-4">
//         <div className="flex flex-col md:flex-row justify-between items-center">
//           <div className="text-center md:text-left mb-4 md:mb-0">
//             <h3 className="text-2xl font-bold">Lizaso Laundry Hub</h3>
//             <p className="mt-2 text-sm">
//               Your trusted laundry service provider.
//             </p>
//           </div>
//           <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6">
//             <a
//               href="#"
//               className="hover:underline hover:text-gray-200 transition duration-300"
//             >
//               About Us
//             </a>
//             <a
//               href="#features"
//               className="hover:underline hover:text-gray-200 transition duration-300"
//             >
//               Services
//             </a>
//             <a
//               href="#"
//               className="hover:underline hover:text-gray-200 transition duration-300"
//             >
//               Contact
//             </a>
//             <a
//               href="#"
//               className="hover:underline hover:text-gray-200 transition duration-300"
//             >
//               Privacy Policy
//             </a>
//           </div>
//         </div>
//         <div className="mt-4 text-center">
//           <p className="text-sm">
//             © {new Date().getFullYear()} Lizaso Laundry Hub. All rights
//             reserved.
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;

{
  /* <footer className="bg-gradient-to-r from-[#448F8C] to-[#5787C8] text-white py-8"> */
}
