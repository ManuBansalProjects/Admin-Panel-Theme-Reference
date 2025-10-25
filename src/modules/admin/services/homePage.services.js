import axiosInstance from "../../../utils/axios";
import { ROLE } from "../../../utils/Constants";
const options = {role: ROLE.SUPER_ADMIN};

const path = "admin/website-home-page"

export const HomePageSectionAdd = async (values) => {
    return await axiosInstance(options).post(`${path}/add`, values);
}

export const HomePageSectionDetails = async (id) => {
    return await axiosInstance(options).get(`${path}/details`);
}



