import axiosInstance from "../../../utils/axios";
import { ROLE } from "../../../utils/Constants";
const options = {role: ROLE.SUPER_ADMIN};

const path = "admin/question"
const pathQuestionnaire = "admin/question-stats"

export const QuestionList = async (values) => {
    return await axiosInstance(options).post(`${path}/list`, values);
}

export const AddQuestion = async (values) => {
    return await axiosInstance(options).post(`${path}/add`, values);
}

export const EditQuestion = async (values) => {
    return await axiosInstance(options).put(`${path}/edit`, values);
}

export const QuestionDelete = async (values) => {
    return await axiosInstance(options).delete(`${path}/delete?o_id=${values}`)
}

export const QuestionDetails = async (id) => {
    return await axiosInstance(options).get(`${path}/details?o_id=${id}`);
}

export const QuestionStatus = async (values) => {
    return await axiosInstance(options).patch(`${path}/change-status`, values)
}

export const getQuestionnaireStats = async (values) => {
    return await axiosInstance(options).get(`${pathQuestionnaire}/questionnaire-stats`, values)
}

