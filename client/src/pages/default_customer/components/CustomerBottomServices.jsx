import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Skeleton,
} from "@mui/material"; // Import Material UI components
import { COLORS } from "../../../constants/color"; // Adjust import based on your project structure
import PopupServiceSelect from "./../PopupServiceSelect"; // Import your popup component
import wash from "../../../assets/images/wash.jpg";
import dry from "../../../assets/images/dry.jpg";
import fold from "../../../assets/images/fold.jpg";
import wash_dry from "../../../assets/images/wash_dry.jpg";
import wash_dry_fold from "../../../assets/images/wash_dry_fold.jpg";

const serviceImages = {
  Wash: wash,
  Dry: dry,
  Fold: fold,
  "Wash/Dry": wash_dry,
  "Wash/Dry/Fold": wash_dry_fold,
};

const CustomerBottomServices = ({
  services,
  selectedService,
  handleSelectService,
  handleClosePopup,
  background_1,
  loading,
}) => {
  return (
    <div
      className="py-20 min-h-[500px] flex flex-col items-center"
      id="features"
      style={{
        background: `linear-gradient(to right, rgba(68, 127, 140, 0.8), rgba(87, 135, 200, 0.8)), url(${background_1})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container mx-auto flex flex-col items-center px-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8 sm:mb-16 text-center">
          Select a Laundry Service
        </h2>
        <div className="flex flex-wrap justify-center gap-6 w-full">
          {loading
            ? // Show skeleton loader if loading is true
              Array.from(new Array(5)).map((_, index) => (
                <Card
                  key={index}
                  className="relative flex flex-col items-center w-full sm:w-64"
                  elevation={3}
                >
                  <Skeleton variant="rectangular" width="100%" height={200} />
                  <CardContent>
                    <Skeleton variant="text" width="80%" />
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="40%" />
                    <Skeleton variant="rectangular" width="100%" height={36} />
                  </CardContent>
                </Card>
              ))
            : services.map((service) => (
                <Card
                  key={service.service_id}
                  className="relative flex flex-col items-center w-full sm:w-64"
                  elevation={3}
                >
                  <CardMedia
                    component="img"
                    alt={service.service_name}
                    image={serviceImages[service.service_name] || wash}
                  />
                  <CardContent>
                    <Typography
                      variant="h6"
                      component="div"
                      style={{ color: COLORS.text }}
                    >
                      {service.service_name}
                    </Typography>
                    <Typography variant="body2" style={{ color: COLORS.text }}>
                      {service.description}
                    </Typography>
                    <Typography
                      variant="h6"
                      style={{ color: COLORS.primary, marginTop: "8px" }}
                    >
                      {new Intl.NumberFormat("en-PH", {
                        style: "currency",
                        currency: "PHP",
                      }).format(service.default_price)}
                    </Typography>
                    <Button
                      onClick={() => handleSelectService(service)}
                      variant="contained"
                      color="primary"
                      style={{ marginTop: "16px" }}
                    >
                      Choose This Service
                    </Button>
                  </CardContent>
                </Card>
              ))}
        </div>
        {selectedService && (
          <PopupServiceSelect
            service={selectedService}
            onClose={handleClosePopup}
          />
        )}
      </div>
    </div>
  );
};

export default CustomerBottomServices;

// import React from "react";
// import {
//   Card,
//   CardMedia,
//   CardContent,
//   Typography,
//   Button,
// } from "@mui/material"; // Import Material UI components
// import { COLORS } from "../../../constants/color"; // Adjust import based on your project structure
// import PopupServiceSelect from "./../PopupServiceSelect"; // Import your popup component
// import wash from "../../../assets/images/wash.jpg";
// import dry from "../../../assets/images/dry.jpg";
// import fold from "../../../assets/images/fold.jpg";
// import wash_dry from "../../../assets/images/wash_dry.jpg";
// import wash_dry_fold from "../../../assets/images/wash_dry_fold.jpg";

// const serviceImages = {
//   Wash: wash,
//   Dry: dry,
//   Fold: fold,
//   "Wash/Dry": wash_dry,
//   "Wash/Dry/Fold": wash_dry_fold,
// };

// const CustomerBottomServices = ({
//   services,
//   selectedService,
//   handleSelectService,
//   handleClosePopup,
//   background_1,
//   loading,
// }) => {
//   return (
//     <div
//       className="py-20 min-h-[500px] flex flex-col items-center"
//       id="features"
//       style={{
//         background: `linear-gradient(to right, rgba(68, 127, 140, 0.8), rgba(87, 135, 200, 0.8)), url(${background_1})`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//       }}
//     >
//       <div className="container mx-auto flex flex-col items-center px-4">
//         <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8 sm:mb-16 text-center">
//           Select a Laundry Service
//         </h2>
//         <div className="flex flex-wrap justify-center gap-6 w-full">
//           {services.map((service) => (
//             <Card
//               key={service.service_id}
//               className="relative flex flex-col items-center w-full sm:w-64"
//               elevation={3}
//             >
//               <CardMedia
//                 component="img"
//                 alt={service.service_name}
//                 image={serviceImages[service.service_name] || wash}
//               />
//               <CardContent>
//                 <Typography
//                   variant="h6"
//                   component="div"
//                   style={{ color: COLORS.text }}
//                 >
//                   {service.service_name}
//                 </Typography>
//                 <Typography variant="body2" style={{ color: COLORS.text }}>
//                   {service.description}
//                 </Typography>
//                 <Typography
//                   variant="h6"
//                   style={{ color: COLORS.primary, marginTop: "8px" }}
//                 >
//                   {new Intl.NumberFormat("en-PH", {
//                     style: "currency",
//                     currency: "PHP",
//                   }).format(service.default_price)}
//                 </Typography>
//                 <Button
//                   onClick={() => handleSelectService(service)}
//                   variant="contained"
//                   color="primary"
//                   style={{ marginTop: "16px" }}
//                 >
//                   Choose This Service
//                 </Button>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//         {selectedService && (
//           <PopupServiceSelect
//             service={selectedService}
//             onClose={handleClosePopup}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default CustomerBottomServices;
