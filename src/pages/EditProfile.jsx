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

const EditProfile = () => {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["currentuser"]);
  const { currentuser = {} } = cookies;
  const { _id, name: currentName, email, token } = currentuser;

  const [name, setName] = useState(currentName || "");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!_id) {
      toast.error("Unable to identify your account. Please log in again.");
      navigate("/");
      return;
    }

    if (!name) {
      toast.error("Please enter your name");
      return;
    }

    try {
      // 不传 password，后端会忽略密码字段，只更新 name
      await updateUser(_id, name, undefined, token);

      setCookie(
        "currentuser",
        { ...currentuser, name },
        { maxAge: 60 * 60 * 8 }
      );

      toast.success("Name updated successfully!");
      navigate(-1);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to update name");
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
            Edit Profile
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={4}>
            Update your name
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Box mb={2}>
              <TextField
                label="Full name"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Box>
            <Box mb={3}>
              <TextField
                label="Email address"
                fullWidth
                value={email || ""}
                disabled
                helperText="Email cannot be changed"
              />
            </Box>
            <Button type="submit" variant="contained" fullWidth size="large">
              Save Changes
            </Button>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default EditProfile;