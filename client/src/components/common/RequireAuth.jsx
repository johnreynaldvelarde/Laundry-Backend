// import { useLocation, Navigate, Outlet } from "react-router-dom";
// import useAuth from "../../hooks/useAuth";

// const RequireAuth = ({ allowedRoles }) => {
//   const { auth } = useAuth();
//   const location = useLocation();

//   return auth?.roles?.find((role) => allowedRoles?.includes(role)) ? (
//     <Outlet />
//   ) : auth?.user ? (
//     <Navigate to="/unauthorized" state={{ from: location }} replace />
//   ) : (
//     <Navigate to="/" state={{ from: location }} replace />
//   );
// };

// export default RequireAuth;

// import { useLocation, Navigate, Outlet } from "react-router-dom";
// import { useEffect } from "react";
// import useAuth from "../../hooks/useAuth";
// import axios from "axios";

// const RequireAuth = ({ allowedRoles }) => {
//   const { auth, setAuth } = useAuth();
//   const location = useLocation();

//   useEffect(() => {
//     const verifyRefreshToken = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:3002/api/refresh-token",
//           {
//             withCredentials: true, // Send cookies with the request
//           }
//         );

//         if (response.data.success) {
//           setAuth((prev) => ({
//             ...prev,
//             accessToken: response.data.accessToken,
//             roles: response.data.roles, // Assuming roles are returned with the refreshed token
//           }));
//         } else {
//           console.error("Refresh token invalid.");
//         }
//       } catch (error) {
//         console.error("Error verifying refresh token:", error);
//       }
//     };

//     if (!auth?.accessToken) {
//       verifyRefreshToken(); // Attempt to refresh the token on load if accessToken is missing
//     }
//   }, [auth?.accessToken, setAuth]);

//   return auth?.roles?.find((role) => allowedRoles?.includes(role)) ? (
//     <Outlet />
//   ) : auth?.user ? (
//     <Navigate to="/unauthorized" state={{ from: location }} replace />
//   ) : (
//     <Navigate to="/" state={{ from: location }} replace />
//   );
// };

// export default RequireAuth;

import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useAuth();
  const location = useLocation();

  return auth?.roles?.find((role) => allowedRoles?.includes(role)) ? (
    <Outlet />
  ) : auth?.accessToken ? ( //changed from user to accessToken to persist login after refresh
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
};

export default RequireAuth;
