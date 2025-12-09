import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Formik } from "formik";
// import Logo from "../../../../src/assets/admin/img/logos/logo2.png";
import Logo from "../../../../src/assets/admin/img/logos/logo-light@1x.png";
import {
  encodeValue,
  handleServerValidations,
} from "../../../utils/commonfunction";
import * as authService from "../services/auth.services";
import { SWAL_SETTINGS } from "../../../utils/Constants";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";


const ForgotPwdPage = () => {
  const {t} = useTranslation();  
  const navigate = useNavigate();
  const [loader, setLoader] = useState("false");

  return (
    <>
      <Formik
        initialValues={{ email: "" }}
        validate={(values) => {
          const errors = {};
          if (!values.email) {
            errors.email = t("label_email_error");
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = t("validation_err_invalid_email");
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setLoader(true);
          let formData = new FormData();
          formData.append("email", values.email);
          authService
            .forgetPassword(formData)
            .then((response) => {
              setLoader(false);
              // console.log(
              //   "🚀 ~ authService.forgetPassword ~ response:",
              //   response
              // );
              if (response.success) {
                Swal.fire({
                  icon: "success",
                  text: response.message,
                  ...SWAL_SETTINGS,
                });
                resetForm();
                let email = encodeValue(values.email);
                  navigate(
                    `/admin/otp-verification/${email}?type=admin_password_reset`
                  );
                // setTimeout(() => {
                //   setLoader(false);
                //   let email = encodeValue(values.email);
                //   navigate(
                //     `/admin/otp-verification/${email}?type=password_reset`
                //   );
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
                              {/* <img src="../assets/img/brand/logo.png" className=" d-lg-none header-brand-img text-left float-left mb-4" alt="logo" /> */}
                              <div className="clearfix"></div>
                              <h5 className="text-left mb-2">
                                {t("forgot_password")}
                              </h5>
                              <p className="mb-4 text-muted tx-13 ml-0 text-left">
                                {t("OTP_will_be_sent_registered_email")}
                              </p>
                              <form onSubmit={handleSubmit}>
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
                                <button
                                  className={
                                    "btn ripple btn-main-primary btn-block signbtn" +
                                    (loader === true ? " disabled" : "")
                                  }
                                  type="submit"
                                >
                                  {t("btn_submit")}
                                </button>
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
                              </form>
                              <div className="card-footer border-top-0 pl-0 mt-3 text-left ">
                                <p className="mb-2">
                                  {t("did_you_remembered_your_password")}?
                                </p>
                                <p className="mb-0">
                                  <Link to="/admin/login">Please Login</Link>
                                </p>
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

export default ForgotPwdPage;
