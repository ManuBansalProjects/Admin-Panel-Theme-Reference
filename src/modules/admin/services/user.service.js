import axiosInstance from "../../../utils/axios";
import { ROLE } from "../../../utils/Constants";
const options = {role: ROLE.SUPER_ADMIN};
const path = "admin/user"

//for users management
export const Add = async (values) => {
    return await axiosInstance(options).post(`${path}/add`, values);
}
export const List = async (values) => {
    return await axiosInstance(options).post(`${path}/list`, values);
}
export const userDetails = async (values) => {
    return await axiosInstance(options).get(`${path}/details?o_id=${values}`)
}
export const userEdit = async (values) => {
    return await axiosInstance(options).put(`${path}/edit`, values)
}
export const userStatus = async (values) => {
    return await axiosInstance(options).put(`${path}/change-status`, values)
}
export const deleteUser = async (values) => {
    return await axiosInstance(options).delete(`${path}/delete?o_id=${values}`)
}


//for profile update
export const updateProfileUsers = async (values) => {
    return await axiosInstance(options).post(`${path}/edit-profile`, values)
}
export const changepassword = async (values) => {
    return await axiosInstance(options).post(`${path}/change-password`, values);
}



export const subscribeForPremium = async (values) => {
    return await axiosInstance(options).post(`${path}/subscription-for-premium`, values)
}
export const unsubscribeFromPremium = async (values) => {
    return await axiosInstance(options).post(`${path}/unsubscription-from-premium`, values)
}
export const subscriptionHistoryList = async (values) => {
    return await axiosInstance(options).get(`${path}/subscription-history?o_id=${values}`)
}
