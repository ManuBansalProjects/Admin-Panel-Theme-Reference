import axiosInstance from "../../../utils/axios";
import { ROLE } from "../../../utils/Constants";
const options = {role: ROLE.SUPER_ADMIN};

const path = "admin/dashboard"


export const Counts = async () => {
    return await axiosInstance(options).post(`${path}/counts`);
}

export const DateWiseTransaction = async () => {
    return await axiosInstance(options).get(`${path}/date-wise-transaction`);
}

export const DateWiseBooking = async () => {
    return await axiosInstance(options).get(`${path}/date-wise-booking`);
}



