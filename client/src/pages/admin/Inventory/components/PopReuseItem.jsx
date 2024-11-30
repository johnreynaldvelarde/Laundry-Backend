import React, { useCallback, useEffect, useState } from "react";
import useAuth from "../../../../contexts/AuthContext";
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
  Menu,
  MenuItem,
} from "@mui/material";

import toast from "react-hot-toast";
import { COLORS } from "../../../../constants/color";
import {
  createNewItem,
  createReuseItem,
} from "../../../../services/api/postApi";
import CustomPopHeaderTitle from "../../../../components/common/CustomPopHeaderTitle";
import CustomPopFooterButton from "../../../../components/common/CustomPopFooterButton";
import useFetchData from "../../../../hooks/common/useFetchData";
import { viewGetItemToReuse } from "../../../../services/api/getApi";

const PopReuseItem = ({ open, onClose, refreshData }) => {
  const { userDetails } = useAuth();
  const [selectedReuseItem, setSelectedReuseItem] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { data: reuseData, fetchData: fetchReuseItem } = useFetchData();
  const fetchReuseItemData = useCallback(() => {
    fetchReuseItem(viewGetItemToReuse.getItemToReuse, userDetails.storeId);
  }, [fetchReuseItem, userDetails?.storeId]);

  useEffect(() => {
    fetchReuseItemData();
  }, [fetchReuseItemData]);

  const validateFields = () => {
    const newErrors = {};
    if (!selectedReuseItem) {
      newErrors.selectedReuseItem = "Reuse item is required";
    }
    return newErrors;
  };

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;

    if (field === "selectedReuseItem") {
      setSelectedReuseItem(value);
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: "",
    }));
  };

  const handleReuseItem = async () => {
    const newErrors = validateFields();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);

      const data = {
        store_id: userDetails.storeId,
        item_id: selectedReuseItem,
      };

      try {
        const response = await createReuseItem.setReuseItem(data);

        if (response.success) {
          toast.success(response.message);
          refreshData();
          onClose();
        } else {
          toast.error(response.message);
        }
      } catch (error) {
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
      <CustomPopHeaderTitle
        title={"Reuse Item"}
        subtitle={"Select available item to reuse in inventory"}
        onClose={onClose}
      />
      <DialogContent>
        {/* Select a item to reuse */}
        <TextField
          select
          margin="dense"
          label="Item"
          fullWidth
          variant="outlined"
          value={selectedReuseItem}
          onChange={handleInputChange("selectedReuseItem")}
          error={Boolean(errors.selectedReuseItem)}
          helperText={errors.selectedReuseItem}
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
        >
          {/* Add your role options here */}
          <MenuItem value="" disabled>
            Select a item
          </MenuItem>
          {reuseData.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.item_name}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      {/* Footer */}
      <CustomPopFooterButton
        label={"Reuse Item"}
        onClose={onClose}
        onSubmit={handleReuseItem}
        loading={loading}
      />
    </Dialog>
  );
};

export default PopReuseItem;
