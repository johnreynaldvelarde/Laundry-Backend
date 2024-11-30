import React, { useState } from "react";
import useLaundryPlans from "../../hooks/customers/useLaundryPlans";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  IconButton,
  Grid,
  Card,
  CardContent,
  CardActionArea,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import styles from "../../styles/style";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import CustomPopFooterButton from "../../components/common/CustomPopFooterButton";
import { COLORS } from "../../constants/color";

const PopupServiceSelect = ({ service, onClose }) => {
  const navigate = useNavigate();
  const {
    qrCode,
    name,
    note,
    serviceType,
    setNote,
    setServiceType,
    selectedPayment,
    setSelectedPayment,
    paymentMethods,
    handleInputChange,
    handleSubmit,
    loading,
    errors,
  } = useLaundryPlans(onClose);

  const handlePaymentSelect = (method) => {
    setSelectedPayment(method);
  };

  const handleNavigateToTrackOrder = () => {
    navigate("/customer-page/track-orders");
  };

  return (
    <Dialog
      open={Boolean(service)}
      onClose={onClose}
      maxWidth="md" // Set maxWidth to medium
      fullWidth
      PaperProps={{
        style: {
          borderRadius: 16,
        },
      }}
    >
      <DialogTitle className="flex flex-col">
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-semibold">Service Details</span>
          </div>
          <IconButton
            onClick={onClose}
            className="text-[#5787C8] hover:text-[#5787C8]"
          >
            <CloseIcon />
          </IconButton>
        </div>
        <Typography variant="body2" color="textSecondary" className="mt-1">
          Complete the service request below.
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            {/* Left side with service details */}
            <TextField
              autoFocus
              margin="dense"
              label="Service Name"
              type="text"
              fullWidth
              variant="outlined"
              value={service.service_name}
              ononChange={handleInputChange("service_name")}
              InputProps={{
                readOnly: true,
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              margin="dense"
              label="Your Name"
              type="text"
              fullWidth
              variant="outlined"
              value={name}
              onChange={handleInputChange("name")}
              error={Boolean(errors.name)}
              helperText={errors.name}
              sx={{ mb: 2 }}
            />

            <TextField
              label="Additional Notes"
              variant="outlined"
              fullWidth
              multiline
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              margin="dense"
              sx={{ mb: 2 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              Payment Method
            </Typography>

            <Grid container spacing={2}>
              {paymentMethods.map((method) => (
                <Grid item xs={6} key={method.id}>
                  <Card
                    sx={{
                      border:
                        selectedPayment === method.id
                          ? "1px solid #5787C8"
                          : "1px solid #ccc",
                      borderRadius: "8px",
                      backgroundColor:
                        selectedPayment === method.id
                          ? COLORS.secondary
                          : COLORS.white,
                      boxShadow: "none",
                    }}
                  >
                    <CardActionArea
                      onClick={() => handlePaymentSelect(method.id)}
                      sx={{ textAlign: "center", padding: 2 }}
                    >
                      {React.cloneElement(method.icon, {
                        style: {
                          color:
                            selectedPayment === method.id
                              ? COLORS.white
                              : COLORS.primary,
                        },
                      })}
                      <Typography
                        variant="body1"
                        sx={{
                          mt: 1,
                          color:
                            selectedPayment === method.id
                              ? COLORS.white
                              : COLORS.primary,
                        }}
                      >
                        {method.label}
                      </Typography>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>

      <CustomPopFooterButton
        label={"Submit Request"}
        onClose={onClose}
        onSubmit={(e) =>
          handleSubmit(
            service.service_id,
            e,
            selectedPayment,
            service.service_name
          )
        }
        loading={loading}
      />

      {qrCode && (
        <Dialog
          open={Boolean(qrCode)}
          fullWidth
          onClose={onClose}
          PaperProps={{
            style: {
              borderRadius: 16,
              boxShadow: "none",
            },
          }}
          maxWidth="xs"
        >
          <DialogTitle
            style={{ marginTop: "16px" }}
            className="flex justify-center"
          >
            <span className="font-semibold text-center text-xl">
              Customer Request QR Code
            </span>
          </DialogTitle>
          <DialogContent className="flex flex-col items-center p-4">
            <p className="mb-2 text-center text-sm">
              Here is the QR code for the customer’s service request.
            </p>
            <QRCodeCanvas value={qrCode} alt="QR Code" size={300} />
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              disableElevation
              onClick={handleNavigateToTrackOrder}
              sx={{
                marginRight: 1,
                backgroundColor: "#5787C8",
                borderRadius: "5px",
                fontWeight: 500,
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#3A5A85",
                },
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Dialog>
  );
};

export default PopupServiceSelect;
