import axiosInstance from "../../../utils/axios";
import { ROLE } from "../../../utils/Constants";

const options = {role: ROLE.PSYCHIC};
const path = "/psychic/booking" ; 

export const psychicBookingList = async (values) => {
    return await axiosInstance(options).post(`${path}/list`, values);
}

export const psychicBookingDetails = async (values) => {
    return await axiosInstance(options).post(`${path}/details?o_id=${values}`);
}

export const psychicUpcomingBookingList = async (values) => {
    return await axiosInstance(options).post(`${path}/upcoming-booking-list`, values);
}

export const AddAvailability = async (values) => {
    return await axiosInstance(options).post(`${path}/add-availability`, values);
}

export const GetAvailability = async (values) => {
    return await axiosInstance(options).get(`${path}/get-availability`, values);
}

export const CancelBooking = async (values) => {
    return await axiosInstance(options).put(`${path}/cancel-booking`, values);
}

export const MarkCompleteBooking = async (values) => {
    return await axiosInstance(options).put(`${path}/mark-completed?o_id=${values}`);
}



