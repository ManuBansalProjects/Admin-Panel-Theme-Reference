import axiosInstance from "../../../utils/axios";
import { ROLE } from "../../../utils/Constants";

const options = {role: ROLE.PSYCHIC};
const path = "/psychic/availability" ; 

export const scheduleAvailability = async (values) => {
    return await axiosInstance(options).post(`${path}/schedule-availability`, values);
}

export const GetAvailability = async (values) => {
    return await axiosInstance(options).post(`${path}/get-availability`, values);
}

export const CancelAvailability = async (values) => {
    return await axiosInstance(options).get(`${path}/cancel-availability?date=${values}`);
}