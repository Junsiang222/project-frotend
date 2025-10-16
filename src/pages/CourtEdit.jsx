import Header from "../components/Header";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { toast } from "sonner";
import { getCourtById, updateCourt } from "../../utils/api_court";
import { useCookies } from "react-cookie";

const CourtEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [openTime, setOpenTime] = useState("08:00");
  const [closeTime, setCloseTime] = useState("22:00");
  const [error, setError] = useState(null);
  const [cookies] = useCookies(["currentuser"]);
  const { currentuser = {} } = cookies;
  const { token = "" } = currentuser;

  useEffect(() => {
    getCourtById(id)
      .then((court) => {
        if (court) {
          setName(court.name);
          setLocation(court.location);//当页面载入（或 id 改变）时，自动从后端拿到对应球场的资料，然后显示在前端
          setPrice(court.price);
          setOpenTime(court.openTime);
          setCloseTime(court.closeTime);
        } else {
          setError("Court not found");
        }
      })
      .catch(() => setError("Court not found"));
  }, [id]);

  const handleFormSubmit = async (event) => {
  event.preventDefault();
  if (!name || !location || !price) {
    toast.error("Please fill up all required fields");
    return;
  }

  console.log("Court data before sending:", {
    name,
    location,
    price,
    openTime,
    closeTime,
  });
  console.log("Token before sending:", token);

  try {
    await updateCourt({id, name, location, price, openTime, closeTime, token});
    toast.success("Court has been updated");
    navigate("/");
  } catch (error) {
    console.error(error);
    toast.error("Failed to update court");
  }
};

  if (error) {
    return (
      <>
        <Header />
        <Container maxWidth="sm" sx={{ textAlign: "center" }}>
          <Typography variant="h3" align="center" mb={2} color="error">
            {error}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/courts"
          >
            Go back to Courts
          </Button>
        </Container>
      </>
    );
  }

  return (
    <>
      <Header />
      <Container maxWidth="sm">
        <Typography variant="h3" align="center" mb={2}>
          Edit Court
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
          <TextField
            label="Location"
            fullWidth
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </Box>

        <Box mb={2}>
          <TextField
            type="number"
            label="Price (RM/hour)"
            fullWidth
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </Box>

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

        <Box mb={2}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleFormSubmit}
          >
            Update
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default CourtEdit;
