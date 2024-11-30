import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
} from "@mui/material";
import { COLORS } from "../../constants/color";
import useFetchData from "../../hooks/common/useFetchData";
import { getPaymentHistory } from "../../services/api/customerApi";
import useAuth from "../../contexts/AuthContext";
import CustomPaymentHistoryTable from "./components/CustomPaymentHistoryTable";

function PaymentHistory() {
  const { userDetails } = useAuth();
  const [loading, setLoading] = useState(true);
  const { data: history, fetchData: fetchPaymentHistory } = useFetchData();
  const fetchPaymentHistoryData = useCallback(async () => {
    setLoading(true);
    await fetchPaymentHistory(getPaymentHistory.getHistory, userDetails.userId);
    setLoading(false);
  }, [fetchPaymentHistory, userDetails.userId]);

  useEffect(() => {
    fetchPaymentHistoryData();
  }, [fetchPaymentHistoryData]);

  const paymentHistory = [
    {
      id: "ORD12345",
      date: "2024-09-20",
      services: "Wash & Dry",
      paymentMethod: "Credit Card",
      amount: "$15.00",
    },
    {
      id: "ORD12346",
      date: "2024-09-25",
      services: "Dry Cleaning",
      paymentMethod: "PayPal",
      amount: "$25.00",
    },
    {
      id: "ORD12347",
      date: "2024-09-30",
      services: "Wash, Dry & Fold",
      paymentMethod: "Cash",
      amount: "$20.00",
    },
  ];

  return (
    <Box sx={{ p: 5, backgroundColor: COLORS.white }}>
      {/* Header */}
      <Typography
        fontWeight={600}
        variant="h4"
        component="h2"
        align="center"
        gutterBottom
        color={COLORS.secondary}
      >
        Payment History
      </Typography>

      <Box mt={5}>
        <CustomPaymentHistoryTable tableData={history} loading={loading} />
      </Box>

      {/* Payment History Table */}
      {/* <Paper sx={{ p: 2, mb: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Order ID</TableCell>
                <TableCell>Services</TableCell>
                <TableCell>Payment Method</TableCell>
                <TableCell align="right">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paymentHistory.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell>{payment.id}</TableCell>
                  <TableCell>{payment.services}</TableCell>
                  <TableCell>{payment.paymentMethod}</TableCell>
                  <TableCell align="right">{payment.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper> */}

      {/* Detailed View */}
      {/* <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Order Details
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Order ID:</strong> {paymentHistory[0].id}
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Date:</strong> {paymentHistory[0].date}
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Services:</strong> {paymentHistory[0].services}
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Payment Method:</strong> {paymentHistory[0].paymentMethod}
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Amount:</strong> {paymentHistory[0].amount}
        </Typography>
        <Button variant="contained" color="primary" sx={{ mt: 2 }}>
          View Receipt
        </Button>
      </Paper> */}
    </Box>
  );
}

export default PaymentHistory;
