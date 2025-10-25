import axiosInstance from "../../../utils/axios";
import { ROLE } from "../../../utils/Constants";
const options = {role: ROLE.SUPER_ADMIN};

const in_path = "/website";
const path = "admin/inquiry"

export const Add = async (values) => {
  return await axiosInstance(options).post(`${in_path}/enquiry-form`, values);
};

export const List = async (values) => {
  return await axiosInstance(options).post(`${path}/list`, values);
};

export const Delete = async (values) => {
  return await axiosInstance(options).post(`${path}/delete`, values);
};

export const Details = async (values) => {
  return await axiosInstance(options).post(`${path}/view`, values);  
};







