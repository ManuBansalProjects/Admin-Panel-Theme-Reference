
import Swal from "sweetalert2";
import { PERMISSIONS } from "./permissions";
import { t } from "i18next";

const {
  DYNAMIC_VARIABLES,
  STAFF_ROLE,
  FILE_UPLOAD,
  ROLE,
  SWAL_SETTINGS,
} = require("../utils/Constants");
// const store = require("../redux/store");
const production = process.env.REACT_APP_PRODUCTION;
const { getData } = require("country-list");

export const encodeValue = (value) => {
  return btoa(value);
};

export const decodeValue = (value) => {
  return atob(value);
};

export const formateDateWithMonth = (date) => {
  try {
    let newStrDate = new Date(date);
    // const isAdminPath = window.location.pathname.includes("/admin");
    const language = localStorage.getItem("i18nextLng")
      ? localStorage.getItem("i18nextLng")
      : "en";
    const options = { month: "long", year: "numeric", day: "2-digit" };
    const formatter = language === "en"
      ? new Intl.DateTimeFormat("en-US", options)
      : new Intl.DateTimeFormat('ja-JP', options);
    newStrDate = formatter.format(newStrDate);
    return newStrDate;
  } catch (err) { return ""; }

};

export const formateDate = (dateString, showTime = true) => {
  let newStrDate = "";
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return "N/A";
  }
  const isAdminPath = window.location.pathname.includes("/admin");
  const language = localStorage.getItem("i18nextLng")
    ? localStorage.getItem("i18nextLng")
    : "en";
  const options = { month: "long", year: "numeric", day: "2-digit" };
  const formatter =
    isAdminPath || language === "en"
      ? new Intl.DateTimeFormat("en-US", options)
      : new Intl.DateTimeFormat("de-DE", options);
  newStrDate = formatter.format(date);
  // if (showTime) {
  //   const hour =
  //     date.getHours() === 0
  //       ? 12
  //       : date.getHours() > 12
  //       ? date.getHours() - 12
  //       : date.getHours();
  //   const min =
  //     date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  //   const secs =
  //     date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  //   const ampm = date.getHours() < 12 ? "AM" : "PM";
  //   newStrDate += ` ${hour}:${min}:${secs} ${ampm}`;
  // }
  return newStrDate;
};

export const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "NA";
  }
  const now = new Date();
  const diffInMilliseconds = now - date;
  const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);
  if (diffInSeconds < 60) {
    return "Just now";
  } else if (diffInMinutes === 1) {
    return "1 min ago";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} mins ago`;
  } else if (diffInHours === 1) {
    return "1 hour ago";
  } else if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  } else if (diffInDays === 1) {
    return "1 day ago";
  } else if (diffInDays < 30) {
    return `${diffInDays} days ago`;
  } else if (diffInMonths === 1) {
    return "1 month ago";
  } else if (diffInMonths < 12) {
    return `${diffInMonths} months ago`;
  } else if (diffInYears === 1) {
    return "1 year ago";
  } else {
    return `${diffInYears} years ago`;
  }
};

export const formatDateFromTime = (createdAt) => {
  const isAdminPath = window.location.pathname.includes("/admin");
  const language = localStorage.getItem("i18nextLng")
    ? localStorage.getItem("i18nextLng")
    : "en";
  if (createdAt) {
    const date = new Date(createdAt);
    if (!isNaN(date.getTime())) {
      const options = { month: "long", year: "numeric", day: "2-digit" };
      const formatter =
        isAdminPath || language === "en"
          ? new Intl.DateTimeFormat("en-US", options)
          : new Intl.DateTimeFormat("de-DE", options);
      return formatter.format(date);
    }
  }
  return "Invalid Date";
};

export const getFormatedTime = (dateString) => {
  let date = new Date(dateString);

  let hours = date.getHours().toString().padStart(2, "0");
  let minutes = date.getMinutes().toString().padStart(2, "0");

  let amOrPm;
  if (hours >= 12) {
    amOrPm = "PM";
  } else {
    amOrPm = "AM";
  }

  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes} ${amOrPm}`;
};

export const setTitle = (value) => {
  let title = document.getElementById("dynamicTitle");
  if (title) {
    title.innerText = value;
  }
};

export const createMeta = (data) => {
  let keywordMeta = document.getElementById("keyword_meta");
  let desctiptiondMeta = document.getElementById("desctiption_meta");
  let slugFlag = sessionStorage.getItem("meta_tag_flag");
  let head = document.querySelector("head");
  if (data?.meta_keyword) {
    if (keywordMeta) {
      keywordMeta.name = "keywords";
      keywordMeta.content = data?.meta_keyword;
    } else {
      let newMeta = document.createElement("meta");
      newMeta.id = "keyword_meta";
      newMeta.name = "keywords";
      newMeta.content = data?.meta_keyword;
      head.appendChild(newMeta);
    }
  }
  if (data?.metadescription) {
    if (desctiptiondMeta) {
      desctiptiondMeta.name = "description";
      desctiptiondMeta.content = data?.metadescription;
    } else {
      let newMeta = document.createElement("meta");
      newMeta.id = "desctiption_meta";
      newMeta.name = "description";
      newMeta.content = data?.metadescription;
      head.appendChild(newMeta);
    }
  }
  if (data?.meta_tags) {
    if (slugFlag && slugFlag === "active") {
      /** Aready set */
    } else {
      head.innerHTML += data?.meta_tags;
      sessionStorage.setItem("meta_tag_flag", "active");
    }
  }
  setTimeout(() => {
    sessionStorage.removeItem("meta_tag_flag");
  }, 2000);
};

export const formatetime = (dateString) => {
  let showTime = "";
  const date = new Date(dateString);
  const hour =
    date.getHours() === 0
      ? 12
      : date.getHours() > 12
        ? date.getHours() - 12
        : date.getHours();
  const min =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  const secs =
    date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  const ampm = date.getHours() < 12 ? "AM" : "PM";
  return (showTime += ` ${hour}:${min}:${secs} ${ampm}`);
};

export const formatePickerDate = (dateString) => {
  const date = new Date(dateString);
  return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
};

export const Editorconvertercsv = (paragraph) => {
  let text = "";
  text = paragraph
    ? paragraph
      .toString()
      .replace(/(<([^>]+)>)/gi, "")
      .replace(/(?:\\[rn]|[\r\n]+)+/g, "")
    : "-";
  return text;
};

export const getDayBetweenDates = (from, to) => {
  const start_date = new Date(from);
  const end_date = new Date(to);
  const dateRange = [];
  let currentDate = start_date;
  while (currentDate <= end_date) {
    dateRange.push(new Date(currentDate).toISOString());
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dateRange;
};

export const calculatePercentage = (part, total) => {
  return (total * part) / 100;
};

export const myToFixed = (price) => {
  let number = Number(price);
  if (number) {
    return number.toFixed(2);
  } else {
    return 0;
  }
};

export function getDate(
  dateString,
  format = "DD-MM-YYYY",
  showTime = true,
  showDefaultDate = false,
  showSeconds = false
) {
  let createDateFrom = null;
  let newStrDate = "";

  if (isNaN(dateString)) {
    createDateFrom = dateString;
  } else {
    createDateFrom = Number(dateString);
  }

  if (showDefaultDate && !dateString) {
    createDateFrom = new Date();
  }

  if (createDateFrom) {
    const date = new Date(createDateFrom);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear());

    newStrDate = format.replace("DD", day);
    newStrDate = newStrDate.replace("MM", month);
    newStrDate = newStrDate.replace("YYYY", year);

    if (showTime) {
      const hour = String(
        date.getHours() === 0
          ? 12
          : date.getHours() > 12
            ? date.getHours() - 12
            : date.getHours()
      ).padStart(2, "0");
      const min = String(date.getMinutes()).padStart(2, "0");
      const ampm = date.getHours() < 12 ? "AM" : "PM";

      if (showSeconds) {
        const secs = String(date.getSeconds()).padStart(2, "0");
        newStrDate += ` ${hour}:${min}:${secs} ${ampm}`;
      } else {
        newStrDate += ` ${hour}:${min} ${ampm}`;
      }
    }
  } else {
    newStrDate = "N/A";
  }

  return newStrDate;
}


export const formateDataMultiSelect = (data, labelField, valueField) => {
  let newData = [];
  if (Array.isArray(data)) {
    data.forEach((item) => {
      let newItem = {
        label: item[labelField],
        value: item[valueField],
      };
      newData.push(newItem);
    });
  }
  return newData;
};

export const formateIdArray = (data, fromField) => {
  let newData = [];
  if (Array.isArray(data)) {
    data.forEach((item) => {
      newData.push(item[fromField]);
    });
  }
  return newData;
};

export const TrimText = (value, size = 40) => {
  return value !== undefined && value.length > size
    ? value.slice(0, size) + "..."
    : value;
};

export const getUser = function (role) {
  const keyData = getLocalKey(role);
  if (keyData) {
    try {
      const userData = JSON.parse(keyData);
      return userData;
    } catch (err) {
      console.log("Invalid user data", err);
      return {};
    }
  } else {
    return {};
  }
};

export const getRestaurantUser = function () {
  if (getLocalKey("restaurant")) {
    return JSON.parse(getLocalKey("restaurant"));
  } else {
    return {};
  }
};

export const copyText = async function (text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    console.log("error", error);
  }
};

export const logOutUser = (role, navigate = null) => {
  removeLocalKey(role);
  let loginUrl = "";
  if (role === ROLE.PSYCHIC) {
    loginUrl = "/psychic/login"
  } else if (role === ROLE.SUPER_ADMIN) {
    loginUrl = "/admin/login";
  }
  if (window.navigate_) {
    window.navigate_(loginUrl);
  } else if (navigate) {
    navigate(loginUrl);
  } else {
    window.location.href = loginUrl;
  }
};
export const logOutWithSwal = (role) => {
  Swal.fire({
    customClass: "swal-wide",
    title: t("msg_are_you_sure"),
    text: t("text_you_want_to_logout"),
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#5A045A",
    cancelButtonColor: "#fbae50",
    confirmButtonText: t("btn_yes"),
    cancelButtonText: t("btn_cancel")
  }).then((result) => {
    if (result.isConfirmed) {
      logOutUser(role);
      Swal.fire({
        icon: "success",
        text: t("msg_logout_successfully"),
        ...SWAL_SETTINGS,
      });
    }
  });
};

export const setLocalKey = (key, value) => {
  if (production === "true") {
    localStorage.setItem(encodeValue(key), encodeValue(value));
  } else {
    localStorage.setItem(key, value);
  }
};

export const getLocalKey = (key) => {
  if (production === "true") {
    if (localStorage.getItem(encodeValue(key))) {
      return decodeValue(localStorage.getItem(encodeValue(key)));
    }
  } else {
    if (localStorage.getItem(key)) {
      return localStorage.getItem(key);
    }
  }
};

export const removeLocalKey = (key) => {
  if (production === "true") {
    localStorage.removeItem(encodeValue(key));
  } else {
    localStorage.removeItem(key);
  }
};
export const DT = (text, dynamicOptions = []) => {
  let str = text;
  if (Array.isArray(dynamicOptions)) {
    dynamicOptions.forEach((string) => {
      str = str.replace(/{{(.*?)}}/, string);
    });
  } else if (typeof dynamicOptions === "object") {
    Object.keys(dynamicOptions).forEach((key) => {
      let regex = new RegExp(`{{${key}}}`, 'g');
      str = str.replace(regex, dynamicOptions[key]);
    });
  }
  return str;
};

export const setSessionKey = (key, value) => {
  if (production === "true") {
    sessionStorage.setItem(encodeValue(key), encodeValue(value));
  } else {
    sessionStorage.setItem(key, value);
  }
};

export const getSessionKey = (key) => {
  if (production === "true") {
    if (sessionStorage.getItem(encodeValue(key))) {
      return decodeValue(sessionStorage.getItem(encodeValue(key)));
    }
  } else {
    if (sessionStorage.getItem(key)) {
      return sessionStorage.getItem(key);
    }
  }
};

export const removeSessionKey = (key) => {
  if (production === "true") {
    sessionStorage.removeItem(encodeValue(key));
  } else {
    sessionStorage.removeItem(key);
  }
};

export const blockInvalidChar = (e) => {
  const str =
    "eE+-.,;:/|\\!@#$%^&*()_=~`abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ ";
  return str.split("").includes(e.key) && e.preventDefault();
};

export const blockInvalidCharWithNumber = (e) => {
  const str =
    "eE+-.,;:/|\\!@#$%^&*()_=~`abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ 1234567890'";
  return str.split("").includes(e.key) && e.preventDefault();
};

export const handleServerValidations = (response) => {
  let message = response.message;
  if (Array.isArray(response.error)) {
    if (response.error[0] && response.error[0].msg) {
      message = response.error[0].msg;
    } else if (response.error[0] && response.error[0].message) {
      message = response.error[0].message;
    }
  }
  return message;
};

export const showStatus = (status) => {
  switch (status) {
    case 0:
      return `<span className="badge badge-secondary" href="#">Inactive</span>`;
    case 1:
      return `<span className="badge badge-primary" href="#">Active</span>`;
    default:
      return ``;
  }
};

export const capitalizeFirstLetter = (str) => {
  if (str && str.length) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  } else {
    return "";
  }
};

export const getExtension = (fileName) => {
  const fileNameArr = fileName.split(".");
  return fileNameArr[fileNameArr.length - 1];
};

export const getIcons = (fileName) => {
  if (!fileName) return null;
  let fileExt = getExtension(fileName);
  let imageExts = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
  if (imageExts.indexOf(fileExt.toLowerCase()) >= 0) {
    return `image`;
    // return `<img className="" src=${fileName} alt="Thumb-1" />`
  } else {
    if (fileExt === "pdf") {
      return `<i className="fa fa-file-pdf-o" aria-hidden="true"></i>`;
    } else if (fileExt === "zip" || fileExt === "tar" || fileExt === "rar") {
      return `<i className="fa fa-file-archive-o" aria-hidden="true"></i>`;
    } else if (fileExt === "docx") {
      return `<i className="fa fa-file-word-o" aria-hidden="true"></i>`;
    } else if (fileExt === "xls" || fileExt === "xlsx" || fileExt === "csv") {
      return `<i className="fa fa-file-excel-o" aria-hidden="true"></i>`;
    } else if (fileExt === "mp3" || fileExt === "wav") {
      // return `<i className="fa fa-file-audio-o" aria-hidden="true"></i>`;
      return `<audio controls><source src=${fileName} type="audio/${fileExt}">Your browser does not support the audio element.</audio>`;
    } else if (fileExt === "mp4" || fileExt === "mov" || fileExt === "avi") {
      // return `<i className="fa fa-file-video-o" aria-hidden="true"></i>`;
      return `<video controls width="250"><source src=${fileName} type="video/${fileExt}">Your browser does not support the video element.</video>`;
    } else {
      return `<i className="fa fa-file" aria-hidden="true"></i>`;
    }
  }
};

export const removeSpecialCharacter = (value) => {
  let text = "";
  try {
    text = String(value);
  } catch (err) {
    console.log(err);
  }
  if (text) {
    return text.replace("-", " ").replace("_", " ");
  }
  return "";
};

export const addSpecialCharacter = (text) => {
  return text.replace(" ", "-");
};

export const isUser = (role) => {
  const user = getUser();
  if (user && user.token) {
    return true;
  }
  return false;
};
export const diffrenceBetweenTwoDates = (startDate, endDate) => {
  const date1 = new Date(startDate);
  const date2 = new Date(endDate);
  console.log("date2 - date1", date2 - date1);
  const diffTime = date2 - date1;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};
export const getDiffrenceInDays = (startDate, endDate) => {
  if (typeof startDate === "object") {
    startDate = startDate.toISOString().split("T")[0];
  }
  if (typeof endDate === "object") {
    endDate = endDate.toISOString().split("T")[0];
  }
  const date1 = new Date(startDate);
  const date2 = new Date(endDate);
  const diffTime = date2 - date1;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};

export const getDiffrenceInTime = (startDate, endDate) => {
  const date1 = new Date(startDate);
  const date2 = new Date(endDate);
  const diffTime = date2 - date1;
  return diffTime;
};

export const globalLoader = (action) => {
  const loader = document.getElementById("main-loader");
  if (loader) {
    let customStyle = action ? "flex" : "none";
    loader.style.display = customStyle;
  }
};

export const getImageFileFromUrl = async (url) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = await fetch(url);
      let data = await response.blob();
      let metadata = {
        type: "image/jpeg",
      };

      const file = new File([data], "image1.jpg", metadata);
      // console.log("file", file);
      resolve(file);
    } catch (err) {
      console.log("err", err);
      reject(err);
    }
  });
};

export const getStringfromPTag = (text) => {
  // const text = 'This is a <p>paragraph</p> of text with <p>multiple</p> paragraphs.';
  const regex = /<p>(.*?)<\/p>/g;
  const matches = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    matches.push(match[1]);
  }

  // console.log(matches);
  return matches;
};

export const removeSpacesAndCharacters = (inputString) => {
  const pattern = /[^0-9]+/g;
  const result = inputString?.replace(pattern, "");

  console.log("res", result);
  return result;
};
// };
// module.exports = myfunctions;

export const attachDynamicStrings = (data) => {
  let response = data;
  Object.keys(DYNAMIC_VARIABLES).forEach((item) => {
    response = response.replace(
      RegExp("{" + item + "}", "g"),
      DYNAMIC_VARIABLES[item]
    );
  });
  return response;
};

export const getNameFromList = (codeName) => {
  const data = getData();
  data.push({ code: "AC", name: "Ascension" });

  var name;
  for (let i = 0; i < data.length; i++) {
    if (data[i].code === codeName) {
      name = data[i].name;
    }
  }
  return name;
};

export const formatFileSize = (bytes) => {
  if (bytes < 1024) {
    return bytes + " B";
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(2) + " KB";
  } else if (bytes < 1024 * 1024 * 1024) {
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  } else {
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
  }
};

export const getLocalizedDate = (date) => {
  return new Date(date).toLocaleString()?.split(",")[1];
};

export const hasPermission = (route) => {
  let permissionQuota = null;
  let dataLocal = null;
  try {
    dataLocal = JSON.parse(getLocalKey("GlobalDetails"));
  } catch (e) { }

  const userData = getLocalKey("user") ? JSON.parse(getLocalKey("user")) : {};
  let role = userData.role;
  if (!userData.role) {
    return false;
  }
  switch (role) {
    case STAFF_ROLE.SUPER_ADMIN:
      permissionQuota = "superAdmin";
      break;
    case STAFF_ROLE.SUB_ADMIN:
      permissionQuota = "subAdmin";
      break;
    case STAFF_ROLE.STAFF:
      permissionQuota = "staff";
      break;
    default:
      permissionQuota = "";
  }
  let allPermissions = [
    ...PERMISSIONS[permissionQuota],
    ...(dataLocal && dataLocal.surveys === true
      ? [
        "/admin/question-settings/sets/add",
        "/admin/question-settings/sets/*/edit/*",
        "/admin/question-settings/sets/status",
        "/admin/question-settings/sets/delete",
        "/admin/question-settings/sets/more",
        "/admin/question-settings/sets/reorder",
        "/admin/question-settings/sets/newQuestions",
        "/admin/question-settings/sets/duplicate",
        "/admin/question-settings/sets/multi_select",
      ]
      : []),
  ];

  return allPermissions.indexOf(route) !== -1;
};
// console.log("Hello", getDayBetweenDates("2024-01-11T00:00:00.000Z","2024-01-12T00:00:00.000Z"));

export const addQueryParam = (url, key, value) => {
  const separator = url.includes("?") ? "&" : "?";
  const queryParams = new URLSearchParams(window.location.search);
  queryParams.set(key, value);
  console.log(`${url}${separator}${queryParams.toString()}`);
  return `${url}${separator}${queryParams.toString()}`;
};

export const decideRole = (role) => {
  // console.log(role);
  if (role === STAFF_ROLE.ADMIN) {
    return <span className="badge badge-success">Super Admin</span>;
  } else if (role === STAFF_ROLE.SUB_ADMIN) {
    return <span className="badge badge-info">Sub Admin</span>;
  } else if (role === STAFF_ROLE.USER) {
    return <span className="badge badge-dark">User</span>;
  } else if (role === STAFF_ROLE.STAFF) {
    return <span className="badge badge-primary">Staff</span>;
  } else {
    return <span className="badge badge-light">Unknown</span>;
  }
};

export const removeCommas = (inputString) => {
  if (typeof inputString !== "string") {
    return inputString;
  }
  return inputString.replace(/,/g, ";");
};

export const isImage = (fileName) => {
  if (!fileName) {
    return false;
  }
  const imageExts = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
  const fileExt = fileName.split(".").pop().toLowerCase();
  return imageExts.includes(fileExt);
};

export const getFileIcons = (fileName) => {
  if (!fileName) return null;

  const fileExt = fileName.split(".").pop().toLowerCase();
  const imageExts = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];

  if (imageExts.includes(fileExt)) {
    return <img src={fileName} alt="Thumbnail" />;
  } else {
    switch (fileExt) {
      case "pdf":
        return (
          <i
            className="fa fa-file-pdf-o"
            aria-hidden="true"
            style={{ fontSize: "30px" }}
          ></i>
        );
      case "zip":
      case "tar":
      case "rar":
        return (
          <i
            className="fa fa-file-archive-o"
            aria-hidden="true"
            style={{ fontSize: "30px" }}
          ></i>
        );
      case "docx":
        return (
          <i
            className="fa fa-file-word-o"
            aria-hidden="true"
            style={{ fontSize: "30px" }}
          ></i>
        );
      case "xls":
      case "xlsx":
      case "csv":
        return (
          <i
            className="fa fa-file-excel-o"
            aria-hidden="true"
            style={{ fontSize: "30px" }}
          ></i>
        );
      case "mp3":
      case "wav":
        return (
          <i
            className="fa fa-file-audio-o"
            aria-hidden="true"
            style={{ fontSize: "30px" }}
          ></i>
        );
      case "mov":
      case "avi":
      case "mp4":
        return (
          <i
            className="fa fa-file-video-o"
            aria-hidden="true"
            style={{ fontSize: "30px" }}
          ></i>
        );
      default:
        return <i className="fa fa-file" aria-hidden="true"></i>;
    }
  }
};

export const writeMyExcel = (data, fileName) => {
  return new Promise((resolve, reject) => {
    const XLSX = document.XLSX;
    if (XLSX) {
      try {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, fileName);
        resolve();
      } catch (err) {
        reject(err);
      }
    } else {
      reject(new Error("XLSX module not found."));
    }
  });
};

export const SpecialCharacter = (text) => {
  return text.replace(/_/g, " ").replace("-", " ");
};

export const capitalizeFirstLetterOfEachWord = (str) => {
  if (str && str.length) {
    return str.replace(/(?:^|\s|-|_)\S/g, (char) => char.toUpperCase());
  } else {
    return "";
  }
};

export const timeStamp = (data, fileName) => {
  return new Date().getTime();
};
export const pluralString = (length = 0, plural = "", singular = "") => {
  return length > 1 ? plural : singular;
};
export const getFileNameFromURL = (url) => {
  if (url) {
    try {
      const urlObject = new URL(url);
      const pathname = urlObject.pathname;
      const segments = pathname.split("/");
      const fileName = segments[segments.length - 1];
      return fileName;
    } catch (err) {
      console.log("Provide url is not valid", err, url);
      return "";
    }
  } else {
    return "";
  }
};
export const getChunks = (file) => {
  let chunks = [];
  const size = file.size;
  const totalChunks = Math.ceil(size / FILE_UPLOAD.CHUNK_SIZE);
  return new Promise((resolve) => {
    let i = 0;
    for (i; i < totalChunks; i++) {
      chunks.push(
        file.slice(i * FILE_UPLOAD.CHUNK_SIZE, FILE_UPLOAD.CHUNK_SIZE * (i + 1))
      );
    }
    resolve(chunks);
  });
};
export const prepareQuestionsFormData = (
  result,
  formData,
  fileUploadPath,
  formId = null
) => {
  if (result) {
    let ans = "";
    let keySuffix = "";
    try {
      ans = JSON.stringify(result?.normalQuestions);
    } catch (err) {
      console.log("Not a valid data to stringify", err);
    }
    if (formId) {
      keySuffix = `__FORM_ID__${formId}`;
    }
    formData?.append("answered_questions" + keySuffix, ans);
    formData?.append("questions_file_upload_path" + keySuffix, fileUploadPath);
    if (Object.keys(result?.files).length) {
      Object.keys(result?.files).forEach((item) => {
        if (Array.isArray(result?.files[item])) {
          result?.files[item].forEach((file) => {
            formData?.append(item + keySuffix, file);
          });
        } else {
          formData?.append(item + keySuffix, result?.files[item]);
        }
      });
    }
  }
  return formData;
};
export const convertTo12HourFormat = (time24) => {
  const [hours, minutes] = time24.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12;
  const time12 = `${hours12}:${String(minutes).padStart(2, "0")} ${period}`;
  return time12;
};
export const getArrayOf = (range = 0) => {
  const arr = [];
  for (let i = 0; i < range; i++) {
    arr.push(i);
  }
  return arr;
};

export const isApp = () => {
  const key = getSessionKey("running_in_app");
  return Boolean(key && key === "true");
};

export const breakWord = (str) => {
  let words = str.split(" ");
  let newStr = words.map(word =>
    word.length > 50 ? word.slice(0, 50) + "...." : word
  ).join(" ");
  return newStr;
}

export const handleOffcanvasScroll = (e, id) => {
  const targetElement = document.getElementById(id);
  if (e.target.scrollTop > 0) {
    if (targetElement) {
      targetElement.classList.add("offcanvas_scrolled");
    }
  } else {
    if (targetElement) {
      targetElement.classList.remove("offcanvas_scrolled");
    }
  }
};

export const createSlider = (selector, settings = null) => {
  setTimeout(() => {
    const evt = new CustomEvent("createOWLSlider", { detail: { selector, settings } });
    document.dispatchEvent(evt);
  }, 100);
};

export const setReturnURL = (role) => {
  const URL = window.location.href.replace(window.location.origin, '');
  if (URL) {
    setSessionKey('return_url', URL);
    setSessionKey('return_url_role', role);
  }
  return true;
};

export const handleNavigation = ({ successURL, role }) => {
  const returnURL = getSessionKey('return_url');
  const returnRole = getSessionKey('return_url_role');
  removeSessionKey('return_url');
  removeSessionKey('return_url_role');
  if (window.location.pathname === returnURL) {
    return window.navigate_ ? window.navigate_(successURL) : null;
  } else {
    if (returnURL && returnRole && returnRole === role) {
      return window.navigate_ ? window.navigate_(returnURL) : null;
    } else {
      return window.navigate_ ? window.navigate_(successURL) : null;
    }
  }
};

export const getPsychicData = () => {
  const psychicData = getLocalKey('psychic');
  if (psychicData) {
    return JSON.parse(psychicData);
  }
  return {};
}

export const formDataToObject = (formData) => {
  const obj = {};
  formData.forEach((value, key) => {
    obj[key] = value;
  });
  return obj;
};

export function formatDashString(inputString) {
  let formattedString = inputString?.replace(/[-_]/g, ' ');
  return formattedString;
};

// export const convertTimezoneToOffset = (timezoneId) => {
//   try {
//     const date = new Date();
//     const options = {
//       timeZone: timezoneId,
//       hour: 'numeric',
//       minute: 'numeric',
//       second: 'numeric',
//       timeZoneName: 'short',
//     };

//     const formatter = new Intl.DateTimeFormat([], options);
//     const parts = formatter.formatToParts(date);

//     const timeZoneOffset = parts.find(part => part.type === 'timeZoneName')?.value;

//     if (!timeZoneOffset) {
//       return 0;
//     }
//     let cleanedOffset = timeZoneOffset.replace(/GMT/g, '').trim();

//     if (!cleanedOffset) {
//       return 0;
//     }

//     return cleanedOffset;

//   } catch (error) {
//     console.error('Error in converting timezone:', error);
//     return 0;
//   }
// };

export const convertTimezoneToOffset = (timezoneId) => {
  try {
    const date = new Date();

    // Get local time in the target timezone
    const localeTime = new Intl.DateTimeFormat('en-US', {
      timeZone: timezoneId,
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    }).formatToParts(date);

    // Get UTC time
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timezoneId }));

    // Offset in minutes
    const offsetMinutes = (tzDate.getTime() - utcDate.getTime()) / 60000;

    const sign = offsetMinutes >= 0 ? '+' : '-';
    const absOffset = Math.abs(offsetMinutes);
    const hours = Math.floor(absOffset / 60)
      .toString()
      .padStart(2, '0');
    const minutes = (absOffset % 60).toString().padStart(2, '0');

    return `${sign}${hours}:${minutes}`;
  } catch (error) {
    console.error('Error in converting timezone:', error);
    return 'UTC';
  }
};

