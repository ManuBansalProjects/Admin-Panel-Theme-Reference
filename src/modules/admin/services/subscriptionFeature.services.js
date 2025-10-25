import axiosInstance from "../../../utils/axios";
import { ROLE } from "../../../utils/Constants";
const options = {role: ROLE.SUPER_ADMIN};

const path = "admin/subscription-features"

export const SubscriptionFeatureUpdate = async (values) => {
    return await axiosInstance(options).post(`${path}/update`, values);
}

export const SubscriptionFeatureNameUpdate = async (values) => {
    return await axiosInstance(options).post(`${path}/update-name`, values);
}

// ------------------------------------------ 

export const SubscriptionFeatureList = async (values) => {
    return await axiosInstance(options).post(`${path}/list`, values);
}

export const SubscriptionFeatureAdd = async (values) => {
    return await axiosInstance(options).post(`${path}/add`, values);
}

export const SubscriptionFeatureEdit = async (values) => {
    return await axiosInstance(options).put(`${path}/edit`, values);
}

export const SubscriptionFeatureDelete = async (values) => {
    return await axiosInstance(options).delete(`${path}/delete?o_id=${values}`)
}

export const SubscriptionFeatureDetails = async (id) => {
    return await axiosInstance(options).get(`${path}/details?o_id=${id}`);
}

export const SubscriptionFeatureStatus = async (values) => {
    return await axiosInstance(options).patch(`${path}/change-status`, values)
}