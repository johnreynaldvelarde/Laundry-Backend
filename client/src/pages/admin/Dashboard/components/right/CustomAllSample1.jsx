import React, { useState, useEffect } from "react";
import { Paper, Typography, Box, Avatar } from "@mui/material";
import { COLORS } from "../../../../../constants/color";

const sampleTransactionData = [
  {
    transaction_id: "TX12345",
    customer_name: "John Doe",
    amount: "$50.00",
    date: "2024-11-13",
  },
  {
    transaction_id: "TX67890",
    customer_name: "Jane Smith",
    amount: "$75.00",
    date: "2024-11-12",
  },
  {
    transaction_id: "TX54321",
    customer_name: "Alice Johnson",
    amount: "$30.00",
    date: "2024-11-11",
  },
  {
    transaction_id: "TX98765",
    customer_name: "Bob Brown",
    amount: "$100.00",
    date: "2024-11-10",
  },
];

const CustomAllSample1 = () => {
  const [transactionList, setTransactionList] = useState([]);

  useEffect(() => {
    // Simulate fetching data
    setTransactionList(sampleTransactionData);
  }, []);

  return (
    <Paper
      sx={{
        p: 4,
        boxShadow: "none",
        border: 1,
        borderColor: COLORS.border,
        borderRadius: "12px",
        // width: 350, // Adjust width as needed
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography fontWeight={700} color={COLORS.text} variant="h6">
            Transactions
          </Typography>
          <Typography
            variant="body2"
            color={COLORS.primary}
            sx={{ cursor: "pointer" }}
          >
            View All
          </Typography>
        </Box>

        {/* Add subtitle text below the main heading */}
        <Typography variant="subtitle1" color={COLORS.subtitle} sx={{ mb: 1 }}>
          Best Transaction
        </Typography>
      </Box>

      <Box>
        {transactionList.length === 0 ? (
          <Typography
            color={COLORS.subtitle}
            fontWeight={500}
            sx={{ textAlign: "center" }}
          >
            No transactions available
          </Typography>
        ) : (
          transactionList.map((transaction, index) => (
            <Box
              key={index}
              sx={{
                mb: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  sx={{ width: 45, height: 45, mr: 2, bgcolor: COLORS.primary }}
                >
                  {transaction.customer_name[0]} {/* Displaying initial */}
                </Avatar>
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: "bold", color: COLORS.secondary }}
                  >
                    {transaction.customer_name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: COLORS.primary }}>
                    {transaction.date}
                  </Typography>
                </Box>
              </Box>
              {/* Displaying Total Amount */}
              <Typography
                variant="body1"
                fontWeight={700}
                sx={{ color: COLORS.success }}
              >
                {transaction.amount}
              </Typography>
            </Box>
          ))
        )}
      </Box>
    </Paper>
  );
};

export default CustomAllSample1;
