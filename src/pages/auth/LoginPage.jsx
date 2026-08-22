import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate, Link as RouterLink } from "react-router";
import { login } from "../../../utils/api_auth";
import { useCookies } from "react-cookie";
import badmintonImg from "../../assets/badminton-hero.jpg";

const LoginPage = () => {
  const navigate = useNavigate();
  const [, setCookie] = useCookies(["currentuser"]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!email || !password) {
        toast.error("Please fill up all the fields");
        return;
      }
      const userData = await login(email, password);
      setCookie("currentuser", userData, { maxAge: 60 * 60 * 8 });
      toast.success("You have successfully logged in!");
      navigate("/courts");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        background: "radial-gradient(circle at top, #14261f 0%, #0a0e0c 70%)",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          width: "100%",
          maxWidth: 900,
          minHeight: 520,
          borderRadius: 4,
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* 左边：表单 */}
        <Box
          component="form"
          onSubmit={handleFormSubmit}
          sx={{
            flex: 1,
            backgroundColor: "#15161a",
            p: { xs: 4, sm: 6 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography variant="h5" fontWeight={700} mb={0.5}>
            DBC Badminton Court
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={4}>
            Login to manage your bookings
          </Typography>

          <Box mb={2}>
            <TextField
              label="Email address"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Box>
          <Box mb={3}>
            <TextField
              type="password"
              label="Password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Box>
          <Button type="submit" variant="contained" fullWidth size="large">
            Login
          </Button>

          <Typography align="center" variant="body2" color="text.secondary" mt={3}>
            Don't have an account?{" "}
            <Link component={RouterLink} to="/signup" underline="hover">
              Sign Up
            </Link>
          </Typography>
        </Box>

        {/* 右边：照片 */}
        <Box
          sx={{
            flex: 1,
            display: { xs: "none", sm: "block" },
            backgroundImage: `linear-gradient(180deg, rgba(10,20,15,0.2), rgba(10,20,15,0.75)), url(${badmintonImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </Paper>
    </Box>
  );
};

export default LoginPage;