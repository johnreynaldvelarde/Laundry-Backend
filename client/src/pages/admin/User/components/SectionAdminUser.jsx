import React, { useCallback, useEffect, useRef, useState } from "react";
import useAuth from "../../../../contexts/AuthContext";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  TablePagination,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import {
  PlusCircle,
  FolderUser,
  Trash,
  PencilLine,
  Eye,
} from "@phosphor-icons/react";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import noData from "../../../../assets/images/no_data_table.jpg";
import { COLORS } from "../../../../constants/color";
import A_PopupAddUser from "./A_PopupAddUser";
import {
  viewAdminBasedStore,
  viewAdminBasedUser,
  viewRolesAndPermissions,
} from "../../../../services/api/getApi";
import PermissionBox from "../../../../components/table/PermissionBox";
import StatusCell from "../../../../components/table/StatusCell";
import DateCell from "../../../../components/table/DateCell";
import OutlinedIconButton from "../../../../components/table/OutlinedIconButton";
import ConfirmationDialog from "../../../../components/common/ConfirmationDialog";
import toast from "react-hot-toast";
import A_PopupEditUser from "./A_PopupEditUser";
import { updateRemoveUser } from "../../../../services/api/putApi";
import A_PopupViewUser from "./A_PopupViewUser";
import A_PopupEditPermissions from "./A_PopupEditPermissions";
import useFetchData from "../../../../hooks/common/useFetchData";
import CustomHeaderTitle from "../../../../components/common/CustomHeaderTitle";
import usePopup from "../../../../hooks/common/usePopup";

const SectionAdminUser = () => {
  const { userDetails } = useAuth();
  const [selectedStore, setSelectedStore] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: roles, fetchData: fetchRoles } = useFetchData();
  const { data: stores, fetchData: fetchStores } = useFetchData();
  const { data: users, fetchData: fetchUsers } = useFetchData();

  const { isOpen, popupType, openPopup, closePopup, popupData } = usePopup();

  const fetchRolesData = useCallback(() => {
    fetchRoles(
      viewRolesAndPermissions.getRoleAndPermission,
      userDetails.storeId
    );
  }, [fetchRoles, userDetails?.storeId]);

  const fetchStoresData = useCallback(() => {
    fetchStores(viewAdminBasedStore.getAdminBasedStore, userDetails.storeId);
  }, [fetchStores, userDetails?.storeId]);

  const fetchUsersData = useCallback(() => {
    fetchUsers(viewAdminBasedUser.getAdminBasedUser, userDetails.storeId);
  }, [fetchUsers, userDetails?.storeId]);

  // useEffect(() => {
  //   fetchRolesData();
  //   fetchStoresData();
  //   fetchUsersData();

  //   const intervalId = setInterval(() => {
  //     fetchRolesData();
  //     fetchStoresData();
  //     fetchUsersData();
  //   }, 10000);

  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, [fetchRolesData, fetchStoresData, fetchUsersData]);

  useEffect(() => {
    fetchRolesData();
    fetchStoresData();
    fetchUsersData();
  }, [fetchRolesData, fetchStoresData, fetchUsersData]);

  useEffect(() => {
    if (stores.length > 0) {
      setSelectedStore(stores[0].id);
    }
  }, [stores]);

  const handleRefreshData = () => {
    fetchRolesData();
    fetchStoresData();
    fetchUsersData();
  };

  // For Popup
  const [openPopupAddUser, setOpenPopupAddUser] = useState(false);
  const [openPopupEditUser, setOpenPopupEditUser] = useState(false);
  const [openPopupViewUser, setOpenPopupViewUser] = useState(false);
  const [openPopupAddRole, setOpenPopupAddRole] = useState(false);
  const [openPopupEditPermission, setOpenPopupEditPermissions] =
    useState(false);
  const [openPopupRenameRole, setOpenPopupRenameRole] = useState(false);
  const [selectedPermissionsData, setSelectedPermissionsData] = useState(false);
  const [selectedRenameRole, setSelectedRenameRole] = useState(false);
  const [selectedEditData, setSelectedEditData] = useState(false);
  const [selectedViewData, setSelectedViewData] = useState(false);

  // #For add role and permission
  const handleOpenPopupAddRole = () => {
    setOpenPopupAddRole(true);
  };
  const handleClosePopupAddRole = () => {
    setOpenPopupAddRole(false);
  };

  // #For edit permissions
  const handleOpenPopupEditPermission = (data) => {
    setOpenPopupEditPermissions(true);
    setSelectedPermissionsData(data);
  };
  const handleClosePopupEditPermissions = () => {
    setOpenPopupEditPermissions(false);
  };

  // #For rename role
  const handleOpenPopupRenameRole = (data) => {
    setOpenPopupRenameRole(true);
    setAnchorEl(null);
    setSelectedRenameRole(data);
  };
  const handleClosePopupRenameRole = () => {
    setOpenPopupRenameRole(false);
  };

  // #For add user
  const handleOpenPopupAddUser = () => {
    setOpenPopupAddUser(true);
  };
  const handleClosePopupAddUser = () => {
    setOpenPopupAddUser(false);
  };

  // #For edit user
  const handleOpenPopupEditUser = (data) => {
    setOpenPopupEditUser(true);
    setSelectedEditData(data);
  };
  const handleClosePopupEditUser = () => {
    setOpenPopupEditUser(false);
    setSelectedEditData(null);
  };

  // #For view user
  const handleOpenPopupViewUser = (data) => {
    setOpenPopupViewUser(true);
    setSelectedViewData(data);
  };
  const handleClosePopupViewtUser = () => {
    setOpenPopupViewUser(false);
    setSelectedViewData(null);
  };

  // For Role and Permission Section
  const handleMenuClick = (event, role) => {
    setAnchorEl(event.currentTarget);
    setSelectedRole(role);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // Store and User Section
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const checkOverflow = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth);
  };

  useEffect(() => {
    checkOverflow();

    const ref = scrollRef.current;
    ref.addEventListener("scroll", checkOverflow);
    window.addEventListener("resize", checkOverflow);

    return () => {
      ref.removeEventListener("scroll", checkOverflow);
      window.removeEventListener("resize", checkOverflow);
    };
  }, []);

  const scrollTo = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === "left" ? -300 : 300;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const handleStoreClick = (id) => {
    setSelectedStore(id);
    setSelected([]);
  };

  const filteredUsers =
    selectedStore && Array.isArray(users)
      ? users.filter((user) => user.store_id === selectedStore)
      : []; // Default to an empty array if no selected store

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = filteredUsers.map((user) => user.user_id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [selectedUser, setSelectedUser] = useState(null);

  const [isDialogOpenForMultiple, setIsDialogOpenForMultiple] = useState(false);

  const handleDialogDelete = (id, options) => {
    if (options === "Role") {
      setSelectedRoles(id);
    } else {
      setSelectedUser(id);
    }

    setDialogOpen(true);
  };

  const openDialogForMultiple = () => {
    if (selected.length === 0) {
      toast.error("No users selected for deletion.");
    } else {
      setIsDialogOpenForMultiple(true);
    }
  };

  const closeDialogForMultiple = () => {
    setIsDialogOpenForMultiple(false);
  };

  const handleClickCheckbox = (id) => {
    setSelected((prevSelected) => {
      const selectedIndex = prevSelected.indexOf(id);
      if (selectedIndex === -1) {
        return [...prevSelected, id];
      } else {
        return prevSelected.filter((selectedId) => selectedId !== id);
      }
    });
  };

  const handleCheckBoxDelete = async () => {
    if (selected.length === 0) {
      toast.error("No users selected for deletion.");
      return;
    }
    const deletePromises = selected.map(async (id) => {
      if (id) {
        try {
          const response = await updateRemoveUser.putRemoveUser(id);
          if (response.success) {
            handleRefreshData();
          } else {
            toast.error(response.message);
          }
        } catch (error) {
          toast.error(`Error: ${error.message || "Something went wrong"}`);
        }
      }
    });

    await Promise.all(deletePromises);
    setSnackbarMessage("Selected users have been deleted.");
    setSnackbarOpen(true);
    setSelected([]);
  };

  const handleConfirmMultipleDelete = () => {
    handleCheckBoxDelete();
    closeDialogForMultiple();
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

  // For snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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
          title={"User Management"}
          subtitle={" Role Management & Permission"}
        />
      </Box>

      {/* List of roles */}
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
        {roles.map((role) => (
          <Box
            key={role.id}
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
                <FolderUser size={30} color="white" weight="duotone" />
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
                {role.role_name}
              </Typography>
            </Box>
            <Box
              display="flex"
              flexDirection={{ xs: "column", sm: "row" }} // Stack vertically on small screens
              alignItems="center"
              mt={2}
              mb={5}
            >
              <Box display="flex" alignItems="center" mb={{ xs: 1, sm: 0 }}>
                {[...Array(4)].map((_, index) => (
                  <Box
                    key={index}
                    component="img"
                    src={`https://via.placeholder.com/24`}
                    alt={`User ${index + 1}`}
                    sx={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "50%",
                      marginLeft: index === 0 ? 0 : "4px",
                    }}
                  />
                ))}
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: COLORS.subtitle,
                  marginLeft: { xs: 0, sm: "8px" }, // No left margin on small screens
                  marginBottom: "8px",
                  textAlign: { xs: "center", sm: "left" }, // Center text on small screens
                }}
              >
                Total Users: {role.user_count}
              </Typography>
            </Box>

            <Button
              onClick={() => handleOpenPopupEditPermission(role)}
              variant="outlined"
              sx={{
                padding: 1,
                marginBottom: "8px",
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
              <ManageAccountsIcon sx={{ marginRight: "5px" }} />
              Edit Role
            </Button>
          </Box>
        ))}
      </Box>

      {/* Store List */}
      <Box
        sx={{
          marginTop: "40px",
          padding: "20px",
          border: `1px solid ${COLORS.border2}`,
          borderRadius: "8px",
          backgroundColor: COLORS.white,
          position: "relative",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: "18px", sm: "24px", md: "28px" },
            fontWeight: 500,
            color: COLORS.primary,
          }}
        >
          Stores Overview
        </Typography>

        {/* Left Arrow */}
        {showLeftArrow && (
          <Box
            onClick={() => scrollTo("left")}
            sx={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              zIndex: 1,
              backgroundColor: "#fff",
              borderRadius: "50%",
              padding: "5px",
              boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)",
            }}
          >
            <ArrowBackIos />
          </Box>
        )}

        {/* List of Stores */}
        <Box
          ref={scrollRef}
          className="hori-scrollable"
          sx={{
            display: "flex",
            overflowX: "auto",
            padding: "10px 0",
          }}
        >
          {stores.map((store) => (
            <Box
              key={store.id}
              onClick={() => handleStoreClick(store.id)}
              sx={{
                border: `1px solid ${COLORS.border2}`,
                borderRadius: "8px",
                padding: "25px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                backgroundColor:
                  selectedStore === store.id ? COLORS.secondary : COLORS.white, // Blue when selected
                minWidth: "300px", // Minimum width for each store box
                marginRight: "20px", // Space between boxes
                cursor: "pointer", // Indicate clickable box
                "&:hover": {
                  backgroundColor:
                    selectedStore === store.id
                      ? COLORS.secondary
                      : COLORS.secondaryLight,
                },
              }}
            >
              <Box display="flex" flexDirection="column">
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    color:
                      selectedStore === store.id
                        ? COLORS.white
                        : COLORS.textPrimary,
                  }}
                >
                  {store.store_name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color:
                      selectedStore === store.id
                        ? COLORS.white
                        : COLORS.subtitle,
                  }}
                >
                  Total Users: {store.user_count}
                </Typography>
              </Box>

              {/* Circular Bar User Total */}
              <Box
                sx={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {/* Circular progress background */}
                <CircularProgress
                  variant="determinate"
                  value={100}
                  size={60}
                  sx={{
                    color: COLORS.border2,
                    position: "absolute",
                  }}
                />
                {/* Filled circular progress */}
                <CircularProgress
                  variant="determinate"
                  value={(store.totalUsers / 99) * 100}
                  size={60}
                  sx={{
                    color:
                      selectedStore === store.id
                        ? COLORS.white
                        : COLORS.secondary,
                  }}
                />
                {/* Centered User Count */}
                <Typography
                  variant="caption"
                  sx={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    textAlign: "center",
                    color:
                      selectedStore === store.id
                        ? COLORS.white
                        : COLORS.textPrimary,
                  }}
                >
                  {store.user_count} {""}
                  User
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Right Arrow */}
        {showRightArrow && (
          <Box
            onClick={() => scrollTo("right")}
            sx={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              zIndex: 1,
              backgroundColor: "#fff",
              borderRadius: "50%",
              padding: "5px",
              boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)",
            }}
          >
            <ArrowForwardIos />
          </Box>
        )}
      </Box>

      {/* User List */}
      <Box mt={5}>
        <Box
          mb={2}
          className="flex items-center justify-between mb-8"
          sx={{
            flexDirection: {
              xs: "column",
              sm: "row",
            },
          }}
        >
          <Box sx={{ display: "flex" }}>
            {/* Title */}
            <Typography variant="h6" sx={{ marginRight: 2 }}>
              All Users
            </Typography>
          </Box>

          <Box
            className="flex items-center"
            sx={{
              width: {
                xs: "100%",
                sm: "auto",
              },
              flexDirection: {
                xs: "column",
                sm: "row",
              },
              "& button": {
                width: {
                  xs: "100%",
                  sm: "auto",
                },
                marginBottom: {
                  xs: 2,
                  sm: 0,
                },
              },
            }}
          >
            <Box
              className="flex items-center"
              sx={{
                width: {
                  xs: "100%",
                  sm: "auto",
                },
                marginBottom: {
                  xs: 2,
                  sm: 0,
                },
              }}
            >
              <FormControl sx={{ minWidth: 200 }} size="small" fullWidth>
                <InputLabel id="role-select-label">Filter by Role</InputLabel>
                <Select
                  labelId="role-select-label"
                  id="role-select"
                  label="Filter by Role"
                  defaultValue=""
                >
                  <MenuItem value="">
                    <em>All</em>
                  </MenuItem>
                  {roles.map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.role_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Button
              onClick={openDialogForMultiple}
              variant="contained"
              disableElevation
              disabled={selected.length === 0}
              sx={{
                marginLeft: { sm: 2 },
                backgroundColor: COLORS.error,
                borderRadius: "5px",
                fontWeight: 500,
                textTransform: "none",
                paddingX: { xs: 1, sm: 2, md: 3 },
                fontSize: { xs: "14px", sm: "14px", md: "16px" },
                "&:hover": {
                  backgroundColor: COLORS.errorHover,
                },
                width: { xs: "100%", sm: "auto" },
                mt: { xs: 0, sm: 0 },
              }}
            >
              Delete Selected
            </Button>
            <Button
              variant="contained"
              startIcon={
                <PlusCircle size={24} color="#fcfcfc" weight="duotone" />
              }
              sx={{
                marginLeft: { sm: 2 },
                backgroundColor: COLORS.secondary,
                borderRadius: "5px",
                fontWeight: 500,
                textTransform: "none",
                paddingX: { xs: 1, sm: 2, md: 3 },
                fontSize: { xs: "14px", sm: "14px", md: "16px" },
                "&:hover": {
                  backgroundColor: COLORS.secondaryHover,
                },
                width: { xs: "100%", sm: "auto" },
                mt: { xs: 0, sm: 0 },
              }}
              onClick={handleOpenPopupAddUser}
            >
              Add new user
            </Button>
          </Box>
        </Box>

        {/* User Table */}
        <TableContainer
          component={Paper}
          sx={{
            overflowX: "auto",
            borderRadius: 2, // No rounded corners
            boxShadow: "none", // No shadow
            border: `1px solid ${COLORS.border2}`,
          }}
        >
          <Table>
            <TableHead className="bg-[#F1F1F1] border-b">
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selected.length > 0 &&
                      selected.length < filteredUsers.length
                    }
                    checked={
                      filteredUsers.length > 0 &&
                      selected.length === filteredUsers.length
                    }
                    onChange={handleSelectAllClick}
                    inputProps={{ "aria-label": "select all users" }}
                    disabled={filteredUsers.length === 0}
                  />
                </TableCell>
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
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    align="center"
                    sx={{ paddingY: 3, paddingX: 4 }}
                  >
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                    >
                      <img
                        src={noData}
                        alt="No data"
                        style={{ width: "150px", marginBottom: "10px" }}
                      />
                      <Typography
                        variant="body1"
                        color={COLORS.primary}
                        fontWeight={500}
                      >
                        No available user
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => {
                    const isItemSelected = isSelected(user.user_id);
                    return (
                      <TableRow
                        key={user.user_id}
                        className="border-b"
                        role="checkbox"
                        aria-checked={isItemSelected}
                        selected={isItemSelected}
                        tabIndex={-1}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selected.includes(user.user_id)}
                            onClick={(event) => {
                              event.stopPropagation();
                              handleClickCheckbox(user.user_id);
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ paddingY: 2, paddingX: 4 }}>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: "600", color: COLORS.secondary }}
                          >
                            #{user.user_id}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ paddingY: 2, paddingX: 4 }}>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: "600", color: COLORS.text }}
                          >
                            {user.first_name}{" "}
                            {user.middle_name && `${user.middle_name} `}
                            {user.last_name}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: "500", color: COLORS.text4 }}
                          >
                            {user.username}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ paddingY: 2, paddingX: 4 }}>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: "500", color: COLORS.text4 }}
                          >
                            {user.role_name}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ paddingY: 2, paddingX: 4 }}>
                          <DateCell dateCreated={user.date_created} />
                        </TableCell>
                        <TableCell sx={{ paddingY: 2, paddingX: 4 }}>
                          <Box display="flex" gap={1}>
                            {user.can_read ? (
                              <PermissionBox label="Read" />
                            ) : null}
                            {user.can_write ? (
                              <PermissionBox label="Write" />
                            ) : null}
                            {user.can_edit ? (
                              <PermissionBox label="Edit" />
                            ) : null}
                            {user.can_delete ? (
                              <PermissionBox label="Delete" />
                            ) : null}
                          </Box>
                        </TableCell>
                        <TableCell sx={{ paddingY: 2, paddingX: 4 }}>
                          <StatusCell status={user.isStatus} />
                        </TableCell>
                        <TableCell sx={{ paddingY: 3, paddingX: 4 }}>
                          <Tooltip title="View User" arrow>
                            <OutlinedIconButton
                              onClick={() => openPopup("viewUser", user)}
                            >
                              <Eye color={COLORS.primary} weight="duotone" />
                            </OutlinedIconButton>
                          </Tooltip>
                          <Tooltip title="Edit User" arrow>
                            <OutlinedIconButton
                              onClick={() => handleOpenPopupEditUser(user)}
                            >
                              <PencilLine
                                color={COLORS.secondary}
                                weight="duotone"
                              />
                            </OutlinedIconButton>
                          </Tooltip>
                          <Tooltip title="Delete User" arrow>
                            <OutlinedIconButton
                              onClick={() =>
                                handleDialogDelete(user.user_id, "")
                              }
                            >
                              <Trash color={COLORS.error} weight="duotone" />
                            </OutlinedIconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>

      {/* PopupSection */}

      {isOpen && popupType === "viewUser" && (
        <A_PopupViewUser
          open={isOpen}
          onClose={closePopup}
          userData={popupData}
        />
      )}

      <A_PopupAddUser
        open={openPopupAddUser}
        onClose={handleClosePopupAddUser}
        roleData={roles}
        storeData={stores}
        refreshData={handleRefreshData}
      />

      <A_PopupEditUser
        open={openPopupEditUser}
        onClose={handleClosePopupEditUser}
        roleData={roles}
        storeData={stores}
        userData={selectedEditData}
        refreshData={handleRefreshData}
      />

      <A_PopupEditPermissions
        open={openPopupEditPermission}
        onClose={handleClosePopupEditPermissions}
        permissionsData={selectedPermissionsData}
        refreshData={handleRefreshData}
      />

      <ConfirmationDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleDeleteUser}
        itemId={selectedUser}
      />

      <ConfirmationDialog
        open={isDialogOpenForMultiple}
        onClose={closeDialogForMultiple}
        onConfirm={handleConfirmMultipleDelete}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }} // Fixed "below" to "bottom"
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{
            width: "100%",
            color: COLORS.white,
            backgroundColor: COLORS.secondary,
            "& .MuiAlert-icon": {
              color: "white", // Change icon color to white
            },
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

const cellHeadStyles = {
  paddingY: 2,
  paddingX: 4,
  textAlign: "left",
  color: "#595959",
  fontSize: "1",
  fontWeight: 600, // Changed to semi-bold
  textTransform: "uppercase",
};

export default SectionAdminUser;
