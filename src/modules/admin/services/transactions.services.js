import axiosInstance from "../../../utils/axios";
import { ROLE } from "../../../utils/Constants";
const options = {role: ROLE.SUPER_ADMIN};

const path = "admin/transactions"

export const List = async (values) => {
    return await axiosInstance(options).post(`${path}/list`, values);
}
export const Details = async (id) => {
    return await axiosInstance(options).get(`${path}/details?o_id=${id}`);
}

export const Refund = async (values) =>{
    return await axiosInstance(options).post(`${path}/refund`, values);
}


