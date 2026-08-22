import axios from "axios";

import { API_URL } from "./constants";


/* =====================================================
   USER SIGNUP
===================================================== */

export const signup = async (name, email, password) => {
  const response = await axios.post(
    API_URL + "users/signup",
    {
      name,
      email,
      password,
    }
  );

  return response.data;
};


/* =====================================================
   USER LOGIN
===================================================== */

export const login = async (email, password) => {
  const response = await axios.post(
    API_URL + "users/login",
    {
      email,
      password,
    }
  );

  return response.data;
};


/* =====================================================
   CURRENT USER PROFILE
===================================================== */

// Get current logged-in user's profile
export const getProfile = async (token) => {
  const response = await axios.get(
    API_URL + "users/profile",
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

  return response.data;
};


// Update current logged-in user's profile
export const updateProfile = async (
  name,
  email,
  token
) => {
  const response = await axios.put(
    API_URL + "users/profile",
    {
      name,
      email,
    },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

  return response.data;
};


/* =====================================================
   RESET PASSWORD
===================================================== */

export const resetPassword = async (
  currentPassword,
  newPassword,
  token
) => {
  const response = await axios.put(
    API_URL + "users/reset-password",
    {
      currentPassword,
      newPassword,
    },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

  return response.data;
};


/* =====================================================
   ADMIN - GET USERS
===================================================== */

export const getUsers = async (token) => {
  const response = await axios.get(
    API_URL + "users",
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

  return response.data;
};


/* =====================================================
   ADMIN - GET USER BY ID
===================================================== */

export const getUserById = async (
  id,
  token
) => {
  const response = await axios.get(
    API_URL + "users/" + id,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

  return response.data;
};


/* =====================================================
   ADMIN - UPDATE USER
===================================================== */

export const updateUser = async (
  id,
  name,
  password,
  token
) => {
  const response = await axios.put(
    API_URL + "users/" + id,
    {
      name,
      password,
    },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

  return response.data;
};


/* =====================================================
   ADMIN - DELETE USER
===================================================== */

export const deleteUser = async (
  id,
  token
) => {
  const response = await axios.delete(
    API_URL + "users/" + id,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

  return response.data;
};


/* =====================================================
   GET USER TOKEN
===================================================== */

export const getUserToken = (cookies) => {
  return cookies.currentUser
    ? cookies.currentUser.token
    : "";
};


/* =====================================================
   CHECK ADMIN
===================================================== */

export const isAdmin = (cookies) => {
  return (
    cookies.currentUser &&
    cookies.currentUser.role === "admin"
  );
};