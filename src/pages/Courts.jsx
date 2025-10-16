import { Link } from "react-router";
import {
  Button,
  Container,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { useCookies } from "react-cookie";
import Header from "../components/Header.jsx";
import { getCourts, deleteCourt } from "../../utils/api_court.js";
import { getLocations } from "../../utils/api_location.js";

const Courts = () => {
  const [cookies] = useCookies(["currentuser"]);
  const { currentuser = {} } = cookies;
  const { token = "", role = "user" } = currentuser;

  const [courts, setCourts] = useState([]);
  const [location, setLocation] = useState("all");
  const [locations, setLocations] = useState([]);

  // ✅ 获取所有球馆数据
  useEffect(() => {
    getCourts(location).then((data) => {
      setCourts(data);
    });
  }, [location]);

  useEffect(() => {
    const loadLocation = async () => {
      const data = await getLocations();
      setLocations(data);
    };
    loadLocation();
  }, []);

  // ✅ 删除球馆（Admin）
  const handleCourtDelete = async (id) => {
    Swal.fire({
      title: "Are you sure you want to delete this court?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteCourt(id, token);
          setCourts(courts.filter((court) => court._id !== id));
          toast.success("Court deleted successfully");
        } catch (err) {
          console.error(err);
          toast.error("Failed to delete court");
        }
      }
    });
  };

  return (
    <>
      <Header current="home" />
      <Container maxWidth={false}>
        {/* Title + Add Button */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: "700" }}>
            Courts
          </Typography>
          {role === "admin" && (
            <Button
              component={Link}
              to="/courts/new"
              variant="contained"
              color="success"
            >
              Add New
            </Button>
          )}
        </Box>

        {/* Filter by Location */}
        <Box sx={{ paddingBottom: "10px" }}>
          <FormControl sx={{ minWidth: 250 }}>
            <InputLabel
              id="select-location"
              sx={{ backgroundColor: "white", pr: 1 }}
            >
              Filter By Location
            </InputLabel>
            <Select
              labelId="select-location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              {locations.map((loc) => (
                <MenuItem key={loc._id} value={loc.name}>
                  {loc.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Courts Grid */}
        <Grid
          container
          spacing={4}
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column", // ✅ 垂直排列
            alignItems: "center",
          }}
        >
          {courts.map((court) => (
            <Grid item xs={12} key={court._id} sx={{ width: "60%" }}>
              <Card sx={{ width: "100%" }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h5">{court.name}</Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      pt: 2,
                    }}
                  >
                    <Chip label={`RM ${court.price}/hour`} color="success" />
                    <Chip label={court.location} color="primary" />
                  </Box>
                  <Typography sx={{ mt: 2 }}>
                    Open: {court.openTime} - {court.closeTime}
                  </Typography>
                </CardContent>

                {/* ✅ 只有 user 能看到 “Book Now” */}
                {role === "user" && (
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    component={Link}
                    to={`/booking/${court._id}`}
                  >
                    Book Now
                  </Button>
                )}

                {/* ✅ Review 按钮 */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    pt: 2,
                  }}
                >
                  <Button
                    component={Link}
                    to={`/review/${court._id}`}
                    color="warning"
                    variant="contained"
                  >
                    Review
                  </Button>
                </Box>

                {/* ✅ Admin 能看到 “Edit / Delete” */}
                {role === "admin" && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 5,
                      pt: 2,
                    }}
                  >
                    <Button
                      component={Link}
                      to={`/courts/${court._id}/edit`}
                      variant="contained"
                      color="info"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleCourtDelete(court._id)}
                    >
                      Delete
                    </Button>
                  </Box>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>

        {courts.length === 0 && (
          <Typography variant="h6" align="center" py={3}>
            No courts found.
          </Typography>
        )}
      </Container>
    </>
  );
};

export default Courts;
