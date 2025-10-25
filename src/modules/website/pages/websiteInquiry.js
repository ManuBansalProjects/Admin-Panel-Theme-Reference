import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { InquiryForm } from "../services/website.services";
import bannerContact from "./../../../assets/website/images/banner-contact.jpg"
import {
  EXPERTISE,
  INPUT_LENGTH_15,
  INPUT_LENGTH_20,
  INPUT_LENGTH_500,
  PHONE_NO_LENGTH,
  SWAL_SETTINGS,
  TEXTAREA_MAX_LENGTH,
} from "../../../utils/Constants";
import {
  DT,
  globalLoader,
  handleServerValidations,
} from "../../../utils/commonfunction";
import * as Yup from "yup";
import CustomError from "../../../utils/customError";
import { ADDRESS, COMMON_INPUT_VALIDATION, EMAIL_VALIDATION, NO_HTML_TAG, PHONE_VALIDATION } from "../../../utils/commonValidations";
import { useSelector } from "react-redux";
import PhoneInput from "../../../utils/PhoneInput";
const WebsiteInquiry = ({ id }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [globalData, setGlobalData] = useState({})
  const getGlobalData = useSelector((state) => state.globalData?.data);

  useEffect(() => {
    if (getGlobalData) {
      const globalSettingData = JSON.parse(getGlobalData);
      setGlobalData(globalSettingData)
    }
  }, [getGlobalData]);

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().trim()
      .max(INPUT_LENGTH_20, DT(t("err_exceed_max_length"), [INPUT_LENGTH_20]))
      .concat(COMMON_INPUT_VALIDATION)
      .required("label_first_name_error"),
    last_name: Yup.string().trim()
      .max(INPUT_LENGTH_20, DT(t("err_exceed_max_length"), [INPUT_LENGTH_20]))
      .concat(COMMON_INPUT_VALIDATION)
      .required("label_last_name_error"),
    // email: Yup.string()
    //   .trim()
    //   .email("Invalid email format")
    //   .test('no-uppercase', "Invalid email format", function (value) {
    //     if (value) {
    //       return !/[A-Z]/.test(value);
    //     }
    //   })
    //   .required("Email address is required"),
    phone_number: PHONE_VALIDATION,
    email: EMAIL_VALIDATION,
    expertise: Yup.string().trim().max(INPUT_LENGTH_20, DT(t("err_exceed_max_length"), [INPUT_LENGTH_20])).required("err_expertise_is_required"),
    // address: Yup.string().trim()
    //   .max(TEXTAREA_MAX_LENGTH, DT(t("err_exceed_max_length"), [TEXTAREA_MAX_LENGTH]))
    //   .matches(/^[A-Za-z0-9\s\.,'";:?!-^]*$/, t("valid_format_error"))
    //   .test("not-only-numbers", t("valid_format_error"), value => {
    //     return /[A-Za-z]/.test(value);
    //   })
    //   .required("Address is required")
    address: Yup.string().trim()
      .max(TEXTAREA_MAX_LENGTH, DT(t("err_exceed_max_length"), [TEXTAREA_MAX_LENGTH]))
      .concat(COMMON_INPUT_VALIDATION)
      .concat(NO_HTML_TAG)
      .required("err_address_is_required"),
    description: Yup.string().trim()
      .max(INPUT_LENGTH_500, DT(t("err_exceed_max_length"), [INPUT_LENGTH_500]))
      .concat(COMMON_INPUT_VALIDATION)
      .concat(NO_HTML_TAG)
      .required("label_richtext_error"),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      expertise: "",
      address: "",
      description: ""
    },
    validateOnBlur: false,
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      globalLoader(true);
      let formData = new FormData();
      formData.append("first_name", values.first_name);
      formData.append("last_name", values.last_name);
      formData.append("email", values.email);
      formData.append("phone_number", values.phone_number);
      formData.append("expertise", values.expertise);
      formData.append("address", values.address);
      formData.append("description", values.description);

      InquiryForm(formData)
        .then((response) => {
          globalLoader(false);
          setSubmitting(false);
          if (response.success) {
            Swal.fire({
              icon: "success",
              text: response.message,
              ...SWAL_SETTINGS,
            });
            resetForm({ values: "" });
            navigate(`/`);
          } else {
            Swal.fire({
              icon: "error",
              text: handleServerValidations(response),
              ...SWAL_SETTINGS,
            });
          }
        })
        .catch((error) => {
          globalLoader(false);
          console.log("error ====> ", error);
        });
    },
  });

  return (
    <>
      <section id={id} className="contact-sec ">
        <div className='banner-inner-head'>
          <div className='container-fluid'>
            <div className='banner-inner-wrap d-flex align-items-center justify-content-center'>
              <img alt="inquiry-banner" className='banner-bg' src={bannerContact} />
              <div className='banner-content d-flex flex-column gap-4'>
                <h1>{t("inquiry")}</h1>
              </div>
            </div>
          </div>
        </div>
        <div className='breadcrumb-container container-fluid'>
          <nav aria-label="breadcrumb" className='mt-4'>
            <ol className="breadcrumb gap-2 justify-content-start align-items-center">
              <li className="breadcrumb-item"><Link to={`/`}>{t("header_home")}</Link></li>
              <li className="breadcrumb-item active" aria-current="page">{t("inquiry")}</li>
            </ol>
          </nav>
        </div>
        <div className="container w-75 py-12">
          <div className="contect d-flex align-items-center justify-content-center">
            <div className="row justify-content-between">
              <div className="col-md-5">
                <div className="contact-us-text">
                  <div className="heading-section d-flex flex-column gap-3 mb-5 me-5">
                    <h4 className="h2-heading">{t("inquiry_heading")}</h4>
                    <p className="paragraph-16">{t("inquiry_content")} </p>
                    <div className="contact-info-box d-flex flex-column gap-3">
                      <div className="contact-info-box-item">
                        <a className="d-flex align-items-center gap-1" href={`mailto:${globalData?.contact_email}`}><i className="ti ti-mail me-2"></i><span>{globalData?.contact_email}</span></a>
                      </div>
                      <div className="contact-info-box-item">
                        <a className="d-flex align-items-center gap-1" href={`tel:${globalData?.phone_number}`}><i className="ti ti-phone me-2"></i><span>{globalData?.phone_number}</span></a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="contact-form-card">
                  <div className="contact-form-card-body">
                    <form onSubmit={formik.handleSubmit}>
                      <div className="contact-form">
                        <div className="contact-form-box">
                          <div className="row">
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label htmlFor="first_name" className="form-label ">
                                  {t("label_first_name")}<span>*</span>
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder={t("placeholder_first_name")}
                                  name="first_name"
                                  id="first_name"
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  value={formik.values.first_name}
                                />
                                <span className="text-danger d-flex text-left">
                                  <CustomError name="first_name" form={formik} />
                                </span>
                              </div>
                            </div>

                            <div className="col-md-6">
                              <div className="mb-3">
                                <label htmlFor="last_name" className="form-label ">
                                  {t('label_last_name')}<span>*</span>
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder={t("placeholder_last_name")}
                                  name="last_name"
                                  id="last_name"
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  value={formik.values.last_name}
                                />
                                <span className="text-danger d-flex text-left">
                                  <CustomError name="last_name" form={formik} />
                                </span>
                              </div>
                            </div>

                            <div className="col-md-12">
                              <div className="mb-3">
                                <label htmlFor="email" className="form-label ">
                                  {t("label_email")} <span>*</span>
                                </label>
                                <input
                                  type="email"
                                  className="form-control"
                                  placeholder={t("placeholder_email_address")}
                                  name="email"
                                  id="email"
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  value={formik.values.email}
                                />
                                <span className="text-danger d-flex text-left">
                                  <CustomError name="email" form={formik} />
                                </span>
                              </div>
                            </div>

                            <div className='col-md-12'>
                              <div className="mb-3">
                                <label htmlFor='phone_number' className="form-label">{t("label_phone_number")}<span>*</span></label>
                                <PhoneInput
                                  id={`phone_number`}
                                  value={formik?.values?.phone_number}
                                  placeholder={t("placeholder_phone_number")}
                                  name={'phone_number'} onChange={(e) => { formik.setFieldValue('phone_number', e?.phone_number) }} onBlur={formik.handleBlur} />
                                <CustomError name="phone_number" form={formik} className="text-danger" shortCodes={{ PHONE_MIN_LENGTH: PHONE_NO_LENGTH.min, PHONE_MAX_LENGTH: PHONE_NO_LENGTH.max }} />
                              </div>
                            </div>

                            <div className="col-md-12">
                              <div className="mb-3">
                                <label htmlFor="expertise" className="form-label ">
                                  {t("label_expertise")}<span>*</span>
                                </label>
                                {/* <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Enter expertise"
                                  name="expertise"
                                  id="expertise"
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  value={formik.values.expertise}
                                /> */}
                                <select
                                  name="expertise"
                                  id="expertise"
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  value={formik.values.expertise}
                                  className="form-control" >
                                  <option value="">{t("select_expertise")}</option>
                                  {(EXPERTISE).map((exp, i) => {
                                    return (
                                      <option key={i} value={exp.value}>{t(`${exp.name}`)}</option>
                                    )
                                  })}
                                </select>
                                <span className="text-danger d-flex text-left">
                                  <CustomError name="expertise" form={formik} />
                                </span>
                              </div>
                            </div>

                            <div className="col-md-12">
                              <div className="mb-3">
                                <label htmlFor="address" className="form-label ">
                                  {t("address")} <span>*</span>
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder={t("placeholder_address")}
                                  name="address"
                                  id="address"
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  value={formik.values.address}
                                />
                                <span className="text-danger d-flex text-left">
                                  <CustomError name="address" form={formik} />
                                </span>
                              </div>
                            </div>

                            <div className="col-md-12">
                              <div className="mb-3">
                                <label htmlFor="description" className="form-label ">
                                  {t("label_description")} <span>*</span>
                                </label>
                                <textarea
                                  type="text"
                                  className="form-control"
                                  placeholder={t("placeholder_description")}
                                  name="description"
                                  id="description"
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  value={formik.values.description}
                                />
                                <span className="text-danger d-flex text-left">
                                  <CustomError name="description" form={formik} />
                                </span>
                              </div>
                            </div>


                            <div className="col-md-7">
                              <button className="btn btn-primary w-50">
                                {t("web_inquiry_form_btn_submit")}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default WebsiteInquiry;
