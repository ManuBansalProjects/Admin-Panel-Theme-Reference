import axiosInstance from "../../../utils/axios";
import { ROLE } from "../../../utils/Constants";

const path = "psychic/user-profile" ; 
const options = {role: ROLE.PSYCHIC};

export const updatePsychicPassword = async (values) => {
    return await axiosInstance(options).post(`${path}/update-password`, values);
}

export const psychicProfileDetails = async (values) => {
    return await axiosInstance(options).get(`${path}/details`, values);
}

export const editPsychicProfile = async (values) => {
    return await axiosInstance(options).post(`${path}/edit`, values);
}
