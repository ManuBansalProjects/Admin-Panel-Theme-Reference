import axiosInstance from "../../../utils/axios";
import { ROLE } from "../../../utils/Constants";

const options = {role: ROLE.PSYCHIC};
const path = "/psychic/chat" ; 

export const getChat = async (values) => {
    return await axiosInstance(options).post(`${path}/get-chat`, values);
}

//also using in meeting
export const sendChat = async (values) => {
    return await axiosInstance(options).post(`${path}/save-chat`, values);
}

//also using in meeting
export const updateChat = async (values) => {
    return await axiosInstance(options).post(`${path}/update-chat`, values);
}

export const getChatUsers = async (values) => {
    return await axiosInstance(options).post(`${path}/user-list`, values);
}

export const getRoomId = async (values) => {
    return await axiosInstance(options).post(`${path}/get-roomId`, values);
}

export const notifyForMeeting = async (values) => {
    return await axiosInstance(options).post(`${path}/notify-for-meeting`, values);
}

//using in meeting only
export const GetMeetingDetails = async (values) => {
    const commonRoutesPath = '/common'
    return await axiosInstance(options).post(`${commonRoutesPath}/get-meeting-details`, values);
}


