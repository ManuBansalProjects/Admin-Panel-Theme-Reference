import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
// import Logo from "../../../../src/assets/admin/img/logos/logo2.png";
import Logo from "../../../../src/assets/admin/img/logos/logo-light@1x.png";
import * as authService from "../services/auth.services";
import {
  SWAL_SETTINGS,
  ATLEAST_ONE_CAPITAL_REGEX,
  ATLEAST_ONE_NUMBER_REGEX,
  ATLEAST_ONE_SPECIAL_CHARACTER_REGEX,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  ATLEAST_ONE_SMALL_REGEX,
} from "../../../utils/Constants";
import Swal from "sweetalert2";
import { handleServerValidations } from "../../../utils/commonfunction";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";

const ResetPwdPage = () => {
  const {t} = useTranslation()
  const navigate = useNavigate();
  const location = useLocation();
  const [newshow, setNewShow] = useState("false");
  const [conformshow, setConformShow] = useState("false");
  const [loader, setLoader] = useState(false);
  const [validateString, setValidateString] = useState(false)

  const validationSchema = Yup.object().shape({
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
      .min(PASSWORD_MIN_LENGTH, t("Password_Validation_minimum_length"))
      .max(
        PASSWORD_MAX_LENGTH,
        t("Password_Validation_maximum_length")
      ),
    confirmPassword: Yup.string()
      .required(t("label_confirm_password_error"))
      .oneOf([Yup.ref("newPassword"), null], t("password_validation_does_not_match")),
  });

  const handleshow = (event) => {
    if (event === "newpwd") {
      setNewShow(!newshow);
    }
    if (event === "confirepwd") {
      setConformShow(!conformshow);
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem("validate_string")) {
      setValidateString(true)
    } else {
      navigate("/admin/login")
    }
  }, [])


  return (
    <>
      {validateString &&
        <Formik
          initialValues={{
            newPassword: "",
            confirmPassword: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            setLoader(true)
            let formData = new FormData();
            formData.append("new_password", values.newPassword);
            formData.append("c_password", values.confirmPassword);
            formData.append("validate_string", location.state);
            authService
              .resetPassword(formData)
              .then((response) => {
                setLoader(false)
                if (response.success) {
                  Swal.fire({
                    icon: "success",
                    text: response.message,
                    ...SWAL_SETTINGS,
                  });
                  resetForm();
                  navigate("/admin/login");
                  // setTimeout(() => {
                  //   setLoader(false)
                  //   resetForm();
                  //   navigate("/admin/login");
                  // }, 2000);
                } else {
                  Swal.fire({
                    icon: "error",
                    text: handleServerValidations(response),
                    ...SWAL_SETTINGS,
                  });
                }
              })
              .catch((error) => {
                console.log("error: ", error);
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
            isSubmitting,
            // and other goodies
          }) => (
            <div className="page main-signin-wrapper">
              <div className="innerbody">
                <div className="row signpages text-center">
                  <div className="col-md-12">
                    <div className="card">
                      <div className="row row-sm">
                        <div className="col-lg-6 col-xl-5 d-none d-lg-block text-center bg-primary details">
                          {/* <div className="mt-5 pt-4 p-2 pos-absolute">
                      <img
                        src={Logo}
                        className="ht-45 rounded mb-4"
                        alt="logo"
                      />
                      <div className="clearfix"></div>
                      <h5 className="mt-4 text-white"> 
                        Reset Your Password
                      </h5>
                    </div> */}
                          <div className="m-5 p-5 pos-absolute">
                            <img
                              src={Logo}
                              // className="ht-120 mt-6 mb-4 admin-logo rounded"
                              alt="logo"
                              // style={{ height: "6rem" }}
                            />
                            <div className="clearfix"></div>
                            <h5 className="mt-4 text-white">
                              {t("reset_your_password")}
                            </h5>
                          </div>
                        </div>
                        <div className="col-lg-6 col-xl-7 col-xs-12 col-sm-12 login_form ">
                          <div className="container-fluid">
                            <div className="row row-sm">
                              <div className="card-body mt-2 mb-2">
                                <img
                                  src="../assets/img/brand/logo.png"
                                  className=" d-lg-none header-brand-img text-left float-left mb-4"
                                  alt="logo"
                                />
                                <div className="clearfix"></div>
                                <h5 className="text-left mb-2">
                                  {t("reset_your_password")}
                                </h5>
                                <form onSubmit={handleSubmit}>
                                  <div className="form-group text-left">
                                    <label>{t("label_new_password")}</label>
                                    <div className="input-group">
                                      <input
                                        className={
                                          "form-control" +
                                          (errors.newpassword &&
                                            touched.newpassword
                                            ? " is-invalid state-invalid"
                                            : "")
                                        }
                                        placeholder={t("placeholder_new_password")}
                                        type={
                                          !newshow === true ? "text" : "password"
                                        }
                                        name="newPassword"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.newPassword}
                                        autoComplete="off"
                                      />
                                      <span
                                        className="input-group-text"
                                        onClick={() => {
                                          handleshow("newpwd");
                                        }}
                                      >
                                        {!newshow === true ? (
                                          <i className="far fa-eye"></i>
                                        ) : (
                                          <i className="far fa-eye-slash"></i>
                                        )}
                                      </span>
                                    </div>
                                    <span className="text-danger text-left d-blockerr-spn">
                                      {errors.newPassword &&
                                        touched.newPassword &&
                                        errors.newPassword}
                                    </span>
                                  </div>
                                  <div className="form-group text-left">
                                    <label>{t("label_confirm_password")}</label>
                                    <div className="input-group">
                                      <input
                                        className={
                                          "form-control" +
                                          (errors.confirmPassword &&
                                            touched.confirmPassword
                                            ? " is-invalid state-invalid"
                                            : "")
                                        }
                                        placeholder={t("placeholder_confirm_password")}
                                        type={
                                          !conformshow === true
                                            ? "text"
                                            : "password"
                                        }
                                        name="confirmPassword"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.confirmPassword}
                                        autoComplete="off"
                                      />
                                      <span
                                        className="input-group-text"
                                        onClick={() => {
                                          handleshow("confirepwd");
                                        }}
                                      >
                                        {!conformshow === true ? (
                                          <i className="far fa-eye"></i>
                                        ) : (
                                          <i className="far fa-eye-slash"></i>
                                        )}
                                      </span>
                                    </div>
                                    <span className="text-danger text-left d-blockerr-spn">
                                      {errors.confirmPassword &&
                                        touched.confirmPassword &&
                                        errors.confirmPassword}
                                    </span>
                                  </div>

                                  {loader === true ? (
                                    <div
                                      className="spinner-border text-primary mt-2"
                                      role="status"
                                    >
                                      <span className="sr-only">{t("loading")}</span>
                                    </div>
                                  ) : (
                                    ""
                                  )}

                                  <button
                                    className="btn ripple btn-main-primary btn-block signbtn"
                                    type="submit"
                                  >
                                    {t("btn_submit")}
                                  </button>
                                </form>
                                <div className="text-left mt-4 ml-0">
                                  <div className="mb-1">
                                    <Link to="/admin/login">{t("link_back_to_login")}</Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Formik>
      }
    </>
  );
};

export default ResetPwdPage;
