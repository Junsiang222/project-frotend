import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useParams, useNavigate } from "react-router";
import { toast } from "sonner";
import { useCookies } from "react-cookie";
import { addBooking, getBookingsByCourt } from "../../utils/api_booking";
import { getCourtById, getCourts } from "../../utils/api_court";
import Header from "../components/Header";

const generateSlots = (openTime, closeTime) => {
  const slots = [];
  let start = dayjs(`2000-01-01 ${openTime}`, "YYYY-MM-DD HH:mm");
  const end = dayjs(`2000-01-01 ${closeTime}`, "YYYY-MM-DD HH:mm");
  while (start.isBefore(end)) {
    const next = start.add(1, "hour");
    slots.push({ start: start.format("HH:mm"), end: next.format("HH:mm") });
    start = next;
  }
  return slots;
};

const BookingTime = () => {
  const { courtId } = useParams();
  const navigate = useNavigate();
  const [cookies] = useCookies(["currentuser"]);
  const token = cookies.currentuser?.token;
  const user = cookies.currentuser?._id;

  const [courts, setCourts] = useState([]);
  const [selectedCourtId, setSelectedCourtId] = useState(courtId);
  const [court, setCourt] = useState(null);
  const [date, setDate] = useState(dayjs());
  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);

 useEffect(() => {
  if (court?.location) {
    getCourts(court.location).then(setCourts);
  }
}, [court?.location]);

  useEffect(() => {
    if (selectedCourtId) {
      getCourtById(selectedCourtId).then(setCourt);
    }
  }, [selectedCourtId]);

  useEffect(() => {
    if (!selectedCourtId) return;
    const fetchBookings = async () => {
      try {
        const data = await getBookingsByCourt(selectedCourtId, date.format("YYYY-MM-DD"));
        setBookedSlots(data);
      } catch (err) {
        console.error("加载预订失败:", err);
      }
    };
    fetchBookings();
    setSelectedSlots([]);
  }, [selectedCourtId, date]);

  const slots = useMemo(() => {
    if (!court) return [];
    return generateSlots(court.openTime, court.closeTime);
  }, [court]);

  const isSlotBooked = (slot) =>
    bookedSlots.some((b) => slot.start < b.endTime && slot.end > b.startTime);

  const toggleSlot = (slot) => {
    if (isSlotBooked(slot)) return;
    setSelectedSlots((prev) =>
      prev.includes(slot.start)
        ? prev.filter((s) => s !== slot.start)
        : [...prev, slot.start].sort()
    );
  };

  const isContiguous = () => {
    if (selectedSlots.length === 0) return false;
    const indices = selectedSlots
      .map((s) => slots.findIndex((slot) => slot.start === s))
      .sort((a, b) => a - b);
    for (let i = 1; i < indices.length; i++) {
      if (indices[i] !== indices[i - 1] + 1) return false;
    }
    return true;
  };

  const summary = useMemo(() => {
    if (selectedSlots.length === 0 || !court) return null;
    const sorted = [...selectedSlots].sort();
    const startTime = sorted[0];
    const endTime = slots.find((s) => s.start === sorted[sorted.length - 1]).end;
    const duration = sorted.length;
    return {
      startTime,
      endTime,
      duration,
      total: duration * court.price,
    };
  }, [selectedSlots, court, slots]);

  const handleConfirm = async () => {
    if (!token || !user) {
      toast.error("Please log in first");
      return;
    }
    if (selectedSlots.length === 0) {
      toast.error("Please select at least one time slot");
      return;
    }
    if (!isContiguous()) {
      toast.error("Please select consecutive time slots");
      return;
    }

    try {
      const data = await addBooking(
        user,
        selectedCourtId,
        summary.startTime,
        summary.endTime,
        date.format("YYYY-MM-DD"),
        token
      );
      toast.success("Booking created successfully!");
      navigate(`/bookings/${data._id}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create booking");
    }
  };

  if (!court) return null;

  return (
    <>
      <Header current="booking" />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight={700} mb={0.5}>
          Book a Court
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={4}>
          Select your preferred date, court and time
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Grid container spacing={2} mb={3}>
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Date"
                      value={date}
                      onChange={(newValue) => newValue && setDate(newValue)}
                      sx={{ width: "100%" }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id="court-select-label">Court</InputLabel>
                    <Select
                      labelId="court-select-label"
                      label="Court"
                      value={selectedCourtId}
                      onChange={(e) => setSelectedCourtId(e.target.value)}
                    >
                      {courts.map((c) => (
                        <MenuItem key={c._id} value={c._id}>
                          {c.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Typography variant="subtitle1" fontWeight={600} mb={2}>
                Select Time (1 hour per slot)
              </Typography>

              <Grid container spacing={2}>
                {slots.map((slot) => {
                  const booked = isSlotBooked(slot);
                  const selected = selectedSlots.includes(slot.start);
                  return (
                    <Grid item xs={6} sm={4} key={slot.start}>
                      <Paper
                        onClick={() => toggleSlot(slot)}
                        variant="outlined"
                        sx={{
                          p: 2,
                          textAlign: "center",
                          cursor: booked ? "not-allowed" : "pointer",
                          opacity: booked ? 0.5 : 1,
                          borderColor: selected ? "success.main" : undefined,
                          backgroundColor: selected
                            ? "rgba(74, 222, 128, 0.12)"
                            : undefined,
                          borderWidth: selected ? 2 : 1,
                        }}
                      >
                        <Typography fontWeight={600}>
                          {slot.start} - {slot.end}
                        </Typography>
                        <Typography
                          variant="caption"
                          color={booked ? "text.disabled" : "success.main"}
                        >
                          {booked ? "Booked" : selected ? "Selected" : "Available"}
                        </Typography>
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>

              <Typography variant="caption" color="text.secondary" mt={3} display="block">
                You can select multiple consecutive time slots.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="subtitle1" fontWeight={600} mb={2}>
                Booking Summary
              </Typography>

              <Box display="flex" justifyContent="space-between" mb={1.5}>
                <Typography color="text.secondary">Court</Typography>
                <Typography fontWeight={600}>{court.name}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1.5}>
                <Typography color="text.secondary">Date</Typography>
                <Typography fontWeight={600}>{date.format("DD MMM YYYY (ddd)")}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1.5}>
                <Typography color="text.secondary">Time</Typography>
                <Typography fontWeight={600}>
                  {summary ? `${summary.startTime} - ${summary.endTime}` : "-"}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography color="text.secondary">Duration</Typography>
                <Typography fontWeight={600}>
                  {summary ? `${summary.duration} hour${summary.duration > 1 ? "s" : ""}` : "-"}
                </Typography>
              </Box>

              <Divider sx={{ mb: 2 }} />

              <Box display="flex" justifyContent="space-between" alignItems="baseline" mb={0.5}>
                <Typography color="text.secondary">Total Price</Typography>
                <Typography variant="h5" color="success.main" fontWeight={700}>
                  RM {summary ? summary.total.toFixed(2) : "0.00"}
                </Typography>
              </Box>
              {summary && (
                <Typography variant="caption" color="text.secondary" display="block" mb={2}>
                  RM {court.price.toFixed(2)} x {summary.duration} hour
                  {summary.duration > 1 ? "s" : ""}
                </Typography>
              )}

              <Button
                variant="contained"
                color="success"
                fullWidth
                size="large"
                onClick={handleConfirm}
                sx={{ mt: 1 }}
              >
                Confirm Booking
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default BookingTime;