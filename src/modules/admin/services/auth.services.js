import axiosInstance from "../../../utils/axios";

const path = "admin/auth"

export const login = async (values) => {
    return await axiosInstance().post(`${path}/login`, values);
}

export const forgetPassword = async (values) => {
    return await axiosInstance().post(`${path}/forget-password`, values);
}

export const otpVerification = async (values) => {
    return await axiosInstance().post(`${path}/verify-otp`, values);
}

export const resetPassword = async (values) => {
    return await axiosInstance().post(`${path}/reset-password`, values);
}

export const resendOtp = async (values) => {
    return await axiosInstance().post(`${path}/resend-otp`, values);
}

export const InvitationInfo = async (values) => {
    return await axiosInstance().post(`${path}/invitation-info`, values);
}

export const CompleteInvitation = async (values) => {
    return await axiosInstance().post(`${path}/complete-invitation`, values);
}
