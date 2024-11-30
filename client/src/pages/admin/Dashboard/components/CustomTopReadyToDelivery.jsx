import React, { useCallback, useEffect, useState } from "react";
import { Paper, Typography, Box, Avatar } from "@mui/material";
import { COLORS } from "../../../../constants/color";
import no_data from "../../../../assets/images/no_data_table.jpg";
import avatar_1 from "../../../../assets/images/d_profile1.png";
import avatar_2 from "../../../../assets/images/d_profile2.png";
import avatar_3 from "../../../../assets/images/d_profile3.png";
import avatar_4 from "../../../../assets/images/d_profile4.png";
import useFetchData from "../../../../hooks/common/useFetchData";

const avatars = [avatar_1, avatar_2, avatar_3, avatar_4];

const getRandomAvatar = () =>
  avatars[Math.floor(Math.random() * avatars.length)];

const sampleReadyToDeliverData = [
  {
    first_name: "John",
    middle_name: "A.",
    last_name: "Doe",
    email: "johndoe@example.com",
    address_line: "123 Main St, Citytown",
    ready_order_count: 5,
  },
  {
    first_name: "Jane",
    last_name: "Smith",
    email: "janesmith@example.com",
    address_line: "456 Elm St, Villagetown",
    ready_order_count: 3,
  },
  {
    first_name: "Alice",
    last_name: "Johnson",
    email: "alicej@example.com",
    address_line: "789 Maple Ave, Townsville",
    ready_order_count: 7,
  },
  {
    first_name: "Bob",
    last_name: "Brown",
    email: "bobbrown@example.com",
    address_line: "101 Oak Ln, Hamletton",
    ready_order_count: 4,
  },
];

const CustomTopReadyToDelivery = () => {
  const [loading, setLoading] = useState(true);
  //   const { data: readyToDeliverList, fetchData: fetchReadyToDeliverData } =
  //     useFetchData();

  //   const fetchReadyToDeliverDataCallback = useCallback(async () => {
  //     setLoading(true);
  //     await fetchReadyToDeliverData(getAdminListReadyToDeliver);
  //     setLoading(false);
  //   }, [fetchReadyToDeliverData]);

  //   useEffect(() => {
  //     fetchReadyToDeliverDataCallback();
  //   }, [fetchReadyToDeliverDataCallback]);
  const [readyToDeliverList, setReadyToDeliverList] = useState([]);

  useEffect(() => {
    // Simulate fetching data
    setReadyToDeliverList(sampleReadyToDeliverData);
  }, []);

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
      <Typography fontWeight={700} color={COLORS.text} variant="h6">
        Ready for Delivery
      </Typography>

      <Box sx={{ mt: 4 }}>
        {readyToDeliverList.length === 0 ? (
          <Box sx={{ textAlign: "center" }}>
            <img
              src={no_data}
              alt="No deliveries ready"
              style={{ maxWidth: "100%", height: "auto" }}
            />
            <Typography
              color={COLORS.subtitle}
              fontWeight={500}
              sx={{ textAlign: "center" }}
            >
              No deliveries ready this month
            </Typography>
          </Box>
        ) : (
          readyToDeliverList.map((customer, index) => (
            <Box
              key={index}
              sx={{
                mb: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {/* Left side with profile image and customer information */}
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  sx={{ width: 45, height: 45, mr: 2 }}
                  src={getRandomAvatar()}
                />
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: "bold", color: COLORS.secondary }}
                  >
                    {customer.first_name}{" "}
                    {customer.middle_name ? `${customer.middle_name} ` : ""}
                    {customer.last_name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: COLORS.primary }}>
                    {customer.email || "No email provided"}
                  </Typography>
                  <Typography variant="body2" sx={{ color: COLORS.primary }}>
                    {customer.address_line || "Address not available"}
                  </Typography>
                </Box>
              </Box>

              {/* Right side with ready orders count */}
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: COLORS.text }}
                >
                  {customer.ready_order_count || 0}
                </Typography>
                <Typography fontSize={12} sx={{ color: COLORS.subtitle }}>
                  Waiting Time
                </Typography>
              </Box>
            </Box>
          ))
        )}
      </Box>
    </Paper>
  );
};

export default CustomTopReadyToDelivery;
