import axiosInstance from "../../../utils/axios";
import { ROLE } from "../../../utils/Constants";
const options = {role: ROLE.SUPER_ADMIN};

const path = "admin/news-letters"

export const List = async (values) => {
    return await axiosInstance(options).post(`${path}/list`, values);
}

// export const View = async (values) => {
//     return await axiosInstance(options).post(`${path}/view`, values);
// }

export const Add = async (values) => {
    return await axiosInstance(options).post(`${path}/add`, values);
}

export const Edit = async (values) => {
    return await axiosInstance(options).post(`${path}/edit`, values);
}

export const Delete = async (values) => {
    return await axiosInstance(options).post(`${path}/delete`, values)
}

export const Details = async (id) => {
    return await axiosInstance(options).get(`${path}/details?o_id=${id}`);
}

export const Status = async (values) => {
    return await axiosInstance(options).post(`${path}/change-status`, values)
}

export const Options = async (values) => {
    return await axiosInstance(options).post(`${path}/options`, values)
}

export const SendEmails = async (values) => {
    return await axiosInstance(options).post(`${path}/send-emails`, values);
}

export const SendNotifications = async (values) => {
    return await axiosInstance(options).post(`${path}/send-notifications`, values);
}

export const ResendEmails = async (values) => {
    return await axiosInstance(options).post(`${path}/resend-now`, values);
}

export const Promotions = async (values) => {
    return await axiosInstance(options).post(`${path}/promotions`, values);
}

export const PromotionsView = async (values) => {
    return await axiosInstance(options).post(`${path}/promotions/view`, values);
}

export const PromotionResendEmail = async (values) => {
    return await axiosInstance(options).post(`${path}/promotions/resend-email`, values);
}
export const ListById = async (values) => {
    return await axiosInstance(options).post(`admin/user/list-by-ids`, values);
}

export const NewsLetterUsersList = async (values) => {
    return await axiosInstance(options).post(`${path}/users-list`, values);
}