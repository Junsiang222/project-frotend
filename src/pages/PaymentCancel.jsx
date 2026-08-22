import { useNavigate } from "react-router";
import { Box, Typography, Button } from "@mui/material";
import Header from "../components/Header";

const PaymentCancel = () => {
  const navigate = useNavigate();
  return (
    <Box>
      <Header />
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          Payment Cancelled
        </Typography>
        <Typography color="text.secondary">
          You can try again anytime.
        </Typography>
        <Button variant="contained" onClick={() => navigate(-1)}>
          Back
        </Button>
      </Box>
    </Box>
  );
};

export default PaymentCancel;