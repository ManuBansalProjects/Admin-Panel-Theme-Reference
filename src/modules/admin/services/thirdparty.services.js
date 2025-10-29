import axiosInstance from "../../../utils/axios";
import { ROLE } from "../../../utils/Constants";
const options = {role: ROLE.SUPER_ADMIN};
const path = "admin/third-party"

//for users management
export const AstroGPTQuery = async (values) => {
    return await axiosInstance(options).post(`${path}/astrogpt-query`, values);
}