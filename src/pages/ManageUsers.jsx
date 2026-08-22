    import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { useCookies } from "react-cookie";
import Header from "../components/Header";
import { getUsers, deleteUser } from "../../utils/api_auth";

const ManageUsers = () => {
  const [cookies] = useCookies(["currentuser"]);
  const token = cookies.currentuser?.token;
  const currentUserId = cookies.currentuser?._id;

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      const data = await getUsers(token);
      setUsers(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete this user?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteUser(id, token);
          setUsers(users.filter((u) => u._id !== id));
          toast.success("User deleted successfully");
        } catch (err) {
          console.error(err);
          toast.error("Failed to delete user");
        }
      }
    });
  };

  return (
    <>
      <Header current="manageUsers" />
      <Container maxWidth={false} sx={{ py: 4, px: { xs: 2, md: 6 } }}>
        <Typography variant="h4" fontWeight={700} mb={3}>
          Manage Users
        </Typography>

        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u._id}>
                    <TableCell>{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={u.role}
                        color={u.role === "admin" ? "success" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      {u._id !== currentUserId && (
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleDelete(u._id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {!loading && users.length === 0 && (
            <Box py={4} textAlign="center">
              <Typography color="text.secondary">No users found.</Typography>
            </Box>
          )}
        </Card>
      </Container>
    </>
  );
};

export default ManageUsers;