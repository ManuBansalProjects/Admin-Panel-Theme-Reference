import axiosInstance from "../../../utils/axios";
import { ROLE } from "../../../utils/Constants";
const options = {role: ROLE.SUPER_ADMIN};

const path = "admin/language-files";


export const Details = async (type,fileName) => {
    return await axiosInstance(options).get(`${path}/details?type=${type}&file_name=${fileName}`);
}

export const Edit = async (values) => {
    return await axiosInstance(options).post(`${path}/edit`, values);
}