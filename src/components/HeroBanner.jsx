import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import badmintonImg from "../assets/badminton-court1.jpg";
import badmintonImg2 from "../assets/badminton-court2.jpg";
import badmintonImg3 from "../assets/badminton-court3.jpg";


const slides = [
  {
    title: ["PLAY MORE.", "BOOK EASIER."],
    subtitle: "Find your court. Book in seconds.",
    image: badmintonImg,
  },
  {
    title: ["NEW COURTS.", "NEW GAMES."],
    subtitle: "Explore locations across the city.",
    image: badmintonImg2,
  },
  {
    title: ["RALLY YOUR", "FRIENDS TODAY."],
    subtitle: "Invite, split the cost, and play.",
    image: badmintonImg3,
  },
];

const AUTOPLAY_MS = 3000;

const HeroBanner = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, []);

  const goTo = (i) => setIndex(i);
  const goPrev = () => setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  const goNext = () => setIndex((prev) => (prev + 1) % slides.length);

  const slide = slides[index];

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, pt: 3 }}>
      <Box
        sx={{
          position: "relative",
          borderRadius: 4,
          overflow: "hidden",
          minHeight: { xs: 360, md: 460 },
          display: "flex",
          alignItems: "center",
          backgroundImage: `linear-gradient(90deg, rgba(6,10,8,0.92) 30%, rgba(6,10,8,0.15) 75%), url(${slide.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "background-image 0.6s ease-in-out",
        }}
      >
        <IconButton
          onClick={goPrev}
          sx={{
            position: "absolute",
            left: 16,
            top: "50%",
            transform: "translateY(-50%)",
            backgroundColor: "rgba(0,0,0,0.4)",
            "&:hover": { backgroundColor: "rgba(0,0,0,0.6)" },
          }}
        >
          <ChevronLeftIcon />
        </IconButton>

        <IconButton
          onClick={goNext}
          sx={{
            position: "absolute",
            right: 16,
            top: "50%",
            transform: "translateY(-50%)",
            backgroundColor: "rgba(0,0,0,0.4)",
            "&:hover": { backgroundColor: "rgba(0,0,0,0.6)" },
          }}
        >
          <ChevronRightIcon />
        </IconButton>

        <Box sx={{ px: { xs: 3, md: 8 }, maxWidth: 560 }}>
          <Typography
            component="h1"
            sx={{
              fontWeight: 800,
              lineHeight: 1.05,
              fontSize: { xs: "2.2rem", md: "3.2rem" },
              mb: 2,
            }}
          >
            {slide.title[0]}
            <br />
            <Box component="span" sx={{ color: "primary.main" }}>
              {slide.title[1]}
            </Box>
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3, fontWeight: 400 }}>
            {slide.subtitle}
          </Typography>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            sx={{ px: 3 }}
          >
            Book Now
          </Button>
        </Box>

        <Box
          sx={{
            position: "absolute",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 1,
          }}
        >
          {slides.map((_, i) => (
            <Box
              key={i}
              onClick={() => goTo(i)}
              sx={{
                width: i === index ? 22 : 8,
                height: 8,
                borderRadius: 4,
                cursor: "pointer",
                backgroundColor: i === index ? "primary.main" : "rgba(255,255,255,0.4)",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default HeroBanner;