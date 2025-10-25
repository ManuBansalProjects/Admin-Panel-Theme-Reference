import React, { useEffect, useState } from "react";
import { ErrorMessage, Formik } from "formik";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrums from "../../../common/breadcrumbs";
import { SWAL_SETTINGS } from "../../../../../utils/Constants";
import { globalLoader, handleServerValidations } from "../../../../../utils/commonfunction";
import * as ServicesService from "../../../services/services.services";
import * as Yup from "yup";
import { Tooltip, Whisper, Loader } from "rsuite";
import { useTranslation } from "react-i18next";

const ServiceEdit = (props) => {
  const navigate = useNavigate();
  const params = useParams();
  const [showdefault, setShowDefault] = useState({});
  const [previewimage, setPreviewImage] = useState("");
  const [dataLoaded, setDataLoaded] = useState(false);
  const [saveType, setSaveType] = useState("");
  const { t } = useTranslation()

  const breadcrumbs = [
    { title: t('sidebar_link_dashboard'), url: "/admin/dashboard" },
    { title: t("sidebar_link_banners"), url: "/admin/cms/services/list/1" },
    { title: t("btn_edit"), url: "" },
  ];

  useEffect(() => {
    ServicesService
      .Details(params.id)
      .then((response) => {
        setShowDefault(response && response.data ? response.data : []);
        setPreviewImage(response.data.image);
        setTimeout(() => {
          setDataLoaded(true);
        }, 100);
      })
      .catch((error) => {
        console.log("error=====>", error);
      });
  }, []);

  const validationSchema = Yup.object().shape({
    title_en: Yup.string().required(t("label_title_error")).max(50, t("Max allowed length of characters is 50"))
      .test("no-spaces", t("label_title_error"), (value) => value.trim()),
    title_de: Yup.string().trim().max(50, "Max allowed length of characters is 50").required(t("label_title_error")),
    title_es: Yup.string().trim().max(50, t("Max allowed length of characters is 50")).required(t("label_title_error")),
    title_hu: Yup.string().trim().max(50, t("Max allowed length of characters is 50")).required(t("label_title_error")),
    description_en: Yup.string().trim().max(1000, t("Max allowed length of characters is 1000")).required(t("label_title_error")),
    description_de: Yup.string().trim().max(1000, t("Max allowed length of characters is 1000")).required(t("label_title_error")),
    description_es: Yup.string().trim().max(1000, t("Max allowed length of characters is 1000")).required(t("label_title_error")),
    description_hu: Yup.string().trim().max(1000, t("Max allowed length of characters is 1000")).required(t("label_title_error")),
    // richtext: Yup.string()
    //   .required(t("label_richtext_error"))
    //   .test("no-spaces", t("label_richtext_error"), (value) => value.trim()),
    files: Yup.mixed()
      .required(t("label_image_error"))
      .test("fileType", t("label_image_format_error"), (value) => {
        if (!value) return false;
        if (value.type) {
          const supportedFormats = ["image/jpeg", "image/png", "image/gif"];
          return supportedFormats.includes(value.type);
        } else {
          return true;
        }
      }),
  });

  return (
    <>
      <Breadcrums data={breadcrumbs} />
      {dataLoaded ? (
        <Formik
          enableReinitialize
          initialValues={{
            title_en: showdefault && showdefault.title_en ? showdefault.title_en : "",
            title_de: showdefault && showdefault.title_de ? showdefault.title_de : "",
            title_es: showdefault && showdefault.title_es ? showdefault.title_es : "",
            title_hu: showdefault && showdefault.title_hu ? showdefault.title_hu : "",
            description_en: showdefault && showdefault.description_en ? showdefault.description_en : "",
            description_de: showdefault && showdefault.description_de ? showdefault.description_de : "",
            description_es: showdefault && showdefault.description_es ? showdefault.description_es : "",
            description_hu: showdefault && showdefault.description_hu ? showdefault.description_hu : "",
            files: showdefault && showdefault.image ? showdefault.image : "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            globalLoader(true);
            let formData = new FormData();
            formData.append("o_id", params.id);
            formData.append("title_en", values.title_en);
            formData.append("title_de", values.title_de);
            formData.append("title_es", values.title_es);
            formData.append("title_hu", values.title_hu);
            formData.append("description_en", values.description_en);
            formData.append("description_de", values.description_de);
            formData.append("description_es", values.description_es);
            formData.append("description_hu", values.description_hu);
            formData.append("image", values.files);
            ServicesService
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
                      navigate(`/admin/cms/services/list/${params.pgno}`);
                    }, 1000);
                  }
                  globalLoader(false);
                } else {
                  Swal.fire({
                    icon: "error",
                    text: handleServerValidations(response),
                    ...SWAL_SETTINGS,
                  });
                }
                globalLoader(false);
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
                        <h6 className="main-content-label mb-3">{t("btn_edit") + " " + t("sidebar_link_banners")}</h6>
                      </div>
                      <div className="row row-sm">
                        <div className="col-md-6 text-center form-group">
                          <label htmlFor="title_en" className="text-left d-flex">
                            {t("Title (English)")}: <span className="requirestar">*</span>{" "}
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
                            <ErrorMessage name="title_en" />
                          </span>
                        </div>

                        <div className="col-md-6 text-center form-group">
                          <label htmlFor="title_de" className="text-left d-flex">
                            {t("Title (German)")}:
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
                            {errors.title_de && touched.title_de && errors.title_de}
                          </span>
                        </div>

                        <div className="col-md-6 text-center form-group">
                          <label htmlFor="title_es" className="text-left d-flex">
                            {t("Title (Spanish)")}: <span className="requirestar">*</span>{" "}
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
                            <ErrorMessage name="title_es" />
                          </span>
                        </div>

                        <div className="col-md-6 text-center form-group">
                          <label htmlFor="title_hu" className="text-left d-flex">
                            {t("Title (Hungarian)")}: <span className="requirestar">*</span>{" "}
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
                            <ErrorMessage name={"title_hu"} />
                          </span>
                        </div>

                        <div className="col-md-12 text-center form-group">
                          <label htmlFor="description_en" className="text-left d-flex">
                            {t("Description (English)")}: <span className="requirestar">*</span>{" "}
                          </label>
                          <textarea
                            name="description_en"
                            id="description_en"
                            type="text"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.description_en}
                            className="form-control"
                          />
                          <span className="text-danger d-flex text-left">
                            <ErrorMessage name={"description_en"} />
                          </span>
                        </div>

                        <div className="col-md-12 text-center form-group">
                          <label htmlFor="description_de" className="text-left d-flex">
                            {t("Description (German)")}: <span className="requirestar">*</span>{" "}
                          </label>
                          <textarea
                            name="description_de"
                            id="description_de"
                            type="text"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.description_de}
                            className="form-control"
                          />
                          <span className="text-danger d-flex text-left">
                            <ErrorMessage name={"description_de"} />
                          </span>
                        </div>

                        <div className="col-md-12 text-center form-group">
                          <label htmlFor="description_es" className="text-left d-flex">
                            {t("Description (Spanish)")}: <span className="requirestar">*</span>{" "}
                          </label>
                          <textarea
                            name="description_es"
                            id="description_es"
                            type="text"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.description_es}
                            className="form-control"
                          />
                          <span className="text-danger d-flex text-left">
                            <ErrorMessage name={"description_es"} />
                          </span>
                        </div>

                        <div className="col-md-12 text-center form-group">
                          <label htmlFor="description_hu" className="text-left d-flex">
                            {t("Description (Hungarian)")}: <span className="requirestar">*</span>{" "}
                          </label>
                          <textarea
                            name="description_hu"
                            id="description_hu"
                            type="text"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.description_hu}
                            className="form-control"
                          />
                          <span className="text-danger d-flex text-left">
                            <ErrorMessage name={"description_hu"} />
                          </span>
                        </div>

                        {/* <div className="col-lg-12 text-center form-group">
                          <label htmlFor="subject" className="text-left d-flex">
                            {t("label_description")}:<span className="requirestar">*</span>
                          </label>
                          {dataLoaded ? (
                            <CustomCkeditor
                              fieldname={"richtext"}
                              setFieldValue={setFieldValue}
                              value={values.richtext}
                              setFieldTouched={setFieldTouched}
                            />
                          ) : (
                            ""
                          )}
                          <span className="text-danger d-flex text-left">
                            {errors.richtext &&
                              touched.richtext &&
                              errors.richtext}
                          </span>
                        </div>

                        <div className="col-lg-12 text-center form-group">
                          <label htmlFor="subject" className="text-left d-flex">
                            {t("description_japanese")}:
                          </label>
                          {dataLoaded ? (
                            <CustomCkeditor
                              fieldname={"richtext_de"}
                              setFieldValue={setFieldValue}
                              value={values.richtext_de}
                              setFieldTouched={setFieldTouched}
                            />
                          ) : (
                            ""
                          )}
                        </div> */}

                        <div className="col-lg-12 text-center form-group">
                          <label htmlFor="files" className="text-left d-flex">
                            {t("label_image")}:<span className="requirestar">*</span>
                            <Whisper
                              placement="top"
                              controlId="control-id-hover"
                              trigger="hover"
                              speaker={
                                <Tooltip>Recommended Size (1920x887)</Tooltip>
                              }
                            >
                              <span className="field-more-info mt-1 ms-1 cp">
                                ?
                              </span>
                            </Whisper>
                          </label>
                          <input
                            className="form-control imgInput"
                            id="files"
                            name="files"
                            accept="image/*"
                            type="file"
                            onChange={(event) => {
                              setFieldValue(
                                "files",
                                event.currentTarget.files[0] || ""
                              );
                              event.currentTarget.files.length === 1
                                ? setPreviewImage(
                                  URL.createObjectURL(
                                    event.currentTarget.files[0]
                                  )
                                )
                                : setPreviewImage("");
                            }}
                          />
                          <span
                            className="text-danger d-flex text-left"
                            id="errortext"
                          >
                            {errors.files && touched.files && errors.files}
                          </span>
                        </div>
                        {previewimage ? (
                          <ul className="question-image-preview questions-ul">
                            <li className="pr_img_box">
                              <img
                                src={previewimage}
                                style={{ height: "100px" }}
                                alt={"img"}
                              />
                              <div className="img_options">
                                <button type="button" className="text-danger"
                                  onClick={() => {
                                    // console.log(previewResImage , previewimage)
                                    setPreviewImage("");
                                    setFieldValue("image", null);
                                    document.getElementById("files").value = ""
                                  }}>
                                  <i className="ri-delete-bin-6-fill"></i>
                                </button>
                              </div>
                            </li>
                          </ul>
                        ) : (
                          ""
                        )}

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
                      {/* // : "Loader"} */}
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

export default ServiceEdit;
