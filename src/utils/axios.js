import axios from "axios";
import { getUser, logOutUser, getLocalKey, setReturnURL } from '../utils/commonfunction';
import Swal from "sweetalert2";
import { SWAL_SETTINGS } from "./Constants";

const Axios = (options = {}) => {
  // console.log(options , "page axios")
  const baseURL = process.env.REACT_APP_API_URL
  let headers = {
    language : getLocalKey('system_language') ? getLocalKey('system_language'): 'en'
  };
  
  try{
    const userData = getUser(options?.role);
    if(userData && userData.token){
      headers.Authorization = `Bearer ${userData.token}`;
    }
  }catch(err){
    console.log(err);
  }

  const axiosInstance = axios.create({
    baseURL: baseURL,
    headers
  });

  axiosInstance.interceptors.response.use((response) =>
    new Promise((resolve, reject) => {
      resolve(response.data);
    }), (error) => {
      console.error("error -----> ", error);
      if (error && error.response && error.response.status && error.response.status === 401) {
        setReturnURL(options?.role);
        logOutUser(options?.role);
        Swal.fire({
          icon: "error",
          text: (error?.response?.data?.message) || "Something went wrong, Please try again later.",
          ...SWAL_SETTINGS,
        });
      }
    }
  );

  return axiosInstance;
};

export default Axios;