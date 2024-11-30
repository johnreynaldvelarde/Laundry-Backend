import React, { useCallback, useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import {
  Grid,
  TextField,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import CustomPopHeaderTitle from "../../../../components/common/CustomPopHeaderTitle";
import CustomPopFooterButton from "../../../../components/common/CustomPopFooterButton";
import { COLORS } from "../../../../constants/color";
import useFetchData from "../../../../hooks/common/useFetchData";
import { getCalculatedTransaction } from "../../../../services/api/getApi";

const PopCompleteInLaundry = ({ open, onClose, data }) => {
  const [customerName, setCustomerName] = useState("");
  const [customerNumber, setCustomerNumber] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { data: transactionData, fetchData: fetchCalculatedTransaction } =
    useFetchData();

  const fetchCalculatedTransactionData = useCallback(() => {
    fetchCalculatedTransaction(
      getCalculatedTransaction.getTransaction,
      data.id
    );
  }, [fetchCalculatedTransaction, data.id]);

  useEffect(() => {
    if (open && data.id) {
      fetchCalculatedTransactionData();
      setCustomerName(data.customer_fullname);
      setServiceType(data.service_name);
      setPaymentMethod(data.payment_method);
    }
  }, [open, data.id, fetchCalculatedTransactionData]);

  const handleSubmit = () => {
    setLoading(true);
    setLoading(false);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: 16,
        },
      }}
    >
      <CustomPopHeaderTitle
        title={"Billing Information"}
        subtitle={"Provide the required information"}
        onClose={onClose}
      />

      <DialogContent>
        <Grid container spacing={2}>
          {/* Left Side: Input Information */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mt: 5 }}>
              <TextField
                fullWidth
                margin="dense"
                label="Customer Name"
                type="text"
                variant="outlined"
                value={customerName}
                InputProps={{
                  readOnly: true,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: COLORS.secondary,
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: COLORS.secondary,
                  },
                }}
              />
              <TextField
                fullWidth
                margin="dense"
                label="Service Type"
                type="text"
                variant="outlined"
                value={serviceType}
                InputProps={{
                  readOnly: true,
                }}
                sx={{
                  mt: 3,
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: COLORS.secondary,
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: COLORS.secondary,
                  },
                }}
              />
              {/* <TextField
                fullWidth
                margin="dense"
                label="Payment Method"
                type="text"
                variant="outlined"
                value={paymentMethod}
                InputProps={{
                  readOnly: true,
                }}
                sx={{
                  mt: 3,
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: COLORS.secondary,
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: COLORS.secondary,
                  },
                }}
              /> */}
            </Box>
          </Grid>

          {/* Right Side: Sample Receipt */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                padding: 3,
                boxShadow: "none !important",
                borderRadius: "10px",
                borderStyle: "solid",
                borderWidth: "2px",
                borderColor: COLORS.border,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Receipt
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Typography variant="subtitle2">
                Customer: {"John Doe"}
              </Typography>
              <Typography variant="subtitle2">
                Phone: {"(123) 456-7890"}
              </Typography>

              <List>
                <ListItem>
                  <ListItemText
                    primary={"Service Type"}
                    secondary={`$${"0.00"}`}
                  />
                </ListItem>

                <ListItem>
                  <ListItemText primary="Subtotal" secondary={1} />
                </ListItem>

                <ListItem>
                  <ListItemText primary="Tax (12%)" secondary={`$${1}`} />
                </ListItem>

                <Divider sx={{ my: 1 }} />

                <ListItem>
                  <ListItemText primary="Total" secondary={`$${1}`} />
                </ListItem>
              </List>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2">
                Payment Method: {"Cash"}
              </Typography>

              <Typography variant="h6" align="center" sx={{ mt: 2 }}>
                Thank you for your business!
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>

      <CustomPopFooterButton
        label={"Proceed"}
        onClose={onClose}
        onClick={handleSubmit}
        loading={loading}
      />
    </Dialog>
  );
};

export default PopCompleteInLaundry;
