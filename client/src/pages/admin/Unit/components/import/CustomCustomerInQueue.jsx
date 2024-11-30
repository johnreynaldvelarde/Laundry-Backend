import React, { useRef, useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Skeleton,
  Button,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { COLORS } from "../../../../../constants/color";
import { formatDistanceToNow } from "date-fns";
import nodata from "../../../../../assets/images/no_data_table.jpg";
import {
  ArrowFatLeft,
  ArrowFatRight,
  Note,
  NotEquals,
} from "@phosphor-icons/react";
import usePopup from "../../../../../hooks/common/usePopup";
import PopupAssignUnit from "../PopupAssignUnit";
import PopNotes from "../PopNotes";

const CustomCustomerInQueue = ({ customers, loading, refreshData }) => {
  const scrollRef = useRef(null);
  const [showArrows, setShowArrows] = useState(false);
  const { isOpen, popupType, openPopup, closePopup, popupData } = usePopup();

  // Function to scroll left
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  // Function to scroll right
  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const checkOverflow = () => {
      if (scrollRef.current) {
        const containerWidth = scrollRef.current.clientWidth;
        const contentWidth = scrollRef.current.scrollWidth;
        setShowArrows(contentWidth > containerWidth);
      }
    };

    checkOverflow(); // Check on mount and when data changes
    window.addEventListener("resize", checkOverflow); // Check on resize
    return () => {
      window.removeEventListener("resize", checkOverflow);
    };
  }, [customers]); // Dependency array includes customers to re-check when data changes

  return (
    <Box
      sx={{
        mt: 2,
        display: "flex",
        flexDirection: "row",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Left arrow button */}
      {showArrows && (
        <IconButton
          onClick={scrollLeft}
          sx={{
            position: "absolute",
            left: 5,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 1,
            backgroundColor: COLORS.secondary,
            boxShadow: 5,
            "&:hover": {
              backgroundColor: COLORS.secondaryHover,
              color: COLORS.white,
              boxShadow: 5,
            },
          }}
        >
          <ArrowFatLeft color={COLORS.white} weight="duotone" />
        </IconButton>
      )}

      <Box
        className="hori-scrollable"
        ref={scrollRef}
        sx={{
          display: "flex",
          flexDirection: "row",
          overflowX: "auto",
          gap: 2,
          flexWrap: "nowrap",
          width: "100%",
        }}
      >
        {loading ? (
          [...Array(6)].map((_, index) => (
            <Paper
              key={index}
              elevation={1}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 2,
                borderRadius: "8px",
                height: "250px",
                width: "200px",
                minWidth: "200px",
              }}
            >
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="text" sx={{ fontSize: "1rem", mt: 1 }} />
              <Skeleton variant="text" sx={{ fontSize: "0.875rem", mt: 1 }} />
              <Skeleton variant="text" sx={{ fontSize: "0.875rem", mt: 1 }} />
              <Skeleton variant="text" sx={{ fontSize: "0.875rem", mt: 1 }} />
              <Skeleton
                variant="rectangular"
                width={100}
                height={40}
                sx={{ mt: 2 }}
              />
            </Paper>
          ))
        ) : customers && customers.length > 0 ? (
          customers.map((customer) => (
            <Paper
              key={customer.tracking_code}
              elevation={1}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 2,
                borderRadius: "8px",
                border: `1px solid ${COLORS.secondary}`,
                backgroundColor: COLORS.white,
                height: "250px",
                width: "200px",
                minWidth: "220px",
                position: "relative",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  position: "absolute",
                  top: 8,
                  left: 8,
                  fontSize: 12,
                  padding: "2px 5px",
                  borderRadius: "5px",
                  fontWeight: 500,
                  zIndex: 1,
                  color: COLORS.white,
                  backgroundColor:
                    customer.customer_type === "Online"
                      ? COLORS.success
                      : COLORS.accent,
                }}
              >
                {customer.customer_type}
              </Typography>

              <Box
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  backgroundColor: COLORS.accent,
                  borderRadius: "50%",
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: COLORS.white,
                  fontWeight: "500",
                  zIndex: 1,
                  padding: 0,
                  fontSize: 13,
                }}
              >
                {customer.queue_number != null &&
                !isNaN(customer.queue_number) ? (
                  customer.queue_number
                ) : (
                  <CircularProgress size={18} color="inherit" />
                )}
              </Box>

              <Typography
                variant="body2"
                sx={{ mt: 6, fontWeight: "bold", color: COLORS.text }}
              >
                {customer.customer_fullname}
              </Typography>
              <Typography
                variant="body2"
                sx={{ mt: 1, fontWeight: 600, color: COLORS.subtitle }}
              >
                {customer.service_name}
              </Typography>
              <Typography
                variant="body2"
                sx={{ mt: 1, color: COLORS.subtitle }}
              >
                Waiting Time
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.secondary }}>
                {formatDistanceToNow(new Date(customer.request_date), {
                  addSuffix: true,
                })}
              </Typography>

              <Box
                sx={{
                  mt: 2,
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Button
                  onClick={() => openPopup("assignUnit", customer.id)}
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: COLORS.secondary,
                    color: COLORS.white,
                    borderRadius: "4px",
                    padding: "8px 0",
                    "&:hover": {
                      backgroundColor: COLORS.secondaryHover,
                    },
                  }}
                >
                  Assign Unit
                </Button>

                {customer.notes && customer.notes.trim() !== "" && (
                  <IconButton
                    onClick={() => openPopup("seeNotes", customer.notes)}
                    sx={{
                      border: 1,
                      borderColor: COLORS.border,
                      borderRadius: "5px",
                      padding: "8px",
                    }}
                  >
                    <Note color={COLORS.primary} />
                  </IconButton>
                )}
              </Box>
            </Paper>
          ))
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              p: 5,
              width: "100%", // Ensure full width
              height: "250px", // Set a specific height
              border: "1px solid",
              borderColor: "grey.300",
              borderRadius: 2,
              boxShadow: 0, // Ensure no shadow
            }}
          >
            <img
              src={nodata}
              alt="No Data"
              style={{ width: 128, height: 128 }} // Adjust as needed
            />
            <Typography
              variant="body1"
              sx={{ color: COLORS.subtitle, fontWeight: 500 }}
            >
              No customers in the queue at the moment.
            </Typography>
          </Box>
        )}
      </Box>

      {/* Right arrow button */}
      {showArrows && (
        <IconButton
          onClick={scrollRight}
          sx={{
            position: "absolute",
            right: 5,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 1,
            backgroundColor: COLORS.secondary,
            boxShadow: 5,
            "&:hover": {
              backgroundColor: COLORS.secondaryHover,
              color: COLORS.white,
              boxShadow: 5,
            },
          }}
        >
          <ArrowFatRight color={COLORS.white} weight="duotone" />
        </IconButton>
      )}

      {isOpen && popupType === "assignUnit" && (
        <PopupAssignUnit
          open={isOpen}
          onClose={closePopup}
          inqueueID={popupData}
          refreshData={refreshData}
        />
      )}

      {isOpen && popupType === "seeNotes" && (
        <PopNotes open={isOpen} onClose={closePopup} notes={popupData} />
      )}
    </Box>
  );
};

export default CustomCustomerInQueue;
