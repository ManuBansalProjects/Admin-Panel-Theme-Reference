import axiosInstance from "../../../utils/axios";
import { ROLE } from "../../../utils/Constants";
const options = {role: ROLE.SUPER_ADMIN};

const path = "admin/portal-design";

export const Update = async (values) => {
  return await axiosInstance(options).post(`${path}/update`, values);
};

export const Details = async () => {
  return await axiosInstance(options).get(`${path}/details`);
};
export const ResetSetting = async () => {
  return await axiosInstance(options).post(`${path}/reset-settings`);
};
