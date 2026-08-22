import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
} from "@mui/material";

import { useCookies } from "react-cookie";
import { toast } from "sonner";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

import Header from "../components/Header";
import { getMyBookings } from "../../utils/api_booking";

const MyBookings = () => {
  const [cookies] = useCookies(["currentuser"]);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = cookies.currentuser?.token;

  // ==========================================
  // Get My Bookings
  // ==========================================

  useEffect(() => {
    const fetchBookings = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await getMyBookings(token);

        console.log("🔥 MY BOOKINGS:", data);
        console.log("🔥 TOTAL MY BOOKINGS:", data.length);

        setBookings(data);
      } catch (error) {
        console.error("Failed to load my bookings:", error);

        toast.error("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token]);

  // ==========================================
  // Status Color
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

      case "confirmed":
        return "success";

      default:
        return "default";
    }
  };

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <>
        <Header current="my-bookings" />

        <Box
          sx={{
            minHeight: "60vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      </>
    );
  }

  // ==========================================
  // Page
  // ==========================================

  return (
    <>
      <Header current="my-bookings" />

      <Container
        maxWidth="xl"
        sx={{
          py: 4,
        }}
      >

        {/* ==========================================
            TITLE
        ========================================== */}

        <Typography
          variant="h4"
          fontWeight={700}
          sx={{
            mb: 3,
          }}
        >
          My Bookings
        </Typography>

        {/* ==========================================
            NO BOOKINGS
        ========================================== */}

        {bookings.length === 0 ? (

          <Paper
            sx={{
              p: 5,
              textAlign: "center",
            }}
          >
            <Typography
              color="text.secondary"
            >
              You have no bookings yet.
            </Typography>
          </Paper>

        ) : (

          /* ==========================================
             BOOKINGS TABLE
          ========================================== */

          <TableContainer
            component={Paper}
            sx={{
              width: "100%",
              overflowX: "auto",
            }}
          >

            <Table>

              {/* ==========================================
                  TABLE HEADER
              ========================================== */}

              <TableHead>

                <TableRow>

                  <TableCell>
                    Court
                  </TableCell>

                  <TableCell>
                    Location
                  </TableCell>

                  <TableCell>
                    Date
                  </TableCell>

                  <TableCell>
                    Time
                  </TableCell>

                  <TableCell>
                    Price
                  </TableCell>

                  <TableCell>
                    Status
                  </TableCell>

                </TableRow>

              </TableHead>

              {/* ==========================================
                  TABLE BODY
              ========================================== */}

              <TableBody>

                {bookings.map((booking) => (

                  <TableRow
                    key={booking._id}
                    hover
                  >

                    {/* COURT */}

                    <TableCell>
                      <Typography
                        fontWeight={600}
                      >
                        {booking.court?.name || "-"}
                      </Typography>
                    </TableCell>

                    {/* LOCATION */}

                    <TableCell>
                      {booking.court?.location || "-"}
                    </TableCell>

                    {/* DATE */}

                    <TableCell>
                      {booking.date || "-"}
                    </TableCell>

                    {/* TIME */}

                    <TableCell>
                      {booking.startTime || "-"}{" "}
                      -{" "}
                      {booking.endTime || "-"}
                    </TableCell>

                    {/* PRICE */}

                    {/* PRICE */}

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

                    {/* STATUS */}

                    <TableCell>

                      <Chip
                        label={
                          booking.status
                            ? booking.status.toUpperCase()
                            : "UNKNOWN"
                        }
                        color={getStatusColor(
                          booking.status
                        )}
                        size="small"
                      />

                    </TableCell>

                  </TableRow>

                ))}

              </TableBody>

            </Table>

          </TableContainer>

        )}

      </Container>
    </>
  );
};

export default MyBookings;