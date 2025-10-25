import axiosInstance from "../../../utils/axios";
import { ROLE } from "../../../utils/Constants";

const options = {role: ROLE.PSYCHIC};
const path = "/psychic/earning" ; 

export const psychicEarnings = async (values) => {
    return await axiosInstance(options).post(`${path}/earning-list`, values);
}

export const psychicEarningsByDate = async (values) => {
    return await axiosInstance(options).post(`${path}/earning-by-date`, values);
}


