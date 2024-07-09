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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/users/profile", {
          withCredentials: true,
        });
        setUser(response.data.user);

        const allUsersResponse = await axios.get("http://localhost:5000/users", {
          withCredentials: true,
        });
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
      await axios.delete(`http://localhost:5000/users/${selectedUser.id}`, {
        withCredentials: true,
      });
      setAllUsers(allUsers.filter((user) => user.id !== selectedUser.id));
      setOpenDeleteDialog(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEditUser = async () => {
    try {
      await axios.put(`http://localhost:5000/users/${editUser.id}`, editUser, {
        withCredentials: true,
      });
      setAllUsers(allUsers.map((user) => (user.id === editUser.id ? editUser : user)));
      setEditDialogOpen(false);
      setEditUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleOpenEditDialog = (user) => {
    setEditUser(user);
    setEditDialogOpen(true);
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
              <Typography variant="h6" gutterBottom>All Users</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead className="table-header">
                    <TableRow>
                      <TableHeaderCell className="table-header-cell">Full Name</TableHeaderCell>
                      <TableHeaderCell className="table-header-cell">Username</TableHeaderCell>
                      <TableHeaderCell className="table-header-cell">Email</TableHeaderCell>
                      <TableHeaderCell className="table-header-cell">Role</TableHeaderCell>
                      <TableHeaderCell className="table-header-cell">Actions</TableHeaderCell>
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
                          <IconButton onClick={() => handleOpenEditDialog(user)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => {
                            setSelectedUser(user);
                            setOpenDeleteDialog(true);
                          }}>
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
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
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
            onChange={(e) => setEditUser({ ...editUser, fullName: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Username"
            type="text"
            fullWidth
            value={editUser?.userName || ""}
            onChange={(e) => setEditUser({ ...editUser, userName: e.target.value })}
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
            label="Role"
            type="text"
            fullWidth
            value={editUser?.role || ""}
            onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
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
    </>
  );
}

export default DashboardUser;

