import React, { useState } from "react";
import useAuth from "../../contexts/AuthContext";
import {
  Avatar,
  Divider,
  TextField,
  Typography,
  Button,
  Grid,
  Box,
  useMediaQuery,
} from "@mui/material";

const Profile = () => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const { userDetails } = useAuth();
  const [firstname, setFirstName] = useState(userDetails.firstname || "");
  const [middlename, setMiddleName] = useState(userDetails.middlename || "");
  const [lastname, setLastName] = useState(userDetails.lastname || "");
  const [username, setUsername] = useState(userDetails.username || "");
  const [email, setEmail] = useState(userDetails.email || "");
  const [phone, setPhone] = useState(userDetails.phone || "");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateFields = () => {
    const newErrors = {};
    if (!firstname) newErrors.firstname = "First name is required";
    if (!lastname) newErrors.lastname = "Last name is required";
    if (!email) newErrors.email = "Email is required";
    if (!phone) newErrors.phone = "Phone number is required";
    if (!username) newErrors.username = "Username is required";
    // Check for existing username - placeholder for actual check
    if (username === "existingUsername") {
      newErrors.username = "Username is already taken";
    }

    return newErrors;
  };

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;

    if (field === "firstname") setFirstName(value);
    else if (field === "middlename") setMiddleName(value);
    else if (field === "lastname") setLastName(value);
    else if (field === "username") setUsername(value);
    else if (field === "email") setEmail(value);
    else if (field === "phone") setPhone(value);

    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: "",
    }));
  };

  const handleClear = () => {
    setFirstName("");
    setMiddleName("");
    setLastName("");
    setUsername("");
    setEmail("");
    setPhone("");
    setErrors({});
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const newErrors = validateFields();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        // Save logic here
        // e.g., await saveProfile({ firstname, middlename, lastname, username, email, phone });
        console.log("Profile saved:", {
          firstname,
          middlename,
          lastname,
          username,
          email,
          phone,
        });
      } catch (error) {
        console.error("Save failed:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box p={2}>
      <Typography variant="h6" component="div">
        Profile
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.8, pb: 2 }}>
        Update your photo and profile here
      </Typography>
      <Divider />

      <Box sx={{ mt: 3, textAlign: isSmallScreen ? "center" : "left" }}>
        <Typography variant="subtitle1">Profile image</Typography>
        <Avatar
          src="/images/avatars/profile-avatar.png"
          sx={{ width: 100, height: 100, mx: "auto" }}
        />
      </Box>

      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="First Name"
            variant="outlined"
            fullWidth
            size="small"
            value={firstname}
            onChange={handleInputChange("firstname")}
            error={Boolean(errors.firstname)}
            helperText={errors.firstname}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-error": {
                  borderColor: "red",
                },
              },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Middle Name"
            variant="outlined"
            fullWidth
            size="small"
            value={middlename}
            onChange={handleInputChange("middlename")}
            error={Boolean(errors.middlename)}
            helperText={errors.middlename}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-error": {
                  borderColor: "red",
                },
              },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Last Name"
            variant="outlined"
            fullWidth
            size="small"
            value={lastname}
            onChange={handleInputChange("lastname")}
            error={Boolean(errors.lastname)}
            helperText={errors.lastname}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-error": {
                  borderColor: "red",
                },
              },
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            size="small"
            value={username}
            onChange={handleInputChange("username")}
            error={Boolean(errors.username)}
            helperText={errors.username}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-error": {
                  borderColor: "red",
                },
              },
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            size="small"
            value={email}
            onChange={handleInputChange("email")}
            error={Boolean(errors.email)}
            helperText={errors.email}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-error": {
                  borderColor: "red",
                },
              },
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Phone"
            variant="outlined"
            fullWidth
            size="small"
            value={phone}
            onChange={handleInputChange("phone")}
            error={Boolean(errors.phone)}
            helperText={errors.phone}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-error": {
                  borderColor: "red",
                },
              },
            }}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 5, display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="outlined"
          onClick={handleClear}
          sx={{
            marginRight: 1,
            borderColor: "divider",
            borderRadius: "5px",
            fontWeight: 500,
            textTransform: "none",
            color: "#595959",
            "&:hover": {
              borderColor: "#5787C8",
              color: "#5787C8",
              backgroundColor: "rgba(0, 0, 0, 0)",
            },
          }}
        >
          Clear
        </Button>
        <Button
          variant="contained"
          disableElevation
          onClick={handleSave}
          sx={{
            backgroundColor: "#5787C8",
            borderRadius: "5px",
            fontWeight: 500,
            minWidth: "80px",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#3A5A85",
            },
          }}
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </Box>
    </Box>
  );
};

export default Profile;

// import React, { useState } from "react";
// import useAuth from "../../contexts/AuthContext";
// import {
//   Avatar,
//   Divider,
//   TextField,
//   Typography,
//   Button,
//   Grid,
//   Box,
//   useMediaQuery,
// } from "@mui/material";

// const Profile = () => {
//   const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
//   const { userDetails } = useAuth();
//   const { firstname, setFirstName } = useState("");
//   const { middlename, setMiddleName } = useState("");
//   const { lastname, setLastName } = useState("");
//   const { username, setUsername } = useState("");
//   const { email, setEmail } = useState("");
//   const { phone, setPhone } = useState("");
//   const { errors, setErrors } = useState([]);
//   const [loading, setLoading] = useState(false);

//   const validateFields = () => {
//     const newErrors = {};
//     if (!firstname) {
//       newErrors.firstname = "First name is required";
//     }
//     if (!lastname) {
//       newErrors.lastname = "Last name is required";
//     }
//     if (!email) {
//       newErrors.email = "Email is required";
//     }
//     if (!phone) {
//       newErrors.phone = "Phone number is required";
//     }
//     if (!username) {
//       newErrors.username = "Username is required";
//     } else if ((username = username)) {
//       newErrors.username = "Username is already taken";
//     }

//     return newErrors;
//   };

//   const handleInputChange = (field) => (e) => {
//     const value = e.target.value;

//     if (field === "firstname") {
//       setFirstName(value);
//     } else if (field === "lastname") {
//       setLastName(value);
//     } else if (field === "username") {
//       setUsername(value);
//     } else if (field === "email") {
//       setEmail(value);
//     } else if (field === "phone") {
//       setPhone(value);
//     }

//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [field]: "",
//     }));
//   };

//   const handleClear = () => {
//     setFirstName("");
//     setMiddleName("");
//     setLastName("");
//     setUsername("");
//     setEmail("");
//     setPhone("");
//     setErrors({});
//   };

//   const handleSave = async (e) => {
//     e.preventDefault();

//     const newErrors = validateFields();
//     setErrors(newErrors);

//     if (Object.keys(newErrors).length === 0) {
//     }
//   };

//   return (
//     <Box p={2}>
//       <Typography variant="h6" component="div">
//         Profile
//       </Typography>
//       <Typography variant="body2" sx={{ opacity: 0.8, pb: 2 }}>
//         Update your photo and profile here
//       </Typography>
//       <Divider />

//       <Box sx={{ mt: 3, textAlign: isSmallScreen ? "center" : "left" }}>
//         <Typography variant="subtitle1">Profile image</Typography>
//         <Avatar
//           src="/images/avatars/profile-avatar.png"
//           sx={{ width: 100, height: 100, mx: "auto" }}
//         />
//       </Box>

//       <Grid container spacing={3} sx={{ mt: 4 }}>
//         <Grid item xs={12} sm={4}>
//           <TextField
//             label="First Name"
//             variant="outlined"
//             fullWidth
//             size="small"
//             defaultValue={userDetails.firstname}
//             value={firstname}
//             onChange={handleInputChange("firstname")}
//             // error={Boolean(errors.firstname)}
//             // helperText={errors.firstname}
//             sx={{
//               "& .MuiOutlinedInput-root": {
//                 "&.Mui-error": {
//                   borderColor: "red",
//                 },
//               },
//             }}
//           />
//         </Grid>
//         <Grid item xs={12} sm={4}>
//           <TextField
//             label="Middle Name"
//             variant="outlined"
//             fullWidth
//             size="small"
//             defaultValue={userDetails.middlename}
//           />
//         </Grid>
//         <Grid item xs={12} sm={4}>
//           <TextField
//             label="Last Name"
//             variant="outlined"
//             fullWidth
//             size="small"
//             defaultValue={userDetails.lastname}
//           />
//         </Grid>
//         <Grid item xs={12}>
//           <TextField
//             label="Username"
//             variant="outlined"
//             fullWidth
//             size="small"
//             defaultValue={userDetails.username}
//           />
//         </Grid>
//         <Grid item xs={12}>
//           <TextField
//             label="Email"
//             variant="outlined"
//             fullWidth
//             size="small"
//             defaultValue={userDetails.email}
//           />
//         </Grid>
//         <Grid item xs={12}>
//           <TextField
//             label="Phone"
//             variant="outlined"
//             fullWidth
//             size="small"
//             defaultValue={userDetails.phone}
//           />
//         </Grid>
//       </Grid>

//       <Box sx={{ mt: 5, display: "flex", justifyContent: "flex-end" }}>
//         <Button
//           variant="outlined"
//           onClick={handleClear}
//           sx={{
//             marginRight: 1,
//             borderColor: "divider",
//             borderRadius: "5px",
//             fontWeight: 500,
//             textTransform: "none",
//             color: "#595959",
//             "&:hover": {
//               borderColor: "#5787C8",
//               color: "#5787C8",
//               backgroundColor: "rgba(0, 0, 0, 0)",
//             },
//           }}
//         >
//           Clear
//         </Button>
//         <Button
//           variant="contained"
//           disableElevation
//           sx={{
//             backgroundColor: "#5787C8",
//             borderRadius: "5px",
//             fontWeight: 500,
//             minWidth: "80px",
//             textTransform: "none",
//             "&:hover": {
//               backgroundColor: "#3A5A85",
//             },
//           }}
//         >
//           Save
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default Profile;

// import React from "react";
// import {
//   Avatar,
//   Divider,
//   TextField,
//   Typography,
//   Button,
//   Grid,
//   Box,
//   useMediaQuery,
// } from "@mui/material";

// const Profile = () => {
//   const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

//   return (
//     <Box p={2}>
//       <Typography variant="h6" component="div">
//         Profile
//       </Typography>
//       <Typography variant="body2" sx={{ opacity: 0.8, pb: 2 }}>
//         Update your photo and profile here
//       </Typography>
//       <Divider />

//       <Box sx={{ mt: 3, textAlign: isSmallScreen ? "center" : "left" }}>
//         <Typography variant="subtitle1">Profile image</Typography>
//         <Avatar
//           src="/images/avatars/profile-avatar.png"
//           sx={{ width: 100, height: 100, mx: "auto" }}
//         />
//       </Box>

//       <Grid container spacing={2} sx={{ mt: 4 }}>
//         <Grid item xs={12} sm={6}>
//           <TextField
//             label="First Name"
//             variant="outlined"
//             fullWidth
//             size="small"
//             defaultValue="Wabweni"
//           />
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <TextField
//             label="Last Name"
//             variant="outlined"
//             fullWidth
//             size="small"
//             defaultValue="Brian"
//           />
//         </Grid>
//         <Grid item xs={12}>
//           <TextField
//             label="Username"
//             variant="outlined"
//             fullWidth
//             size="small"
//             defaultValue="Wabweni Brian"
//           />
//         </Grid>
//         <Grid item xs={12}>
//           <TextField
//             label="Email"
//             variant="outlined"
//             fullWidth
//             size="small"
//             defaultValue="wabwenib66@gmail.com"
//           />
//         </Grid>
//         <Grid item xs={12}>
//           <TextField
//             label="Phone"
//             variant="outlined"
//             fullWidth
//             size="small"
//             defaultValue="+256 775 358738"
//           />
//         </Grid>
//       </Grid>

//       <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
//         <Button
//           variant="outlined"
//           sx={{
//             marginRight: 1,
//             borderColor: "#595959",
//             borderRadius: "5px",
//             fontWeight: 500,
//             textTransform: "none",
//             color: "#595959",
//             "&:hover": {
//               borderColor: "#595959",
//               backgroundColor: "rgba(144, 144, 144, 0.1)",
//             },
//           }}
//         >
//           Clear
//         </Button>
//         <Button
//           variant="contained"
//           disableElevation
//           sx={{
//             backgroundColor: "#5787C8",
//             borderRadius: "5px",
//             fontWeight: 500,
//             minWidth: "90px",
//             textTransform: "none",
//             "&:hover": {
//               backgroundColor: "#3A5A85",
//             },
//           }}
//         >
//           Save
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default Profile;

// import React from "react";
// import {
//   Avatar,
//   Divider,
//   TextField,
//   Typography,
//   DialogActions,
//   Button,
//   Grid,
//   useMediaQuery,
// } from "@mui/material";
// import { Box } from "@mui/system";

// const Profile = () => {
//   const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

//   return (
//     <Box p={2}>
//       <Typography variant="h6" component={"div"}>
//         Profile
//       </Typography>
//       <Typography variant="body2" sx={{ opacity: 0.8, pb: 2 }}>
//         Update your photo and profile here
//       </Typography>
//       <Divider />

//       <Box sx={{ mt: 3, textAlign: isSmallScreen ? "center" : "left" }}>
//         <Typography variant="subtitle1">Profile image</Typography>
//         <Avatar
//           src="/images/avatars/profile-avatar.png"
//           sx={{ width: 100, height: 100, mx: "auto" }}
//         />
//       </Box>

//       <Grid container spacing={2} sx={{ mt: 4 }}>
//         <Grid item xs={12} sm={6}>
//           <TextField
//             label="First Name"
//             variant="outlined"
//             fullWidth
//             size="small"
//             defaultValue="Wabweni"
//           />
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <TextField
//             label="Last Name"
//             variant="outlined"
//             fullWidth
//             size="small"
//             defaultValue="Brian"
//           />
//         </Grid>
//         <Grid item xs={12}>
//           <TextField
//             label="Username"
//             variant="outlined"
//             fullWidth
//             size="small"
//             defaultValue="Wabweni Brian"
//           />
//         </Grid>
//         <Grid item xs={12}>
//           <TextField
//             label="Email"
//             variant="outlined"
//             fullWidth
//             size="small"
//             defaultValue="wabwenib66@gmail.com"
//           />
//         </Grid>
//         <Grid item xs={12}>
//           <TextField
//             label="Phone"
//             variant="outlined"
//             fullWidth
//             size="small"
//             defaultValue="+256 775 358738"
//           />
//         </Grid>
//       </Grid>

//       <DialogActions sx={{ mt: 3 }}>
//         <Button
//           variant="outlined"
//           sx={{
//             marginRight: 1,
//             borderColor: "#595959",
//             borderRadius: "5px",
//             fontWeight: 500,
//             textTransform: "none",
//             color: "#595959",
//             "&:hover": {
//               borderColor: "#595959",
//               backgroundColor: "rgba(144, 144, 144, 0.1)",
//             },
//           }}
//         >
//           Clear
//         </Button>
//         <Button
//           variant="contained"
//           disableElevation
//           sx={{
//             backgroundColor: "#5787C8",
//             borderRadius: "5px",
//             fontWeight: 500,
//             minWidth: "90px",
//             textTransform: "none",
//             "&:hover": {
//               backgroundColor: "#3A5A85",
//             },
//           }}
//         >
//           Update
//         </Button>
//       </DialogActions>
//     </Box>
//   );
// };

// export default Profile;

// import React from "react";
// import {
//   Avatar,
//   Divider,
//   TextField,
//   Typography,
//   DialogActions,
//   Button,
// } from "@mui/material";
// import { Box } from "@mui/system";

// const Profile = () => {
//   return (
//     <Box>
//       <Typography variant="subtitle1">Profile</Typography>
//       <Typography variant="subtitle2" sx={{ opacity: 0.8, pb: 2 }}>
//         Update your photo and profile here
//       </Typography>
//       <Divider />
//       <Box sx={{ mt: 3 }}>
//         <Typography variant="subtitle1">Profile image</Typography>
//         <Avatar src="/images/avatars/profile-avatar.png" />
//         <Box sx={{ mt: 4, display: "flex", alignItems: "center", gap: 4 }}>
//           <TextField
//             label="First Name"
//             variant="outlined"
//             rows={4}
//             fullWidth
//             size="small"
//             defaultValue={"Wabweni"}
//           />
//           <TextField
//             label="Last Name"
//             variant="outlined"
//             rows={4}
//             fullWidth
//             size="small"
//             defaultValue={"Brian"}
//           />
//         </Box>
//         <Box sx={{ my: 2 }}>
//           <TextField
//             label="Username"
//             variant="outlined"
//             size="small"
//             fullWidth
//             defaultValue={"Wabweni Brian"}
//           />
//         </Box>
//         <Box sx={{ my: 2 }}>
//           <TextField
//             label="Email"
//             variant="outlined"
//             size="small"
//             fullWidth
//             defaultValue={"wabwenib66@gmail.com"}
//           />
//         </Box>
//         <Box sx={{ my: 2 }}>
//           <TextField
//             label="Phone"
//             variant="outlined"
//             size="small"
//             fullWidth
//             defaultValue={"+256 775 358738"}
//           />
//         </Box>
//       </Box>
//       <DialogActions ">
//         <Button
//           variant="outlined"
//           sx={{
//             marginRight: 1,
//             borderColor: "#595959",
//             borderRadius: "5px",
//             fontWeight: 500,
//             textTransform: "none",
//             color: "#595959",
//             "&:hover": {
//               borderColor: "#595959",
//               backgroundColor: "rgba(144, 144, 144, 0.1)",
//             },
//           }}
//         >
//           Clear
//         </Button>
//         <Button
//           variant="contained"
//           disableElevation
//           sx={{
//             backgroundColor: "#5787C8",
//             borderRadius: "5px",
//             fontWeight: 500,
//             minWidth: "90px",
//             textTransform: "none",
//             "&:hover": {
//               backgroundColor: "#3A5A85",
//             },
//           }}
//         >
//           Update
//         </Button>
//       </DialogActions>
//     </Box>
//   );
// };

// export default Profile;
