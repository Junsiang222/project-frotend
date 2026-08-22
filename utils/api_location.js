import axios from "axios";
import { API_URL } from "./constants";

// ✅ Get all locations
export const getLocations = async () => {
  const response = await axios.get(API_URL + "locations");
  return response.data;
};

// ✅ Create a new location
export const createLocation = async (name) => {
  const response = await axios.post(API_URL + "locations", {
    name,
  });
  return response.data;
};

// ✅ Update location by ID
export const updateLocation = async (id, name) => {
  const response = await axios.put(API_URL + "locations/" + id, {
    name,
  });
  return response.data;
};

// ✅ Delete location by ID
export const deleteLocation = async (id) => {
  const response = await axios.delete(API_URL + "locations/" + id);
  return response.data;
};
