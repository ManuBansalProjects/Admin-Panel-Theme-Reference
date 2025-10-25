import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ContactUsForm } from "../../website/services/website.services"
import bannerContact from "./../../../assets/website/images/banner-contact.jpg"
import {
  SWAL_SETTINGS,
  INPUT_LENGTH_100,
  INPUT_LENGTH_500,
  INPUT_LENGTH_30
} from "../../../utils/Constants";
import {
  DT,
  globalLoader,
  handleServerValidations,
} from "../../../utils/commonfunction";
import * as Yup from "yup";
import CustomError from "../../../utils/customError";
import { useSelector } from "react-redux";
const WebsiteContactUs = ({ id }) => {

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
    name: Yup.string().trim()
      .max(INPUT_LENGTH_30, DT(t("err_exceed_max_length"), [INPUT_LENGTH_30]))
      .matches(/^[A-Za-z0-9\s\.,'";:?!-^]*$/, t("valid_format_error"))
      .test("not-only-numbers", t("valid_format_error"), value => {
        return /[A-Za-z]/.test(value);
      })
      .required("label_name_error"),
    subject: Yup.string().trim().max(INPUT_LENGTH_100, DT(t("err_exceed_max_length"), [INPUT_LENGTH_100])).required("label_subject_error"),
    message: Yup.string().trim().max(INPUT_LENGTH_500, DT(t("err_exceed_max_length"), [INPUT_LENGTH_500])).required("err_message_is_required"),
    email: Yup.string()
      .trim()
      .email("label_email_invalid_format_error")
      .test('custom-email', 'label_email_invalid_format_error', (value) => {
        const regex = new RegExp('^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$');
        return value && regex.test(value);
      })
      .required("err_email_is_required"),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
    validateOnBlur: false,
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      globalLoader(true);
      let formData = new FormData();
      formData.append("name", values.name)
      formData.append("email", values.email);
      formData.append("subject", values.subject);
      formData.append("message", values.message);

      ContactUsForm(formData)
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
              <img alt="contact-us-banner" className='banner-bg' src={bannerContact} />
              <div className='banner-content d-flex flex-column gap-4'>
                <h1>{t("contact_us")}</h1>
              </div>
            </div>
          </div>
        </div>
        <div className='breadcrumb-container container-fluid'>
        <nav aria-label="breadcrumb" className='mt-4'>
                    <ol className="breadcrumb gap-2 justify-content-start align-items-center">
                    <li className="breadcrumb-item"><Link to={`/`}>{t("header_home")}</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">{t("contact_us")}</li>
                  </ol>
                </nav>
        </div>
        <div className="container w-75 py-12">
          <div className="contect d-flex align-items-center justify-content-center">
            <div className="row justify-content-between">
              <div className="col-md-6 px-3">
                <div className="contact-us-text">
                  <div className="heading-section d-flex flex-column gap-3 mb-5">
                    <h4 className="h2-heading">{t("contact_us_heading")}</h4>
                    <p className="paragraph-16">{t("contact_us_content")} </p>
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
              <div className="col-md-5">
                <div className="contact-form-card">
                  <div className="contact-form-card-body">
                    <form onSubmit={formik.handleSubmit}>
                      <div className="contact-form">
                        <div className="contact-form-box">
                          <div className="row">
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label htmlFor="name" className="form-label ">
                                  {t('label_name')}<span>*</span>
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder={t("placeholder_name")}
                                  name="name"
                                  id="name"
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  value={formik.values.name}
                                />
                                <span className="text-danger d-flex text-left">
                                  <CustomError name="name" form={formik} />
                                </span>
                              </div>
                            </div>

                            <div className="col-md-6">
                              <div className="mb-3">
                                <label htmlFor="email" className="form-label">
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

                            <div className="col-md-12">
                              <div className="mb-3">
                                <label htmlFor="subject" className="form-label ">
                                  {t("label_subject")}<span>*</span>
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder={t("placeholder_subject")}
                                  name="subject"
                                  id="subject"
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  value={formik.values.subject}
                                />
                                <span className="text-danger d-flex text-left">
                                  <CustomError name="subject" form={formik} />
                                </span>
                              </div>
                            </div>

                            <div className="col-md-12">
                              <div className="mb-3">
                                <label htmlFor="message" className="form-label ">
                                  {t("label_message")}<span>*</span>
                                </label>
                                <textarea
                                  className="form-control"
                                  placeholder={t("placeholder_message")}
                                  style={{ height: "120px" }}
                                  name="message"
                                  id="message"
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  value={formik.values.message}
                                ></textarea>
                                <span className="text-danger d-flex text-left">
                                  <CustomError name="message" form={formik} />
                                </span>
                              </div>
                            </div>
                            <div className="col-md-7">
                              <button className="btn btn-primary w-50">
                                {t("btn_submit")}
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

export default WebsiteContactUs;
