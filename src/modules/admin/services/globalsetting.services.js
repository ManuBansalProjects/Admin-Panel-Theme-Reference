import axiosInstance from "../../../utils/axios";
import { ROLE } from "../../../utils/Constants";
const options = {role: ROLE.SUPER_ADMIN};

const path = "admin/global-settings";

export const Add = async (values) => {
  return await axiosInstance(options).post(`${path}/add`, values);
};

export const Details = async () => {
  return await axiosInstance(options).get(`${path}/details`);
};


