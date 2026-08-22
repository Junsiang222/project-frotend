import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
  Button,
} from "@mui/material";
import { toast } from "sonner";
import Header from "../components/Header";
import { getBooking } from "../../utils/api_booking";
import { createCheckoutSession } from "../../utils/api_payment";
import dayjs from "dayjs";

const BookingConfirm = () => {
  const { bookingId } = useParams();
  const [cookies] = useCookies(["currentuser"]);
  const [booking, setBooking] = useState(null);
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const token = cookies.currentuser?.token;
        const data = await getBooking(bookingId, token);
        setBooking(data);

        const start = dayjs(data.startTime, "HH:mm");
        const end = dayjs(data.endTime, "HH:mm");
        const hours = end.diff(start, "hour") || 0;
        const courtPrice = data?.court?.price ?? 0;
        setPrice(hours * courtPrice);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load booking details");
      }
    };
    fetchBooking();
  }, [bookingId]);

  const handlePayNow = async () => {
    try {
      setLoading(true);
      const token = cookies.currentuser?.token;
      const { url } = await createCheckoutSession(bookingId, token);
      window.location.href = url; // 跳转去 Stripe 付款页面
    } catch (err) {
      console.error(err);
      toast.error("Failed to start payment");
      setLoading(false);
    }
  };

  if (!booking) {
    return (
      <Typography variant="h6" sx={{ textAlign: "center", mt: 5 }}>
        Loading booking details...
      </Typography>
    );
  }

  return (
    <Box>
      <Header />
      <Typography
        variant="h4"
        sx={{ p: 4, display: "flex", justifyContent: "center" }}
      >
        Booking Confirmation
      </Typography>

      <Container>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Court</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>End Time</TableCell>
                <TableCell>Price (RM)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{booking.user?.name}</TableCell>
                <TableCell>{booking.user?.email}</TableCell>
                <TableCell>{booking.court?.name}</TableCell>
                <TableCell>{booking.date}</TableCell>
                <TableCell>{booking.startTime}</TableCell>
                <TableCell>{booking.endTime}</TableCell>
                <TableCell>{price.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 4 }}>
          <Button variant="outlined" onClick={() => navigate("/")}>
            Back to Courts
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handlePayNow}
            disabled={loading}
          >
            {loading ? "Redirecting..." : `Pay RM ${price.toFixed(2)} Now`}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default BookingConfirm;