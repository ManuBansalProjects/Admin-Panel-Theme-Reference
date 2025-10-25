import axiosInstance from "../../../utils/axios";
import { ROLE } from "../../../utils/Constants";

const options = {role: ROLE.PSYCHIC};
const path = "/psychic/notification" ; 

export const psychicNotificationList = async (values) => {
    return await axiosInstance(options).post(`${path}/list`, values);
}


export const psychicNotificationCount = async (values) => {
    return await axiosInstance(options).get(`${path}/count`, values);
}

export const markNotificationRead = async (values) => {
    return await axiosInstance(options).patch(`${path}/mark-read`, values);
}


