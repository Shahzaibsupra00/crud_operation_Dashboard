import axios from "axios";

const API = "http://localhost:5000/api/auth";

export const loginAdmin = (email, password) => {
  return axios.post(`${API}/login`, {
    email,
    password,
  });
};
