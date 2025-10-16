import { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { TimePicker, DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useParams, useNavigate } from "react-router";
import { toast } from "sonner";
import { useCookies } from "react-cookie";
import { addBooking } from "../../utils/api_booking";

const BookingTime = () => {
  const { courtId } = useParams();
  const [date, setDate] = useState(dayjs()); 
  const [startTime, setStartTime] = useState(dayjs().hour(8).minute(0));
  const [endTime, setEndTime] = useState(dayjs().hour(10).minute(0));
  const [disabledTimes, setDisabledTimes] = useState([]); // 已预订的时间段
  const [cookies] = useCookies(["currentuser"]);
  const token = cookies.currentuser?.token;
  const user = cookies.currentuser?._id;
  const navigate = useNavigate();

  // 🟢 加载该球场当天的已被订的时间段
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const selectedDate = dayjs(date).format("YYYY-MM-DD");
        const res = await fetch(
          `http://localhost:5000/api/bookings/court/${courtId}?date=${date.format("YYYY-MM-DD")}`   //当你选了某个球场（courtId）和某一天（date）的时候//然后把那些时间保存到 disabledTimes//这样前端就能显示“哪些时间不能选”//这个 useEffect 会去你的后端（API）拿那一天所有已经被别人订的时间段。
        );
        const data = await res.json();
        console.log("📅 已有预订：", data);
        setDisabledTimes(data); // 存储所有已预订时段
      } catch (err) {
        console.error("加载预订失败:", err);
      }
    };

    fetchBookings();
  }, [courtId, date]); // ✅ 日期变化时重新加载

  // 🟢 确认预订
  const handleConfirm = async () => {
    if (endTime.isBefore(startTime)) {
      toast.error("End time must be after start time");
      return;
    }

    if (!token || !user) {
      toast.error("Please log in first");
      return;
    }

    //  检查时间是否与当天数据库里的时间冲突
    const isConflict = disabledTimes.some((b) => {   //some() 会去一个个检查，只要有一个冲突，就会返回 true
      const bookedStart = dayjs(`${b.date} ${b.startTime}`, "YYYY-MM-DD HH:mm");  //这是把别人已经订的那一笔时间（开始和结束）转成 dayjs 的时间对象
      const bookedEnd = dayjs(`${b.date} ${b.endTime}`, "YYYY-MM-DD HH:mm");
      const selectedStart = dayjs(`${date.format("YYYY-MM-DD")} ${startTime.format("HH:mm")}`);//你选的时间（selectedStart～selectedEnd）有没有和别人订的时间（bookedStart～bookedEnd）重叠
      const selectedEnd = dayjs(`${date.format("YYYY-MM-DD")} ${endTime.format("HH:mm")}`);

      return (
        (selectedStart.isBefore(bookedEnd) && selectedEnd.isAfter(bookedStart)) //就表示你选的时间段，不是完全在别人之前，也不是完全在别人之后
      );
    });

    if (isConflict) {
      toast.error("This time slot has already been booked for this date");
      return;
    }

    // 🟢 提交预订
    try {
      const data = await addBooking(
        user,
        courtId,
        startTime.format("HH:mm"),
        endTime.format("HH:mm"),
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

  return (
    <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
      <Box sx={{ width: 400, boxShadow: 3, borderRadius: 2, p: 3 }}>
        <Typography variant="h5" mb={3} textAlign="center">
          Select Booking Date & Time
        </Typography>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {/* ✅ 日期选择器 */}
          <Box mb={3}>
            <DatePicker
              label="Select Date"
              value={date}
              onChange={(newValue) => setDate(newValue)}
              sx={{ width: "100%" }}
            />
          </Box>

          {/* 开始时间 */}
          <Box mb={2}>
            <TimePicker
              label="Start Time"
              value={startTime}
              onChange={(newValue) => setStartTime(newValue)}
              sx={{ width: "100%" }}
            />
          </Box>

          {/* 结束时间 */}
          <Box mb={3}>
            <TimePicker
              label="End Time"
              value={endTime}
              onChange={(newValue) => setEndTime(newValue)}
              sx={{ width: "100%" }}
            />
          </Box>
        </LocalizationProvider>

        <Button
          variant="contained"
          fullWidth
          sx={{ bgcolor: "black" }}
          onClick={handleConfirm}
        >
          Confirm Time
        </Button>
      </Box>
    </Box>
  );
};

export default BookingTime;
