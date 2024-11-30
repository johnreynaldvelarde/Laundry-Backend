import React, { useCallback, useEffect, useState } from "react";
import {
  Autocomplete,
  Chip,
  createFilterOptions,
  Dialog,
  DialogContent,
  FormControl,
  TextField,
  Typography,
} from "@mui/material";
import toast from "react-hot-toast";
import { COLORS } from "../../../../constants/color";
import {
  createItemCategory,
  createNewRoleAndPermissions,
} from "../../../../services/api/postApi";
import CustomPopHeaderTitle from "../../../../components/common/CustomPopHeaderTitle";
import CustomPopFooterButton from "../../../../components/common/CustomPopFooterButton";
import useAuth from "../../../../contexts/AuthContext";
import useFetchData from "../../../../hooks/common/useFetchData";
import { getSelectedStaff } from "../../../../services/api/getApi";
import { updatePendingToAssign } from "../../../../services/api/putApi";

const PopPendingAssignTo = ({ open, onClose, id, refreshData }) => {
  const { userDetails } = useAuth();
  const [categoryName, setCategoryName] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { data: userData, fetchData: fetchSelectedUser } = useFetchData();

  const fetchSelectedUserData = useCallback(() => {
    fetchSelectedUser(getSelectedStaff.getSelectStaff, userDetails.storeId);
  }, [fetchSelectedUser, userDetails?.storeId]);

  useEffect(() => {
    if (open) {
      fetchSelectedUserData();
    }
  }, [open, fetchSelectedUserData]);

  const filterOptions = createFilterOptions({
    matchFrom: "any", // This will match from any part of the string (name or username)
    stringify: (option) => `${option.fullname} ${option.user_type}`,
  });

  const validateFields = () => {
    const newErrors = {};
    if (!selectedUser) {
      newErrors.selectedUser = "Assigned staff is required";
    }

    return newErrors;
  };

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;

    if (field === "selectedUser") {
      setSelectedUser(value);
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: "",
    }));
  };

  const handleAssignNow = async () => {
    const newErrors = validateFields();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);

      const data = {
        user_id: selectedUser.id,
      };

      try {
        const response = await updatePendingToAssign.putPendingUpdateToAssign(
          id,
          data
        );
        if (response.success) {
          toast.success(response.message);
          refreshData();
          onClose();
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            categoryName: response.message,
          }));
        }
      } catch (error) {
        toast.error(`Error with service request: ${error.message || error}`);
      } finally {
        setLoading(false);
      }
    } else {
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
        title={"Assign Staff for Pickup"}
        subtitle={"Choose a staff member for laundry pickup"}
        onClose={onClose}
      />

      <DialogContent>
        {/* Staff Selection Autocomplete */}
        <FormControl fullWidth margin="normal" error={!!errors.selectedUser}>
          <Autocomplete
            options={userData}
            getOptionLabel={(option) => option.fullname}
            value={selectedUser}
            onChange={(event, newValue) => setSelectedUser(newValue)}
            isOptionEqualToValue={(option, value) => option.id === value?.id}
            filterOptions={filterOptions} // Use the custom filterOptions to search by name and username
            renderOption={(props, option) => {
              const today = new Date();
              const createdDate = new Date(option.date_created);
              const diffDays = Math.ceil(
                (today - createdDate) / (1000 * 60 * 60 * 24)
              );

              return (
                <li
                  {...props}
                  key={option.id}
                  style={{
                    display: "flex",
                    flexDirection: "column", // Stack name and username vertically
                    justifyContent: "center",
                    alignItems: "flex-start",
                    padding: "8px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <span
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontWeight: "bold",
                      }}
                    >
                      {option.fullname}
                    </span>
                    {diffDays <= 3 && (
                      <Chip
                        label="New"
                        variant="outlined"
                        size="small"
                        sx={{
                          color: "red",
                          borderColor: "red",
                          marginLeft: 2,
                        }}
                      />
                    )}
                  </div>
                  <span
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      color: "gray",
                      fontSize: "smaller",
                    }}
                  >
                    {option.user_type}
                  </span>
                </li>
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Staff"
                variant="outlined"
                placeholder="Search for a staff"
                error={!!errors.selectedUser}
              />
            )}
          />
          {errors.selectedUser && (
            <Typography
              variant="caption"
              color="error"
              sx={{ marginTop: "3px", marginLeft: "5px" }}
            >
              {errors.selectedUser}
            </Typography>
          )}
        </FormControl>
      </DialogContent>
      {/* Footer */}
      <CustomPopFooterButton
        label={"Assign now"}
        onClose={onClose}
        onSubmit={handleAssignNow}
        loading={loading}
      />
    </Dialog>
  );
};

export default PopPendingAssignTo;
