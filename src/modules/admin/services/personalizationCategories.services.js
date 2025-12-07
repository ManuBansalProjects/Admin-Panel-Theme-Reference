import axiosInstance from "../../../utils/axios";
import { ROLE } from "../../../utils/Constants";
const options = {role: ROLE.SUPER_ADMIN};

const path = "admin/personalization-categories"

export const List = async (values) => {
    return await axiosInstance(options).post(`${path}/list`, values);
}

export const Edit = async (values) => {
    return await axiosInstance(options).post(`${path}/edit`, values);
}

export const Details = async (id) => {
    return await axiosInstance(options).get(`${path}/details?o_id=${id}`);
}
