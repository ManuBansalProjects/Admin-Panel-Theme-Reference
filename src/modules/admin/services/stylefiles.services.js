import axiosInstance from "../../../utils/axios";
import { ROLE } from "../../../utils/Constants";
const options = {role: ROLE.SUPER_ADMIN};

const path = "admin/style-files";


export const Details = async (fileName) => {
    return await axiosInstance(options).get(`${path}/details?&file_name=${fileName}`);
}

export const Edit = async (values) => {
    return await axiosInstance(options).post(`${path}/edit`, values);
}

export const ResetLatest = async (values) => {
    return await axiosInstance(options).post(`${path}/reset-latest`, values);
}

export const Reset = async (values) => {
    return await axiosInstance(options).post(`${path}/reset`, values);
}