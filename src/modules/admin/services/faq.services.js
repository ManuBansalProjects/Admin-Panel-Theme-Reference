import axiosInstance from "../../../utils/axios";
import { ROLE } from "../../../utils/Constants";
const options = {role: ROLE.SUPER_ADMIN};

const path = "admin/faq"

export const List = async (values) => {
    return await axiosInstance(options).post(`${path}/list`, values);
}

export const Add = async (values) => {
    return await axiosInstance(options).post(`${path}/add`, values);
}

export const Edit = async (values) => {
    return await axiosInstance(options).put(`${path}/edit`, values);
}

export const Delete = async (values) => {
    return await axiosInstance(options).delete(`${path}/delete?o_id=${values[0]}`)
}

export const Details = async (id) => {
    return await axiosInstance(options).get(`${path}/details?o_id=${id}`);
}

export const Status = async (values) => {
    return await axiosInstance(options).patch(`${path}/change-status`, values)
}