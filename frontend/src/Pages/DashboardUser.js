// DashboardUser.js
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
  styled,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  InputAdornment,
  Grid,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const DashboardContainer = styled(Box)({
  padding: "20px",
});

const TableHeaderCell = styled(TableCell)({
  fontWeight: "bold",
  backgroundColor: "#f5f5f5",
});

function DashboardUser() {
  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    fullName: "",
    userName: "",
    mail: "",
    password: "",
    role: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/users/profile",
          {
            withCredentials: true,
          }
        );
        setUser(response.data.user);

        const allUsersResponse = await axios.get(
          "http://localhost:5000/users",
          {
            withCredentials: true,
          }
        );
        setAllUsers(allUsersResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    if (location.state?.user) {
      setSnackbar({
        open: true,
        message: `Welcome ${location.state.user.fullName}`,
        severity: "success",
      });
    }
  }, [location.state]);

  const handleDeleteUser = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/users/${selectedUser.userName}`,
        {
          withCredentials: true,
        }
      );
      setAllUsers(
        allUsers.filter((user) => user.userName !== selectedUser.userName)
      );
      setOpenDeleteDialog(false);
      setSelectedUser(null);
      setSnackbar({
        open: true,
        message: "User deleted successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      setSnackbar({
        open: true,
        message: "Error deleting user",
        severity: "error",
      });
    }
  };

  const handleEditUser = async () => {
    try {
      await axios.put(
        `http://localhost:5000/users/${editUser.userName}`,
        editUser,
        {
          withCredentials: true,
        }
      );
      setAllUsers(
        allUsers.map((user) =>
          user.userName === editUser.userName ? editUser : user
        )
      );
      setEditDialogOpen(false);
      setEditUser(null);
      setSnackbar({
        open: true,
        message: "User updated successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error updating user:", error);
      setSnackbar({
        open: true,
        message: "Error updating user",
        severity: "error",
      });
    }
  };

  const handleAddUser = async () => {
    try {
      await axios.post("http://localhost:5000/users", newUser, {
        withCredentials: true,
      });
      setAllUsers([...allUsers, newUser]);
      setAddDialogOpen(false);
      setNewUser({
        fullName: "",
        userName: "",
        mail: "",
        password: "",
        role: "",
      });
      setSnackbar({
        open: true,
        message: "User added successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error adding user:", error);
      setSnackbar({
        open: true,
        message: "Error adding user",
        severity: "error",
      });
    }
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowEditPassword = () => setShowEditPassword(!showEditPassword);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box>
      <Navbar />
      <DashboardContainer>
        <Typography variant="h4" gutterBottom>
          User Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setAddDialogOpen(true)}
          startIcon={<PersonAddIcon />}
        >
          Add User
        </Button>
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Full Name</TableHeaderCell>
                <TableHeaderCell>Username</TableHeaderCell>
                <TableHeaderCell>Email</TableHeaderCell>
                <TableHeaderCell>Role</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allUsers.map((user) => (
                <TableRow key={user.userName}>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.userName}</TableCell>
                  <TableCell>{user.mail}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => {
                        setEditUser(user);
                        setEditDialogOpen(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() => {
                        setSelectedUser(user);
                        setOpenDeleteDialog(true);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Dialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this user?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDeleteUser} color="secondary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
        >
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            <TextField
              margin="normal"
              fullWidth
              label="Full Name"
              value={editUser?.fullName || ""}
              onChange={(e) =>
                setEditUser({ ...editUser, fullName: e.target.value })
              }
            />
            <TextField
              margin="normal"
              fullWidth
              label="Username"
              value={editUser?.userName || ""}
              onChange={(e) =>
                setEditUser({ ...editUser, userName: e.target.value })
              }
              disabled
            />
            <TextField
              margin="normal"
              fullWidth
              label="Email"
              value={editUser?.mail || ""}
              onChange={(e) =>
                setEditUser({ ...editUser, mail: e.target.value })
              }
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Role</InputLabel>
              <Select
                value={editUser?.role || ""}
                onChange={(e) =>
                  setEditUser({ ...editUser, role: e.target.value })
                }
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="user">User</MenuItem>
              </Select>
            </FormControl>
            <TextField
              margin="normal"
              fullWidth
              label="Password"
              type={showEditPassword ? "text" : "password"}
              value={editUser?.password || ""}
              onChange={(e) =>
                setEditUser({ ...editUser, password: e.target.value })
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowEditPassword}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {showEditPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleEditUser} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
          <DialogTitle>Add New User</DialogTitle>
          <DialogContent>
            <TextField
              margin="normal"
              fullWidth
              label="Full Name"
              value={newUser.fullName}
              onChange={(e) =>
                setNewUser({ ...newUser, fullName: e.target.value })
              }
            />
            <TextField
              margin="normal"
              fullWidth
              label="Username"
              value={newUser.userName}
              onChange={(e) =>
                setNewUser({ ...newUser, userName: e.target.value })
              }
            />
            <TextField
              margin="normal"
              fullWidth
              label="Email"
              value={newUser.mail}
              onChange={(e) => setNewUser({ ...newUser, mail: e.target.value })}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Role</InputLabel>
              <Select
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({ ...newUser, role: e.target.value })
                }
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="user">User</MenuItem>
              </Select>
            </FormControl>
            <TextField
              margin="normal"
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleAddUser} color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </DashboardContainer>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default DashboardUser;
