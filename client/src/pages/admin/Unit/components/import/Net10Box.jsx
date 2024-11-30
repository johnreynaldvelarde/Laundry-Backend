// import React from "react";
// import { Box, Grid, Paper, Typography, Button } from "@mui/material";
// import { CheckCircle } from "@mui/icons-material"; // Example icon
// import { COLORS } from "../../../../../constants/color";

// const Net10Box = ({ data }) => (
//   <Paper
//     elevation={3}
//     sx={{
//       padding: 2,
//       borderRadius: "8px",
//       textAlign: "center",
//       backgroundColor: COLORS.secondaryLight, // Light background color
//       border: 1,
//       borderColor: COLORS.secondary,
//     }}
//   >
//     <CheckCircle sx={{ color: COLORS.error, fontSize: 40 }} />
//     <Typography variant="h6" sx={{ fontWeight: 600, mt: 1 }}>
//       Net 10
//     </Typography>
//     <Typography variant="body2" sx={{ mt: 1, color: "#555" }}>
//       Enjoy unlimited talk and text with 10GB of high-speed data.
//     </Typography>
//     <Box sx={{ mt: 2 }}>
//       <Button
//         variant="contained"
//         color="primary"
//         sx={{
//           textTransform: "none",
//           fontWeight: 500,
//           color: COLORS.white,
//           backgroundColor: COLORS.secondary,
//           "&:hover": {
//             backgroundColor: COLORS.secondaryHover,
//           },
//         }}
//       >
//         Assign
//       </Button>
//     </Box>
//   </Paper>
// );

// const Net10Grid = () => {
//   return (
//     <Box sx={{ flexGrow: 1 }}>
//       <Grid container spacing={2}>
//         {Array.from({ length: 10 }).map((_, index) => (
//           <Grid item xs={6} sm={4} md={2} key={index}>
//             <Net10Box />
//           </Grid>
//         ))}
//       </Grid>
//     </Box>
//   );
// };

// export default Net10Grid;

import React from "react";
import { Box, Grid, Paper, Typography, Button, Skeleton } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import { COLORS } from "../../../../../constants/color";

const Net10Box = ({ data, loading }) => (
  <Paper
    elevation={3}
    sx={{
      padding: 2,
      borderRadius: "8px",
      textAlign: "center",
      backgroundColor: COLORS.secondaryLight,
      border: 1,
      borderColor: COLORS.secondary,
    }}
  >
    {loading ? (
      <>
        <Skeleton
          variant="circular"
          width={40}
          height={40}
          sx={{ margin: "auto" }}
        />
        <Skeleton variant="text" height={30} sx={{ mt: 1 }} />
        <Skeleton variant="text" height={20} sx={{ mt: 1 }} />
        <Skeleton variant="text" height={20} sx={{ mt: 1 }} />
        <Skeleton
          variant="rectangular"
          width={100}
          height={40}
          sx={{ mt: 2, margin: "auto" }}
        />
      </>
    ) : (
      <>
        <CheckCircle sx={{ color: COLORS.error, fontSize: 40 }} />
        <Typography variant="h6" sx={{ fontWeight: 600, mt: 1 }}>
          {data.tracking_code}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, color: "#555" }}>
          {data.customer_fullname}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, color: "#555" }}>
          {data.service_name} - {data.request_status}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, color: "#555" }}>
          Payment: {data.payment_method}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            sx={{
              textTransform: "none",
              fontWeight: 500,
              color: COLORS.white,
              backgroundColor: COLORS.secondary,
              "&:hover": {
                backgroundColor: COLORS.secondaryHover,
              },
            }}
          >
            Assign
          </Button>
        </Box>
      </>
    )}
  </Paper>
);

const Net10Grid = ({ data, loading }) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        {(loading ? Array.from(new Array(10)) : data).map((item, index) => (
          <Grid item xs={6} sm={4} md={2} key={index}>
            <Net10Box data={item} loading={loading} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Net10Grid;
