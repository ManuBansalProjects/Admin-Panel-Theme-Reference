import axiosInstance from "../../../utils/axios";
import { ROLE } from "../../../utils/Constants";

const options = {role: ROLE.PSYCHIC};
const path = "/psychic/payment" ; 

export const psychicPaymentList = async (values) => {
    return await axiosInstance(options).post(`${path}/list`, values);
}


