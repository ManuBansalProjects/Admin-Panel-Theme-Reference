import axiosInstance from "../../../utils/axios";
import { ROLE } from "../../../utils/Constants";

const options = {role: ROLE.PSYCHIC};
const path = "/psychic/dashboard" ; 

export const psychicFeedbackList = async (values) => {
    return await axiosInstance(options).post(`${path}/feedback-list`, values);
}

export const psychicOverAllRating = async (values) => {
    return await axiosInstance(options).get(`${path}/overall-rating`, values);
}

export const psychicEarningsByDate = async (values) => {
    return await axiosInstance(options).post(`${path}/earning-by-date`, values);
}

export const getDashboardData = async (values) => {
    return await axiosInstance(options).get(`${path}/dashboard-data`, values);
}


