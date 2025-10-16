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

import { useState,useEffect} from "react";
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
  const [cookies] = useCookies(["currentuser"]);
  const { currentuser = {} } = cookies; //assign empty object to avoid error
  const { token = "" } = currentuser;

  useEffect(() => {
    getLocations().then((data) => setLocations(data));
  }, []);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!name || !location || !price) {
      toast.error("Please fill up all required fields");
      return;
    }
    console.log({
      name,
      location,
      price,
      openTime,
      closeTime,
    });

    try {
      await createCourt({ name, location, price, openTime, closeTime, token });
      toast.success("New court has been added");
      navigate("/");
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
            Submit
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default CourtAdd;
