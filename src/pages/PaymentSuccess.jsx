import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import { toast } from "sonner";
import Header from "../components/Header";
import { verifyPayment } from "../../utils/api_payment";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState("checking"); // checking / paid / failed

  useEffect(() => {
    const check = async () => {
      try {
        const booking = await verifyPayment(sessionId);
        if (booking.status === "paid") {
          setStatus("paid");
          toast.success("Payment successful!");
        } else {
          setStatus("failed");
          toast.error("Payment could not be confirmed");
        }
      } catch (err) {
        console.error(err);
        setStatus("failed");
        toast.error("Failed to verify payment");
      }
    };
    if (sessionId) check();
  }, [sessionId]);

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
        {status === "checking" && (
          <>
            <CircularProgress color="success" />
            <Typography>Verifying your payment, please wait...</Typography>
          </>
        )}
        {status === "paid" && (
          <>
            <Typography variant="h5" color="success.main" fontWeight={700}>
              Payment Successful!
            </Typography>
            <Button variant="contained" onClick={() => navigate("/")}>
              Back to Courts
            </Button>
          </>
        )}
        {status === "failed" && (
          <>
            <Typography variant="h5" color="error.main" fontWeight={700}>
              Payment Failed
            </Typography>
            <Button variant="contained" onClick={() => navigate("/")}>
              Back to Courts
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default PaymentSuccess;