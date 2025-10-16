import axios from "axios";
import { API_URL } from "./constants";

// ✅ 获取球馆（支持 location 筛选）
export async function getCourts(location = "all") {
  const response = await axios.get(
    API_URL + "courts" + (location === "all" ? "" : "?location=" + location)
  );
  // 例子: http://localhost:5524/courts?location=pontian
  return response.data;
}

// ✅ 获取单个球馆
export async function getCourt(id) {
  const response = await axios.get(API_URL + "courts/" + id);
  // 例子: GET http://localhost:5524/courts/66f36c2b4a8d5e1ad69b6d5e
  return response.data;
}

// ✅ 添加球馆（Admin）
export async function addCourt(name, location, price, openTime, closeTime, token) {
  const response = await axios.post(
    API_URL + "courts",
    {
      name,
      location,
      price,
      openTime,
      closeTime,
    },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return response.data;
}

// ✅ 更新球馆（Admin）
export async function updateCourt(
  id,
  name,
  location,
  price,
  openTime,
  closeTime,
  token
) {
  const response = await axios.put(
    API_URL + "courts/" + id,
    {
      name,
      location,
      price,
      openTime,
      closeTime,
    },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return response.data;
}

// ✅ 删除球馆（Admin）
export async function deleteCourt(id, token) {
  const response = await axios.delete(API_URL + "courts/" + id, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
}
