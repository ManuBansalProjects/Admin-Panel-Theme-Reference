import axiosInstance from "../../../utils/axios";

const commonPath= "common";
const path = "/website" ; 

export const ContactUsForm = async (values) => {
  return await axiosInstance().post(`${path}/contact-us-form`, values);
}

export const InquiryForm = async (values) => {
  return await axiosInstance().post(`${path}/inquiry-form`, values);
}

export const GetAllFAQ = async (values) => {
  return await axiosInstance().get(`${path}/faq`, values);
}

export const GetAboutUs = async (values) => {
  return await axiosInstance().get(`${path}/about-us-details`, values);
}

export const GetServicesList = async () => {
  return await axiosInstance().get(`${path}/services-list`);
}

export const GetDataForHomePage = async () => {
  return await axiosInstance().get(`${path}/home-page-data`);
}

export const CMSOptions = async (values) => {
  return await axiosInstance().get(`${path}/cms-options?menu_location=${values}`);
}

export const GlobalSettingsDetails = async () => {
  return await axiosInstance().get(`${commonPath}/global-settings`);
};

export const CMSPageDetails = async (values) => {
  return await axiosInstance().get(`${path}/cms-page?page_slug=${values}`);
}

