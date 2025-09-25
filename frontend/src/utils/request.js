import axios from "axios";
import config from "./config";

export const request = (url="" , method="" , data = {}) => {

    return axios({
        url : config.base_url + url,
        method: method,
        data:data,
        headers: {
            Accept : "aplication/json",
            "Content-type" :  "aplication/json",
        }
    }).then((res) => {
        return res.data;
    }).catch(((error) => {
        console.log(error);
    }))

}