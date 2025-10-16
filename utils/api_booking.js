import axios from "axios";
import { API_URL } from "./constants";

//  获取所有预订（管理员）
export const getBookings = async (token) => {
  const res = await axios.get(`${API_URL}bookings`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

//  获取单个预订（用户/管理员）
export const getBooking = async (id, token) => {
  const res = await axios.get(`${API_URL}bookings/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

//  新增预订（用户）
export const addBooking = async (
  user,
  court,
  startTime,
  endTime,
  date,
  token
) => {
  const res = await axios.post(
    `${API_URL}bookings`,
    { user, court, startTime, endTime, date }, // ✅ 加上 date
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

//  更新预订（管理员）
export const updateBooking = async (id, data, token) => {
  const res = await axios.put(`${API_URL}bookings/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

//  删除预订（管理员）
export const deleteBooking = async (id, token) => {
  const res = await axios.delete(`${API_URL}bookings/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
