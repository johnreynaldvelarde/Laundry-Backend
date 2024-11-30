import React, { useEffect, useState } from "react";
import { Paper, Typography, Box, Avatar, IconButton } from "@mui/material";
import { COLORS } from "../../../../../constants/color";
import no_data from "../../../../../assets/images/no_data_table.jpg";
import avatar_1 from "../../../../../assets/images/d_profile1.png";
import avatar_2 from "../../../../../assets/images/d_profile2.png";
import avatar_3 from "../../../../../assets/images/d_profile3.png";
import avatar_4 from "../../../../../assets/images/d_profile4.png";
import BadgeIcon from "@mui/icons-material/EmojiEvents"; // Example icon

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

const CustomAllSample = () => {
  const [readyToDeliverList, setReadyToDeliverList] = useState([]);

  useEffect(() => {
    // Simulate fetching data
    setReadyToDeliverList(sampleReadyToDeliverData);
  }, []);

  return (
    <Paper
      sx={{
        p: 4,
        boxShadow: "none",
        border: 1,
        borderColor: COLORS.border,
        borderRadius: "12px",
        maxWidth: "100%",
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography fontWeight={700} color={COLORS.text} variant="h6">
          Participants
        </Typography>
        <Typography
          variant="body2"
          color={COLORS.primary}
          sx={{ cursor: "pointer" }}
        >
          View All
        </Typography>
      </Box>

      <Box>
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
                alignItems: "center",
                justifyContent: "space-between",
                overflow: "hidden", // Ensures no overflow
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
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
                </Box>
              </Box>
              <IconButton sx={{ alignSelf: "flex-start" }}>
                <BadgeIcon color="success" />
              </IconButton>
            </Box>
          ))
        )}
      </Box>
    </Paper>
  );
};

export default CustomAllSample;
