import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useCookies } from "react-cookie";
import {
  Box,
  Typography,
  FormControl,
  Button,
  Card,
  CardContent,
  TextField,
} from "@mui/material";
import { toast } from "sonner";
import Header from "../components/Header";
import { signup, isAdmin } from "../../utils/api_auth";

const AddUser = () => {
  const [cookies] = useCookies(["currentUser"]);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ 新增用户
  const handleAdd = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await signup(name, email, password);
      toast.success("User added successfully");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add user");
    }
  };

  return (
    <Box>
      <Header />
      <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
        <Card
          sx={{ maxWidth: 600, width: "100%", boxShadow: 5, borderRadius: 2 }}
        >
          <CardContent>
            <Typography variant="h4" textAlign="center" gutterBottom>
              Add New User
            </Typography>

            <Box mb={2}>
              <FormControl fullWidth>
                <TextField
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>
            </Box>

            <Box mb={2}>
              <FormControl fullWidth>
                <TextField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
            </Box>

            <Box mb={2}>
              <FormControl fullWidth>
                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
            </Box>

            <Button
              variant="contained"
              fullWidth
              sx={{ bgcolor: "black" }}
              onClick={handleAdd}
            >
              Add User
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default AddUser;
