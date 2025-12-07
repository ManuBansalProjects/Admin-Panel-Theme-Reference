import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrums from "../../common/breadcrumbs";
import { SWAL_SETTINGS } from "../../../../utils/Constants";
import {
  globalLoader,
  handleServerValidations,
} from "../../../../utils/commonfunction";
import * as TestimonialService from "../../services/testimonial.services";
import * as Yup from "yup";
import CustomError from "../../../../utils/customError";
import { useTranslation } from "react-i18next";

const TestimonialEdit = (props) => {
  const navigate = useNavigate();
  const params = useParams();
  const { t } = useTranslation();
  const [showdefault, setShowDefault] = useState({});
  const [previewimage, setPreviewImage] = useState("");
  // const [previewimage, setPreviewImage] = useState("");
  // const [setPreviewResImage] = useState([]);
  const [saveType, setSaveType] = useState("");
  const breadcrumbs = [
    { title: t("sidebar_link_dashboard"), url: "/admin/dashboard" },
    {
      title: t("sidebar_link_testimonial"),
      url: "/admin/cms/testimonials/list/1",
    },
    { title: t("btn_edit"), url: "" },
  ];

  useEffect(() => {
    TestimonialService.Details(params.id)
      .then((response) => {
        setShowDefault(response && response.data ? response?.data : []);
        setPreviewImage(response?.data?.profile_image);
        // setPreviewResImage(response?.data?.images);
      })
      .catch((error) => {
        console.log("error=====>", error);
      });
  }, [params.id]);



  // function getImageUrl(image) {
  //   if (typeof image === "string") {
  //     return image;
  //   } else {
  //     return URL.createObjectURL(image);
  //   }
  // }

  // function handleDeleteImage(ind, image) {
  //   let images = [...formik.values.images];
  //   images.splice(ind, 1);
  //   formik.setFieldValue("images", images);
  //   if (typeof image === "string") {
  //     let dFiles = [...deletedFiles];
  //     dFiles.push(image);
  //     setDeletedFiles(dFiles);
  //   }
  // }

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t("label_name_error"))
      .test("no-spaces", "label_name_error", (value) => value.trim()),
    testimonial_text: Yup.string().trim().required(t("label_testimonial_error")),
    address: Yup.string().trim().required(t("label_address_error")),
    city: Yup.string().trim().required(t("label_city_error")),
    country: Yup.string().trim().required(t("label_country_error")),
    rating: Yup.number()
      .min(1, t("validation_error_rating_min_1"))
      .max(5, t("validation_error_rating_max_5"))
      .required(t("validate_error_rating")),
      profile_image: Yup.string().required(t("validation_error_profile_img_required")),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name:
        showdefault && showdefault.name ? showdefault.name : "",

        address: showdefault && showdefault.address ? showdefault.address : "",

      profile_image:
        showdefault && showdefault.profile_image
          ? showdefault.profile_image
          : "",
      testimonial_text:
        showdefault && showdefault.testimonial_text
          ? showdefault.testimonial_text
          : "",
      city: showdefault && showdefault.city ? showdefault.city : "",
      country: showdefault && showdefault.country ? showdefault.country : "",
      rating: showdefault && showdefault.rating ? showdefault.rating : "",
    },
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      globalLoader(true);
      let formData = new FormData();
      formData.append("o_id", params.id);
      formData.append("name", values.name);
      if (typeof values.profile_image === "object") {
        formData.append("profile_image", values.profile_image);
      } else if (values.profile_image === false) {
        formData.append("profile_image", false);
      }
      formData.append("address", values.address);
      formData.append("testimonial_text", values.testimonial_text);
      formData.append("city", values.city);
      formData.append("country", values.country);
      formData.append("rating", values.rating);

      TestimonialService.Edit(formData)
        .then((response) => {
          setSubmitting(false);
          if (response.success) {
            Swal.fire({
              icon: "success",
              text: response.message,
              ...SWAL_SETTINGS,
            });
            globalLoader(false);
            if (saveType !== "Save") {
              navigate(`/admin/cms/testimonials/list/1`);
            }
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
          Swal.fire({
            icon: "error",
            text: handleServerValidations(error),
            ...SWAL_SETTINGS,
          });
          console.log("error ====> ", error);
        });
    },
  });
  return (
    <>
      <Breadcrums data={breadcrumbs} />
      <form onSubmit={formik.handleSubmit}>
        <div className="row row-sm">
          <div className="col-lg-12 col-md-12 animation_fade">
            <div className="card custom-card">
              <div className="card-body">
                <div>
                  <h6 className="main-content-label mb-3">
                    {t("btn_edit")} {t("sidebar_link_testimonial")}
                  </h6>
                </div>
                <div className="row row-sm">
                  <div className="col-md-6 text-center form-group">
                    <label htmlFor="name" className="text-left d-flex">
                      {t("label_name")}
                      <span className="requirestar">*</span>{" "}
                    </label>
                    <input
                      name="name"
                      id="name"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.name}
                      className="form-control"
                    />
                    <span className="text-danger d-flex text-left">
                      <CustomError name="name" form={formik} />
                    </span>
                  </div>

                  <div className="col-md-6 text-center form-group">
                    <label htmlFor="address" className="text-left d-flex">
                      {t("label_address")}:
                      <span className="requirestar">*</span>{" "}
                    </label>
                    <input
                      name="address"
                      id="address"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.address}
                      className="form-control"
                    />
                    <span className="text-danger d-flex text-left">
                      <CustomError name="address" form={formik} />
                    </span>
                  </div>

                  <div className="col-md-6 text-center form-group">
                    <label htmlFor="city" className="text-left d-flex">
                      {t("label_city")}:<span className="requirestar">*</span>{" "}
                    </label>
                    <input
                      name="city"
                      id="city"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.city}
                      className="form-control"
                    />
                    <span className="text-danger d-flex text-left">
                      <CustomError name="city" form={formik} />
                    </span>
                  </div>

                  <div className="col-md-6 text-center form-group">
                    <label htmlFor="country" className="text-left d-flex">
                      {t("label_country")}:
                      <span className="requirestar">*</span>{" "}
                    </label>
                    <input
                      name="country"
                      id="country"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.country}
                      className="form-control"
                    />
                    <span className="text-danger d-flex text-left">
                      <CustomError name="country" form={formik} />
                    </span>
                  </div>

                  <div className="col-md-6 text-center form-group">
                    <label htmlFor="rating" className="text-left d-flex">
                      {t("label_rating_1_to_5")}:
                      <span className="requirestar">*</span>{" "}
                    </label>
                    <input
                      name="rating"
                      id="rating"
                      type="number"
                      min="1"
                      max="5"
                      step="1"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.rating}
                      className="form-control"
                    />
                    <span className="text-danger d-flex text-left">
                      <CustomError name="rating" form={formik} />
                    </span>
                  </div>

                  <div className="col-md-6 text-center form-group">
                    <label
                      htmlFor="testimonial_text"
                      className="text-left d-flex"
                    >
                      {t("sidebar_link_testimonial")} {t("label_text")}:
                      <span className="requirestar">*</span>{" "}
                    </label>
                    <textarea
                      name="testimonial_text"
                      id="testimonial_text"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.testimonial_text}
                      className="form-control"
                    />
                    <span className="text-danger d-flex text-left">
                      <CustomError name="testimonial_text" form={formik} />
                    </span>
                  </div>

                  <div className="col-lg-6 text-center form-group">
                    <label htmlFor="profile_image" className="text-left d-flex">
                      {t("label_profile_picture")}:
                    </label>
                    <input
                      className="form-control imgInput"
                      id="profile_image"
                      name="profile_image"
                      accept="image/*"
                      type="file"
                      onChange={(event) => {
                        formik.setFieldValue(
                          "profile_image",
                          event.target.files[0] || ""
                        );
                        event.target.files.length === 1
                          ? setPreviewImage(
                            URL.createObjectURL(event.target.files[0])
                          )
                          : setPreviewImage(URL.createObjectURL(""));
                      }}
                    />
                    <span className="text-danger d-flex text-left">
                      <CustomError name="profile_image" form={formik} />
                    </span>

                    {previewimage ? (
                      <ul className="question-image-preview questions-ul">
                        <li className="pr_img_box">
                          <img
                            src={previewimage}
                            style={{ height: "100px" }}
                            alt={"profileImg"}
                          />
                          <div className="img_options">
                            <button
                              type="button"
                              onClick={() => {
                                setPreviewImage("");
                                formik.setFieldValue("profile_image", false);
                              }}
                              className="text-danger"
                            >
                              <i className="ri-delete-bin-6-fill"></i>
                            </button>
                          </div>
                        </li>
                      </ul>
                    ) : (
                      ""
                    )}
                  </div>

                  <div className="mt-5">
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
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default TestimonialEdit;
