import React, { useEffect, useState } from "react";
import useAuth from "../../../../contexts/AuthContext";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import toast from "react-hot-toast";
import { COLORS } from "../../../../constants/color";
import { updatePermissions } from "../../../../services/api/putApi";
import CustomPopHeaderTitle from "../../../../components/common/CustomPopHeaderTitle";

const A_PopupEditPermissions = ({
  open,
  onClose,
  permissionsData,
  refreshData,
}) => {
  const { userDetails } = useAuth();
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initialPermissions = [];
    if (permissionsData.can_read) initialPermissions.push("Read");
    if (permissionsData.can_write) initialPermissions.push("Write");
    if (permissionsData.can_edit) initialPermissions.push("Edit");
    if (permissionsData.can_delete) initialPermissions.push("Delete");

    setSelectedPermissions(initialPermissions);
  }, [permissionsData]);

  const handlePermissionToggle = (permission) => {
    setSelectedPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
  };

  const handleUpdatePermissions = async () => {
    setLoading(true);
    const id = permissionsData.id; // Ensure permissionsData is defined in the parent scope
    const updatedPermissionsData = {
      activity_id: userDetails.userId,
      activity_username: userDetails.username,
      activity_roleName: userDetails.roleName,
      permissionsStatus: {
        Read: selectedPermissions.includes("Read"),
        Write: selectedPermissions.includes("Write"),
        Edit: selectedPermissions.includes("Edit"),
        Delete: selectedPermissions.includes("Delete"),
      },
    };

    try {
      const response = await updatePermissions.putPermissions(
        id,
        updatedPermissionsData
      );

      if (response.success) {
        refreshData();
        toast.success(response.message);
        onClose();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(`Error with service request: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: 16,
        },
      }}
    >
      {/* Header */}
      <CustomPopHeaderTitle
        title={"Edit Role Permission"}
        subtitle={" Select permissions for this role"}
        onClose={onClose}
      />

      <DialogContent>
        {/* Permission Selection */}
        <Typography variant="subtitle1" color="textSecondary" sx={{ mt: 1 }}>
          Select Permissions:
        </Typography>
        <Grid container spacing={1} sx={{ mt: 0.5 }}>
          {["Read", "Write", "Edit", "Delete"].map((permission) => (
            <Grid item xs={6} sm={4} md={3} key={permission}>
              <Button
                variant={
                  selectedPermissions.includes(permission)
                    ? "contained"
                    : "outlined"
                }
                onClick={() => handlePermissionToggle(permission)}
                sx={{
                  color: selectedPermissions.includes(permission)
                    ? "#fff"
                    : COLORS.secondary,
                  backgroundColor: selectedPermissions.includes(permission)
                    ? COLORS.secondary
                    : "#fff",
                  width: "100%", // Make the button full width
                  "&:hover": {
                    backgroundColor: selectedPermissions.includes(permission)
                      ? "#3A5A85"
                      : "rgba(144, 144, 144, 0.1)",
                  },
                }}
              >
                {selectedPermissions.includes(permission) && <CheckIcon />}
                {permission}
              </Button>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      {/* Footer */}
      <DialogActions className="flex justify-end space-x-1 mb-1 mr-2">
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
          Cancel
        </Button>
        <Button
          onClick={handleUpdatePermissions}
          variant="contained"
          disableElevation
          sx={{
            backgroundColor: "#5787C8",
            borderRadius: "5px",
            fontWeight: 500,
            minWidth: "90px",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#3A5A85",
            },
          }}
          disabled={loading}
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
          ) : (
            "Update Permission"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default A_PopupEditPermissions;
