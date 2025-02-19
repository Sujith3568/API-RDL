import React, { useState, useEffect } from "react";
import {
  Card,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EmployeeManagement() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [employeeList, setEmployeeList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");

  useEffect(() => {
    fetch("https://reqres.in/api/users?page=2")
      .then((res) => res.json())
      .then((data) => {
        setEmployeeList(data.data || []);
      })
      .catch((error) => console.error("Error fetching employees:", error));
  }, []);

  const handleAddEmployee = async () => {
    if (!firstName || !lastName) {
      toast.error("First and last name are required!");
      return;
    }

    const newEmployee = {
      id: Date.now(),
      first_name: firstName,
      last_name: lastName,
    };

    try {
      const response = await fetch("https://reqres.in/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEmployee),
      });

      await response.json();
      setEmployeeList((prev) => [...prev, newEmployee]);
      setFirstName("");
      setLastName("");

      toast.success("Employee added successfully!");
    } catch (error) {
      console.error("Error adding employee:", error);
      toast.error("Failed to add employee!");
    }
  };

  const handleOpenDeleteDialog = (id) => {
    setSelectedEmployeeId(id);
    setOpenDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDialog(false);
    setSelectedEmployeeId(null);
  };

  const handleDeleteConfirmed = async () => {
    if (!selectedEmployeeId) return;

    try {
      await fetch(`https://reqres.in/api/users/${selectedEmployeeId}`, {
        method: "DELETE",
      });

      setEmployeeList(employeeList.filter((employee) => employee.id !== selectedEmployeeId));
      toast.success("Employee deleted successfully!");
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error("Failed to delete employee!");
    }

    handleCloseDeleteDialog();
  };

  const handleOpenEditDialog = (employee) => {
    setSelectedEmployeeId(employee.id);
    setEditFirstName(employee.first_name);
    setEditLastName(employee.last_name);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedEmployeeId(null);
  };

  const handleUpdateEmployee = async () => {
    if (!editFirstName || !editLastName) {
      toast.error("First and last name are required!");
      return;
    }

    try {
      await fetch(`https://reqres.in/api/users/${selectedEmployeeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: editFirstName,
          last_name: editLastName,
        }),
      });

      setEmployeeList(
        employeeList.map((employee) =>
          employee.id === selectedEmployeeId
            ? { ...employee, first_name: editFirstName, last_name: editLastName }
            : employee
        )
      );

      toast.success("Employee updated successfully!");
      handleCloseEditDialog();
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error("Failed to update employee!");
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <ToastContainer position="top-right" autoClose={3000} />

      <Grid container spacing={2} justifyContent="center">
        {/* Employee Login Form */}
        <Grid item xs={12}>
          <Card sx={{ p: 3, maxWidth: 800, mx: "auto" }}> {/* Increased width to 800px */}
            <Typography variant="h5" align="center">Employee Management</Typography>
            <TextField
              fullWidth
              margin="normal"
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleAddEmployee}>
              Add Employee
            </Button>
          </Card>
        </Grid>

        {/* Employee List */}
        <Grid item xs={12}>
          <Card sx={{ p: 3, maxWidth: 800, mx: "auto" }}> {/* Increased width to 800px */}
            <Typography variant="h5">Employee List</Typography>
            <Box sx={{ maxHeight: 300, overflowY: "auto", p: 1 }}>
              {employeeList.length === 0 ? (
                <Typography>No employees found.</Typography>
              ) : (
                employeeList.map((employee) => (
                  <Grid container key={employee.id} alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography>
                      {employee.first_name} {employee.last_name}
                    </Typography>
                    <Box>
                      <Tooltip title="Edit Employee">
                        <IconButton color="primary" size="small" onClick={() => handleOpenEditDialog(employee)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Employee">
                        <IconButton color="error" size="small" onClick={() => handleOpenDeleteDialog(employee.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Grid>
                ))
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this employee?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">Cancel</Button>
          <Button onClick={handleDeleteConfirmed} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Employee Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Employee</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="normal" label="First Name" value={editFirstName} onChange={(e) => setEditFirstName(e.target.value)} />
          <TextField fullWidth margin="normal" label="Last Name" value={editLastName} onChange={(e) => setEditLastName(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="primary">Cancel</Button>
          <Button onClick={handleUpdateEmployee} color="success">Update</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default EmployeeManagement;