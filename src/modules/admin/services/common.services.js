import axiosInstance from "../../../utils/axios";
import { ROLE } from "../../../utils/Constants";
const options = {role: ROLE.SUPER_ADMIN};

export const GetLanguageJson = async (language) => {
  return await axiosInstance(options).get(
    `web/other/locales/details?file_name=${language}`
  );
};

export const portalDesign = async () => {
  return await axiosInstance(options).get(`web/other/portal-design/details`);
};
export const globalSetting = async () => {
  return await axiosInstance(options).get(`web/other/global-settings/details`);
};
