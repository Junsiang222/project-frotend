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
import dayjs from "dayjs";

const BookingConfirm = () => {
  const { bookingId } = useParams(); 
  const [cookies] = useCookies(["currentuser"]);
  const [booking, setBooking] = useState(null);
  const [price, setPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooking = async () => {            //去后端拿某个 booking 的资料，然后放进你的 setBooking() 里
      try {
        const token = cookies.currentuser?.token;
        const data = await getBooking(bookingId, token);
        setBooking(data);

        //  自动计算价钱（时长 × 单价）
        const start = dayjs(data.startTime, "HH:mm");
        const end = dayjs(data.endTime, "HH:mm");
        const hours = end.diff(start, "hour") || 0;    //这段代码会用 dayjs 算出「开始时间到结束时间的小时数」，再乘上「球场的小时价钱」，最后更新总价
        const courtPrice = data?.court?.price ?? 0;    //diff = 计算 end 时间 减去 start 时间 的 差距，单位是 "hour"（小时）
        setPrice(hours * courtPrice);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load booking details");
      }
    };
    fetchBooking();
  }, [bookingId]);

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

        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/")}
          >
            Back to Courts
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default BookingConfirm;
