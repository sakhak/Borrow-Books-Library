import axios from "axios";
import config from "./config";
import Cookies from "js-cookie";

export const request = (url = "", method = "", data = {}) => {
  const token = Cookies.get("access_token");
  
  const headers = {
    Accept: "application/json",
  };
  
  if (!(data instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  return axios({
    url: config.base_url + url,
    method: method,
    data: data,
    headers: headers 
  })
    .then((res) => {
      if (res.data?.access_token) {
        Cookies.set("access_token", res.data.access_token, {
          expires: null,
        });
      }
      return res.data;
    })
    .catch((error) => {
      // Expired or invalid token on a protected call -> clear it and go back to login
      if (error.response?.status === 401 && url !== "/login") {
        Cookies.remove("access_token");
        if (window.location.pathname !== "/login") window.location.href = "/login";
      }
      throw error;
    });
};
