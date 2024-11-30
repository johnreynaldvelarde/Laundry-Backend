import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { COLORS } from "../../../../constants/color";
import usePopup from "../../../../hooks/common/usePopup";
import PopEditPromo from "./PopEditPromo";
import DeleteConfirmationDialog from "../../../../components/common/DeleteConfirmationDialog";
import {
  updateServicePromoActived,
  updateServicePromoDeactived,
} from "../../../../services/api/putApi";
import DeactivedConfirmDialog from "../../../../components/common/DeactivedConfirmDialog";
import toast from "react-hot-toast";

const CustomServicesPromoList = ({
  servicesPromoData,
  refreshData,
  userDetails,
}) => {
  const { isOpen, popupType, openPopup, closePopup, popupData } = usePopup();
  const [loading, setLoading] = useState(false);

  const handleDeactivedPromo = async (id) => {
    if (id) {
      setLoading(true);
      try {
        const response = await updateServicePromoDeactived.putPromoDeactived(
          id
        );
        if (response.success) {
          refreshData();
          toast.success(response.message);
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        toast.error(`Error: ${error.message || "Something went wrong"}`);
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Error Action!!!");
    }
  };

  const handleActivatedPromo = async (id) => {
    if (id) {
      setLoading(true);
      try {
        const response = await updateServicePromoActived.putPromoActived(id);
        if (response.success) {
          refreshData();
          toast.success(response.message);
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        toast.error(`Error: ${error.message || "Something went wrong"}`);
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Error Action!!!");
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(1, 1fr)",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
            xl: "repeat(4, 1fr)",
          },
          gap: "20px",
        }}
      >
        {servicesPromoData.map((service) => (
          <Box
            key={service.promo_id}
            sx={{
              border: `1px solid ${COLORS.border}`,
              borderRadius: "8px",
              padding: "30px",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100%",
              backgroundColor: COLORS.white,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                marginBottom: "8px",
                color: COLORS.primary,
              }}
            >
              {service.service_name}
            </Typography>

            {/* Price container for alignment */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              {/* Display default price with line-through */}
              <Typography
                variant="body2"
                sx={{
                  color: COLORS.text,
                  textDecoration: "line-through",
                  marginRight: "8px",
                  fontSize: 18,
                }}
              >
                <span className="mr-1">₱</span>
                {Number(service.default_price).toFixed(2) || "0.00"}{" "}
              </Typography>

              <Box sx={{ marginRight: "8px" }}>
                <span
                  style={{ display: "inline-block", color: COLORS.subtitle }}
                >
                  ➜
                </span>
              </Box>

              <Typography
                variant="body2"
                sx={{
                  color: COLORS.error,
                  fontWeight: 700,
                  fontSize: 18,
                }}
              >
                <span className="mr-1">₱</span>
                {Number(service.discount_price).toFixed(2) || "0.00"}
              </Typography>
            </Box>

            {/* Display valid days */}
            <Typography
              variant="body2"
              sx={{
                marginBottom: "8px",
                color: COLORS.subtitle,
              }}
            >
              <span
                className="mr-1 font-semibold"
                style={{ color: COLORS.secondary }}
              >
                Valid Days:
              </span>
              {service.valid_days || "N/A"}
            </Typography>

            {/* Display start date and end date */}
            <Typography
              variant="body2"
              sx={{
                marginBottom: "8px",
                color: COLORS.subtitle,
              }}
            >
              <span
                className="mr-1 font-semibold"
                style={{ color: COLORS.primary }}
              >
                Start Date:
              </span>
              {service.start_date
                ? new Date(service.start_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "N/A"}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                marginBottom: "16px",
                color: COLORS.subtitle,
              }}
            >
              <span
                className="mr-1 font-semibold"
                style={{ color: COLORS.primary }}
              >
                End Date:
              </span>
              {service.end_date
                ? new Date(service.end_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "N/A"}
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: "10px",
              }}
            >
              <Button
                disabled={!userDetails?.permissions?.canEdit}
                variant="outlined"
                onClick={() => openPopup("editPromo", service)}
                sx={{
                  textTransform: "none",
                  color: COLORS.primary,
                  borderColor: COLORS.border,
                  width: "100%", // Set button width to fill available space
                  "&:hover": {
                    borderColor: COLORS.secondary,
                    color: COLORS.secondary,
                    backgroundColor: COLORS.secondaryLight,
                  },
                }}
              >
                Edit
              </Button>
              <Button
                disabled={!userDetails?.permissions?.canWrite}
                variant="outlined"
                onClick={() => {
                  if (service.promo_status === "active") {
                    handleDeactivedPromo(service.promo_id);
                  } else {
                    handleActivatedPromo(service.promo_id);
                  }
                }}
                sx={{
                  textTransform: "none",
                  color: COLORS.primary,
                  borderColor: COLORS.border,
                  width: "100%",
                  "&:hover": {
                    borderColor:
                      service.promo_status === "active"
                        ? COLORS.error
                        : COLORS.success,
                    color:
                      service.promo_status === "active"
                        ? COLORS.error
                        : COLORS.success,
                    backgroundColor:
                      service.promo_status === "active"
                        ? COLORS.pale_error
                        : COLORS.pale_sucess,
                  },
                }}
              >
                {service.promo_status === "active" ? "Deactivate" : "Activate"}
              </Button>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Popup */}
      {isOpen && popupType === "editPromo" && (
        <PopEditPromo
          open={isOpen}
          onClose={closePopup}
          editData={popupData}
          refreshData={refreshData}
        />
      )}
    </>
  );
};

export default CustomServicesPromoList;
