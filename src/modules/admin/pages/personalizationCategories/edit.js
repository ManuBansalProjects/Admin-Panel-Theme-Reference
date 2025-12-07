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
import * as PersonalizationCategoriesService from "../../services/personalizationCategories.services";
import * as Yup from "yup";
import CustomError from "../../../../utils/customError";
import { useTranslation } from "react-i18next";

const PersonalizationCategoryEdit = (props) => {
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
      title: 'Personalization Feeds',
      url: "/admin/personalization-categories/list/1",
    },
    { title: t("btn_edit"), url: "" },
  ];

  useEffect(() => {
    PersonalizationCategoriesService.Details(params.id)
      .then((response) => {
        setShowDefault(response && response.data ? response?.data : []);
        // setPreviewImage(response?.data?.profile_image);
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
    category_name: Yup.string().required('Category is required')
      .test("no-spaces", "label_name_error", (value) => value.trim()),
    // testimonial_text: Yup.string().trim().required(t("label_testimonial_error")),
    // address: Yup.string().trim().required(t("label_address_error")),
    // city: Yup.string().trim().required(t("label_city_error")),
    // country: Yup.string().trim().required(t("label_country_error")),
    // rating: Yup.number()
    //   .min(1, t("validation_error_rating_min_1"))
    //   .max(5, t("validation_error_rating_max_5"))
    //   .required(t("validate_error_rating")),
    //   profile_image: Yup.string().required(t("validation_error_profile_img_required")),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      category_name: showdefault && showdefault.category_name ? showdefault.category_name : "",
    },
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      globalLoader(true);
      let formData = new FormData();
      formData.append("o_id", params.id);
      formData.append("category_name", values.category_name);
      

      PersonalizationCategoriesService.Edit(formData)
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
              navigate(`/admin/personalization-categories/list/1`);
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
                      Category Name
                      <span className="requirestar">*</span>{" "}
                    </label>
                    <input
                      name="category_name"
                      id="category_name"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.category_name}
                      className="form-control"
                    />
                    <span className="text-danger d-flex text-left">
                      <CustomError name="category_name" form={formik} />
                    </span>
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

export default PersonalizationCategoryEdit;
