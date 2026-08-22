import Header from "../components/Header";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { createCourt } from "../../utils/api_court";
import { useCookies } from "react-cookie";
import { getLocations } from "../../utils/api_location.js";

const CourtAdd = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [locations, setLocations] = useState([]);
  const [price, setPrice] = useState("");
  const [openTime, setOpenTime] = useState("08:00");
  const [closeTime, setCloseTime] = useState("22:00");
  const [imageFile, setImageFile] = useState(null); // ✅ 新增：存选中的图片文件
  const [imagePreview, setImagePreview] = useState(""); // ✅ 新增：预览图片网址
  const [cookies] = useCookies(["currentuser"]);
  const { currentuser = {} } = cookies;
  const { token = "" } = currentuser;

  useEffect(() => {
    getLocations().then((data) => setLocations(data));
  }, []);

  // ✅ 新增：选择图片时触发
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // 产生一个临时网址用来预览
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!name || !location || !price) {
      toast.error("Please fill up all required fields");
      return;
    }

    try {
      await createCourt({
        name,
        location,
        price,
        openTime,
        closeTime,
        imageFile, // ✅ 新增：一起送出去
        token,
      });
      toast.success("New court has been added");
      navigate("/courts");
    } catch (error) {
      toast.error("Failed to add court");
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="sm">
        <Typography variant="h3" align="center" mb={2}>
          Add New Court
        </Typography>

        <Box mb={2}>
          <TextField
            label="Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Box>

        <Box mb={2}>
          <FormControl sx={{ width: "100%" }}>
            <InputLabel
              id="location-select-label"
              sx={{ backgroundColor: "white", paddingRight: "5px" }}
            >
              Location
            </InputLabel>
            <Select
              labelId="location-select-label"
              id="location-select"
              value={location}
              label="Location"
              onChange={(event) => {
                setLocation(event.target.value);
              }}
            >
              {locations.map((loc) => (
                <MenuItem key={loc._id} value={loc.name}>
                  {loc.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <TextField
          type="number"
          label="Price (RM/hour)"
          fullWidth
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          inputProps={{ min: 0 }} // ✅ 加这行
         />

        <Box mb={2}>
          <TextField
            label="Open Time"
            type="time"
            fullWidth
            value={openTime}
            onChange={(e) => setOpenTime(e.target.value)}
          />
        </Box>

        <Box mb={2}>
          <TextField
            label="Close Time"
            type="time"
            fullWidth
            value={closeTime}
            onChange={(e) => setCloseTime(e.target.value)}
          />
        </Box>

        {/* ✅ 新增：图片上传欗位 */}
        <Box mb={2}>
          <Button variant="outlined" component="label" fullWidth>
            Upload Court Image
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </Button>
        </Box>

        {/* ✅ 新增：图片预览 */}
        {imagePreview && (
          <Box mb={2} textAlign="center">
            <img
              src={imagePreview}
              alt="Preview"
              style={{ maxWidth: "100%", maxHeight: 200, borderRadius: 8 }}
            />
          </Box>
        )}

        <Box mb={2}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleFormSubmit}
          >
            Submit
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default CourtAdd;