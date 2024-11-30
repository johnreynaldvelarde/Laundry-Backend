// // import axios from "axios";

// // const loginService = {
// //   login: async (data) => {
// //     try {
// //       const response = await axios.post("http://localhost:3002/login", data);
// //       return response.data;
// //     } catch (error) {
// //       console.error("Error in loginService:", error);
// //       throw error;
// //     }
// //   },
// // };

// // export default loginService;
// // import axios from 'axios';

// // const loginService = {
// //   login: async (data) => {
// //     try {
// //       const response = await axios.post('http://localhost:3002/login', data);

// //       // Ensure the response data contains the token
// //       const { success, token, userType, message } = response.data;

// //       if (!success) {
// //         throw new Error(message || 'Login failed');
// //       }

// //       return {
// //         success,
// //         token, // Return the token along with other data
// //         userType,
// //         message,
// //       };
// //     } catch (error) {
// //       console.error('Error in loginService:', error);
// //       throw error;
// //     }
// //   },
// // };

// // export default loginService;
// // In your loginService.js
// // import axios from "axios";

// const loginService = {
//   login: async (data) => {
//     try {
//       const response = await axios.post("http://localhost:3002/api/login", data);
//         const token = response.data.token;
//         localStorage.setItem('token', token); // Store token in localStorage
//         return response.data;
      
//       // if (response.data.success) {
//       //   const token = response.data.token;
//       //   localStorage.setItem('token', token); // Store token in localStorage
//       //   return response.data;
//       // } else {
//       //   throw new Error(response.data.message);
//       // }
//     } catch (error) {
//       console.error("Error in loginService:", error);
//       throw error;
//     }
//   },
// };

// export default loginService;
