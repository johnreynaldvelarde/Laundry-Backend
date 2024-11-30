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
import no_data from "../../../../../assets/images/no_data_table.jpg";

import { COLORS } from "../../../../../constants/color";
import usePopup from "../../../../../hooks/common/usePopup";
import PopPendingAssignTo from "../../../Schedule/components/PopPendingAssignTo";
import DateTime from "../../../../../components/table/DateTime";
import DateOnly from "../../../../../components/table/DateOnly";
import { getActionType } from "../../../Activity/components/method";
import StatusTransactionCellTable from "../../../../../components/common/table/custom/StatusTransactionCellTable";
import { getStatusColor } from "../../../../../components/common/table/custom/method";
import OutlinedIconButton from "../../../../../components/table/OutlinedIconButton";
import { Eye } from "@phosphor-icons/react";

const CustomTableReadyForDelivery = ({ tableData, loading, refreshData }) => {
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
              <TableCell sx={cellHeadStyles}>Customer Name</TableCell>
              <TableCell sx={cellHeadStyles}>Date</TableCell>
              <TableCell sx={cellHeadStyles}>Payment Status</TableCell>
              <TableCell sx={cellHeadStyles}>Request Status</TableCell>
              <TableCell sx={cellHeadStyles}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              // Skeleton loading state
              Array.from(new Array(rowsPerPage)).map((_, index) => (
                <TableRow key={index}>
                  {Array.from(new Array(6)).map((_, colIndex) => (
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
                    key={data.service_request_id}
                    className="border-b"
                    role="checkbox"
                    tabIndex={-1}
                  >
                    <TableCell sx={{ paddingY: 2, paddingX: 4 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "600", color: COLORS.secondary }}
                      >
                        #{data.service_request_id}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ paddingY: 2, paddingX: 4 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "600", color: COLORS.text }}
                      >
                        {data.customer_fullname}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "500", color: COLORS.text4 }}
                      >
                        {data.address_line}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ paddingY: 2, paddingX: 4 }}>
                      <DateOnly dateCreated={data.transaction_date} />
                      <DateTime dateCreated={data.transaction_date} />
                    </TableCell>
                    <TableCell sx={{ paddingY: 2, paddingX: 4 }}>
                      <StatusTransactionCellTable
                        status={data.transaction_status}
                      />
                    </TableCell>
                    <TableCell sx={{ paddingY: 2, paddingX: 4 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          paddingX: 2,
                          paddingY: 0.5,
                          backgroundColor: getStatusColor(data.request_status),
                          fontWeight: "500",
                          color: COLORS.white,
                          borderRadius: 8,
                          display: "inline-block",
                          fontSize: { xs: 10, sm: 10, md: 12, lg: 14 },
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {data.request_status}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ paddingY: 2, paddingX: 4 }}>
                      <Tooltip title="View" arrow>
                        <OutlinedIconButton
                          onClick={() => {
                            openPopup("restockItem", data.service_request_id);
                          }}
                        >
                          <Eye color={COLORS.primary} weight="duotone" />
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
      {isOpen && popupType === "assignTo" && (
        <PopPendingAssignTo
          open={isOpen}
          onClose={closePopup}
          id={popupData}
          refreshData={refreshData}
        />
      )}
    </>
  );
};

export default CustomTableReadyForDelivery;

const cellHeadStyles = {
  paddingY: 2,
  paddingX: 4,
  textAlign: "left",
  color: "#595959",
  fontSize: "1",
  fontWeight: 600,
  textTransform: "uppercase",
};
