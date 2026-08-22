import axios from "axios";
import { API_URL } from "./constants";

const getAuthHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

// 获取当前用户的所有通知
export async function getMyNotifications(token) {
  const response = await axios.get(`${API_URL}notifications`, getAuthHeader(token));
  return response.data;
}

// 标记单个通知为已读
export async function markNotificationAsRead(id, token) {
  const response = await axios.patch(
    `${API_URL}notifications/${id}/read`,
    {},
    getAuthHeader(token)
  );
  return response.data;
}

// 标记全部通知为已读
export async function markAllNotificationsAsRead(token) {
  const response = await axios.patch(
    `${API_URL}notifications/read-all`,
    {},
    getAuthHeader(token)
  );
  return response.data;
}