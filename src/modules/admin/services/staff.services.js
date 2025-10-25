import axiosInstance from "../../../utils/axios";
import { ROLE } from "../../../utils/Constants";
const options = {role: ROLE.SUPER_ADMIN};

const path = "admin/staff"

export const List = async (values) => {
    return await axiosInstance(options).post(`${path}/list`, values);
}

export const Add = async (values) => {
    return await axiosInstance(options).post(`${path}/add`, values);
}

export const Details = async (id) => {
    return await axiosInstance(options).get(`${path}/details?o_id=${id}`);
}

export const Edit = async (values) => {
    return await axiosInstance(options).post(`${path}/edit`, values);
}

export const Status = async (values) => {
    return await axiosInstance(options).post(`${path}/change-status`, values)
}

export const Delete = async (values) => {
    return await axiosInstance(options).post(`${path}/delete`, values)
}

export const Options = async (values) => {
    return await axiosInstance(options).post(`${path}/options`, values)
}

export const invite = async (values) => {
    return await axiosInstance(options).post(`${path}/invite`, values)
}

export const reInviteStaff = async (values) => {
    return await axiosInstance(options).post(`${path}/re-invite`, values)
}