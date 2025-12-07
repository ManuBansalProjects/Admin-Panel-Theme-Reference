import axiosInstance from "../../../utils/axios";
import { ROLE } from "../../../utils/Constants";
const options = {role: ROLE.SUPER_ADMIN};

const path = "admin/referrals";

export const GetReferralSettings = async () => {
  return await axiosInstance(options).get(`${path}/settings`);
};
export const UpdateReferralSettings = async (values) => {
  return await axiosInstance(options).put(`${path}/settings`, values);
};
export const ChangeReferralSettingsStatus = async (status) => {
  return await axiosInstance(options).put(`${path}/settings/status?status=${status}`);
};

export const ListReferralHistory = async (values) => {
  return await axiosInstance(options).post(`${path}/history`, values);
};


