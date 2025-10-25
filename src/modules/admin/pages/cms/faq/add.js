import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Breadcrums from "../../../common/breadcrumbs";
import * as faqServices from "../../../services/faq.services";
import { SWAL_SETTINGS, INPUT_LENGTH_100, INPUT_LENGTH_500 } from "../../../../../utils/Constants";
import {
  globalLoader,
  handleServerValidations,
} from "../../../../../utils/commonfunction";
import { Tooltip, Whisper } from "rsuite";
import { useTranslation } from "react-i18next";
import CustomCkeditor from "../../../common/customeditor";
import * as Yup from "yup";
import { COMMON_INPUT_VALIDATION } from "../../../../../utils/commonValidations";

const FAQAdd = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { t } = useTranslation()
  const [submitted, setSubmitted] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [initialValues, setInitialValues] = useState({
    title_en: "",
    description_en: "",
    title_de: "",
    description_de: "",
    title_es: "",
    description_es: "",
    title_hu: "",
    description_hu: ""
  });

  const breadcrumbs = [
    { title: t("faq.link_dashboard"), url: "/admin/dashboard" },
    { title: t("faq.link_faq"), url: "/admin/cms/faq/list/1" },
    { title: t("faq.link_add"), url: "" },
  ];

  useEffect(() => {
    setInitialValues({
      title: state && state?.title ? state?.title : "",
      description: state && state?.description ? state?.description : "",

    });
    setDataLoaded(true);
  }, []);

  const validationSchema = Yup.object().shape({
    title_en: Yup.string().trim().required("faq.label_title_error").max(INPUT_LENGTH_500, "faq.validation_err_reached_maximum_length"),
    title_de: Yup.string().trim().required("faq.label_title_error").max(INPUT_LENGTH_500, "faq.validation_err_reached_maximum_length"),
    title_es: Yup.string().trim().required("faq.label_title_error").max(INPUT_LENGTH_500, "faq.validation_err_reached_maximum_length"),
    title_hu: Yup.string().trim().required("faq.label_title_error").max(INPUT_LENGTH_500, "faq.validation_err_reached_maximum_length"),
    description_en: Yup.string().trim().required("faq.label_description_error"),
    description_de: Yup.string().trim().required("faq.label_description_error"),
    description_es: Yup.string().trim().required("faq.label_description_error"),
    description_hu: Yup.string().trim().required("faq.label_description_error"),
  });

  return (
    <>
      <Breadcrums data={breadcrumbs} />
      {dataLoaded ? (
        <Formik
          initialValues={{
            title_en: "",
            description_en: "",
            title_de: "",
            description_de: "",
            title_es: "",
            description_es: "",
            title_hu: "",
            description_hu: ""
          }}
          validateOnBlur={false}
          validationSchema={validationSchema}
          // validate={(values) => {
          //   const error = {};
          //   if (!values.title_en || !values.title_en.trim())
          //     error.title_en = "faq.label_title_error";
          //   if (values.title_en.length > INPUT_LENGTH_500)
          //     error.title_en = "faq.validation_err_reached_maximum_length";
          //   if (!values.description_en || !values.description_en.trim())
          //     error.description_en = "faq.label_description_error";

          //   return error;
          // }}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            setSubmitted(true);
            globalLoader(true);
            console.log(values);
            let formData = new FormData();
            formData.append("title_en", values.title_en);
            formData.append("description_en", values.description_en);
            formData.append("title_de", values.title_de);
            formData.append("description_de", values.description_de);
            formData.append("title_es", values.title_es);
            formData.append("description_es", values.description_es);
            formData.append("title_hu", values.title_hu);
            formData.append("description_hu", values.description_hu);
            faqServices
              .Add(formData)
              .then((response) => {
                setSubmitting(false);
                if (response.success) {
                  Swal.fire({
                    icon: "success",
                    text: response.message,
                    ...SWAL_SETTINGS,
                  });
                  setTimeout(() => {
                    resetForm({ values: "" });
                    globalLoader(false);
                    navigate(`/admin/cms/faq/list/1`);
                  }, 1000);
                } else {
                  Swal.fire({
                    icon: "error",
                    text: handleServerValidations(response),
                    ...SWAL_SETTINGS,
                  });
                  setSubmitted(false);
                  globalLoader(false);
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
            setFieldTouched,
            isSubmitting,
          }) => (
            <form onSubmit={handleSubmit}>
              <div className="row row-sm">
                <div className="col-lg-12 col-md-12 animation_fade">
                  <div className="card custom-card">
                    <div className="card-body">
                      <div>
                        <h6 className="main-content-label mb-3">{t("faq.add_faq")}</h6>
                      </div>
                      <div className="row row-sm">

                        <div className="col-lg-6 text-center form-group">
                          <label htmlFor="title_en" className="text-left d-flex cp">
                            {t("faq.list_heading_title_en")} :<span className="requirestar">*</span>
                          </label>
                          <input
                            name="title_en"
                            id="title_en"
                            type="text"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.title_en}
                            className="form-control"
                            placeholder={t("faq.faq_title_placeholder")}
                          />
                          <span className="text-danger d-flex text-left">
                            {errors.title_en && touched.title_en && t(errors.title_en)}
                          </span>
                        </div>

                        <div className="col-lg-6 text-center form-group">
                          <label htmlFor="title_de" className="text-left d-flex cp">
                            {t("faq.list_heading_title_de")} :<span className="requirestar">*</span>
                          </label>
                          <input
                            name="title_de"
                            id="title_de"
                            type="text"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.title_de}
                            className="form-control"
                            placeholder={t("faq.faq_title_placeholder")}
                          />
                          <span className="text-danger d-flex text-left">
                            {errors.title_de && touched.title_de && t(errors.title_de)}
                          </span>
                        </div>

                        <div className="col-lg-6 text-center form-group">
                          <label htmlFor="title_es" className="text-left d-flex cp">
                            {t("faq.list_heading_title_es")} :<span className="requirestar">*</span>
                          </label>
                          <input
                            name="title_es"
                            id="title_es"
                            type="text"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.title_es}
                            className="form-control"
                            placeholder={t("faq.faq_title_placeholder")}
                          />
                          <span className="text-danger d-flex text-left">
                            {errors.title_es && touched.title_es && t(errors.title_es)}
                          </span>
                        </div>

                        <div className="col-lg-6 text-center form-group">
                          <label htmlFor="title_hu" className="text-left d-flex cp">
                            {t("faq.list_heading_title_hu")} :<span className="requirestar">*</span>
                          </label>
                          <input
                            name="title_hu"
                            id="title_hu"
                            type="text"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.title_hu}
                            className="form-control"
                            placeholder={t("faq.faq_title_placeholder")}
                          />
                          <span className="text-danger d-flex text-left">
                            {errors.title_hu && touched.title_hu && t(errors.title_hu)}
                          </span>
                        </div>

                        <div className="col-lg-12 text-center form-group">
                          <label htmlFor="description_en" className="text-left d-flex cp">
                            {t("faq.label_description_en")} :<span className="requirestar">*</span>
                          </label>
                          <CustomCkeditor
                            fieldname={"description_en"}
                            setFieldValue={setFieldValue}
                            value={values.description_en}
                            setFieldTouched={setFieldTouched}
                          />
                          <span className="text-danger d-flex text-left">
                            {errors.description_en &&
                              touched.description_en &&
                              t(errors.description_en)}
                          </span>
                        </div>

                        <div className="col-lg-12 text-center form-group">
                          <label htmlFor="description_de" className="text-left d-flex cp">
                            {t("faq.label_description_de")} :<span className="requirestar">*</span>
                          </label>
                          <CustomCkeditor
                            fieldname={"description_de"}
                            setFieldValue={setFieldValue}
                            value={values.description_de}
                            setFieldTouched={setFieldTouched}
                          />
                          <span className="text-danger d-flex text-left">
                            {errors.description_de &&
                              touched.description_de &&
                              t(errors.description_de)}
                          </span>
                        </div>

                        <div className="col-lg-12 text-center form-group">
                          <label htmlFor="description_es" className="text-left d-flex cp">
                            {t("faq.label_description_es")} :<span className="requirestar">*</span>
                          </label>
                          <CustomCkeditor
                            fieldname={"description_es"}
                            setFieldValue={setFieldValue}
                            value={values.description_es}
                            setFieldTouched={setFieldTouched}
                          />
                          <span className="text-danger d-flex text-left">
                            {errors.description_es &&
                              touched.description_es &&
                              t(errors.description_es)}
                          </span>
                        </div>

                        <div className="col-lg-12 text-center form-group">
                          <label htmlFor="description_hu" className="text-left d-flex cp">
                            {t("faq.label_description_hu")} :<span className="requirestar">*</span>
                          </label>
                          <CustomCkeditor
                            fieldname={"description_hu"}
                            setFieldValue={setFieldValue}
                            value={values.description_hu}
                            setFieldTouched={setFieldTouched}
                          />
                          <span className="text-danger d-flex text-left">
                            {errors.description_hu &&
                              touched.description_hu &&
                              t(errors.description_hu)}
                          </span>
                        </div>

                        <div className="">
                          <button
                            className="btn btn-main-primary signbtn mr-2"
                            type="submit"
                            disabled={submitted ? true : null}
                          >
                            <i className="ace-icon fa fa-check bigger-110 mx-1"></i>
                            {t("btn_submit")}
                          </button>
                          <button
                            className="btn ripple btn-secondary"
                            type="button"
                            disabled={submitted ? true : null}
                            onClick={() => navigate(-1)}
                          >
                            <i className="ace-icon fa fa-times bigger-110 mx-1"></i>
                            {t("btn_cancel")}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}
        </Formik>
      ) : (
        <></>
      )}
    </>
  );
};

export default FAQAdd;
