import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Button,
} from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "sonner";
import Header from "../components/Header";
import { API_URL } from "../../utils/constants";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const AdminBookings = () => {
  const [cookies] = useCookies(["currentuser"]);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = cookies.currentuser?.token;

  // ==========================================
  // Get all bookings
  // ==========================================

  const fetchBookings = async () => {
    try {
      if (!token) {
        toast.error("Admin is not logged in");
        setLoading(false);
        return;
      }

      if (cookies.currentuser?.role !== "admin") {
        toast.error("This account is not an admin account");
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_URL}bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBookings(response.data);
    } catch (error) {
      console.error("Failed to load admin bookings", error);
      toast.error(error.response?.data?.message || "Failed to load bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [token]);

  // ==========================================
  // ✅ 新增：取消预订（带确认对话框）
  // ==========================================

  const handleCancelBooking = async (booking) => {
    const result = await Swal.fire({
      title: "Cancel this booking?",
      html: `
        <div style="text-align:left">
          <p><b>User:</b> ${booking.user?.name || "-"}</p>
          <p><b>Court:</b> ${booking.court?.name || "-"}</p>
          <p><b>Date:</b> ${booking.date || "-"} (${booking.startTime} - ${booking.endTime})</p>
        </div>
        <p style="margin-top:10px">This will notify the user and free up this time slot for others to book.</p>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it",
      cancelButtonText: "Keep booking",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${API_URL}bookings/${booking._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Booking has been cancelled");
      // 重新抓取最新列表（该笔状态会变成 cancelled）
      fetchBookings();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    }
  };

  // ==========================================
  // Status color
  // ==========================================

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "success";
      case "pending":
        return "warning";
      case "failed":
        return "error";
      case "cancelled":
        return "default";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: "60vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Header />

      <Box sx={{ p: 4 }}>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
          Booking Management
        </Typography>

        <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
          Total Bookings: {bookings.length}
        </Typography>

        {bookings.length === 0 ? (
          <Paper sx={{ p: 4 }}>
            <Typography>No bookings found.</Typography>
          </Paper>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Court</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                  {/* ✅ 新增欄位 */}
                </TableRow>
              </TableHead>

              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking._id} hover>
                    <TableCell>{booking.user?.name || "-"}</TableCell>
                    <TableCell>{booking.user?.email || "-"}</TableCell>
                    <TableCell>{booking.court?.name || "-"}</TableCell>
                    <TableCell>{booking.court?.location || "-"}</TableCell>
                    <TableCell>{booking.date || "-"}</TableCell>
                    <TableCell>
                      {booking.startTime || "-"} - {booking.endTime || "-"}
                    </TableCell>
                    <TableCell>
                      RM{" "}
                      {booking.court?.price
                        ? (
                            dayjs(booking.endTime, "HH:mm").diff(
                              dayjs(booking.startTime, "HH:mm"),
                              "hour"
                            ) * booking.court.price
                          ).toFixed(2)
                        : "0.00"}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={booking.status ? booking.status.toUpperCase() : "UNKNOWN"}
                        color={getStatusColor(booking.status)}
                        size="small"
                      />
                    </TableCell>

                    {/* ✅ 新增：Cancel 按钮 */}
                    <TableCell align="right">
                      {booking.status !== "cancelled" ? (
                        <Button
                          size="small"
                          variant="contained"
                          color="error"
                          onClick={() => handleCancelBooking(booking)}
                        >
                          Cancel
                        </Button>
                      ) : (
                        <Chip label="Cancelled" size="small" variant="outlined" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
};

export default AdminBookings;