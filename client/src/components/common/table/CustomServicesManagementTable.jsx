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
  Skeleton,
  Tooltip,
} from "@mui/material";
import no_data from "../../../assets/images/no_data_table.jpg";
import DateCell from "../../table/DateCell";
import { COLORS } from "../../../constants/color";
import usePopup from "../../../hooks/common/usePopup";
import { Trash, PencilLine, StackPlus, Tag } from "@phosphor-icons/react";
import OutlinedIconButton from "../../table/OutlinedIconButton";
import PopEditServices from "../../../pages/admin/Service/components/PopEditServices";
import PopAddPromo from "../../../pages/admin/Service/components/PopAddPromo";
import DeleteConfirmationDialog from "../DeleteConfirmationDialog";
import toast from "react-hot-toast";
import { updateServiceDelete } from "../../../services/api/putApi";

const CustomServicesManagementTable = ({
  tableData,
  loading,
  refreshData,
  userDetails,
}) => {
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

  const handlDeleteService = async (id) => {
    if (id) {
      try {
        const response = await updateServiceDelete.putPromo(id);
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
              <TableCell sx={cellHeadStyles}>Name</TableCell>
              <TableCell sx={cellHeadStyles}>Description</TableCell>
              <TableCell sx={cellHeadStyles}>Default Price</TableCell>
              <TableCell sx={cellHeadStyles}>Date Created</TableCell>
              <TableCell sx={cellHeadStyles}>Promo</TableCell>
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
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "600", color: COLORS.text }}
                      >
                        {data.service_name}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ paddingY: 2, paddingX: 4 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "400", color: COLORS.subtitle }}
                      >
                        {data.description || "No description yet"}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ paddingY: 2, paddingX: 4 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: "600",
                          color: COLORS.secondary,
                          textDecoration:
                            data.promo_status === "active" &&
                            data.discount_price
                              ? "line-through"
                              : "none",
                        }}
                      >
                        ₱ {data.default_price}
                      </Typography>

                      {data.promo_status === "active" &&
                        data.discount_price && (
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: "600",
                              color: COLORS.error,
                              marginLeft: 1,
                            }}
                          >
                            ₱ {data.discount_price}
                          </Typography>
                        )}
                    </TableCell>
                    <TableCell sx={{ paddingY: 2, paddingX: 4 }}>
                      <DateCell dateCreated={data.date_created} />
                    </TableCell>

                    <TableCell sx={{ paddingY: 2, paddingX: 4 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: "600",
                          color:
                            data.promo_status === null
                              ? COLORS.primary
                              : COLORS.white,
                          backgroundColor:
                            data.promo_status === null
                              ? COLORS.background
                              : data.promo_status === "active"
                              ? COLORS.success
                              : COLORS.error,
                          padding: "4px 8px",
                          borderRadius: 8,
                          display: "inline-block",
                        }}
                      >
                        {data.promo_status === null
                          ? "No promo yet"
                          : data.promo_status === "active"
                          ? "Activated"
                          : "Deactivated"}
                      </Typography>
                    </TableCell>

                    <TableCell sx={{ paddingY: 2, paddingX: { xs: 4, sm: 0 } }}>
                      {data.promo_status !== "active" &&
                        data.promo_status !== "inactive" && (
                          <Tooltip title="Add Promo" arrow>
                            <OutlinedIconButton
                              disabled={!userDetails?.permissions?.canWrite}
                              onClick={() => {
                                openPopup("addPromo", data);
                              }}
                            >
                              <Tag color={COLORS.success} weight="duotone" />
                            </OutlinedIconButton>
                          </Tooltip>
                        )}

                      <Tooltip title="Edit Services" arrow>
                        <OutlinedIconButton
                          disabled={!userDetails?.permissions?.canEdit}
                          onClick={() => {
                            openPopup("editService", data);
                          }}
                        >
                          <PencilLine
                            color={COLORS.secondary}
                            weight="duotone"
                          />
                        </OutlinedIconButton>
                      </Tooltip>
                      <Tooltip title="Delete Services" arrow>
                        <OutlinedIconButton
                          disabled={!userDetails?.permissions?.canDelete}
                          onClick={() => {
                            openPopup("deleteService", data.id);
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
      {isOpen && popupType === "addPromo" && (
        <PopAddPromo
          open={isOpen}
          onClose={closePopup}
          addData={popupData}
          refreshData={refreshData}
        />
      )}

      {isOpen && popupType === "editService" && (
        <PopEditServices
          open={isOpen}
          onClose={closePopup}
          editData={popupData}
          refreshData={refreshData}
        />
      )}

      {isOpen && popupType === "deleteService" && (
        <DeleteConfirmationDialog
          open={isOpen}
          onClose={closePopup}
          id={popupData}
          onConfirm={handlDeleteService}
        />
      )}
    </>
  );
};

export default CustomServicesManagementTable;

const cellHeadStyles = {
  paddingY: 2,
  paddingX: 4,
  textAlign: "left",
  color: "#595959",
  fontSize: "1",
  fontWeight: 600,
  textTransform: "uppercase",
};
