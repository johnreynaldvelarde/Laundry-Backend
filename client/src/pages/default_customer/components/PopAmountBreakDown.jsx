import React from "react";
import { Dialog, DialogContent, Button } from "@mui/material";
import CustomPopHeaderTitle from "../../../components/common/CustomPopHeaderTitle";
import { COLORS } from "../../../constants/color";

const PopAmountBreakDown = ({ open, onClose }) => {
  // Sample data for one service availed by the customer
  const service = {
    service: "Wash & Fold",
    pricePerKilo: 60, // Default price per kilo
    weight: 5, // Customer's laundry weight in kilograms
    itemsUsed: ["Detergent", "Fabric Softener"],
  };

  const totalAmount = service.pricePerKilo * service.weight;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: 16,
          height: "400px", // Adjusted height for a simpler breakdown
        },
      }}
    >
      {/* Header */}
      <CustomPopHeaderTitle
        title={"Service Breakdown"}
        subtitle={"Details of the service you availed"}
        onClose={onClose}
      />

      <DialogContent
        style={{
          padding: "16px",
          height: "calc(100% - 64px)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Breakdown Area */}
        <div className="flex flex-col flex-grow overflow-y-auto bg-gray-100 rounded p-4 max-h-[300px]">
          <div className="my-2 p-2 bg-white rounded shadow-sm">
            {/* Service Info */}
            <div className="flex justify-between">
              <span>{service.service}</span>
              <span>₱{service.pricePerKilo} per kg</span>
            </div>

            {/* Laundry Weight and Cost */}
            <div className="flex justify-between mt-2">
              <span>Laundry Weight:</span>
              <span>{service.weight} kg</span>
            </div>

            <div className="flex justify-between mt-2">
              <span>Total Cost:</span>
              <span>₱{totalAmount}</span>
            </div>

            {/* Items Used */}
            <div className="text-sm text-gray-500 mt-3">
              <strong>Items Used:</strong> {service.itemsUsed.join(", ")}
            </div>
          </div>
        </div>

        {/* Close Button */}
        <Button
          disableElevation
          variant="contained"
          color="primary"
          onClick={onClose}
          sx={{
            marginTop: 2,
            textTransform: "none",
            backgroundColor: COLORS.secondary,
            "&:hover": {
              backgroundColor: COLORS.secondaryHover,
            },
          }}
        >
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default PopAmountBreakDown;
