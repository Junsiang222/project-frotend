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

  // 获取某球场在某天已被预订的时段
export const getBookingsByCourt = async (courtId, date) => {
  const res = await axios.get(`${API_URL}bookings/court/${courtId}`, {
    params: { date },
  });
  return res.data;
  
};
// 获取目前登入用户自己的所有预订
export const getMyBookings = async (token) => {
  const res = await axios.get(`${API_URL}bookings/mine`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
