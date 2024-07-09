import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import {
  Box,
  CircularProgress,
  Container,
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
  Grid,
  styled,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

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
  const navigate = useNavigate();

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
      const response = await axios.post(
        "http://localhost:5000/users",
        newUser,
        {
          withCredentials: true,
        }
      );
      
      if (response.data && response.data.userId) {
        const addedUser = {
          id: response.data.userId,
          ...newUser
        };
        
        setAllUsers(prevUsers => [...prevUsers, addedUser]);
        
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
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Error adding user:", error);
      setSnackbar({
        open: true,
        message: "Error adding user: " + (error.response?.data?.error || error.message),
        severity: "error",
      });
    }
  };

  const handleOpenEditDialog = (user) => {
    setEditUser(user);
    setEditDialogOpen(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  if (!user) {
    return (
      <Box className="loading-container">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Navbar />
      <Container className="dashboard-container">
        <DashboardContainer>
          <Typography variant="h4" gutterBottom>
            Dashboard
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">All Users</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setAddDialogOpen(true)}
                >
                  Add User
                </Button>
              </Box>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead className="table-header">
                    <TableRow>
                      <TableHeaderCell className="table-header-cell">
                        Full Name
                      </TableHeaderCell>
                      <TableHeaderCell className="table-header-cell">
                        Username
                      </TableHeaderCell>
                      <TableHeaderCell className="table-header-cell">
                        Email
                      </TableHeaderCell>
                      <TableHeaderCell className="table-header-cell">
                        Role
                      </TableHeaderCell>
                      <TableHeaderCell className="table-header-cell">
                        Actions
                      </TableHeaderCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {allUsers.map((user) => (
                      <TableRow key={user.id} className="table-row">
                        <TableCell>{user.fullName}</TableCell>
                        <TableCell>{user.userName}</TableCell>
                        <TableCell>{user.mail}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => handleOpenEditDialog(user)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
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
            </Grid>
          </Grid>
        </DashboardContainer>
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Delete User</DialogTitle>
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

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Full Name"
            type="text"
            fullWidth
            value={editUser?.fullName || ""}
            onChange={(e) =>
              setEditUser({ ...editUser, fullName: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={editUser?.mail || ""}
            onChange={(e) => setEditUser({ ...editUser, mail: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            value={editUser?.password || ""}
            onChange={(e) =>
              setEditUser({ ...editUser, password: e.target.value })
            }
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select
              labelId="role-select-label"
              id="role-select"
              value={editUser?.role || ""}
              label="Role"
              onChange={(e) =>
                setEditUser({ ...editUser, role: e.target.value })
              }
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="guest">Guest</MenuItem>
            </Select>
          </FormControl>
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

      {/* Add User Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Full Name"
            type="text"
            fullWidth
            value={newUser.fullName}
            onChange={(e) =>
              setNewUser({ ...newUser, fullName: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Username"
            type="text"
            fullWidth
            value={newUser.userName}
            onChange={(e) =>
              setNewUser({ ...newUser, userName: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={newUser.mail}
            onChange={(e) => setNewUser({ ...newUser, mail: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="new-role-select-label">Role</InputLabel>
            <Select
              labelId="new-role-select-label"
              id="new-role-select"
              value={newUser.role}
              label="Role"
              onChange={(e) =>
                setNewUser({ ...newUser, role: e.target.value })
              }
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="guest">Guest</MenuItem>
            </Select>
          </FormControl>
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

      {/* Snackbar for success/error messages */}
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
    </>
  );
}

export default DashboardUser;