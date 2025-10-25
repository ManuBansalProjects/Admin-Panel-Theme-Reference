import axiosInstance from "../../../utils/axios";
import { ROLE } from "../../../utils/Constants";
const options = {role: ROLE.SUPER_ADMIN};

const path = "admin/coupon"

export const CouponList = async (values) => {
    return await axiosInstance(options).post(`${path}/list`, values);
}

export const CouponAdd = async (values) => {
    return await axiosInstance(options).post(`${path}/add`, values);
}

export const CouponEdit = async (values) => {
    return await axiosInstance(options).put(`${path}/edit`, values);
}

export const CouponDelete = async (values) => {
    return await axiosInstance(options).delete(`${path}/delete?o_id=${values}`)
}

export const CouponDetails = async (id) => {
    return await axiosInstance(options).get(`${path}/details?o_id=${id}`);
}

export const CouponStatus = async (values) => {
    return await axiosInstance(options).patch(`${path}/change-status`, values)
}