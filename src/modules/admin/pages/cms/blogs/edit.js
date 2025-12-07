import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Breadcrums from "../../../common/breadcrumbs";
import CustomCkeditor from "../../../common/customeditor";
import * as blogServices from "../../../services/blogs.services";
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

const BlogEdit = () => {
  const navigate = useNavigate();
   const params = useParams();
  const { t } = useTranslation()
  const [submitted, setSubmitted] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [initialValues, setInitialValues] = useState({});
  const [previewimage, setPreviewImage] = useState('');

  const breadcrumbs = [
    { title: t("sidebar_link_dashboard"), url: "/admin/dashboard" },
    { title: 'Blogs', url: "/admin/cms/blogs/list/1" },
    { title: 'Blog Edit', url: "" },
  ];

  useEffect(() => {
    blogServices.Details(params.id)
    .then((data) => {
        setInitialValues(data && data.data ? data.data : []);
        setPreviewImage(data.data.image);
        setTimeout(() => {
          setDataLoaded(true);
        }, 100);
      })
      .catch((error) => {
        console.log("error=====>", error);
      });
  
  }, []);


  const validationSchema = Yup.object().shape({
  title: Yup.string()
    .trim()
    .required("Title is required")
    .max(INPUT_LENGTH_50, `Maximum ${INPUT_LENGTH_50} characters allowed`)
    .concat(COMMON_INPUT_VALIDATION),

  description: Yup.string()
    .trim()
    .required("Description is required")
    .max(INPUT_LENGTH_50, `Maximum ${INPUT_LENGTH_50} characters allowed`)
    .concat(COMMON_INPUT_VALIDATION),

  image: Yup.mixed()
    .required("Image is required"),
});

  return (
    <>
      <Breadcrums data={breadcrumbs} />
      {dataLoaded ? (
        <Formik
          initialValues={initialValues}
          validateOnBlur={false}
          validationSchema={validationSchema}
          // validate={(values) => {
          //   const error = {};
          //   if (!values.title || !values.title.trim())
          //     error.title = t("label_title_error");
          //   if (values.title.length > INPUT_LENGTH_50)
          //     error.title = DT(t("validation_err_reached_maximum_length"), [INPUT_LENGTH_50]);
            
          //   if (!values.description || !values.description.trim())
          //     error.description = t("label_title_error");
          //   if (values.description.length > INPUT_LENGTH_50)
          //     error.description = DT(t("validation_err_reached_maximum_length"), [INPUT_LENGTH_50]);

          //   if (!values.image)
          //     error.image = 'Image is required';
           
          //   return error;
          // }}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            setSubmitted(true);
            globalLoader(true);
            console.log(values);
            let formData = new FormData();
            formData.append("o_id", params.id);
            formData.append("title", values.title);
            formData.append("description", values.description);
            formData.append("is_blog_of_the_day", values.is_blog_of_the_day);
            formData.append("image", values.image);
            
            blogServices
              .Edit(formData)
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
                    navigate(`/admin/cms/blogs/list/1`);
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
                        <h6 className="main-content-label mb-3">Edit Blog</h6>
                      </div>
                      <div className="row row-sm">
                     

                        <div className="col-lg-6 text-center form-group">
                          <label htmlFor="title" className="text-left d-flex">
                            Title:<span className="requirestar">*</span>
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
                            name="title"
                            id="title"
                            type="text"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.title}
                            className="form-control"
                          />
                          <span className="text-danger d-flex text-left">
                            {errors.title && touched.title && t(errors.title)}
                          </span>
                        </div>

                        <div className="col-lg-6 text-center form-group">
                          <label htmlFor="description" className="text-left d-flex">
                            Description:<span className="requirestar">*</span>
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
                            name="description"
                            id="description"
                            type="text"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.description}
                            className="form-control"
                          />
                          <span className="text-danger d-flex text-left">
                            {errors.description && touched.description && t(errors.description)}
                          </span>
                        </div>

                        <div className="col-lg-6 text-center form-group">
                          <label htmlFor="image" className="text-left d-flex">
                            Upload Image:
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
                            id="image"
                            name="image"
                            accept="image/*"
                            type="file"
                            onChange={(event) => {
                              setFieldValue(
                                "image",
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
                            {errors.image &&
                              touched.image &&
                              errors.image}
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

                         <div className="col-lg-6 text-center form-group">
                          <label htmlFor="description" className="text-left d-flex">
                            Is Blog of the Day:
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
                            <div className="select-down-arrow">
                              <select
                                name="is_blog_of_the_day"
                                id="is_blog_of_the_day"
                                type="text"
                                onChange={(event)=> {handleChange(event); }}
                                onBlur={handleBlur}
                                value={values.is_blog_of_the_day}
                                className="form-control"
                              >
                                <option value='true'>True</option>
                                <option value='false'>False</option>
                              </select>
                            </div>
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

export default BlogEdit;
