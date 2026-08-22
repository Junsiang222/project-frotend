import axios from "axios";
import { API_URL } from "./constants";

// 获取所有球馆
export const getCourts = async (location) => {
  const response = await axios.get(
    `${API_URL}courts${location && location !== "all" ? `?location=${location}` : ""}`
  );
  return response.data;
};

// 根据 ID 获取球馆
export const getCourtById = async (id) => {
  const response = await axios.get(API_URL + "courts/" + id);
  return response.data;
};

// ✅ 创建新球馆（支持图片上传）
export const createCourt = async ({
  name,
  location,
  price,
  openTime,
  closeTime,
  imageFile, // 改成传入 File 对象
  token,
}) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("location", location);
  formData.append("price", price);
  formData.append("openTime", openTime);
  formData.append("closeTime", closeTime);
  if (imageFile) {
    formData.append("image", imageFile);
  }

  const response = await axios.post(API_URL + "courts", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// ✅ 更新球馆（支持图片上传）
export const updateCourt = async ({
  id,
  name,
  location,
  price,
  openTime,
  closeTime,
  imageFile,
  token,
}) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("location", location);
  formData.append("price", price);
  formData.append("openTime", openTime);
  formData.append("closeTime", closeTime);
  if (imageFile) {
    formData.append("image", imageFile);
  }

  const response = await axios.put(API_URL + "courts/" + id, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// 删除球馆
export const deleteCourt = async (id, token) => {
  const response = await axios.delete(API_URL + "courts/" + id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};