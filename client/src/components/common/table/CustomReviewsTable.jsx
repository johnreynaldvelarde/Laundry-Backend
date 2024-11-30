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
import { getStatusColor } from "./custom/method";
import { COLORS } from "../../../constants/color";
import usePopup from "../../../hooks/common/usePopup";
import PopPendingAssignTo from "../../../pages/admin/Schedule/components/PopPendingAssignTo";
import CustomStarRating from "../CustomStartRating";
import StatusApprovedRejectCellTable from "./custom/StatusApprovedRejectCellTable";
import OutlinedIconButton from "../../table/OutlinedIconButton";
import { PencilLine } from "@phosphor-icons/react";
import PopEditReview from "../../../pages/admin/Review/components/PopEditReview";

const CustomReviewsTable = ({ tableData, loading, refreshData }) => {
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
              <TableCell sx={cellHeadStyles}>Customer Review</TableCell>
              <TableCell sx={cellHeadStyles}>Rating</TableCell>
              <TableCell sx={cellHeadStyles}>Date Created</TableCell>
              <TableCell sx={cellHeadStyles}>Service Type</TableCell>
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
                    key={data.review_id}
                    className="border-b"
                    role="checkbox"
                    tabIndex={-1}
                  >
                    <TableCell sx={{ paddingY: 2, paddingX: 4 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "600", color: COLORS.secondary }}
                      >
                        #{data.review_id}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ paddingY: 2, paddingX: 4, maxWidth: 400 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "600", color: COLORS.text }}
                      >
                        <span
                          className="mr-1 font-normal"
                          style={{ color: COLORS.primary }}
                        >
                          By
                        </span>
                        {data.customer_full_name}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: "400",
                          color: COLORS.primary,
                          marginTop: 1,
                          whiteSpace: "normal", // Allows text to wrap
                          wordWrap: "break-word", // Breaks long words if necessary
                          overflowWrap: "break-word", // Ensures long words break if needed
                        }}
                      >
                        {data.comment || "No comment"}
                      </Typography>
                    </TableCell>

                    <TableCell sx={{ paddingY: 2, paddingX: 4 }}>
                      <CustomStarRating rating={data.rating.toFixed(1)} />
                    </TableCell>
                    <TableCell sx={{ paddingY: 2, paddingX: 4 }}>
                      <DateCell dateCreated={data.created_at} />
                    </TableCell>
                    <TableCell sx={{ paddingY: 2, paddingX: 4 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "600", color: COLORS.secondary }}
                      >
                        {data.service_name}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ paddingY: 2, paddingX: 4 }}>
                      <StatusApprovedRejectCellTable
                        status={data.is_approved}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Tooltip title="Edit Review" arrow>
                          <OutlinedIconButton
                            onClick={() => {
                              openPopup("editReview", data);
                            }}
                          >
                            <PencilLine
                              color={COLORS.secondary}
                              weight="duotone"
                            />
                          </OutlinedIconButton>
                        </Tooltip>
                      </Box>
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
      {isOpen && popupType === "editReview" && (
        <PopEditReview
          open={isOpen}
          onClose={closePopup}
          getData={popupData}
          refreshData={refreshData}
        />
      )}
    </>
  );
};

export default CustomReviewsTable;

const cellHeadStyles = {
  paddingY: 2,
  paddingX: 4,
  textAlign: "left",
  color: "#595959",
  fontSize: "1",
  fontWeight: 600,
  textTransform: "uppercase",
};
