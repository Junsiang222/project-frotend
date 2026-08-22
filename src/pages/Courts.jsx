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
  CardMedia,
  Chip,
  Fab,
  Zoom,
} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useState, useEffect, useMemo } from "react";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { useCookies } from "react-cookie";
import Header from "../components/Header.jsx";
import { getCourts, deleteCourt } from "../../utils/api_court.js";
import { getLocations } from "../../utils/api_location.js";
import { BASE_URL } from "../../utils/constants.js";
import HeroBanner from "../components/HeroBanner.jsx";

const SHOP_NAME = "DBC Badminton Court"; // 之后要换真实店名，改这里就好

const Courts = () => {
  const [cookies] = useCookies(["currentuser"]);
  const { currentuser = {} } = cookies;
  const { token = "", role = "user" } = currentuser;

  const [courts, setCourts] = useState([]);
  const [location, setLocation] = useState("all");
  const [locations, setLocations] = useState([]);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    getCourts(location).then(setCourts);
  }, [location]);

  useEffect(() => {
    getLocations().then(setLocations);
  }, []);

  // ✅ 按 location 分组，一个分店只取一笔代表资料
  const shopCards = useMemo(() => {
    const groups = {};
    courts.forEach((c) => {
      if (!groups[c.location]) {
        groups[c.location] = { ...c, courtCount: 1 };
      } else {
        groups[c.location].courtCount += 1;
        // 取价格最低的当代表价格（可选，也可以不管）
        if (c.price < groups[c.location].price) {
          groups[c.location].price = c.price;
        }
      }
    });
    return Object.values(groups);
  }, [courts]);

  // 监听滚动距离，决定要不要显示按钮
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 滚回顶部
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
      <HeroBanner />
      <Container maxWidth={false}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: "700" }}>
            Courts
          </Typography>
          {role === "admin" && (
            <Button component={Link} to="/courts/new" variant="contained" color="success">
              Add New
            </Button>
          )}
        </Box>

        <Box sx={{ paddingBottom: "10px" }}>
          <FormControl sx={{ minWidth: 250 }}>
            <InputLabel id="select-location" sx={{ backgroundColor: "white", pr: 1 }}>
              Filter By Location
            </InputLabel>
            <Select labelId="select-location" value={location} onChange={(e) => setLocation(e.target.value)}>
              <MenuItem value="all">All</MenuItem>
              {locations.map((loc) => (
                <MenuItem key={loc._id} value={loc.name}>
                  {loc.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* ✅ 现在渲染的是 shopCards，一个分店一张卡 */}
        <Grid container spacing={4}>
          {shopCards.map((shop) => (
            <Grid item xs={12} sm={6} md={4} key={shop.location}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <CardMedia
                  component="img"
                  height="180"
                  image={
                    shop.image
                      ? `${BASE_URL}${shop.image.replace(/^\//, "")}`
                      : "https://via.placeholder.com/400x180?text=No+Image"
                  }
                  alt={SHOP_NAME}
                />
                <CardContent sx={{ p: 3, flexGrow: 1 }}>
                  <Typography variant="h5">{SHOP_NAME}</Typography>
                  <Box sx={{ display: "flex", justifyContent: "space-between", pt: 2 }}>
                    <Chip label={`From RM ${shop.price}/hour`} color="success" />
                    <Chip label={shop.location} color="primary" />
                  </Box>
                  <Typography sx={{ mt: 2 }}>
                    Open: {shop.openTime} - {shop.closeTime}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {shop.courtCount} court{shop.courtCount > 1 ? "s" : ""} available
                  </Typography>
                </CardContent>

                {role === "user" && (
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    component={Link}
                    to={`/booking/${shop._id}`}
                  >
                    Book Now
                  </Button>
                )}

                <Box sx={{ display: "flex", justifyContent: "center", pt: 2 }}>
                  <Button component={Link} to={`/review/${shop._id}`} color="warning" variant="contained">
                    Review
                  </Button>
                </Box>

                {role === "admin" && (
                  <Box sx={{ p: 2 }}>
                    <Button
                      component={Link}
                      to={`/courts/manage/${encodeURIComponent(shop.location)}`}
                      variant="contained"
                      color="info"
                      fullWidth
                    >
                      Manage Courts
                    </Button>
                  </Box>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>

        {shopCards.length === 0 && (
          <Typography variant="h6" align="center" py={3}>
            No courts found.
          </Typography>
        )}
      </Container>

      {/* 回到顶部悬浮按钮 */}
      <Zoom in={showScrollTop}>
        <Fab
          color="primary"
          size="medium"
          onClick={scrollToTop}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 1000,
          }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </Zoom>
    </>
  );
};

export default Courts;