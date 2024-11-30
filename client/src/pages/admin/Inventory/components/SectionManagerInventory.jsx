import React, { useCallback, useEffect, useState } from "react";
import { COLORS } from "../../../../constants/color";
import useAuth from "../../../../contexts/AuthContext";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { parseISO } from "date-fns";
import {
  PlusCircle,
  PencilLine,
  Basket,
  Trash,
  Repeat,
} from "@phosphor-icons/react";
import CustomAddButton from "../../../../components/common/CustomAddButton";
import CustomHeaderTitle from "../../../../components/common/CustomHeaderTitle";
import useFetchData from "../../../../hooks/common/useFetchData";
import { viewCategory, viewInventory } from "../../../../services/api/getApi";
import usePopup from "../../../../hooks/common/usePopup";
import PopAddCategory from "./PopAddCategory";
import PopAddNewItem from "./PopAddNewItem";
import PopEditCategory from "./PopEditCategory";
import ConfirmationDialog from "../../../../components/common/ConfirmationDialog";
import { updateRemoveCategory } from "../../../../services/api/putApi";
import toast from "react-hot-toast";
import { KeyboardArrowDown } from "@mui/icons-material";
import CustomInventoryTable from "../../../../components/common/table/CustomInventoryTable";
import { dateOptions } from "../../../../data/schedule/serviceStatus";
import { checkDateMatch } from "../../../../utils/method";
import CustomOutlinedAddButton from "../../../../components/common/CustomOutlinedAddButton";
import PopReuseItem from "./PopReuseItem";
import DeleteConfirmationDialog from "../../../../components/common/DeleteConfirmationDialog";

const SectionManagerInventory = ({ userDetails }) => {
  const { isOpen, popupType, openPopup, closePopup, popupData } = usePopup();
  const { data: categoryData, fetchData: fetchCategory } = useFetchData();
  const { data: inventoryData, fetchData: fetchInventory } = useFetchData();
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  const statusOptions = ["Available", "Not Available"];

  const fetchCategoryData = useCallback(() => {
    fetchCategory(viewCategory.getViewCategoryList, userDetails.storeId);
  }, [fetchCategory, userDetails?.storeId]);

  const fetchInventoryData = useCallback(async () => {
    setLoading(true);
    await fetchInventory(
      viewInventory.getViewInventoryList,
      userDetails.storeId
    );
    setLoading(false);
  }, [fetchInventory, userDetails?.storeId]);

  useEffect(() => {
    fetchCategoryData();
    fetchInventoryData();
  }, [fetchCategoryData, fetchInventoryData]);

  useEffect(() => {
    if (inventoryData) {
      setFilteredData(inventoryData);
    }
  }, [inventoryData]);

  const handleRefreshData = () => {
    fetchCategoryData();
    fetchInventoryData();
  };

  const handleStatusChange = (event) => {
    const status = event.target.value;
    setSelectedStatus(status);
    applyFilters(selectedDate, status);
  };

  const handleDateChange = (event) => {
    const date = event.target.value;
    setSelectedDate(date);
    applyFilters(date, selectedStatus);
  };

  const applyFilters = (dateOption, status) => {
    const filtered = inventoryData.filter((item) => {
      const createdDate = parseISO(item.date_created); // Parse the created date
      const isDateMatch = dateOption
        ? checkDateMatch(dateOption, createdDate)
        : true;
      const isStatusMatch =
        status !== ""
          ? (status === "Available" && item.isStatus === 1) ||
            (status === "Not Available" && item.isStatus === 0)
          : true;
      return isDateMatch && isStatusMatch;
    });
    setFilteredData(filtered);
  };

  const handleRemoveCategory = async () => {
    if (popupData) {
      try {
        const response = await updateRemoveCategory.putRemoveCategory(
          popupData
        );
        if (response.success) {
          handleRefreshData();
          toast.success(response.message);
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        toast.error(`Error: ${error.message || "Something went wrong"}`);
      }
    } else {
      toast.error("Error Action!!!");
    }
  };

  return (
    <>
      {/* Header */}
      <Box
        className="flex items-center justify-between mb-8"
        sx={{
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "center", sm: "flex-start" },
          width: "100%",
        }}
      >
        <CustomHeaderTitle
          title={"Inventory Management"}
          subtitle={"All Categories & Item Availability"}
        />
        <CustomAddButton
          onClick={() => openPopup("addCategory")}
          label={"Add new category"}
          icon={<PlusCircle size={24} color={COLORS.white} weight="duotone" />}
        />
      </Box>
      {/*Categories */}
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
        {categoryData.map((category) => (
          <Box
            key={category.category_id}
            sx={{
              border: `1px solid ${COLORS.border2}`,
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
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              width="100%"
            >
              <Box display="flex" alignItems="center">
                <Box
                  display="flex"
                  alignItems="center"
                  sx={{
                    borderRadius: "5px",
                    padding: "4px",
                    backgroundColor: COLORS.secondary,
                  }}
                >
                  <Basket size={40} color="white" weight="duotone" />
                </Box>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: "18px", md: "20px" },
                    fontWeight: 700,
                    marginLeft: "8px",
                    color: COLORS.primary,
                  }}
                >
                  {category.category_name}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginLeft: "auto",
                  marginRight: "8px",
                }}
              >
                <Box
                  sx={{
                    border: `2px solid ${COLORS.secondary}`,
                    borderRadius: "50%",
                    padding: "8px",
                    fontWeight: 600,
                    color: COLORS.secondary,
                    fontSize: { xs: "16px", md: "18px" },
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "40px",
                    height: "40px",
                  }}
                >
                  {category.number_of_items}
                </Box>

                <Typography
                  sx={{
                    fontSize: { xs: "14px", md: "12px" },
                    fontWeight: 500,
                    color: COLORS.secondary,
                    marginTop: "4px",
                  }}
                >
                  Number of Items
                </Typography>
              </Box>
            </Box>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              marginTop={3}
            >
              <Button
                disabled={!userDetails?.permissions?.canEdit}
                onClick={() => openPopup("editCategory", category)}
                variant="outlined"
                sx={{
                  width: "100%",
                  padding: 1,
                  textTransform: "none",
                  color: COLORS.primary,
                  fontWeight: 600,
                  borderColor: COLORS.border,
                  "&:hover": {
                    borderColor: COLORS.secondary,
                    color: COLORS.secondary,
                    backgroundColor: COLORS.secondaryLight,
                  },
                }}
              >
                <PencilLine size={24} weight="duotone" className="mr-1" />
                Edit Category
              </Button>

              <Button
                disabled={!userDetails?.permissions?.canDelete}
                variant="outlined"
                sx={{
                  marginLeft: 1,
                  padding: 1,
                  textTransform: "none",
                  color: COLORS.primary,
                  fontWeight: 600,
                  borderColor: COLORS.border,
                  "&:hover": {
                    borderColor: COLORS.error,
                  },
                }}
                onClick={() => {
                  openPopup("removeCategory", category.category_id);
                }}
              >
                <Trash size={24} weight="duotone" color={COLORS.error} />
              </Button>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Content */}
      <Box mt={5}>
        <Box
          mb={2}
          className="flex items-center"
          sx={{
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            justifyContent: {
              xs: "flex-start",
              sm: "space-between",
            },
          }}
        >
          <Box sx={{ display: "flex" }}>
            {/* Title */}
            <Typography
              variant="h6"
              sx={{ marginRight: 2, color: COLORS.text, fontWeight: 600 }}
            >
              All Inventory Item
            </Typography>
          </Box>

          {/* Filter by created date */}
          <Box
            sx={{
              width: {
                xs: "100%", // Full width on small screens
                sm: "auto", // Auto width on larger screens
              },
              mt: {
                xs: 2, // Margin top on small screens
                sm: 0, // No margin top on larger screens
              },
            }}
          >
            <FormControl sx={{ minWidth: 200 }} size="small" fullWidth>
              <Select
                value={selectedDate}
                onChange={handleDateChange}
                displayEmpty
                IconComponent={KeyboardArrowDown}
                renderValue={(selected) => {
                  if (!selected) {
                    return (
                      <span style={{ color: COLORS.primary }}>
                        Select creation date
                      </span>
                    );
                  }
                  return selected;
                }}
                sx={{
                  borderRadius: 2,
                  color: COLORS.primary,
                  "& .MuiSvgIcon-root": {
                    color: COLORS.primary,
                  },
                }}
              >
                {/* Creation date options */}
                {dateOptions.map((date) => (
                  <MenuItem key={date} value={date}>
                    {date}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Filter Status */}
          <Box
            sx={{
              width: {
                xs: "100%",
                sm: "auto",
              },
              mt: {
                xs: 2,
                sm: 0,
              },
              mx: {
                xs: 0,
                sm: 2,
              },
            }}
          >
            <FormControl sx={{ minWidth: 200 }} size="small" fullWidth>
              <Select
                value={selectedStatus}
                onChange={handleStatusChange}
                displayEmpty
                IconComponent={KeyboardArrowDown}
                renderValue={(selected) => {
                  if (!selected) {
                    return (
                      <span style={{ color: COLORS.primary }}>
                        Select status
                      </span>
                    );
                  }
                  return selected;
                }}
                sx={{
                  borderRadius: 2,
                  color: COLORS.primary,
                  "& .MuiSvgIcon-root": {
                    color: COLORS.primary,
                  },
                }}
              >
                {/* Status options */}
                {statusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Clear Filters Button */}
          <Box
            sx={{
              width: {
                xs: "100%", // Full width on small screens
                sm: "auto", // Auto width on larger screens
              },
              mt: { xs: 2, sm: 0 },
              ml: { sm: "1px" },
            }}
          >
            <Button
              variant="outlined"
              onClick={() => {
                setSelectedDate("");
                setSelectedStatus("");
                setFilteredData(inventoryData);
              }}
              sx={{
                width: {
                  xs: "100%", // Full width on small screens
                  sm: "auto", // Auto width on larger screens
                },
                textTransform: "none",
                borderColor: COLORS.border,
                color: COLORS.primary,
                "&:hover": {
                  borderColor: COLORS.secondary,
                  backgroundColor: COLORS.secondaryLight,
                  color: COLORS.secondary,
                },
              }}
            >
              Clear Filters
            </Button>
          </Box>

          {/* Add item and reuse button */}
          <Box
            sx={{
              display: "flex",
              flexDirection: {
                xs: "column",
                sm: "row",
              },
              justifyContent: "flex-end",
              gap: {
                xs: 0,
                sm: 1,
              },
              width: {
                xs: "100%",
                sm: "auto",
              },
              marginLeft: "auto",
            }}
          >
            {/* Reuse item button */}
            <CustomOutlinedAddButton
              onClick={() => openPopup("reuseItem")}
              label={"Reuse item"}
              icon={
                <Repeat size={24} color={COLORS.secondary} weight="duotone" />
              }
            />

            {/* Add new item button */}
            <CustomAddButton
              onClick={() => openPopup("addItem")}
              label={"Add new item"}
              icon={
                <PlusCircle size={24} color={COLORS.white} weight="duotone" />
              }
            />
          </Box>
        </Box>
        <Box>
          <CustomInventoryTable
            tableData={filteredData}
            loading={loading}
            refreshData={handleRefreshData}
            itemEditData={categoryData}
          />
        </Box>
      </Box>

      {/* Popup */}
      {isOpen && popupType === "addCategory" && (
        <PopAddCategory open={isOpen} onClose={closePopup} />
      )}
      {isOpen && popupType === "editCategory" && (
        <PopEditCategory open={isOpen} onClose={closePopup} data={popupData} />
      )}
      {isOpen && popupType === "addItem" && (
        <PopAddNewItem open={isOpen} onClose={closePopup} data={categoryData} />
      )}
      {isOpen && popupType === "reuseItem" && (
        <PopReuseItem
          open={isOpen}
          onClose={closePopup}
          data={categoryData}
          refreshData={handleRefreshData}
        />
      )}
      {isOpen && popupType === "removeCategory" && (
        <DeleteConfirmationDialog
          open={isOpen}
          onClose={closePopup}
          onConfirm={handleRemoveCategory}
          id={popupData}
        />
      )}
    </>
  );
};

export default SectionManagerInventory;
