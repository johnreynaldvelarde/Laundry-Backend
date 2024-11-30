// import React from "react";

// const PopupQRCode = ({ qrCode }) => {
//   return (
//     <div>
//       <h2>Your QR Code:</h2>
//       <img src={qrCode} alt="QR Code" />
//       {/* Add any additional styling or components as needed */}
//     </div>
//   );
// };

// export default PopupQRCode;
import React from "react";

const PopupQRCode = ({ qrCode }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center">
        <h2 className="text-xl font-semibold mb-4">Your QR Code:</h2>
        <img src={qrCode} alt="QR Code" className="mx-auto mb-4" />
        <p className="text-gray-600">
          Scan this QR code to view your service request.
        </p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={() => console.log("Close Popup")}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PopupQRCode;
