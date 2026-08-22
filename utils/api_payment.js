import axios from "axios";
import { API_URL } from "./constants";

// ✅ 建立付款 session，拿到 Stripe 付款网址
export const createCheckoutSession = async (bookingId, token) => {
  const res = await axios.post(
    `${API_URL}payment/create-checkout-session/${bookingId}`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data; // { url }
};

// ✅ 验证付款结果
export const verifyPayment = async (sessionId) => {
  const res = await axios.get(`${API_URL}payment/verify/${sessionId}`);
  return res.data; // updated booking
};