import axiosInstance from "../../../utils/axios";
import { ROLE } from "../../../utils/Constants";
const options = {role: ROLE.SUPER_ADMIN};

const in_path = "/website";
const path = "admin/contact-us"

export const Add = async (values) => {
  return await axiosInstance(options).post(`${in_path}/contact-us-form`, values);
};

export const List = async (values) => {
  return await axiosInstance(options).post(`${path}/list`, values);
};

export const Delete = async (values) => {
 
  return await axiosInstance(options).delete(`${path}/delete?o_id=${values}`);
};

export const Details = async (values) => {
  return await axiosInstance(options).post(`${path}/view`, values);  
};







