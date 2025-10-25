import axiosInstance from "../../../utils/axios";
import { ROLE } from "../../../utils/Constants";
const options = {role: ROLE.SUPER_ADMIN};

const path = "admin/about-us"

export const AddAboutUs = async (values) => {
    return await axiosInstance(options).post(`${path}/add`, values);
}

export const EditAboutUs = async (values) => {
    return await axiosInstance(options).post(`${path}/edit`, values);
}

export const AboutUsDetails = async (id) => {
    return await axiosInstance(options).get(`${path}/details`);
}



