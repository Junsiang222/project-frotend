import axios from "axios";
import { API_URL } from "./constants";

const getAuthHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` },  //Bearer=带着一个 token，它在 Authorization 这个字段里
});                                               //Header= 是 HTTP 请求里用来携带额外信息的部分，前端在发请求时，会把登录后的 token 放在 Authorization header 里

// 获取特定球馆的所有评论
export async function getReviewsByCourt(courtId) {
  const response = await axios.get(`${API_URL}reviews/court/${courtId}`);
  return response.data;
}

// 创建评论
export async function addReview(courtId, userId, comment, token) {
  const response = await axios.post(
    `${API_URL}reviews`,
    { court: courtId, user: userId, comment },
    getAuthHeader(token)//getAuthHeader(token) 是用来在 API 请求时附带 JWT Token 的，这样后端就能确认当前操作是哪位用户执行的
  );
  return response.data;
}

// 删除评论
export async function deleteReview(id, token) {
  const response = await axios.delete(
    `${API_URL}reviews/${id}`,
    getAuthHeader(token)
  );
  return response.data;
}
