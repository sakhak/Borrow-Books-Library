import axios from "axios";
import config from "./config";
import Cookies from "js-cookie"

export const request = (url = "", method = "", data = {}) => {
  return axios({
    url: config.base_url + url,
    method: method,
    data: data,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if(res.data?.access_token){
        Cookies.set('access_token' , res.data.access_token , {
            expires: 7
        })
      }
      return res.data;
    })
    .catch((error) => {
      console.log(error);
      throw error
    });
};
