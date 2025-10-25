import axiosInstance from "../../../utils/axios";
import { ROLE } from "../../../utils/Constants";
const options = {role: ROLE.SUPER_ADMIN};

const path = "admin/restaurant";

// ========  Restaurant Enroll  =====

export const RestEnrollAdd = async (values) => {
  return await axiosInstance(options).post(`${path}/rest-enroll/add`, values);
};

export const RestEnrollList = async (values) => {
  return await axiosInstance(options).post(`${path}/rest-enroll/enrollmentDetails`, values);
};

//http://172.16.11.237:5500/webservice/api/v1/admin/restaurant/rest-enroll/edit
export const RestEnrollEdit = async (values) => {
  return await axiosInstance(options).post(`${path}/rest-enroll/edit`, values);
};

export const RestTransactionList = async (values) => {
  return await axiosInstance(options).post(`${path}/rest-enroll/transactiondetails`, values);
};

//http://172.16.11.237:5500/webservice/api/v1/admin/restaurant/rest-enroll/renewenrollment
export const RestRenewEnroll = async (values) => {
  return await axiosInstance(options).post(`${path}/rest-enroll/renewenrollment`, values);
};

//http://172.16.11.237:5500/webservice/api/v1/admin/restaurant/rest-enroll/delete
export const ResEnrollDelete = async (values) => {
  return await axiosInstance(options).post(`${path}/rest-enroll/delete`, values);
};

// -------------------------------


export const List = async (values) => {
  return await axiosInstance(options).post(`${path}/list`, values);
};

export const Add = async (values) => {
  return await axiosInstance(options).post(`${path}/add`, values);
};

export const Edit = async (values) => {
  return await axiosInstance(options).post(`${path}/edit`, values);
};

export const Delete = async (values) => {
  return await axiosInstance(options).post(`${path}/delete`, values);
};

export const Details = async (id) => {
  return await axiosInstance(options).get(`${path}/details?o_id=${id}`);
};

export const Status = async (values) => {
  return await axiosInstance(options).post(`${path}/change-status`, values);
};

export const ListChats = async (values) => {
  return await axiosInstance(options).post(`${path}/chat-list`, values);
};

export const ChatDelete = async (values) => {
  return await axiosInstance(options).post(`${path}/messages-delete`, values);
};

export const ChatDetails = async (id) => {
  return await axiosInstance(options).get(`${path}/get-messages?room=${id}`);
};

export const Subscribe = async (values) => {
  return await axiosInstance(options).post(`${path}/news-letter-toggle`, values);
};

export const AssignMedia = async (values) => {
  return await axiosInstance(options).post(`${path}/assign-media`, values);
};

export const ListByIds = async (values) => {
  return await axiosInstance(options).post(`${path}/list-by-ids`, values);
};

export const updateprofile = async (values) => {
  return await axiosInstance(options).post(`${path}/edit-profile`, values);
};

// export const changepassword = async (values) => {
//   return await axiosInstance(options).post(`${path}/change-password`, values);
// };


