import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Breadcrums from "../../../common/breadcrumbs";
import CustomCkeditor from "../../../common/customeditor";
import * as pageServices from "../../../services/pages.services";
import { SWAL_SETTINGS, MENU_LOCATION, showFilterlist, INPUT_LENGTH_50, INPUT_LENGTH_100, FOOTER_LOCATION } from "../../../../../utils/Constants";
import {
  DT,
  globalLoader,
  handleServerValidations,
} from "../../../../../utils/commonfunction";
import { Tooltip, Whisper } from "rsuite";
import { useTranslation } from "react-i18next";
import { COMMON_INPUT_VALIDATION } from "../../../../../utils/commonValidations";
import * as Yup from "yup";
const PageAdd = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { t } = useTranslation()
  const [submitted, setSubmitted] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [initialValues, setInitialValues] = useState({
    title_en: "",
    title_de: "",
    title_es: "",
    title_hu: "",
    name: "",
    slug: "",
    short_description_en: "",
    short_description_de: "",
    short_description_es: "",
    short_description_hu: "",
    meta_tags: "",
    meta_keyword: "",
    menu_location: "",
    footer_location: "",
    description_en: "",
    description_de: "",
    description_es: "",
    description_hu: "",
  });

  const breadcrumbs = [
    { title: t("sidebar_link_dashboard"), url: "/admin/dashboard" },
    { title: t("sidebar_link_pages"), url: "/admin/cms/pages/list/1" },
    { title: t("link_add"), url: "" },
  ];

  useEffect(() => {
    setInitialValues({
      title_en: state && state?.title_en ? state?.title_en : "",
      title_de: state && state?.title_de ? state?.title_de : "",
      title_es: state && state?.title_es ? state?.title_es : "",
      title_hu: state && state?.title_hu ? state?.title_hu : "",
      slug: state && state?.slug ? state?.slug : "",
      status: state && state?.status ? state.status : "",
      menu_location: state && state?.menu_location ? state.menu_location : "",
      footer_location: state && state?.footer_location ? state.footer_location : "",
      short_description_en: state && state?.short_description_en ? state?.short_description_en : "",
      short_description_de: state && state?.short_description_de ? state?.short_description_de : "",
      short_description_es: state && state?.short_description_es ? state?.short_description_es : "",
      short_description_hu: state && state?.short_description_hu ? state?.short_description_hu : "",
      description_en: state && state?.description_en ? state?.description_en : "",
      description_de: state && state?.description_de ? state?.description_en : "",
      description_es: state && state?.description_es ? state?.description_en : "",
      description_hu: state && state?.description_hu ? state?.description_en : "",

    });
    setDataLoaded(true);
  }, []);

  const validationSchema = Yup.object().shape({
    title: Yup.string().trim()
      .concat(COMMON_INPUT_VALIDATION)
  })

  return (
    <>
      <Breadcrums data={breadcrumbs} />
      {dataLoaded ? (
        <Formik
          initialValues={initialValues}
          validateOnBlur={false}
          validationSchema={validationSchema}
          validate={(values) => {
            const error = {};
            if (!values.title_en || !values.title_en.trim())
              error.title_en = t("label_title_error");
            if (values.title_en.length > INPUT_LENGTH_50)
              error.title_en = DT(t("validation_err_reached_maximum_length"), [INPUT_LENGTH_50]);
            if (!values.title_de || !values.title_de.trim())
              error.title_de = t("label_title_error");
            if (values.title_de.length > INPUT_LENGTH_50)
              error.title_de = DT(t("validation_err_reached_maximum_length"), [INPUT_LENGTH_50]);
            if (!values.title_es || !values.title_es.trim())
              error.title_es = t("label_title_error");
            if (values.title_es.length > INPUT_LENGTH_50)
              error.title_es = DT(t("validation_err_reached_maximum_length"), [INPUT_LENGTH_50]);
            if (!values.title_hu || !values.title_hu.trim())
              error.title_hu = t("label_title_error");
            if (values.title_hu.length > INPUT_LENGTH_50)
              error.title_hu = DT(t("validation_err_reached_maximum_length"), [INPUT_LENGTH_50]);
            if (!values.slug || !values.slug.trim())
              error.slug = t("label_slug_error");
            if (values.slug.length > INPUT_LENGTH_50)
              error.slug = DT(t("validation_err_reached_maximum_length"), [INPUT_LENGTH_50]);
            const slugPattern = /^[a-zA-Z0-9-_]+$/;
            if (values.slug && !slugPattern.test(values.slug)) {
              error.slug = t("validation_err_invalid_slug");
            }
            if (!values.status)
              error.status = t("validation_err_status_required");
            if (!values.menu_location)
              error.menu_location = t("validation_err_menu_location");
            if (values.menu_location === "footer" && !values.footer_location)
              error.footer_location = "validation_err_footer_location";
            if (!values.short_description_en || !values.short_description_en.trim())
              error.short_description_en = t("label_short_description_error");
            if (!values.short_description_de || !values.short_description_de.trim())
              error.short_description_de = t("label_short_description_error");
            if (!values.short_description_es || !values.short_description_es.trim())
              error.short_description_es = t("label_short_description_error");
            if (!values.short_description_hu || !values.short_description_hu.trim())
              error.short_description_hu = t("label_short_description_error");
            if (!values.description_en || !values.description_en.trim())
              error.description_en = t("label_long_description_error");
            if (!values.description_de || !values.description_de.trim())
              error.description_de = t("label_long_description_error");
            if (!values.description_es || !values.description_es.trim())
              error.description_es = t("label_long_description_error");
            if (!values.description_hu || !values.description_hu.trim())
              error.description_hu = t("label_long_description_error");

            return error;
          }}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            setSubmitted(true);
            globalLoader(true);
            console.log(values);
            let formData = new FormData();
            formData.append("title_en", values.title_en);
            formData.append("title_de", values.title_de);
            formData.append("title_es", values.title_es);
            formData.append("title_hu", values.title_hu);
            formData.append("slug", values.slug);
            formData.append("status", Number(values.status));
            formData.append("menu_location", values.menu_location);
            formData.append("footer_location", values.footer_location);
            formData.append("short_description_en", values.short_description_en);
            formData.append("short_description_de", values.short_description_de);
            formData.append("short_description_es", values.short_description_es);
            formData.append("short_description_hu", values.short_description_hu);
            formData.append("description_en", values.description_en);
            formData.append("description_de", values.description_de);
            formData.append("description_es", values.description_es);
            formData.append("description_hu", values.description_hu);
            pageServices
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
                    navigate(`/admin/cms/pages/list/1`);
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
                        <h6 className="main-content-label mb-3">{t("add_cms")}</h6>
                      </div>
                      <div className="row row-sm">
                        {/* <div className="col-lg-6 text-center form-group">
                          <label htmlFor="name" className="text-left d-flex">
                          {t("label_name")}:
                            <Whisper
                              placement="top"
                              controlId="control-id-hover"
                              trigger="hover"
                              speaker={
                                <Tooltip>Page Name - Backend Only</Tooltip>
                              }
                            >
                              <span className="field-more-info mt-1 ms-1 cp">
                                ?
                              </span>
                            </Whisper>
                          </label>
                          <input
                            name="name"
                            id="name"
                            type="text"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.name}
                            className="form-control"
                          />
                        </div> */}

                        <div className="col-lg-6 text-center form-group">
                          <label htmlFor="title_en" className="text-left d-flex">
                            {t("label_page_title_en")}:<span className="requirestar">*</span>
                            <Whisper
                              placement="top"
                              controlId="control-id-hover"
                              trigger="hover"
                              speaker={
                                <Tooltip>
                                  {t("tooltip_page_title")}
                                </Tooltip>
                              }
                            >
                              <span className="field-more-info mt-1 ms-1 cp">
                                ?
                              </span>
                            </Whisper>
                          </label>
                          <input
                            name="title_en"
                            id="title_en"
                            type="text"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.title_en}
                            className="form-control"
                          />
                          <span className="text-danger d-flex text-left">
                            {errors.title_en && touched.title_en && t(errors.title_en)}
                          </span>
                        </div>

                        <div className="col-lg-6 text-center form-group">
                          <label htmlFor="title_de" className="text-left d-flex">
                            {t("label_page_title_de")}:<span className="requirestar">*</span>
                            <Whisper
                              placement="top"
                              controlId="control-id-hover"
                              trigger="hover"
                              speaker={
                                <Tooltip>
                                  {t("tooltip_page_title")}
                                </Tooltip>
                              }
                            >
                              <span className="field-more-info mt-1 ms-1 cp">
                                ?
                              </span>
                            </Whisper>
                          </label>
                          <input
                            name="title_de"
                            id="title_de"
                            type="text"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.title_de}
                            className="form-control"
                          />
                          <span className="text-danger d-flex text-left">
                            {errors.title_de && touched.title_de && t(errors.title_de)}
                          </span>
                        </div>

                        <div className="col-lg-6 text-center form-group">
                          <label htmlFor="title_es" className="text-left d-flex">
                            {t("label_page_title_es")}:<span className="requirestar">*</span>
                            <Whisper
                              placement="top"
                              controlId="control-id-hover"
                              trigger="hover"
                              speaker={
                                <Tooltip>
                                  {t("tooltip_page_title")}
                                </Tooltip>
                              }
                            >
                              <span className="field-more-info mt-1 ms-1 cp">
                                ?
                              </span>
                            </Whisper>
                          </label>
                          <input
                            name="title_es"
                            id="title_es"
                            type="text"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.title_es}
                            className="form-control"
                          />
                          <span className="text-danger d-flex text-left">
                            {errors.title_es && touched.title_es && t(errors.title_es)}
                          </span>
                        </div>

                        <div className="col-lg-6 text-center form-group">
                          <label htmlFor="title_hu" className="text-left d-flex">
                            {t("label_page_title_hu")}:<span className="requirestar">*</span>
                            <Whisper
                              placement="top"
                              controlId="control-id-hover"
                              trigger="hover"
                              speaker={
                                <Tooltip>
                                  {t("tooltip_page_title")}
                                </Tooltip>
                              }
                            >
                              <span className="field-more-info mt-1 ms-1 cp">
                                ?
                              </span>
                            </Whisper>
                          </label>
                          <input
                            name="title_hu"
                            id="title_hu"
                            type="text"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.title_hu}
                            className="form-control"
                          />
                          <span className="text-danger d-flex text-left">
                            {errors.title_hu && touched.title_hu && t(errors.title_hu)}
                          </span>
                        </div>


                        <div className="col-lg-6 text-center form-group">
                          <label htmlFor="slug" className="text-left d-flex">
                            {t("label_slug_of_page")}:<span className="requirestar">*</span>
                          </label>
                          <input
                            name="slug"
                            id="slug"
                            type="text"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.slug}
                            className="form-control"
                          />
                          <span className="text-danger d-flex text-left">
                            {errors.slug && touched.slug && errors.slug}
                          </span>
                        </div>

                        <div className="col-md-6 text-center form-group">
                          <label htmlFor="status" className="text-left d-flex">
                            {t("list_heading_status")}:
                            <span className="requirestar">*</span>{" "}
                          </label>
                          <div className=" select-down-arrow">
                            <select
                              name="status"
                              id="status"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.status}
                              className="form-control" >

                              {/* <option value="">{t("input_select_text")}</option> */}
                              {(showFilterlist).map((value, i) => {
                                return (
                                  <option key={i} value={value.status__id}>{t(`${value.name}`)}</option>
                                )
                              })}
                            </select>
                          </div>
                          <span className="text-danger d-flex text-left">
                            {errors.status &&
                              touched.status &&
                              errors.status}
                          </span>
                        </div>

                        <div className="col-md-6 text-center form-group">
                          <label htmlFor="menu_location" className="text-left d-flex">
                            {t("label_menu_of_the_page")}:
                            <span className="requirestar">*</span>{" "}
                          </label>
                          <div className=" select-down-arrow">
                            <select
                              name="menu_location"
                              id="menu_location"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.menu_location}
                              className="form-control" >

                              <option value="">{t("input_select_text")}</option>
                              {Object.keys(MENU_LOCATION).map((key, i) => {
                                return (
                                  <option key={i} value={MENU_LOCATION[key]}>{t(`${key}`)}</option>
                                )
                              })}
                            </select>
                          </div>
                          <span className="text-danger d-flex text-left">
                            {errors.menu_location &&
                              touched.menu_location &&
                              errors.menu_location}
                          </span>
                        </div>

                        {values.menu_location === "footer" &&
                          <div className="col-md-6 text-center form-group">
                            <label htmlFor="footer_location" className="text-left d-flex">
                              {t("label_location_of_the_footer")}:
                              <span className="requirestar">*</span>{" "}
                            </label>
                            <div className=" select-down-arrow">
                              <select
                                name="footer_location"
                                id="footer_location"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.footer_location}
                                className="form-control cp" >

                                <option value="">{t("input_select_text")}</option>
                                {Object.keys(FOOTER_LOCATION).map((key, i) => {
                                  return (
                                    <option key={i} value={FOOTER_LOCATION[key]}>{t(`${key}`)}</option>
                                  )
                                })}
                              </select>
                            </div>
                            <span className="text-danger d-flex text-left">
                              {errors.footer_location &&
                                touched.footer_location &&
                                t(errors.footer_location)}
                            </span>
                          </div>
                        }

                        {/* <div className="col-lg-12 text-center form-group required">
                          <label
                            htmlFor="meta_tags"
                            className="text-left d-flex"
                          >
                             {t("meta_tags")}:{" "}
                          </label>
                          <textarea
                            name="meta_tags"
                            id="meta_tags"
                            rows="2"
                            type="text"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.meta_tags}
                            className="form-control"
                          />
                        </div> */}
                        {/* <div className="col-lg-12 text-center form-group required">
                          <label
                            htmlFor="meta_keyword"
                            className="text-left d-flex"
                          >
                             {t("meta_keywords")}:{" "}
                          </label>
                          <textarea
                            name="meta_keyword"
                            id="meta_keyword"
                            rows="2"
                            type="text"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.meta_keyword}
                            className="form-control"
                          />
                        </div> */}

                        <div className="col-lg-12 text-center form-group required">
                          <label htmlFor="short_description_en" className="text-left d-flex" >
                            {t("label_short_description_en")}:
                            <span className="requirestar">*</span>{" "}
                          </label>
                          <textarea
                            name="short_description_en"
                            id="short_description_en"
                            rows="2"
                            type="text"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.short_description_en}
                            className="form-control"
                          />
                          <span className="text-danger d-flex text-left">
                            {errors.short_description_en &&
                              touched.short_description_en &&
                              errors.short_description_en}
                          </span>
                        </div>

                        <div className="col-lg-12 text-center form-group required">
                          <label htmlFor="short_description_de" className="text-left d-flex" >
                            {t("label_short_description_de")}:
                            <span className="requirestar">*</span>{" "}
                          </label>
                          <textarea
                            name="short_description_de"
                            id="short_description_de"
                            rows="2"
                            type="text"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.short_description_de}
                            className="form-control"
                          />
                          <span className="text-danger d-flex text-left">
                            {errors.short_description_de &&
                              touched.short_description_de &&
                              errors.short_description_de}
                          </span>
                        </div>

                        <div className="col-lg-12 text-center form-group required">
                          <label htmlFor="short_description_es" className="text-left d-flex" >
                            {t("label_short_description_es")}:
                            <span className="requirestar">*</span>{" "}
                          </label>
                          <textarea
                            name="short_description_es"
                            id="short_description_es"
                            rows="2"
                            type="text"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.short_description_es}
                            className="form-control"
                          />
                          <span className="text-danger d-flex text-left">
                            {errors.short_description_es &&
                              touched.short_description_es &&
                              errors.short_description_es}
                          </span>
                        </div>

                        <div className="col-lg-12 text-center form-group required">
                          <label htmlFor="short_description_hu" className="text-left d-flex" >
                            {t("label_short_description_hu")}:
                            <span className="requirestar">*</span>{" "}
                          </label>
                          <textarea
                            name="short_description_hu"
                            id="short_description_hu"
                            rows="2"
                            type="text"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.short_description_hu}
                            className="form-control"
                          />
                          <span className="text-danger d-flex text-left">
                            {errors.short_description_hu &&
                              touched.short_description_hu &&
                              errors.short_description_hu}
                          </span>
                        </div>

                        <div className="col-lg-12 text-center form-group">
                          <label htmlFor="description_en" className="text-left d-flex">
                            {t("label_long_description_en")}:<span className="requirestar">*</span>
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
                              errors.description_en}
                          </span>
                        </div>

                        <div className="col-lg-12 text-center form-group">
                          <label htmlFor="description_de" className="text-left d-flex">
                            {t("label_long_description_de")}:<span className="requirestar">*</span>
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
                              errors.description_de}
                          </span>
                        </div>

                        <div className="col-lg-12 text-center form-group">
                          <label htmlFor="description_es" className="text-left d-flex">
                            {t("label_long_description_es")}:<span className="requirestar">*</span>
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
                              errors.description_es}
                          </span>
                        </div>

                        <div className="col-lg-12 text-center form-group">
                          <label htmlFor="description_hu" className="text-left d-flex">
                            {t("label_long_description_hu")}:<span className="requirestar">*</span>
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
                              errors.description_hu}
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
                          <butthu
                            className="btn ripplehutn-secondary"
                            type="button"
                            disabled={submitted ? true : null}
                            onClick={() => navigate(-1)}
                          >
                            <i className="ace-icon fa fa-times bigger-110 mx-1"></i>
                            {t("btn_cancel")}
                          </butthu>
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

export default PageAdd;
