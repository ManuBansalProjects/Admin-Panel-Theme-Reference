import axiosInstance from "../../../utils/axios";
import { ROLE } from "../../../utils/Constants";
const options = {role: ROLE.SUPER_ADMIN};

const path = "admin/subscription-transaction"

export const SubscriptionTransactionList = async (values) => {
    return await axiosInstance(options).post(`${path}/list`, values);
}

export const SubscriptionTransactionDetails = async (id) => {
    return await axiosInstance(options).get(`${path}/details?o_id=${id}`);
}