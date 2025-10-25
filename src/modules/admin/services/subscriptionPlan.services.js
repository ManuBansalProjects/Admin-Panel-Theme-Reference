import axiosInstance from "../../../utils/axios";
import { ROLE } from "../../../utils/Constants";
const options = {role: ROLE.SUPER_ADMIN};

const path = "admin/subscription-plan"

//Subscription-CRUD
export const SubscriptionPlanList = async (values) => {
    return await axiosInstance(options).post(`${path}/list`, values);
}
export const SubscriptionPlanAdd = async (values) => {
    return await axiosInstance(options).post(`${path}/add`, values);
}
export const SubscriptionPlanEdit = async (values) => {
    return await axiosInstance(options).put(`${path}/edit`, values);
}
export const SubscriptionPlanDelete = async (values) => {
    return await axiosInstance(options).delete(`${path}/delete?o_id=${values}`)
}
export const SubscriptionPlanDetails = async (id) => {
    return await axiosInstance(options).get(`${path}/details?o_id=${id}`);
}
export const SubscriptionPlanStatus = async (values) => {
    return await axiosInstance(options).patch(`${path}/change-status`, values)
}

//Subscription-history get APIs
export const SubscriptionHistoryList = async (values) => {
    return await axiosInstance(options).post(`${path}/history/list`, values);
}
export const SubscriptionHistoryDetails = async (id) => {
    return await axiosInstance(options).get(`${path}/history/details?o_id=${id}`);
}