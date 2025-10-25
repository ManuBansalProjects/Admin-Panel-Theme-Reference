import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Breadcrums from "../../../common/breadcrumbs";
// import Loader from "../../../common/loader";
import CustomCkeditor from "../../../common/customeditor";
import * as faqServices from "../../../services/faq.services";
import {
  globalLoader,
  handleServerValidations,
} from "../../../../../utils/commonfunction";
import { SWAL_SETTINGS, INPUT_LENGTH_500 } from "../../../../../utils/Constants";
import { Tooltip, Whisper, Loader } from "rsuite";
import { useTranslation } from "react-i18next";
import { COMMON_INPUT_VALIDATION } from "../../../../../utils/commonValidations";
import * as Yup from "yup";

const FAQEdit = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [showdefault, setShowDefault] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);
  const [saveType, setSaveType] = useState("");
  const { t } = useTranslation()

  const breadcrumbs = [
    { title: t("faq.link_dashboard"), url: "/admin/dashboard" },
    { title: t("faq.link_faq"), url: "/admin/cms/faq/list/1" },
    { title: t("faq.link_edit"), url: "" },
  ];

  useEffect(() => {
    faqServices
      .Details(params.id)
      .then((data) => {
        setShowDefault(data && data?.data ? data.data : []);
        setTimeout(() => {
          setDataLoaded(true);
        }, 100);
      })
      .catch((error) => {
        console.log("error=====>", error);
      });
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
      {dataLoaded ? (<Formik
        enableReinitialize
        initialValues={{
          title_en: showdefault && showdefault.title_en ? showdefault.title_en : "",
          description_en: showdefault && showdefault.description_en ? showdefault.description_en : "",
          title_de: showdefault && showdefault.title_de ? showdefault.title_de : "",
          description_de: showdefault && showdefault.description_de ? showdefault.description_de : "",
          title_es: showdefault && showdefault.title_es ? showdefault.title_es : "",
          description_es: showdefault && showdefault.description_es ? showdefault.description_es : "",
          title_hu: showdefault && showdefault.title_hu ? showdefault.title_hu : "",
          description_hu: showdefault && showdefault.description_hu ? showdefault.description_hu : "",
        }}
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
          globalLoader(true);
          let formData = new FormData();
          formData.append("o_id", params.id);
          formData.append("title_en", values.title_en);
          formData.append("description_en", values.description_en);
          formData.append("title_de", values.title_de);
          formData.append("description_de", values.description_de);
          formData.append("title_es", values.title_es);
          formData.append("description_es", values.description_es);
          formData.append("title_hu", values.title_hu);
          formData.append("description_hu", values.description_hu);
          faqServices
            .Edit(formData)
            .then((response) => {
              setSubmitting(false);
              if (response.success) {
                Swal.fire({
                  icon: "success",
                  text: response.message,
                  ...SWAL_SETTINGS,
                });
                if (saveType !== "Save") {
                  setTimeout(() => {
                    resetForm({ values: "" });
                    globalLoader(false);
                    navigate(`/admin/cms/faq/list/1`);
                  }, 1000);
                }
                if (saveType === "Save") {
                  setTimeout(() => {
                    globalLoader(false);
                  }, 1000);
                }
              } else {
                Swal.fire({
                  icon: "error",
                  text: handleServerValidations(response),
                  ...SWAL_SETTINGS,
                });
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
                      <h6 className="main-content-label mb-3">{t("faq.edit_faq")}</h6>
                    </div>
                    {showdefault && Object.keys(showdefault).length > 0 ? (
                      <div className="row row-sm">

                        <div className="col-lg-6 text-center form-group">
                          <label htmlFor="title_en" className="text-left d-flex cp">
                            {t("faq.list_heading_title")} (English):<span className="requirestar">*</span>
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
                            {t("faq.list_heading_title")} (German):<span className="requirestar">*</span>
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
                            {t("faq.list_heading_title")} (Spanish):<span className="requirestar">*</span>
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
                            {t("faq.list_heading_title")} (Hungarian):<span className="requirestar">*</span>
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
                            onClick={() => {
                              setSaveType("Save");
                            }}
                            className="btn btn-info mr-2"
                            type="submit"
                          >
                            <i className="ace-icon fa fa-check bigger-110 mx-1"></i>
                            {t("btn_save")}
                          </button>
                          <button
                            onClick={() => {
                              setSaveType("");
                            }}
                            className="btn btn-success mr-2"
                            type="submit"
                          >
                            <i className="ace-icon fa fa-check bigger-110 mx-1"></i>
                            {t("btn_save_exit")}
                          </button>
                          <button
                            className="btn ripple btn-secondary"
                            type="button"
                            onClick={() => navigate(-1)}
                          >
                            <i className="ace-icon fa fa-times bigger-110 mx-1"></i>
                            {t("btn_cancel")}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <Loader />
                    )}
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

export default FAQEdit;
