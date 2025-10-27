import React, { useEffect, useState } from "react";
import { Formik, FieldArray, Field } from "formik";
import Swal from "sweetalert2";
import * as globalSettingsService from "../../../services/globalsetting.services";
import Breadcrums from "../../../common/breadcrumbs";
import {
  blockInvalidChar,
  handleServerValidations,
} from "../../../../../utils/commonfunction";
import { SWAL_SETTINGS } from "../../../../../utils/Constants";
import Loader from "../../../common/loader";
import { URL_REGEX, amountRegex, MOBILE_NUMBER_REGEX } from "../../../../../utils/Constants";
import { useTranslation } from "react-i18next";
import { Tooltip, Whisper } from "rsuite";

const GlobalSettings = (props) => {
  const { t } = useTranslation();
  const [showdefault, setShowDefault] = useState({});
  // const [ setContactNumber] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [previewimage, setPreviewImage] = useState("");
  const breadcrumbs = [
    { title: t("sidebar_link_dashboard"), url: "/admin/dashboard" },
    { title: t("sidebar_link_global_settings"), url: "" },
  ];

  useEffect(() => {
    globalSettingsService
      .Details()
      .then((response) => {
        setShowDefault(response && response.data ? response?.data : []);
        setPreviewImage(response?.data?.website_logo);
        // console.log("🚀 ~ .then ~ response:", response.data);
        setTimeout(() => {
          setDataLoaded(true);
        }, 100);
      })
      .catch((error) => {
        console.log("error=====>", error);
        setDataLoaded(true);
      });
  }, []);



  return (
    <>
      <Breadcrums data={breadcrumbs} />
      {dataLoaded ? (
        <Formik

          validateOnChange={true}
          enableReinitialize
          initialValues={{
            Address:
              showdefault && showdefault.address ? showdefault.address : "",
            // smtp_username:
            //   showdefault && showdefault.smtp_username
            //     ? showdefault.smtp_username
            //     : "",
            AdminEmail:
              showdefault && showdefault.admin_email
                ? showdefault.admin_email
                : "",
            contactEmail:
              showdefault && showdefault.contact_email
                ? showdefault.contact_email
                : "",
            financeEmail:
              showdefault && showdefault.finance_email
                ? showdefault.finance_email
                : "",
            Contact:
              showdefault && showdefault.phone_number
                ? showdefault.phone_number
                : "",
            CopyRighttxt:
              showdefault && showdefault.copy_right_text
                ? showdefault.copy_right_text
                : "",

            web: showdefault && showdefault.website ? showdefault.website : "",
            title: showdefault && showdefault.title ? showdefault.title : "",
            website_info: showdefault && showdefault.website_info ? showdefault.website_info : "",
            website_logo: showdefault && showdefault.website_logo ? showdefault.website_logo : "",
            // credit_value: showdefault && showdefault.credit_value ? showdefault.credit_value : "",
            // wallet_recharge_status: showdefault && showdefault.wallet_recharge_status ? showdefault.wallet_recharge_status : "false",
            // monthly_restaurant_enrollment_cost: showdefault && showdefault.monthly_restaurant_enrollment_cost ?
            //   showdefault.monthly_restaurant_enrollment_cost :
            //   "",
            // yearly_restaurant_enrollment_cost: showdefault && showdefault.yearly_restaurant_enrollment_cost ?
            //   showdefault.yearly_restaurant_enrollment_cost :
            //   "",
            socialMedia:
              showdefault && showdefault.social_media_details && showdefault?.social_media_details?.length
                ? showdefault.social_media_details
                : [{ title: '', link: '', icon: '' }],
          }}
          validate={(values) => {

            let error = { socialMedia: [] };
            // { console.log("values--",values.Address)}

            if (values?.socialMedia?.length > 0) {
              values?.socialMedia.forEach((element, i) => {
                error.socialMedia[i] = {};
                if (!element.title) {
                  error.socialMedia[i]["title"] = t("validation_err_title_required");
                }
                if (element.title.length > 20) {
                  error.socialMedia[i]["title"] = t("validation_err_reached_maximum_length");
                }
                if (!element.icon) {
                  error.socialMedia[i]["icon"] = t("validation_err_icon_required");
                }
                if (element.icon.length > 50) {
                  error.socialMedia[i]["icon"] = t("validation_err_reached_maximum_length");
                }
                if (!element.link) {
                  error.socialMedia[i]["link"] = t("validation_err_link_required");
                }
                if (element.link.length > 50) {
                  error.socialMedia[i]["link"] = t("validation_err_reached_maximum_length");
                }
                else if (!URL_REGEX.test(element.link)) {
                  error.socialMedia[i]["link"] = t("invalid_web_url")
                }
              });
            }
            if (error.socialMedia.length) {
              let socialMediaFlag = 0;
              error.socialMedia.forEach((element, i) => {
                if (Object.keys(element).length) {
                  socialMediaFlag++;
                }
              });
              if (!socialMediaFlag) {
                delete error.socialMedia;
              }
            } else {
              delete error.socialMedia;
            }

            if (!values.AdminEmail.trim()) {
              error.AdminEmail = t("label_email_error");
            } else if (
              !/^[A-Z0-9._%+'-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                values.AdminEmail
              )
            ) {
              error.AdminEmail = t("invalid_email")
            }
            if (!values.contactEmail.trim()) {
              error.contactEmail = t("label_email_error");
            } else if (
              !/^[A-Z0-9._%+'-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                values.contactEmail
              )
            ) {
              error.contactEmail = t("invalid_email")
            }
            if (!values.financeEmail.trim()) {
              error.financeEmail = t("label_email_error");
            } else if (
              !/^[A-Z0-9._%+'-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                values.financeEmail
              )
            ) {
              error.financeEmail = t("invalid_email")
            }
            if (!String(values.Contact).trim()) {
              error.Contact = t("label_phone_number_required_error");
            }
            else if (!MOBILE_NUMBER_REGEX.test(values.Contact)) {
              error.Contact = t("label_contact_invalid_error");
            }
            if (!values.CopyRighttxt || !values.CopyRighttxt.trim()) {
              error.CopyRighttxt = t("copyright_error");
            }

            if (!values.Address || !values.Address.trim()) {
              error.Address = t("label_location_error");

            }
            if (values.Address.length > 100) {
              error.Address = t("validation_err_reached_maximum_length")
            }

            // if(!values?.credit_value){
            //   error.credit_value = "Credit value is required"
            // }else if(values?.credit_value < 0 || values?.credit_value > 100000000){
            //   error.credit_value = "Credit value should be between 0 to 100000000"
            // }

            if (!values.web.trim()) {
              error.web = t("website_error");
            }
            else if (!URL_REGEX.test(values.web)) {
              error.web = t("invalid_web_url")
            }
            if (!values.title.trim()) {
              error.title = t("label_title_error");
            }
            else if (values.title.trim().length > 50) {
              error.title = t("label_title_length_error_50");
            }
            if (!values.website_info.trim()) {
              error.website_info = t("Website information is required");
            }
            else if (values.website_info.trim().length > 150) {
              error.website_info = t("Exceed maximum length of 150");
            }

            // Validate website logo image
            if (values.website_logo) {
              const image = values.website_logo;
              if (typeof image === 'string') {
                // Check if it's a URL (either HTTP or HTTPS)
                const urlRegex = /^(http|https):\/\/[^\s$.?#].[^\s]*$/gm;
                if (!urlRegex.test(image)) {
                  error.website_logo = t("invalid_image_url");
                }
              } else {
                // Check file type (JPG, JPEG, PNG, WEBP, GIF)
                const validFileTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp', 'image/gif'];
                if (!validFileTypes.includes(image.type)) {
                  error.website_logo = t("supported_file_error");
                }

                // Check file size (max 1.5MB)
                if (image.size > 1.5 * 1024 * 1024) {
                  error.website_logo = t("image_max_size_error");
                }
              }
            } else {
              error.website_logo = t("image_required_error");
            }

            // if (!values.monthly_restaurant_enrollment_cost.toString().trim()) {
            //   error.monthly_restaurant_enrollment_cost = t("monthly_enrollment_error");
            // }
            // else if (!amountRegex.test(values.monthly_restaurant_enrollment_cost)) {
            //   error.monthly_restaurant_enrollment_cost = t("label_invalid_amount_error")
            // }
            // if (!values.yearly_restaurant_enrollment_cost.toString().trim()) {
            //   error.yearly_restaurant_enrollment_cost = t("yearly_enrollment_error");
            // }
            // else if (!amountRegex.test(values.yearly_restaurant_enrollment_cost)) {
            //   error.yearly_restaurant_enrollment_cost = t("label_invalid_amount_error")
            // }

            return error;
          }}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            setSubmitted(true);
            let formData = new FormData();
            formData.append("address", values.Address);
            formData.append("website", values.web);
            // formData.append("smtp_username", values.smtp_username);
            formData.append("admin_email", values.AdminEmail);
            formData.append("contact_email", values.contactEmail);
            formData.append("finance_email", values.financeEmail);
            formData.append("social_media_details", JSON.stringify(values.socialMedia));
            formData.append("phone_number", values.Contact);
            formData.append("copy_right_text", values.CopyRighttxt);
            formData.append("title", values.title);
            formData.append("website_info", values.website_info);
            formData.append("website_logo", values.website_logo);
            // formData.append("credit_value", values.credit_value);
            // formData.append("wallet_recharge_status", values.wallet_recharge_status);
            // formData.append("monthly_restaurant_enrollment_cost", values.monthly_restaurant_enrollment_cost);
            // formData.append("yearly_restaurant_enrollment_cost", values.yearly_restaurant_enrollment_cost);
            // console.log("formData--->",formData)
            globalSettingsService
              .Add(formData)
              .then((response) => {
                if (response.success) {
                  Swal.fire({
                    icon: "success",
                    text: response.message,
                    ...SWAL_SETTINGS,
                  });
                  setTimeout(() => {
                    setSubmitted(false);
                  }, 2000);
                } else {
                  Swal.fire({
                    icon: "error",
                    text: handleServerValidations(response),
                    ...SWAL_SETTINGS,
                  });
                  setSubmitted(false);
                }
              })
              .catch((error) => {
                console.log("error ====> ", error);
              });
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            isSubmitting,
            setFieldTouched,
          }) => (
            <form onSubmit={handleSubmit}>
              {console.log("values", values)}
              {console.log("error", errors)}
              <div className="row row-sm">
                <div className="col-lg-12 col-md-12 animation_fade">
                  <div className="card custom-card">
                    <div className="card-body">
                      <div>
                        <h6 className="main-content-label mb-3">
                          {t("sidebar_link_global_settings")}
                        </h6>
                      </div>
                      <div className="row row-sm">
                        {/* <div className="col-md-12 text-center form-group">
                          <label
                            htmlFor="smtp_username"
                            className="text-left d-flex"
                          >
                            SMTP {t("label_username")}:<span className="requirestar">*</span>
                          </label>
                          <input
                            name="smtp_username"
                            type="text"
                            id="smtp_username"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.smtp_username}
                            className="form-control"
                          />
                          <span className="text-danger d-flex text-left">
                            {errors.smtp_username &&
                              touched.smtp_username &&
                              errors.smtp_username}
                          </span>
                        </div> */}
                        <div className="col-md-12 text-center form-group">
                          <label
                            htmlFor="AdminEmail"
                            className="text-left d-flex"
                          >
                            {t("role_super_admin")} {t("label_email")}:<span className="requirestar">*</span>
                          </label>
                          <input
                            name="AdminEmail"
                            type="text"
                            id="AdminEmail"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.AdminEmail}
                            className="form-control"
                          />
                          <span className="text-danger d-flex text-left">
                            {errors.AdminEmail &&
                              touched.AdminEmail &&
                              errors.AdminEmail}
                          </span>
                        </div>
                        
                        <div className="col-md-12 text-center form-group">
                          <label
                            htmlFor="contactEmail"
                            className="text-left d-flex"
                          >
                            {t("Contact Email")}:<span className="requirestar">*</span>
                          </label>
                          <input
                            name="contactEmail"
                            type="text"
                            id="contactEmail"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.contactEmail}
                            className="form-control"
                          />
                          <span className="text-danger d-flex text-left">
                            {errors.contactEmail &&
                              touched.contactEmail &&
                              errors.contactEmail}
                          </span>
                        </div>
                        
                        <div className="col-md-12 text-center form-group">
                          <label
                            htmlFor="financeEmail"
                            className="text-left d-flex"
                          >
                            {t("Finance Email")}:<span className="requirestar">*</span>
                          </label>
                          <input
                            name="financeEmail"
                            type="text"
                            id="financeEmail"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.financeEmail}
                            className="form-control"
                          />
                          <span className="text-danger d-flex text-left">
                            {errors.financeEmail &&
                              touched.financeEmail &&
                              errors.financeEmail}
                          </span>
                        </div>
                        
                        <div className="col-md-12 text-center form-group">
                          <label
                            htmlFor="Contact"
                            className="text-left d-flex"
                          >
                            {t("label_contact_no")}:<span className="requirestar">*</span>
                          </label>
                          <input
                            name="Contact"
                            type="text"
                            id="Contact"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.Contact}
                            className="form-control"
                          />
                          <span className="text-danger d-flex text-left">
                            {errors.Contact &&
                              touched.Contact &&
                              errors.Contact}
                          </span>
                        </div>

                        <div className="col-md-12 text-center form-group">
                          <label htmlFor="Address" className="text-left d-flex">
                            {t("list_heading_address")}:<span className="requirestar">*</span>{" "}
                          </label>
                          <textarea
                            name="Address"
                            id="Address"
                            type="text"
                            style={{ minHeight: "100px" }}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.Address}
                            className="form-control"
                          />
                          <span className="text-danger d-flex text-left">
                            {errors.Address &&
                              touched.Address &&
                              errors.Address}
                          </span>
                        </div>

                        <div className="col-md-12 text-center form-group">
                          <label htmlFor="web" className="text-left d-flex">
                            {t("label_website")}:<span className="requirestar">*</span>{" "}
                          </label>
                          <input
                            name="web"
                            id="web"
                            type="text"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.web}
                            className="form-control"
                          />
                          <span className="text-danger d-flex text-left">
                            {errors.web && touched.web && errors.web}
                          </span>
                        </div>

                        <div className="col-md-12 text-center form-group">
                          <label
                            htmlFor="CopyRighttxt"
                            className="text-left d-flex"
                          >
                            {t("label_copy_right_text")}:
                            <span className="requirestar">*</span>{" "}
                          </label>
                          <input
                            name="CopyRighttxt"
                            type="text"
                            id="CopyRighttxt"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.CopyRighttxt}
                            className="form-control"
                          />
                          <span className="text-danger d-flex text-left">
                            {errors.CopyRighttxt &&
                              touched.CopyRighttxt &&
                              errors.CopyRighttxt}
                          </span>
                        </div>

                        <div className="col-md-12 text-center form-group">
                          <label
                            htmlFor="title"
                            className="text-left d-flex"
                          >
                            {t("Website title")}:
                            <span className="requirestar">*</span>{" "}
                          </label>
                          <input
                            name="title"
                            type="text"
                            id="title"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.title}
                            className="form-control"
                            placeholder="Website title"
                          />
                          <span className="text-danger d-flex text-left">
                            {errors.title &&
                              touched.title &&
                              errors.title}
                          </span>
                        </div>

                        <div className="col-md-12 text-center form-group">
                          <label
                            htmlFor="website_info"
                            className="text-left d-flex"
                          >
                            {t("Website Info")}:
                            <span className="requirestar">*</span>{" "}
                          </label>
                          <input
                            name="website_info"
                            type="text"
                            id="website_info"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.website_info}
                            className="form-control"
                            placeholder="Website info"
                          />
                          <span className="text-danger d-flex text-left">
                            {errors.website_info &&
                              touched.website_info &&
                              errors.website_info}
                          </span>
                        </div>

                        <div className="col-lg-6 text-center form-group">
                          <label htmlFor="website_logo" className="text-left d-flex">
                            {t("Website Logo")}:
                            {" "}
                            <Whisper
                              placement="top"
                              controlId="control-id-hover"
                              trigger="hover"
                              speaker={
                                <Tooltip>
                                  {t("image_support_tooltip")}
                                </Tooltip>
                              }
                            >
                              <span className="field-more-info mt-1 ms-1 cp">
                                ?
                              </span>
                            </Whisper>
                          </label>
                          <input
                            className="form-control imgInput"
                            id="website_logo"
                            name="website_logo"
                            accept="image/*"
                            type="file"
                            onChange={(event) => {
                              setFieldValue(
                                "website_logo",
                                event.target.files[0] || ""
                              );
                              event.target.files.length === 1
                                ? setPreviewImage(
                                  URL.createObjectURL(event.target.files[0])
                                )
                                : setPreviewImage("");
                            }}
                          />
                          <span className="text-danger d-flex text-left">
                            {errors.website_logo &&
                              touched.website_logo &&
                              errors.website_logo}
                          </span>
                          {previewimage ? (
                            <ul className="question-image-preview questions-ul">
                              <li className="pr_img_box">
                                <img
                                  src={previewimage}
                                  style={{ height: "100px" }}
                                  alt={"profileImg"}
                                />
                              </li>
                            </ul>
                          ) : (
                            ""
                          )}
                        </div>

                        {/*   
                         <div className="col-md-6 text-center form-group">
                          <label
                            htmlFor="credit_value"
                            className="text-left d-flex"
                          >
                            {t("Number of credits for one €")}:
                            <span className="requirestar">*</span>{" "}
                          </label>

                          <div className="input-group mb-3">
                            
                            <input
                              name="credit_value"
                              type="number"
                              id="credit_value"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.credit_value}
                              className="form-control"
                              onKeyDown={blockInvalidChar}
                            />
                            <div className="input-group-prepend">
                              <span className="input-group-text">Credits</span>
                            </div>
                          </div>
                          <span className="text-danger d-flex text-left">
                            {errors.credit_value &&
                              touched.credit_value &&
                              errors.credit_value}
                          </span>
                        </div> */}

                        {/* <div className="col-md-6 text-center form-group">
                          <label htmlFor="wallet_recharge_status" className="text-left d-flex">
                            {t("Wallet recharge status")}:
                            <span className="requirestar">*</span>
                          </label>
                          <div className="select-down-arrow">
                            <select
                              name="wallet_recharge_status"
                              id="wallet_recharge_status"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={String(values.wallet_recharge_status)}
                              className="form-control"
                            >
                              <option value="false">{t("False")}</option>
                              <option value="true">{t("True")}</option>
                            </select>
                          </div>
                          <span className="text-danger d-flex text-left">
                            {errors.wallet_recharge_status &&
                              touched.wallet_recharge_status &&
                              errors.wallet_recharge_status}
                          </span>
                        </div> */}


                        {/*<div className="col-md-12 text-center form-group">
                          <label
                            htmlFor="yearly_restaurant_enrollment_cost"
                            className="text-left d-flex"
                          >
                            {t("yearly_enrollement_cost")}:
                            <span className="requirestar">*</span>{" "}
                          </label>

                          <div className="input-group mb-3">
                            <div className="input-group-prepend">
                              <span className="input-group-text">¥</span>
                            </div>
                            <input
                              name="yearly_restaurant_enrollment_cost"
                              type="text"
                              id="yearly_restaurant_enrollment_cost"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.yearly_restaurant_enrollment_cost}
                              className="form-control"
                            />
                          </div>
                          <span className="text-danger d-flex text-left">
                            {errors.yearly_restaurant_enrollment_cost &&
                              touched.yearly_restaurant_enrollment_cost &&
                              errors.yearly_restaurant_enrollment_cost}
                          </span>
                        </div> */}

                        {/* ---- */}

                        <label className="text-left d-flex">
                          {t("label_social_media")}:
                        </label>
                        <FieldArray
                          name="socialMedia"
                          render={(arrayHelper) => (
                            <div className="col-12 mb-4">
                              <div className="row">
                                {values?.socialMedia &&
                                  values?.socialMedia?.length >= 0 ? (
                                  values?.socialMedia.map((item, index) => (
                                    <div className="col-12 " key={index}>
                                      <div className="w-100 p-2 bg-group">
                                        <div className="row">
                                          <div className="col-md-3 text-center form-group mb-0">
                                            <Field
                                              className="form-control"
                                              id="title"
                                              name={`socialMedia[${index}].title`}
                                              onChange={handleChange}
                                              onBlur={handleBlur}
                                              value={item.title}
                                              placeholder={t("input_placeholder_title")}
                                            />
                                            <span className="text-danger d-flex text-left">
                                              {((touched?.socialMedia &&
                                                touched?.socialMedia[index] &&
                                                touched?.socialMedia[index]
                                                  .title) ||
                                                submitClicked) &&
                                                errors.socialMedia &&
                                                errors.socialMedia[index] &&
                                                errors.socialMedia[index].title}
                                            </span>
                                          </div>
                                          <div className="col-md-4 text-center form-group mb-0">
                                            <Field
                                              className="form-control"
                                              id="link"
                                              name={`socialMedia[${index}].link`}
                                              onChange={handleChange}
                                              onBlur={handleBlur}
                                              value={item.link}
                                              placeholder={t("input_placeholder_link")}
                                            />
                                            <span className="text-danger d-flex text-left">
                                              {((touched.socialMedia &&
                                                touched.socialMedia[index] &&
                                                touched.socialMedia[index]
                                                  .link) ||
                                                submitClicked) &&
                                                errors.socialMedia &&
                                                errors.socialMedia[index] &&
                                                errors.socialMedia[index].link}
                                            </span>
                                          </div>
                                          <div className="col-md-3 text-center form-group mb-0">
                                            <Field
                                              className="form-control"
                                              id="icon"
                                              name={`socialMedia[${index}].icon`}
                                              onChange={handleChange}
                                              onBlur={handleBlur}
                                              value={item.icon}
                                              placeholder={t("input_placeholder_icon")}
                                            />
                                            <span className="text-danger d-flex text-left">
                                              {((touched.socialMedia &&
                                                touched.socialMedia[index] &&
                                                touched.socialMedia[index]
                                                  .icon) ||
                                                submitClicked) &&
                                                errors.socialMedia &&
                                                errors.socialMedia[index] &&
                                                errors.socialMedia[index].icon}
                                            </span>
                                          </div>
                                          <div className="col-md-2">
                                            <div className="social-media-action">
                                              <button
                                                className="btn btn-danger "
                                                type="button"
                                                disabled={values?.socialMedia?.length === 1}
                                                onClick={() =>
                                                  arrayHelper.remove(index)
                                                } // remove a friend from the list
                                              >
                                                {t("link_remove")}
                                              </button>
                                              {index ===
                                                values?.socialMedia?.length -
                                                1 && (
                                                  <button
                                                    className="btn btn-main-primary signbtn ms-2 "
                                                    type="button"
                                                    onClick={() =>
                                                      arrayHelper.insert(
                                                        values?.socialMedia
                                                          ?.length,
                                                        {
                                                          title: "",
                                                          link: "",
                                                          icon: "",
                                                        }
                                                      )
                                                    }
                                                  >
                                                    {t("link_add")}
                                                  </button>
                                                )}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <button
                                    className="btn btn-main-primary signbtn mr-2 ms-2 mb-3"
                                    type="button"
                                    onClick={() => arrayHelper.push({})}
                                  >
                                    Add a social media
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        />


                        {/* {hasPermission("/admin/cms/settings/submit") ? ( */}
                        <div className="">
                          <button
                            className="btn btn-main-primary signbtn mr-2"
                            type="submit"
                            disabled={submitted ? true : null}
                            onClick={() => {
                              setSubmitClicked(true);
                            }}
                          >
                            <i className="ace-icon fa fa-check bigger-110 mx-1"></i>
                            {t("btn_submit")}
                          </button>
                        </div>
                        {/* ) : null} */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}
        </Formik>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default GlobalSettings;


