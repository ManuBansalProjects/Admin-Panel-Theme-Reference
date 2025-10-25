import axiosInstance from "../../../utils/axios";
import { ROLE } from "../../../utils/Constants";
const options = {role: ROLE.SUPER_ADMIN};

const path = "admin/subscription-benifits"

export const SubscriptionBenefitsUpdate = async (values) => {
    return await axiosInstance(options).post(`${path}/update`, values);
}
export const SubscriptionBenefitsDetails = async (values) => {
    return await axiosInstance(options).get(`${path}/details`, values);
}
