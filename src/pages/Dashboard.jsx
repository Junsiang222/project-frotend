import * as React from "react";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
  Button,
} from "@mui/material";
import { toast } from "sonner";
import Swal from "sweetalert2";
import Header from "../components/Header";
import { getUsers, deleteUser } from "../../utils/api_auth";
import { getUserToken, isAdmin } from "../../utils/api_auth";

const UserDashboard = () => {
  const [users, setUsers] = useState([]);
  const [cookies] = useCookies(["currentUser"]);
  const navigate = useNavigate();
  const token = getUserToken(cookies);

  // ✅ 检查 admin 身份
  useEffect(() => {
    if (!isAdmin(cookies)) {
      navigate("/dashboard");
    }
  }, [cookies, navigate]);

  // ✅ 获取用户数据
  useEffect(() => {
    getUsers()
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  // ✅ 删除用户
  const handleDelete = async (id) => {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "This user will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmed.isConfirmed) {
      try {
        await deleteUser(id, token);
        // ✅ 无需刷新页面，直接更新本地状态
        setUsers(users.filter((u) => u._id !== id));
        toast.success("User deleted successfully");
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete user");
      }
    }
  };

  return (
    <Box>
      <Header />
      <Typography
        variant="h4"
        sx={{ p: 4, display: "flex", justifyContent: "center" }}
      >
        User Dashboard
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/dashboard/new")}
      >
        Add User
      </Button>
      <Container>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell align="right">
                    {user.role !== "admin" && (
                      <>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          LinkComponent={Link}
                          to={`/dashboard/${user._id}/edit/`}
                          sx={{ mr: 1 }}
                        >
                          EDIT
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => handleDelete(user._id)}
                        >
                          DELETE
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
};

export default UserDashboard;
