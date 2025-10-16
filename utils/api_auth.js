import axios from "axios";
import { API_URL } from "./constants";

/* ------------------- 用户注册与登录 ------------------- */

// ✅ 注册
export const signup = async (name, email, password) => {
  const response = await axios.post(API_URL + "users/signup", {
    name,
    email,
    password,
  });
  return response.data;
};

// ✅ 登录
export const login = async (email, password) => {
  const response = await axios.post(API_URL + "users/login", {
    email,
    password,
  });
  return response.data;
};

/* ------------------- 用户管理（Admin） ------------------- */

// ✅ 获取所有用户（admin）
export const getUsers = async (token) => {
  const response = await axios.get(API_URL + "users", {
    headers: { Authorization: "Bearer " + token },
  });
  return response.data;
};

// ✅ 获取单个用户（for 编辑页面）
export const getUserById = async (id, token) => {
  const response = await axios.get(API_URL + "users/" + id, {
    headers: { Authorization: "Bearer " + token },
  });
  return response.data;
};

// ✅ 更新用户资料（admin）
export const updateUser = async (id, name, password, token) => {
  const response = await axios.put(
    API_URL + "users/" + id,
    { name, password },
    { headers: { Authorization: "Bearer " + token } }
  );
  return response.data;
};
// ✅ 删除用户（admin）
export const deleteUser = async (id, token) => {
  const response = await axios.delete(API_URL + "users/" + id, {
    headers: { Authorization: "Bearer " + token },
  });
  return response.data;
};

/* ------------------- 辅助函数 ------------------- */

// ✅ 从 cookie 获取 token
export const getUserToken = (cookies) => {
  return cookies.currentUser ? cookies.currentUser.token : "";
};

// ✅ 检查是否为管理员
export const isAdmin = (cookies) => {
  return cookies.currentUser && cookies.currentUser.role === "admin";
};
