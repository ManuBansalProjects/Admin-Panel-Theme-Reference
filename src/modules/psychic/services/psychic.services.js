import axiosInstance from "../../../utils/axios";

const commonPath= "common";
const path = "/psychic/auth" ; 

export const psychicLogin = async (values) => {
    return await axiosInstance().post(`${path}/login`, values);
}

export const psychicForgetPassword = async (values) => {
    return await axiosInstance().post(`${path}/forget-password`, values);
}

export const psychicVerifyOTP = async (values) => {
    return await axiosInstance().post(`${path}/verify-otp`, values);
}

export const psychicResendOTP = async (values) => {
    return await axiosInstance().post(`${path}/resend-otp`, values);
}

export const psychicResetPassword = async (values) => {
    return await axiosInstance().post(`${path}/reset-password`, values);
}

