import React, { useCallback, useEffect, useState } from "react";
import { Paper, Typography, Box, Avatar } from "@mui/material";
import { COLORS } from "../../../../constants/color";
import no_data from "../../../../assets/images/no_data_table.jpg";
import avatar_1 from "../../../../assets/images/d_profile1.png";
import avatar_2 from "../../../../assets/images/d_profile2.png";
import avatar_3 from "../../../../assets/images/d_profile3.png";
import avatar_4 from "../../../../assets/images/d_profile4.png";
import useFetchData from "../../../../hooks/common/useFetchData";
import { getAdminListCustomerMostRequest } from "../../../../services/api/getApi";

const avatars = [avatar_1, avatar_2, avatar_3, avatar_4];

const getRandomAvatar = () =>
  avatars[Math.floor(Math.random() * avatars.length)];

const CustomTopNewCustomer = () => {
  const [loading, setLoading] = useState(true);
  const { data: totalMostRequest, fetchData: fetchTotalCustomerMostRequest } =
    useFetchData();

  const fetchTotalCustomerMostRequestData = useCallback(async () => {
    setLoading(true);
    await fetchTotalCustomerMostRequest(
      getAdminListCustomerMostRequest.getListCustomerMostRequest
    );
    setLoading(false);
  }, [fetchTotalCustomerMostRequest]);

  useEffect(() => {
    fetchTotalCustomerMostRequestData();
  }, [fetchTotalCustomerMostRequestData]);

  return (
    <Paper
      sx={{
        p: 5,
        boxShadow: "none",
        border: 1,
        borderColor: COLORS.border,
        borderRadius: "14px",
      }}
    >
      <Typography
        fontWeight={700}
        color={COLORS.text}
        variant="h6"
        sx={{ fontSize: { xs: "1.2rem", sm: "1.5rem" } }} // Responsive title font size
      >
        Customers with Most Requests
      </Typography>

      <Box sx={{ mt: 4 }}>
        {totalMostRequest.length === 0 ? (
          <>
            <Box sx={{ textAlign: "center" }}>
              <img
                src={no_data}
                alt="No customers"
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </Box>
            <Typography
              color={COLORS.subtitle}
              fontWeight={500}
              sx={{
                textAlign: "center",
                fontSize: { xs: "0.8rem", sm: "1rem" },
              }} // Responsive text
            >
              No new customers this month
            </Typography>
          </>
        ) : (
          totalMostRequest.map((customer, index) => (
            <Box
              key={index}
              sx={{
                mb: 2,
                display: "flex",
                flexDirection: "row", // Keep row layout for both small and large screens
                justifyContent: "space-between",
                alignItems: "center",
                overflow: "hidden",
              }}
            >
              {/* Left side with profile image and customer information */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: { xs: 2, sm: 0 }, // Margin bottom for mobile screens
                  overflow: "hidden",
                  flex: 1, // Allow this to take available space
                }}
              >
                <Avatar
                  sx={{ width: 45, height: 45, mr: 2 }}
                  src={getRandomAvatar()}
                />
                <Box sx={{ maxWidth: "200px" }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: "bold",
                      color: COLORS.secondary,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      fontSize: {
                        xs: "0.7rem",
                        ss: "0.7rem",
                        sm: "0.7rem",
                        md: "0.8rem",
                        lg: "0.9rem",
                        xl: "1rem",
                      },
                    }}
                  >
                    {customer.first_name}{" "}
                    {customer.middle_name ? `${customer.middle_name} ` : ""}
                    {customer.last_name}
                  </Typography>

                  {/* Email */}
                  <Typography
                    variant="body2"
                    sx={{
                      color: COLORS.primary,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      fontSize: {
                        xs: "0.7rem",
                        ss: "0.7rem",
                        sm: "0.7rem",
                        md: "0.8rem",
                        lg: "0.9rem",
                        xl: "1rem",
                      },
                    }}
                  >
                    {customer.email || "No email provided"}
                  </Typography>

                  {/* Address below the email */}
                  <Typography
                    variant="body2"
                    sx={{
                      color: COLORS.primary,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      fontSize: {
                        xs: "0.7rem",
                        ss: "0.7rem",
                        sm: "0.7rem",
                        md: "0.8rem",
                        lg: "0.9rem",
                        xl: "1rem",
                      },
                    }}
                  >
                    {customer.address_line || "Address not available"}
                  </Typography>
                </Box>
              </Box>

              {/* Right side with number of service requests */}
              <Box sx={{ textAlign: "center", minWidth: "120px" }}>
                {/* Service Requests Number */}
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    color: COLORS.text,
                    fontSize: {
                      xs: "0.7rem",
                      ss: "0.7rem",
                      sm: "0.7rem",
                      md: "0.8rem",
                      lg: "0.9rem",
                      xl: "1rem",
                    },
                  }}
                >
                  {customer.service_request_count || 0}
                </Typography>
                {/* Label below the number (changed "Service Requests" to "Service Orders") */}
                <Typography
                  fontSize={12}
                  sx={{
                    color: COLORS.subtitle,
                    fontSize: {
                      xs: "0.7rem",
                      ss: "0.7rem",
                      sm: "0.7rem",
                      md: "0.8rem",
                      lg: "0.9rem",
                      xl: "1rem",
                    },
                  }}
                >
                  Service Request
                </Typography>
              </Box>
            </Box>
          ))
        )}
      </Box>
    </Paper>
  );
};

export default CustomTopNewCustomer;
