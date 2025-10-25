import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import Swal from "sweetalert2";
import * as userService from "../services/user.service";
import { handleServerValidations } from "../../../utils/commonfunction";
import {
  SWAL_SETTINGS,
  ATLEAST_ONE_CAPITAL_REGEX,
  ATLEAST_ONE_NUMBER_REGEX,
  ATLEAST_ONE_SPECIAL_CHARACTER_REGEX,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  ATLEAST_ONE_SMALL_REGEX,
} from "../../../utils/Constants";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";

const Changepassword = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState("false");
  const [newshow, setNewShow] = useState("false");
  const [conformshow, setConformShow] = useState("false");
  const [submitted, setSubmitted] = useState(false);
  const {t} = useTranslation()

  const handleshow = (event) => {
    if (event === "oldshw") {
      setShow(!show);
    }
    if (event === "newpwd") {
      setNewShow(!newshow);
    }
    if (event === "confirepwd") {
      setConformShow(!conformshow);
    }
  };


  const validationSchema = Yup.object().shape({
    oldPassword: Yup.string().required(t("label_current_password_error")),
    newPassword: Yup.string()
      .required(t("label_new_password_error"))
      .matches(
        ATLEAST_ONE_SMALL_REGEX,
        t("password_validation_lowercase")
      )
      .matches(
        ATLEAST_ONE_CAPITAL_REGEX,
        t("Password_Validation_uppercase")
      )
      .matches(
        ATLEAST_ONE_NUMBER_REGEX,
        t("Password_Validation_number")
      )
      .matches(
        ATLEAST_ONE_SPECIAL_CHARACTER_REGEX,
        t("Password_Validation_special_char")
      )
      .min(PASSWORD_MIN_LENGTH,t("Password_Validation_minimum_length"))
      .max(
        PASSWORD_MAX_LENGTH,
        t("Password_Validation_maximum_length")
      ),
    confirmPassword: Yup.string()
      .required(t("label_confirm_password_error"))
      .oneOf([Yup.ref("newPassword"), null], t("password_validation_does_not_match")),
  });

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={{
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        }}
        validationSchema={validationSchema}
        // validate={values => {
        //   const error = {};
        //   if (!values.oldpassword) error.oldpassword = "Current password is required";
        //   if (!values.newpassword) error.newpassword = "New Password is required"
        //   if (!values.confirmpassword) error.confirmpassword = "Confirm Password is required"
        //   if (values.newpassword != values.confirmpassword) error.confirmpassword = "Password does not match"
        //   return error;
        // }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setSubmitted(true);
          let formData = new FormData();
          formData.append("current_password", values.oldPassword);
          formData.append("new_password", values.newPassword);
          formData.append("confirm_newpassword", values.confirmPassword);
          userService
            .changepassword(formData)
            .then((response) => {
              setSubmitting(false);
              setSubmitted(false);
              if (response.success) {
                Swal.fire({
                  icon: "success",
                  text: response.message,
                  ...SWAL_SETTINGS,
                });
                resetForm({ values: "" });
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
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit}>
            <div className="row row-sm">
              <div className="col-lg-12 col-md-12 animation_fade">
                <div className="card custom-card">
                  <div className=" mt-5">
                    <div className="form-group ">
                      <div className="row row-sm">
                        <div className="col-md-4">
                          <label
                            className="text-left d-flex"
                            htmlFor="newPassword"
                          >
                            {t("label_current_password")}:
                            <span className="requirestar">*</span>
                          </label>
                          <div className="input-group">
                            <input
                              type={!show === true ? "text" : "password"}
                              className="form-control"
                              id="oldPassword"
                              name="oldPassword"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.oldPassword}
                              placeholder={t("placeholder_current_password")}
                            />
                            <span
                              className="input-group-text cp"
                              onClick={() => {
                                handleshow("oldshw");
                              }}
                            >
                              {!show === true ? (
                                <i className="far fa-eye-slash"></i>
                              ) : (
                                <i className="far fa-eye"></i>
                              )}
                            </span>
                          </div>
                          <span className="text-danger d-flex text-left">
                            {errors.oldPassword &&
                              touched.oldPassword &&
                              errors.oldPassword}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="form-group ">
                      <div className="row row-sm">
                        <div className="col-md-4">
                          <label
                            className="text-left d-flex"
                            htmlFor="newPassword"
                          >
                            {t("label_new_password")}:<span className="requirestar">*</span>
                          </label>
                          <div className="input-group">
                            <input
                              type={!newshow === true ? "text" : "password"}
                              id="newPassword"
                              name="newPassword"
                              className="form-control"
                              placeholder={t("placeholder_new_password")}
                              value={values.newPassword}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            <span
                              className="input-group-text cp"
                              onClick={() => {
                                handleshow("newpwd");
                              }}
                            >
                              {!newshow === true ? (
                                <i className="far fa-eye-slash"></i>
                              ) : (
                                <i className="far fa-eye"></i>
                              )}
                            </span>
                          </div>
                          <span className="text-danger d-flex text-left">
                            {errors.newPassword &&
                              touched.newPassword &&
                              errors.newPassword}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="form-group ">
                      <div className="row row-sm">
                        <div className="col-md-4">
                          <label
                            className="text-left d-flex"
                            htmlFor="newpassword"
                          >
                            {t("label_confirm_password")}:
                            <span className="requirestar">*</span>
                          </label>
                          <div className="input-group">
                            <input
                              type={!conformshow === true ? "text" : "password"}
                              id="confirmPassword"
                              name="confirmPassword"
                              className="form-control"
                              placeholder={t("placeholder_confirm_password")}
                              value={values.confirmPassword}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              autoComplete="off"
                            />
                            <span
                              className="input-group-text cp"
                              onClick={() => {
                                handleshow("confirepwd");
                              }}
                            >
                              {!conformshow === true ? (
                                <i className="far fa-eye-slash"></i>
                              ) : (
                                <i className="far fa-eye"></i>
                              )}
                            </span>
                          </div>
                          <span className="text-danger d-flex text-left">
                            {errors.confirmPassword &&
                              touched.confirmPassword &&
                              errors.confirmPassword}
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
          </form>
        )}
      </Formik>
    </>
  );
};

export default Changepassword;
