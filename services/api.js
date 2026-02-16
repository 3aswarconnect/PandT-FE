import axios from "axios";

const API = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
console.log("API URL:", process.env.EXPO_PUBLIC_API_URL);

export default API;
