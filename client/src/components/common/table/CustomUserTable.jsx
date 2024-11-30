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
import OutlinedIconButton from "../../table/OutlinedIconButton";
import useAuth from "../../../contexts/AuthContext";
import PopMessageCustomer from "../../../pages/admin/Customers/components/PopMessageCustomer";
import PermissionBox from "../../table/PermissionBox";
import StatusCell from "../../table/StatusCell";
import { Trash, PencilLine, Eye } from "@phosphor-icons/react";
import A_PopupViewUser from "../../../pages/admin/User/components/A_PopupViewUser";
import A_PopupEditUser from "../../../pages/admin/User/components/A_PopupEditUser";
import ConfirmationDialog from "../ConfirmationDialog";
import { updateRemoveUser } from "../../../services/api/putApi";
import toast from "react-hot-toast";

const CustomUserTable = ({
  tableData,
  loading,
  refreshData,
  roles,
  stores,
  userDetails,
}) => {
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

  const handleDeleteUser = async (id) => {
    if (id) {
      const activityData = {
        activity_id: userDetails.userId,
        activity_username: userDetails.username,
        activity_roleName: userDetails.roleName,
      };
      try {
        const response = await updateRemoveUser.putRemoveUser(id, activityData);
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
              <TableCell sx={cellHeadStyles}>Role</TableCell>
              <TableCell sx={cellHeadStyles}>Date Created</TableCell>
              <TableCell sx={cellHeadStyles}>Permissions</TableCell>
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
                    key={data.user_id}
                    className="border-b"
                    role="checkbox"
                    tabIndex={-1}
                  >
                    <TableCell sx={{ paddingY: 2, paddingX: 4 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "600", color: COLORS.secondary }}
                      >
                        #{data.user_id}
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
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "500", color: COLORS.text4 }}
                      >
                        {data.role_name}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ paddingY: 2, paddingX: 4 }}>
                      <DateCell dateCreated={data.date_created} />
                    </TableCell>
                    <TableCell sx={{ paddingY: 2, paddingX: 4 }}>
                      <Box display="flex" gap={1}>
                        {data.can_read ? <PermissionBox label="Read" /> : null}
                        {data.can_write ? (
                          <PermissionBox label="Write" />
                        ) : null}
                        {data.can_edit ? <PermissionBox label="Edit" /> : null}
                        {data.can_delete ? (
                          <PermissionBox label="Delete" />
                        ) : null}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ paddingY: 2, paddingX: 4 }}>
                      <StatusCell status={data.status} />
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ paddingY: 2, paddingX: { xs: 4, sm: 0 } }}
                    >
                      <Tooltip title="View User" arrow>
                        <OutlinedIconButton
                          onClick={() => openPopup("viewUser", data)}
                        >
                          <Eye color={COLORS.primary} weight="duotone" />
                        </OutlinedIconButton>
                      </Tooltip>
                      <Tooltip title="Edit User" arrow>
                        <OutlinedIconButton
                          onClick={() => openPopup("edit", data)}
                        >
                          <PencilLine
                            color={COLORS.secondary}
                            weight="duotone"
                          />
                        </OutlinedIconButton>
                      </Tooltip>
                      <Tooltip title="Delete User" arrow>
                        <OutlinedIconButton
                          onClick={() => openPopup("delete", data.user_id)}
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
      {isOpen && popupType === "viewUser" && (
        <A_PopupViewUser
          open={isOpen}
          onClose={closePopup}
          userData={popupData}
        />
      )}

      {isOpen && popupType === "edit" && (
        <A_PopupEditUser
          open={isOpen}
          onClose={closePopup}
          roleData={roles}
          storeData={stores}
          userData={popupData}
          refreshData={refreshData}
        />
      )}

      {isOpen && popupType === "delete" && (
        <ConfirmationDialog
          open={isOpen}
          onClose={closePopup}
          onConfirm={handleDeleteUser}
          itemId={popupData}
        />
      )}
    </>
  );
};

export default CustomUserTable;

const cellHeadStyles = {
  paddingY: 2,
  paddingX: 4,
  textAlign: "left",
  color: "#595959",
  fontSize: "1",
  fontWeight: 600,
  textTransform: "uppercase",
};
