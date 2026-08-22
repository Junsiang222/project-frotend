import{ useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
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
import {
  getUserToken,
  getUserById,
  updateUser,
} from "../../utils/api_auth";

const EditUser = () => {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [cookies] = useCookies(["currentUser"]);
  const token = getUserToken(cookies);  

  // 如果不是管理员，跳回登录
  //   useEffect(() => {
  //     if (!isAdmin(cookies)) {
  //       navigate("/login");
  //     }
  //   }, [cookies, navigate]);

  // 获取用户资料
  useEffect(() => {
    getUserById(id, token)
      .then((data) => {
        setName(data.name || "");//把使用者的名字存进 name 状态里；如果没有名字，就放一个空字串，避免报错
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      });
  }, [id, token]);

  // 更新用户
  const handleUpdate = async (event) => {
    event.preventDefault(); //当用户按下 Update 时，不要让表单重新载入网页，我要自己用 JavaScript 发送更新请求
    if (!name || !password) {
      toast.error("Please fill in both name and password");
      return;
    }

    try {
      const updatedUser = await updateUser(id, name, "", "", token); 
      if (updatedUser) {
        toast.success("User has been updated");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update user");
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
              Edit User
            </Typography>

            <Box mb={2}>
              <FormControl fullWidth>
                <TextField
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
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
                  fullWidth
                />
              </FormControl>
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ bgcolor: "black" }}
              onClick={handleUpdate}
            >
              Update User
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
export default EditUser;
