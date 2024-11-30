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
import { OutboundOutlined } from "@mui/icons-material";
import { Archive, ChatCircleDots, PencilLine } from "@phosphor-icons/react";
import OutlinedIconButton from "../../table/OutlinedIconButton";
import useAuth from "../../../contexts/AuthContext";
import PopMessageCustomer from "../../../pages/admin/Customers/components/PopMessageCustomer";

const CustomCustomerTable = ({ tableData, loading, refreshData }) => {
  const { userDetails } = useAuth;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedName, setSelectName] = useState("");
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
              <TableCell sx={cellHeadStyles}>Name</TableCell>
              <TableCell sx={cellHeadStyles}>Address</TableCell>
              <TableCell sx={cellHeadStyles}>Email</TableCell>
              <TableCell sx={cellHeadStyles}>Mobile Number</TableCell>
              <TableCell sx={cellHeadStyles}>Date Created</TableCell>
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
                    key={data.customer_id}
                    className="border-b"
                    role="checkbox"
                    tabIndex={-1}
                  >
                    <TableCell sx={{ paddingY: 2, paddingX: 4 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "600", color: COLORS.secondary }}
                      >
                        #{data.customer_id}
                      </Typography>
                    </TableCell>

                    <TableCell sx={{ paddingY: 2, paddingX: 4 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "600", color: COLORS.text }}
                      >
                        {data.full_name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "500", color: COLORS.subtitle }}
                      >
                        {data.username}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ paddingY: 2, paddingX: 4 }}>
                      {data.address?.address_line ||
                      data.address?.country ||
                      data.address?.province ? (
                        <>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: "600", color: COLORS.text }}
                          >
                            {data.address.address_line ||
                              "Address line not available"}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: "500", color: COLORS.subtitle }}
                          >
                            <span className="mr-1">
                              {data.address.country || "Country not available"}
                            </span>
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: "400", color: COLORS.subtitle }}
                          >
                            <span>
                              {data.address.province ||
                                "Province not available"}
                            </span>
                          </Typography>
                        </>
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: "600", color: COLORS.text }}
                        >
                          The address is not completed yet
                        </Typography>
                      )}
                    </TableCell>

                    <TableCell sx={{ paddingY: 2, paddingX: 4 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: data.email ? "600" : "400",
                          color: data.email ? COLORS.primary : COLORS.subtitle,
                        }}
                      >
                        {data.email || "No email available"}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ paddingY: 2, paddingX: 4 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "600", color: COLORS.secondary }}
                      >
                        {data.mobile_number}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ paddingY: 2, paddingX: 4 }}>
                      <DateCell dateCreated={data.date_created} />
                    </TableCell>

                    <TableCell
                      align="center"
                      sx={{ paddingY: 2, paddingX: { xs: 4, sm: 0 } }}
                    >
                      <Tooltip title="Message Customer" arrow>
                        <OutlinedIconButton
                          onClick={() => {
                            openPopup("messageCustomer", data.customer_id);
                            setSelectName(data.full_name);
                          }}
                        >
                          <ChatCircleDots
                            color={COLORS.success}
                            weight="duotone"
                          />
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
      {isOpen && popupType === "messageCustomer" && (
        <PopMessageCustomer
          open={isOpen}
          onClose={closePopup}
          id={popupData}
          name={selectedName}
          refreshData={refreshData}
        />
      )}
    </>
  );
};

export default CustomCustomerTable;

const cellHeadStyles = {
  paddingY: 2,
  paddingX: 4,
  textAlign: "left",
  color: "#595959",
  fontSize: "1",
  fontWeight: 600,
  textTransform: "uppercase",
};
