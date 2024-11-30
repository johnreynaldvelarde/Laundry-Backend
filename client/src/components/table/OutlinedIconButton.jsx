import { Box, IconButton } from "@mui/material";
import React from "react";
import { COLORS } from "../../constants/color";

const OutlinedIconButton = React.forwardRef(
  ({ children, disabled = false, ...props }, ref) => {
    return (
      <Box
        sx={{
          display: "inline-flex",
          border: `1px solid ${
            disabled ? COLORS.disabledIcon : COLORS.border2
          }`,
          borderRadius: "4px",
          marginRight: "5px",
          marginBottom: { xs: 1, sm: 1, md: 1, lg: 1, xl: 0 },
          opacity: disabled ? 0.5 : 1, // Dim when disabled
          pointerEvents: disabled ? "none" : "auto", // Disable interaction
        }}
      >
        <IconButton ref={ref} disabled={disabled} {...props}>
          {children}
        </IconButton>
      </Box>
    );
  }
);

export default OutlinedIconButton;

// import { Box, IconButton } from "@mui/material";
// import React from "react";
// import { COLORS } from "../../constants/color";

// const OutlinedIconButton = React.forwardRef(({ children, ...props }, ref) => {
//   return (
//     <Box
//       sx={{
//         display: "inline-flex",
//         border: `1px solid ${COLORS.border2}`,
//         borderRadius: "4px",
//         marginRight: "5px",
//         // padding: "4px",
//         marginBottom: { xs: 1, sm: 1, md: 1, lg: 1, xl: 0 },
//       }}
//     >
//       <IconButton ref={ref} {...props}>
//         {children}
//       </IconButton>
//     </Box>
//   );
// });

// export default OutlinedIconButton;
