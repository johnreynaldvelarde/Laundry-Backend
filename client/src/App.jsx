import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

// Import pages
import { StartingPage, Main, CheckStartingPoint, MainCustomer } from "./pages";
import NotFound from "./pages/NotFound";

// Import the AuthProvider
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./contexts/ProtectedRoute";
import ForgetPassword from "./pages/start/ForgetPassword";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* This is public route */}
          <Route path="/" element={<StartingPage />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="*" element={<NotFound />} />

          {/* This is protected route */}
          <Route path="/main/*" element={<ProtectedRoute component={Main} />} />
          <Route
            path="/complete-details/*"
            element={<ProtectedRoute component={CheckStartingPoint} />}
          />
          <Route
            path="/customer-page/*"
            element={<ProtectedRoute component={MainCustomer} />}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
