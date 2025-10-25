import axiosInstance from "../../../utils/axios";
import { ROLE } from "../../../utils/Constants";
const options = {role: ROLE.SUPER_ADMIN};
const path = "admin/gallery"

export const List = async (values) => {
    return await axiosInstance(options).post(`${path}/list`, values);
}

export const Add = async (values) => {
    return await axiosInstance(options).post(`${path}/add`, values);
}

export const Delete = async (values) => {
    return await axiosInstance(options).post(`${path}/delete`, values);
}