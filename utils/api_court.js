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

// 创建新球馆（只有 admin 可用）
export const createCourt = async ({
  name,
  location,
  price,
  openTime,
  closeTime,
  token
}) => {
  const response = await axios.post(
    API_URL + "courts",
    { name, location, price, openTime, closeTime },
    {
      headers: {
        Authorization: `Bearer ${token}`, // 带上 JWT token
      },
    }
  );
  return response.data;
};

  // 更新球馆
  export const updateCourt = async ({id, name, location, price, openTime, closeTime, token}) => {
    console.log(token)
  const response = await axios.put(
    API_URL + "courts/" + id,
    { name, location, price, openTime, closeTime },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
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
