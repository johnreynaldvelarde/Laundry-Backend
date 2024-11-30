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
} from "@mui/material";
import no_data from "../../../assets/images/no_data_table.jpg";
import DateCell from "../../table/DateCell";
import { getStatusColor } from "./custom/method";
import { COLORS } from "../../../constants/color";
import usePopup from "../../../hooks/common/usePopup";
import PopPendingAssignTo from "../../../pages/admin/Schedule/components/PopPendingAssignTo";
import ConfirmationDialog from "../ConfirmationDialog";
import {
  updateAtStoreToInQueue,
  updateCompletedPickupToAtStore,
} from "../../../services/api/putApi";
import ChangeConfirmationDialog from "../ChangeConfirmationDialog";

const CustomScheduleTable = ({ tableData, loading, refreshData }) => {
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

  const handeUpdateStatus = async (id) => {
    if (id) {
      try {
        console.log(id);
        const response =
          await updateCompletedPickupToAtStore.putCompletedAtStore(id);
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

  const handeUpdateStatusInQueue = async (id) => {
    if (id) {
      try {
        console.log(id);
        const response = await updateAtStoreToInQueue.putAtStoreInQueue(id);
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
              <TableCell sx={cellHeadStyles}>Date Created</TableCell>
              <TableCell sx={cellHeadStyles}>Name</TableCell>
              <TableCell sx={cellHeadStyles}>Service Type</TableCell>
              <TableCell sx={cellHeadStyles}>Payment Method</TableCell>
              <TableCell sx={cellHeadStyles}>Status</TableCell>
              <TableCell sx={cellHeadStyles}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              // Skeleton loading state
              Array.from(new Array(rowsPerPage)).map((_, index) => (
                <TableRow key={index}>
                  {Array.from(new Array(7)).map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <Skeleton variant="rectangular" height={30} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : tableData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
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
                    key={data.id}
                    className="border-b"
                    role="checkbox"
                    tabIndex={-1}
                  >
                    <TableCell sx={{ paddingY: 2, paddingX: 4 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "600", color: COLORS.secondary }}
                      >
                        #{data.id}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ paddingY: 2, paddingX: 4 }}>
                      <DateCell dateCreated={data.request_date} />
                    </TableCell>
                    <TableCell sx={{ paddingY: 2, paddingX: 4 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "600", color: COLORS.text }}
                      >
                        {data.customer_fullname}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ paddingY: 2, paddingX: 4 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "600", color: COLORS.primary }}
                      >
                        {data.service_name}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ paddingY: 2, paddingX: 4 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "600", color: COLORS.secondary }}
                      >
                        {data.payment_method}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ paddingY: 2, paddingX: 4 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          paddingX: { xs: 1, sm: 2, md: 2 },
                          paddingY: { xs: 0.25, sm: 0.5, md: 0.9 },
                          backgroundColor: getStatusColor(data.request_status),
                          fontWeight: 600,
                          color: COLORS.white,
                          borderRadius: { xs: 4, sm: 6, md: 8 },
                          display: "inline-block",
                          fontSize: {
                            xs: "0.6rem",
                            sm: "0.7rem",
                            md: "0.8rem",
                          }, // Responsive font size
                        }}
                      >
                        {data.request_status}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {data.request_status === "Pending Pickup" ? (
                        <Button
                          variant="outlined"
                          sx={{
                            color: COLORS.secondary,
                            textTransform: "none",
                          }}
                          onClick={() => {
                            openPopup("assignTo", data.id);
                          }}
                        >
                          Assign To
                        </Button>
                      ) : data.request_status === "Ready for delivery" ? (
                        <Button
                          variant="outlined"
                          sx={{
                            color: COLORS.secondary,
                            textTransform: "none",
                          }}
                          onClick={() => {
                            openPopup("assignTo", data.id);
                          }}
                        >
                          Assign To
                        </Button>
                      ) : data.request_status === "Completed Pickup" ? (
                        <Button
                          variant="outlined"
                          sx={{
                            color: COLORS.secondary,
                            textTransform: "none",
                          }}
                          onClick={() => {
                            openPopup("markInStore", data.id);
                          }}
                        >
                          Mark as In-Store
                        </Button>
                      ) : data.request_status === "At Store" ? (
                        <Button
                          variant="outlined"
                          sx={{
                            color: COLORS.secondary,
                            textTransform: "none",
                          }}
                          onClick={() => {
                            openPopup("markInQueue", data.id);
                          }}
                        >
                          Mark as In-Queue
                        </Button>
                      ) : null}
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
      {isOpen && popupType === "assignTo" && (
        <PopPendingAssignTo
          open={isOpen}
          onClose={closePopup}
          id={popupData}
          refreshData={refreshData}
        />
      )}

      {isOpen && popupType === "markInStore" && (
        <ChangeConfirmationDialog
          open={isOpen}
          onClose={closePopup}
          id={popupData}
          onConfirm={handeUpdateStatus}
        />
      )}

      {isOpen && popupType === "markInQueue" && (
        <ChangeConfirmationDialog
          open={isOpen}
          onClose={closePopup}
          id={popupData}
          onConfirm={handeUpdateStatusInQueue}
        />
      )}
    </>
  );
};

export default CustomScheduleTable;

const cellHeadStyles = {
  paddingY: 2,
  paddingX: 4,
  textAlign: "left",
  color: "#595959",
  fontSize: "1",
  fontWeight: 600,
  textTransform: "uppercase",
};
