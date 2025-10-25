import axiosInstance from "../../../utils/axios";
import { ROLE } from "../../../utils/Constants";
const options = {role: ROLE.SUPER_ADMIN};

const in_path = "/website";
const path = "admin/transaction"

export const PayableList = async (values) => {
  return await axiosInstance(options).post(`${path}/payable-list`, values);
};

export const PsychicPayableList = async (values) => {
  return await axiosInstance(options).post(`${path}/psychic-all-payable-list`, values);
};

export const CreatePayout = async (values) => {
  return await axiosInstance(options).post(`${path}/create-payout`, values);
};

export const PayoutList = async (values) => {
  return await axiosInstance(options).post(`${path}/payout-list`, values);
};

export const ConfirmPayout = async (values) => {
  return await axiosInstance(options).patch(`${path}/confirm-payout`, values);
};







