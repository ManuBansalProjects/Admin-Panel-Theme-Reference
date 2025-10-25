import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import {
  getUser,
  handleServerValidations,
  setLocalKey,
  blockInvalidChar,
  DT,
} from "../../../utils/commonfunction";
import { useSelector } from "react-redux";
import * as userServices from "../services/user.service";
import { SWAL_SETTINGS, EMAIL_REGEX, INPUT_LENGTH_15, ROLE } from "../../../utils/Constants";
// import PhoneInput from 'react-phone-input-2'
import "react-phone-input-2/lib/style.css";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
// import 'react-phone-number-input/style.css'

const EditProfile = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const showprofile = useSelector((state) => state.profile);
  const [showdefault, setShowDefault] = useState({});
  const [updateData, setUpdateData] = useState("false");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const getuser = getUser(ROLE.SUPER_ADMIN);
    setShowDefault(getuser);
  }, [updateData]);

  console.log("showdefalut",showdefault)

  const validationSchema = Yup.object().shape({
    first_name: Yup.string()
      .trim()
      .required(t("label_first_name_error"))
      .max(INPUT_LENGTH_15,DT(t("validation_max_input_characters"), [INPUT_LENGTH_15]))
      .matches(/^[A-Za-z\s]+$/, t("label_first_name_format_error")),
    // middle_name: Yup.string().matches(/^[A-Za-z\s]+$/, "Only alphabets are allowed in the middle name"),
    // middle_name: Yup.string().max(INPUT_LENGTH_15,DT(t("validation_max_input_characters"), [INPUT_LENGTH_15])),
    // last_name: Yup.string().trim().required('Last name is required').matches(/^[A-Za-z\s]+$/, "Only alphabets are allowed in the last name"),
    last_name: Yup.string()
    .trim()
    .max(INPUT_LENGTH_15,DT(t("validation_max_input_characters"), [INPUT_LENGTH_15]))
    .required(t("label_last_name_error")),
    email: Yup.string()
      .trim()
      .required(t("label_email_error"))
      .matches(EMAIL_REGEX, t("label_email_validation_error")),
    files: Yup.mixed()
      .required(t("label_image_error"))
      .test("fileType", t("label_image_format_error"), (value) => {
        if (!value) {
          const supportedFormats = ["image/jpeg", "image/png", "image/gif"];
          return supportedFormats.includes(value.type);
        } else {
          return true;
        }
      }),
    phone_number: Yup.string()
      .trim()
      .required(t("label_phone_error"))
      .test(
        "min-length",
        t("label_phone_number_minimum_length"),
        (value) => {
          if (value?.trim()?.length < 10) {
            return false;
          } else {
            return true;
          }
        }
      )
      .test(
        "max-length",
        t("label_phone_number_maximum_length"),
        (value) => {
          if (value?.trim()?.length > 14) {
            return false;
          } else {
            return true;
          }
        }
      ),
  });

 

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      first_name:
        showdefault && showdefault.first_name ? showdefault.first_name : "",
      middle_name:
        showdefault && showdefault.middle_name ? showdefault.middle_name : "",
      last_name:
        showdefault && showdefault.last_name ? showdefault.last_name : "",
      email: showdefault && showdefault.email ? showdefault.email : "",
      files:
        showdefault && showdefault.profile_image
          ? showdefault.profile_image
          : "",
      phone_number:
        showdefault &&
        showdefault.phone_number &&
        showdefault.phone_number
          ? showdefault.phone_number
          : "",
    },
    validationSchema: validationSchema,
    validateOnBlur: false,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      setSubmitted(true);
      let formData = new FormData();
      formData.append("first_name", values.first_name);
      formData.append("middle_name", values.middle_name);
      formData.append("last_name", values.last_name);
      formData.append("email", values.email);
      formData.append("phone_number", values.phone_number);
      // if (values.phone_number) {
      //   formData.append(
      //     "phone_number",
      //     JSON.stringify({
      //       number: values.phone_number,
      //     })
      //   );
      // }

      if (showprofile && showprofile.file) {
        formData.append('image', showprofile.file);
      }

      userServices
        .updateProfileUsers(formData)
        .then((response) => {
          setSubmitted(false);
          if (response.success) {
            setLocalKey("super_admin", JSON.stringify(response.data));
            Swal.fire({
              icon: "success",
              text: response.message,
              ...SWAL_SETTINGS,
            });
            resetForm({ values: "" });
            setUpdateData(!updateData);
          } else {
            Swal.fire({
              icon: "error",
              text: handleServerValidations(response),
              ...SWAL_SETTINGS,
            });
          }
        })
        .catch((error) => {
          setSubmitted(false);
          console.log("error ====> ", error);
        });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="row row-sm">
        <div className="col-lg-12 col-md-12 animation_fade">
          <div className="card custom-card">
            <div className="mt-5">
              <div className="form-group ">
                <div className="row row-sm">
                  <div className="col-md-4">
                    <label className="text-left d-flex" htmlFor="Email">
                      {t("label_first_name")}:<span className="requirestar">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="first_name"
                      name="first_name"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.first_name}
                      placeholder={t("placeholder_first_name")}
                    />
                    <span className="text-danger d-flex text-left">
                      {formik.errors.first_name &&
                        formik.touched.first_name &&
                        formik.errors.first_name}
                    </span>
                  </div>
                </div>
              </div>

              {/* <div className="form-group ">
                <div className="row row-sm">
                  <div className="col-md-4">
                    <label className="text-left d-flex" htmlFor="Email">
                    {t("label_middle_name")}:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="middle_name"
                      name="middle_name"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.middle_name}
                      placeholder={t("placeholder_middle_name")}
                    />
                    <span className="text-danger d-flex text-left">
                      {formik.errors.middle_name &&
                        formik.touched.middle_name &&
                        formik.errors.middle_name}
                    </span>
                  </div>
                </div>
              </div> */}

              <div className="form-group ">
                <div className="row row-sm">
                  <div className="col-md-4">
                    <label className="text-left d-flex" htmlFor="Email">
                    {t("label_last_name")}:<span className="requirestar">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="last_name"
                      name="last_name"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.last_name}
                      placeholder={t("placeholder_last_name")}
                    />
                    <span className="text-danger d-flex text-left">
                      {formik.errors.last_name &&
                        formik.touched.last_name &&
                        formik.errors.last_name}
                    </span>
                  </div>
                </div>
              </div>

              <div className="form-group ">
                <div className="row row-sm">
                  <div className="col-md-4">
                    <label className="text-left d-flex" htmlFor="email">
                    {t("label_email")}:<span className="requirestar">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-control"
                      placeholder={t("placeholder_email")}
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      autoComplete="off"
                    />
                    <span className="text-danger d-flex text-left">
                      {formik.errors.email &&
                        formik.touched.email &&
                        formik.errors.email}
                    </span>
                  </div>
                </div>
              </div>
              <div className="form-group ">
                <div className="row row-sm">
                  <div className="col-md-4">
                    <label className="text-left d-flex" htmlFor="phone_number">
                    {t("label_phone_number")}:
                    </label>
                    <div className="form-control d-flex">
      
                      <input
                        className={"phoneInput"}
                        placeholder={t("placeholder_phone_number")}
                        name="phone_number"
                        style={{ border: 0 }}
                        onChange={(event) => {
                          formik.setFieldValue(
                            `phone_number`,
                            event.nativeEvent.target.value
                          );
                        }}
                        // onBlur={handleBlur}
                        value={`${formik.values.phone_number}`}
                        onKeyDown={blockInvalidChar}
                      />
                    </div>
                    <span className="text-danger d-flex text-left">
                      {formik.errors.phone_number && formik.errors.phone_number}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-5">
                <button
                  className="btn btn-info mr-2"
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
                  onClick={() => {navigate(-1)}}
                >
                  <i className="ace-icon fa fa-times bigger-110 mx-1"></i>
                  {t("btn_cancel")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default EditProfile;
