import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { COLORS } from "../../../../constants/color";

const A_PopupViewUser = ({ open, onClose, userData }) => {
  if (!userData) {
    return null;
  }
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: 16,
        },
      }}
    >
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            View User Details
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{ color: "#5787C8", "&:hover": { color: "#5787C8" } }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ spaceY: 4 }}>
          {/* Personal Information Section */}
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, color: COLORS.primary }}
          >
            Personal Information
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography variant="body2" sx={{ color: "gray" }}>
                First Name
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: COLORS.secondary, fontWeight: 600 }}
              >
                {userData.first_name}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography variant="body2" sx={{ color: "gray" }}>
                Middle Name
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: COLORS.secondary, fontWeight: 600 }}
              >
                {userData.middle_name}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography variant="body2" sx={{ color: "gray" }}>
                Last Name
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: COLORS.secondary, fontWeight: 600 }}
              >
                {userData.last_name}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography variant="body2" sx={{ color: "gray" }}>
                Username
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: COLORS.secondary, fontWeight: 600 }}
              >
                {userData.username}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography variant="body2" sx={{ color: "gray" }}>
                Mobile Number
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: COLORS.secondary, fontWeight: 600 }}
              >
                {userData.mobile_number}
              </Typography>
            </Box>
          </Box>

          {/* Account Information Section */}
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, color: COLORS.primary, marginTop: 4 }}
          >
            Account Information
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 2,
            }}
          >
            <div>
              <Typography variant="body2" sx={{ color: "gray" }}>
                Status
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  backgroundColor:
                    userData.isStatus === "Deactivated"
                      ? COLORS.error
                      : userData.isStatus === "Active"
                      ? COLORS.success
                      : userData.isStatus === "Pending"
                      ? COLORS.grayMedium
                      : "transparent", // Fallback color
                  color: "white", // Text color for better contrast
                  padding: "2px 15px",
                  borderRadius: "20px",
                  display: "inline-block", // Allow the background to fit the text
                  whiteSpace: "nowrap", // Prevent text from wrapping to a new line
                }}
              >
                {userData.isStatus}
              </Typography>
            </div>
            <div>
              <Typography variant="body2" sx={{ color: "gray" }}>
                Role
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: COLORS.secondary, fontWeight: 600 }}
              >
                {userData.role_name}
              </Typography>
            </div>
            <div>
              <Typography variant="body2" sx={{ color: "gray" }}>
                Date Created
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: COLORS.secondary, fontWeight: 600 }}
              >
                {new Date(userData.date_created).toLocaleDateString()}
              </Typography>
            </div>
          </Box>

          {/* Permissions Section */}
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, color: COLORS.primary, marginTop: 4 }}
          >
            Permissions
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 2,
            }}
          >
            <div>
              <Typography variant="body2" sx={{ color: "gray" }}>
                Read
              </Typography>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  border: "1px solid",
                  borderColor: COLORS.border2,
                  borderRadius: "8px",
                  padding: "1px 5px",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ color: COLORS.secondary, fontWeight: 500 }}
                >
                  {userData.can_read ? "Yes" : "No"}
                </Typography>
              </Box>
            </div>
            <div>
              <Typography variant="body2" sx={{ color: "gray" }}>
                Write
              </Typography>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  border: "1px solid",
                  borderColor: COLORS.border2,
                  borderRadius: "8px",
                  padding: "1px 5px",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ color: COLORS.secondary, fontWeight: 500 }}
                >
                  {userData.can_write ? "Yes" : "No"}
                </Typography>
              </Box>
            </div>
            <div>
              <Typography variant="body2" sx={{ color: "gray" }}>
                Edit
              </Typography>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  border: "1px solid",
                  borderColor: COLORS.border2,
                  borderRadius: "8px",
                  padding: "1px 5px",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ color: COLORS.secondary, fontWeight: 500 }}
                >
                  {userData.can_edit ? "Yes" : "No"}
                </Typography>
              </Box>
            </div>
            <div>
              <Typography variant="body2" sx={{ color: "gray" }}>
                Delete
              </Typography>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  border: "1px solid",
                  borderColor: COLORS.border2,
                  borderRadius: "8px",
                  padding: "1px 5px",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ color: COLORS.secondary, fontWeight: 500 }}
                >
                  {userData.can_delete ? "Yes" : "No"}
                </Typography>
              </Box>
            </div>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            marginRight: 1,
            borderColor: COLORS.border2,
            borderRadius: "5px",
            fontWeight: 500,
            textTransform: "none",
            color: COLORS.text4,
            "&:hover": {
              borderColor: COLORS.border2,
              backgroundColor: COLORS.light,
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default A_PopupViewUser;
