import React, { useEffect, useState, useRef } from "react";
import { Formik } from "formik";
import Swal from "sweetalert2";
import * as authService from "../services/auth.services";
import { Link } from "react-router-dom";
import logo from "../../../../src/assets/admin/img/logos/logo-light@1x.png";
import {
  getSessionKey,
  handleNavigation,
  handleServerValidations,
  removeSessionKey,
  setLocalKey,
  setSessionKey,
} from "../../../utils/commonfunction";
import { SWAL_SETTINGS, COOKIES_EXPIRATION, PASSWORD_MIN_LENGTH, ROLE } from "../../../utils/Constants";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";

const Login = () => {
  const [show, setShow] = useState(true);
  const [loader, setLoader] = useState(false);
  // const [logo, setLogo] = useState("");
  const formikRef = useRef(null);
  const { t } = useTranslation()

  /** Remember last logged-in user >>>> */
  useEffect(() => {
    const storedUsername = Cookies.get("email");
    const storeUserpass = Cookies.get("password");
    if (storedUsername) {
      formikRef?.current?.setFieldValue("email", storedUsername);
    }
    if (storeUserpass) {
      formikRef?.current?.setFieldValue("password", storeUserpass);
    }
  }, []);
  /** Remember last logged-in user <<<< */

  const handleshow = () => {
    setShow(!show);
  };

  function handleRememberMe(e) {
    console.log(e.target.checked);
    if (e.target.checked) {
      setSessionKey("remember-me", "true");
    } else {
      removeSessionKey("remember-me");
      Cookies.remove("email");
      Cookies.remove("password");
      // console.log("remvdkjl");
    }
  }

 
  return (
    <>
      <Formik
        initialValues={{ email: "", password: "" }}
        innerRef={formikRef}
        validate={(values) => {
          const errors = {};
          if (!values.email) {
            errors.email = t("label_email_error");
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = t("validation_err_invalid_email");
          }
          if (!values.password) {
            errors.password = t("validation_password_required");
          } else {
            let trimmedPass = values.password.trim();
            if(trimmedPass.length === 0){
              errors.password = t("validation_password_required")
            }
            else if (trimmedPass.length < PASSWORD_MIN_LENGTH) {
              errors.password = t("msg_validation_password_length");
          }
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          setLoader(true);
          // console.log("🚀 ~ Login ~ values:", values);

          let formData = new FormData();
          formData.append("email", values.email);
          formData.append("password", values.password);

          authService
            .login(formData)
            .then((response) => {
              // console.log("🚀 ~ .then ~ response:", response);
              setLoader(false);
              if (response.success) {
                /** Remember last logged-in user >>>> */
                if (getSessionKey("remember-me") === "true") {
                  Cookies.set("email", response?.data?.email, {
                    expires: COOKIES_EXPIRATION,
                  });
                  Cookies.set("password", values.password, {
                    expires: COOKIES_EXPIRATION,
                  });
                } else {
                  Cookies.remove("email");
                  Cookies.remove("password");
                }
                /** Remember last logged-in user <<<< */
                setLocalKey(ROLE.SUPER_ADMIN, JSON.stringify(response.data));
                Swal.fire({
                  icon: "success",
                  text: response.message,
                  ...SWAL_SETTINGS,
                });
                handleNavigation({
                  successURL:"/admin/dashboard",
                  role:ROLE.SUPER_ADMIN
                });
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
                        <div className="m-5 p-5 pos-absolute">
                          <img
                            src={logo}
                            // className="ht-120 mt-6 mb-4 admin-logo rounded"
                            alt="logo"
                            // style={{ height: "6rem" }}
                          />
                          <div className="clearfix"></div>
                          <h5 className="mt-4 text-white">
                            {t("login_your_account")}
                          </h5>
                        </div>
                      </div>
                      <div className="col-lg-6 col-xl-7 col-xs-12 col-sm-12 login_form ">
                        <div className="container-fluid">
                          <div className="row row-sm">
                            <div className="card-body mt-2 mb-2">
                              {/* <img src="../assets/img/brand/logo.png" className=" d-lg-none header-brand-img text-left float-left mb-4" alt="logo" /> */}
                              <div className="clearfix"></div>
                              <form onSubmit={handleSubmit}>
                                <h5 className="text-left mb-2">
                                  {t("signin_our_account")}
                                </h5>
                                <div className="form-group text-left">
                                  <label>{t("label_email")}</label>
                                  <input
                                    className={
                                      "form-control" +
                                      (errors.email && touched.email
                                        ? " is-invalid state-invalid"
                                        : "")
                                    }
                                    placeholder={t("placeholder_email")}
                                    type="email"
                                    name="email"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.email}
                                    autoComplete="off"
                                  />
                                  <span className="text-danger text-left d-blockerr-spn">
                                    {errors.email &&
                                      touched.email &&
                                      errors.email}
                                  </span>
                                </div>
                                <div className="form-group text-left">
                                  <label>{t("label_password")}</label>
                                  <div className="input-group">
                                    <input
                                      className={
                                        "form-control" +
                                        (errors.password && touched.password
                                          ? " is-invalid state-invalid"
                                          : "")
                                      }
                                      placeholder={t("placeholder_password")}
                                      type={
                                        !show === true ? "text" : "password"
                                      }
                                      name="password"
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      value={values.password}
                                      autoComplete="off"
                                    />
                                    <span
                                      className="input-group-text cp"
                                      onClick={handleshow}
                                    >
                                      {!show === true ? (
                                        <i className="far fa-eye-slash"></i>
                                      ) : (
                                        <i className="far fa-eye"></i>
                                      )}
                                    </span>
                                  </div>
                                  <span className="text-danger text-left d-block err-spn">
                                    {errors.password &&
                                      touched.password &&
                                      errors.password}
                                  </span>
                                </div>
                                <button
                                  className={
                                    "btn ripple btn-main-primary btn-block signbtn" +
                                    (loader === true ? " disabled" : "")
                                  }
                                  type="submit"
                                >
                                  {loader === true ? (
                                    <div
                                      className="spinner-border mt-2 text-white"
                                      role="status"
                                      style={{
                                        height: "15px",
                                        width: "15px",
                                        marginRight: "15px",
                                      }}
                                    >
                                      <span className="sr-only ">
                                        {t("loading")}
                                      </span>
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                  {t("sign_in")}
                                </button>
                              </form>
                              <div className="form-check mt-4 text-left ml-0">
                                <input
                                  type="checkbox"
                                  id="remember-me"
                                  className="form-check-input question-required cp"
                                  value={"true"}
                                  defaultChecked={
                                    (Cookies.get("username"),
                                      Cookies.get("password"))
                                  }
                                  onChange={handleRememberMe}
                                />
                                <label
                                  className="form-check-label cp"
                                  htmlFor="remember-me"
                                >
                                  {t("remember_me")}
                                </label>
                              </div>
                              <div className="text-left mt-4 ml-0">
                                <div className="mb-1">
                                  <Link to="/admin/forget-password">
                                    {t("forgot_password")}?
                                  </Link>
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
    </>
  );
};
export default Login;
