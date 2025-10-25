import axiosInstance from "../../../utils/axios";
import { ROLE } from "../../../utils/Constants";

const options = {role: ROLE.PSYCHIC};
const path = "/common" ; 

export const getCmsPage = async (values) => {
    return await axiosInstance(options).get(`${path}/cms-page?slug=${values}`);
}