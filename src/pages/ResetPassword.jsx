import { useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useCookies } from "react-cookie";
import Header from "../components/Header";
import { updateUser } from "../../utils/api_auth";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies(["currentuser"]);
  const { currentuser = {} } = cookies;
  const { _id, name: currentName, token } = currentuser;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!_id) {
      toast.error("Unable to identify your account. Please log in again.");
      navigate("/");
      return;
    }

    if (!newPassword || !confirmPassword) {
      toast.error("Please fill up all the fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      // name 传回原本的名字，只有 password 会被更新
      await updateUser(_id, currentName, newPassword, token);

      toast.success("Password updated successfully!");
      navigate(-1);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to update password");
    }
  };

  return (
    <>
      <Header />
      <Box
        sx={{
          minHeight: "calc(100vh - 80px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 480,
            p: { xs: 4, sm: 5 },
            borderRadius: 4,
            border: "1px solid rgba(255,255,255,0.08)",
            backgroundColor: "#15161a",
          }}
        >
          <Typography variant="h5" fontWeight={700} mb={0.5}>
            Reset Password
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={4}>
            Choose a new password for your account
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Box mb={2}>
              <TextField
                type="password"
                label="New password"
                fullWidth
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Box>
            <Box mb={3}>
              <TextField
                type="password"
                label="Confirm new password"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Box>
            <Button type="submit" variant="contained" fullWidth size="large">
              Update Password
            </Button>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default ResetPassword;