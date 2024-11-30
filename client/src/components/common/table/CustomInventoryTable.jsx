import React, { useState } from "react";
import {
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  TablePagination,
  Box,
  Typography,
  Button,
  Skeleton,
  Tooltip,
} from "@mui/material";
import no_data from "../../../assets/images/no_data_table.jpg";
import DateCell from "../../table/DateCell";
import { COLORS } from "../../../constants/color";
import usePopup from "../../../hooks/common/usePopup";
import OutlinedIconButton from "../../table/OutlinedIconButton";
import { PencilLine, StackPlus, Trash } from "@phosphor-icons/react";
import StatusCellTable from "./custom/StatusCellTable";
import CustomStock from "./custom/CustomStock";
import PopEditItem from "../../../pages/admin/Inventory/components/PopEditItem";
import PopRestock from "../../../pages/admin/Inventory/components/PopRestock";
import DeleteConfirmationDialog from "../DeleteConfirmationDialog";
import { updateRemoveItem } from "../../../services/api/putApi";
import toast from "react-hot-toast";
import useAuth from "../../../contexts/AuthContext";

const CustomInventoryTable = ({
  tableData,
  loading,
  refreshData,
  itemEditData,
}) => {
  const { userDetails } = useAuth();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { isOpen, popupType, openPopup, closePopup, popupData } = usePopup();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRemoveItem = async () => {
    if (popupData) {
      const activityData = {
        activity_id: userDetails.userId,
        activity_username: userDetails.username,
        activity_roleName: userDetails.roleName,
      };
      try {
        const response = await updateRemoveItem.putRemoveItem(
          popupData,
          activityData
        );
        if (response.success) {
          refreshData();
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
      <TableContainer
        component={Paper}
        sx={{
          overflowX: "auto",
          borderRadius: 2,
          boxShadow: "none",
          border: `1px solid ${COLORS.border}`,
        }}
      >
        <Table>
          <TableHead className="bg-[#F1F1F1] border-b">
            <TableRow>
              <TableCell sx={cellHeadStyles}>ID</TableCell>
              <TableCell sx={cellHeadStyles}>Item Name</TableCell>
              <TableCell sx={cellHeadStyles}>Category</TableCell>
              <TableCell sx={cellHeadStyles}>Date Created</TableCell>
              <TableCell sx={cellHeadStyles}>Price</TableCell>
              <TableCell sx={cellHeadStyles}>Stock</TableCell>
              <TableCell sx={cellHeadStyles}>Status</TableCell>
              <TableCell sx={cellHeadStyles}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              // Skeleton loading state
              Array.from(new Array(rowsPerPage)).map((_, index) => (
                <TableRow key={index}>
                  {Array.from(new Array(8)).map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <Skeleton variant="rectangular" height={30} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : tableData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  align="center"
                  sx={{ paddingY: 5, paddingX: 1 }}
                >
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                  >
                    <img
                      src={no_data}
                      alt="No data"
                      style={{ width: "150px" }}
                    />
                    <Typography
                      variant="body1"
                      sx={{ color: COLORS.primary, fontWeight: 500 }}
                    >
                      No available data
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              tableData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((data) => (
                  <TableRow
                    key={data.inventory_id}
                    className="border-b"
                    role="checkbox"
                    tabIndex={-1}
                  >
                    <TableCell sx={{ paddingY: 2, paddingX: 4 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "600", color: COLORS.secondary }}
                      >
                        #{data.inventory_id}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ paddingY: 2, paddingX: 4 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "600", color: COLORS.text }}
                      >
                        {data.item_name}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ paddingY: 2, paddingX: 4 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "600", color: COLORS.secondary }}
                      >
                        {data.category_name}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ paddingY: 2, paddingX: 4 }}>
                      <DateCell dateCreated={data.date_created} />
                    </TableCell>
                    <TableCell sx={{ paddingY: 2, paddingX: 4 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "600", color: COLORS.primary }}
                      >
                        ₱{parseFloat(data.price).toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ paddingY: 2, paddingX: 4 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "600", color: COLORS.primary }}
                      >
                        <CustomStock
                          quantity={data.quantity}
                          lowStockThreshold={50}
                        />
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ paddingY: 2, paddingX: 4 }}>
                      <StatusCellTable status={data.isStatus} />
                    </TableCell>
                    <TableCell sx={{ paddingY: 2, paddingX: { xs: 4, sm: 0 } }}>
                      <Tooltip title="Restock Item" arrow>
                        <OutlinedIconButton
                          disabled={!userDetails?.permissions?.canWrite}
                          onClick={() => {
                            openPopup("restockItem", data.inventory_id);
                          }}
                        >
                          <StackPlus color={COLORS.success} weight="duotone" />
                        </OutlinedIconButton>
                      </Tooltip>
                      <Tooltip title="Edit Item" arrow>
                        <OutlinedIconButton
                          disabled={!userDetails?.permissions?.canEdit}
                          onClick={() => {
                            openPopup("editItem", data);
                          }}
                        >
                          <PencilLine
                            color={COLORS.secondary}
                            weight="duotone"
                          />
                        </OutlinedIconButton>
                      </Tooltip>
                      <Tooltip title="Delete User" arrow>
                        {/* if(userDetails.roleName == Manager) */}
                        <OutlinedIconButton
                          disabled={!userDetails?.permissions?.canDelete}
                          onClick={() => {
                            openPopup("removeItem", data.inventory_id);
                          }}
                        >
                          <Trash color={COLORS.error} weight="duotone" />
                        </OutlinedIconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={tableData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Popup */}
      {isOpen && popupType === "editItem" && (
        <PopEditItem
          open={isOpen}
          onClose={closePopup}
          getData={popupData}
          editData={itemEditData}
          refreshData={refreshData}
        />
      )}

      {isOpen && popupType === "restockItem" && (
        <PopRestock
          open={isOpen}
          onClose={closePopup}
          id={popupData}
          refreshData={refreshData}
        />
      )}

      {isOpen && popupType === "removeItem" && (
        <DeleteConfirmationDialog
          open={isOpen}
          onClose={closePopup}
          onConfirm={handleRemoveItem}
          id={popupData}
        />
      )}
    </>
  );
};

export default CustomInventoryTable;

const cellHeadStyles = {
  paddingY: 2,
  paddingX: 4,
  textAlign: "left",
  color: "#595959",
  fontSize: "1",
  fontWeight: 600,
  textTransform: "uppercase",
};
