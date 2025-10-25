import React, { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { Formik } from "formik";
import { Link } from "react-router-dom";
// import Logo from "../../../../src/assets/admin/img/logos/logo2.png";
import Logo from "../../../../src/assets/admin/img/logos/logo-light@1x.png";
import { DT, decodeValue, handleServerValidations } from "../../../utils/commonfunction";
import * as authService from "../services/auth.services";
import { SWAL_SETTINGS, NUMBER_CHARACTER_ONLY, OTP_LENGTH } from "../../../utils/Constants";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

const OtpVerificationPage = () => {
  const {t} = useTranslation()
  const navigate = useNavigate();
  const location = useLocation();
  const [loader, setLoader] = useState("false");
  const [type, setType] = useState("");
  const [searchParams] = useSearchParams();
  const params = useParams();
  let decryemail = decodeValue(params.email);

  useEffect(() => {
    setType(searchParams.get("type"));
  }, []);

  const resentotpfunct = () => {
    setLoader(true);
    let formData = new FormData();
    formData.append("email", decryemail);
    formData.append("type", type);
    authService
      .resendOtp(formData)
      .then((response) => {
        if (response.success) {
          setLoader(false)
          Swal.fire({
            icon: "success",
            text: response.message,
            ...SWAL_SETTINGS,
          });
        } else {
          Swal.fire({
            icon: "error",
            text: response.message,
            ...SWAL_SETTINGS,
          });
        }
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  };

  return (
    <>
      <Formik
        initialValues={{ otp: "" }}
        validate={(values) => {
          const errors = {};
          if (!values.otp) {
            errors.otp = t("validation_OTP_is_required")
          } else {
            let myOTP = String(values.otp);
            if (myOTP === "") {
              errors.otp = t("msg_validation_do_not_accept_space")
            } else if (!NUMBER_CHARACTER_ONLY.test(myOTP)) {
              errors.otp = t("msg_validation_contain_numeric_character")
            } else if (myOTP.length !== OTP_LENGTH) {
              // errors.otp = t("msg_validation_otp_length") `${OTP_LENGTH}`
              errors.otp = DT(t("msg_validation_otp_length"), [OTP_LENGTH])
            }

          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          setLoader(true);
          let formData = new FormData();
          formData.append("email", decryemail);
          formData.append("otp", values.otp);
          formData.append("type", type);
          authService
            .otpVerification(formData)
            .then((response) => {
              sessionStorage.setItem("validate_string" , response?.data?.validate_string)
              setLoader(false);
              if (
                response.success &&
                location.pathname.includes("otp-verification")
              ) {
                Swal.fire({
                  icon: "success",
                  text: response.message,
                  ...SWAL_SETTINGS,
                });
                navigate("/admin/reset-password", {
                  state: response?.data?.validate_string,
                });
                // setTimeout(() => {
                //   setLoader(false);
                //   navigate("/admin/reset-password", {
                //     state: response.data.validate_string,
                //   });
                // }, 1000);
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
                        <div className="m-5 pt-5 ps-5 pos-absolute">
                          <img
                            src={Logo}
                            // className="ht-120 mt-6 mb-4 admin-logo rounded"
                            alt="logo"
                            // style={{ height: "6rem" }}
                          />
                          <div className="clearfix"></div>
                          <h5 className="mt-4 text-white">
                            {t("heading_otp_verification")}
                          </h5>
                        </div>
                      </div>
                      <div className="col-lg-6 col-xl-7 col-xs-12 col-sm-12 login_form ">
                        <div className="container-fluid">
                          <div className="row row-sm">
                            <div className="card-body mt-4 mb-4">
                              <img
                                src={Logo}
                                className="text-left float-left mb-4 w-25"
                                alt="logo"
                              />
                              
                              <div className="clearfix"></div>
                              <h5 className="text-left mb-2">
                                {t("heading_otp_verification")}
                              </h5>
                              <p className="mb-4 text-muted tx-13 ml-0 text-left">
                                {t("msg_OTP_has_been_sent_to")} {decryemail}
                              </p>
                              <form onSubmit={handleSubmit}>
                                <div className="form-group text-left">
                                  <label>OTP</label>
                                  <input
                                    className={
                                      "form-control no_spring_input" +
                                      (errors.otp && touched.otp
                                        ? " is-invalid state-invalid"
                                        : "")
                                    }
                                    placeholder={t("placeholder_enter_OTP")}
                                    type="number"
                                    name="otp"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.otp}
                                    autoComplete="off"
                                    autoFocus
                                  />
                                  <span className="text-danger text-left d-blockerr-spn">
                                    {errors.otp && touched.otp && errors.otp}
                                  </span>
                                </div>
                                <button
                                  className={
                                    "btn ripple btn-main-primary btn-block signbtn" +
                                    (loader === true ? " disabled" : "")
                                  }
                                  type="submit"
                                >
                                  {t("verify_otp")}
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
                              <div className="text-left mt-3 ml-0">
                                <div className="mb-1">
                                  <button
                                    className="a"
                                    onClick={resentotpfunct}
                                  >
                                    {t("link_resend_otp")}?
                                  </button>
                                </div>
                              </div>
                              <div className="text-left mt-0 ml-0">
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
    </>
  );
};

export default OtpVerificationPage;
