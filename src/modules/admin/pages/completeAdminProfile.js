import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import Swal from "sweetalert2";
import * as authService from "../services/auth.services";
import { useNavigate, useParams } from "react-router-dom";
import { ATLEAST_ONE_CAPITAL_REGEX, ATLEAST_ONE_NUMBER_REGEX, ATLEAST_ONE_SMALL_REGEX, ATLEAST_ONE_SPECIAL_CHARACTER_REGEX, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, SWAL_SETTINGS } from "../../../utils/Constants";
import * as Yup from "yup";
import { handleServerValidations } from "../../../utils/commonfunction";

const CompleteAdminProfile = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [show, setShow] = useState(true);
  const [showConfirm, setConfirmShow] = useState(true);
  const [loader] = useState(false);
  const [foundedUser, setFoundedUser] = useState(true);
  const [apiDone, setApiDone] = useState(false);
  const [invitedStaffData, setInvitedStaffData] = useState([]);

  const handleshow = (event) => {
    if (event === "newpwd") {
      setShow(!show);
    }
    if (event === "confirmpwd") {
      setConfirmShow(!showConfirm);
    }
  };

  useEffect(() => {
    authService
      .InvitationInfo({ 'validate_string': params.validate_string })
      .then((response) => {
        if (response?.success === false) {
          setFoundedUser(false);
        } else if (response?.success) {
          setInvitedStaffData(response?.data);
          setApiDone(true);
        }
        setApiDone(true);
      })
      .catch((error) => {
        console.log("error=====>", error);
      });
  }, []);

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required("New password is required")
      .matches(ATLEAST_ONE_SMALL_REGEX, "Password should have at least 1 lowercase letter")
      .matches(ATLEAST_ONE_CAPITAL_REGEX, "Password should have at least 1 capital letter")
      .matches(ATLEAST_ONE_NUMBER_REGEX, "Password should have at least 1 number")
      .matches(ATLEAST_ONE_SPECIAL_CHARACTER_REGEX, "Password should have at least 1 special character")
      .min(PASSWORD_MIN_LENGTH, "Password should be at least 8 characters long")
      .max(PASSWORD_MAX_LENGTH, "Password cannot be more than 20 characters long"),
    confirm_password: Yup.string().required("Confirm password is required").oneOf([Yup.ref("password"), null], "Passwords don't match"),
  })

  return (
    <>
      {apiDone ? (
        <Formik
          initialValues={{
            email: invitedStaffData && invitedStaffData?.email ? invitedStaffData.email : "",
            password: "",
            confirm_password: "",
          }}
          // validate={(values) => {
          //   const errors = {};
          //   if (!values.email) {
          //     errors.email = "Email is required";
          //   } else if (
          //     !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          //   ) {
          //     errors.email = "Invalid email address";
          //   }
          //   if (!values.password) {
          //     errors.password = "Password is required";
          //   }
          //   if (!values.confirm_password) {
          //     errors.confirm_password = "Confirm password is required";
          //   }
          //   return errors;
          // }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            authService.CompleteInvitation({
              'validate_string': params.validate_string,
              'password': values.password,
              'c_password': values.confirm_password
            }).then((response) => {
              if (response.success) {
                Swal.fire({
                  icon: "success",
                  text: response.message,
                  ...SWAL_SETTINGS,
                });
                navigate("/admin/login");
              }
              else {
                Swal.fire({
                  icon: "error",
                  text: handleServerValidations(response),
                  ...SWAL_SETTINGS,
                });
              }
            }).catch((error) => {
              console.log('error', error)
            })
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
                  <div className="d-flex justify-content-center">
                    {foundedUser ? (
                      <div className="col-lg-6 col-xl-7 col-xs-12 col-sm-12 login_form ">
                        <div className="container-fluid">
                          <div className="row row-sm">
                            <div className="card-body mt-2 mb-2">
                              <div className="clearfix"></div>
                              <form onSubmit={handleSubmit}>
                                <h5 className="text-left mb-4">
                                  Activate Your Account
                                </h5>
                                {/* <p className="mb-4 text-muted tx-13 ml-0 text-left">Signin to create, discover and connect with the global community</p> */}
                                <div className="form-group text-left">
                                  <label>Email</label>
                                  <input
                                    className={
                                      "form-control" +
                                      (errors.email && touched.email
                                        ? " is-invalid state-invalid"
                                        : "")
                                    }
                                    placeholder="Enter your email"
                                    disabled={true}
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
                                  <label>Password</label>
                                  <div className="input-group">
                                    <input
                                      className={
                                        "form-control" +
                                        (errors.password && touched.password
                                          ? " is-invalid state-invalid"
                                          : "")
                                      }
                                      placeholder="Enter your password"
                                      type={!show === true ? "text" : "password"}
                                      name="password"
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      value={values.password}
                                      autoComplete="off"
                                    />
                                    <span
                                      className="input-group-text cp"
                                      onClick={() => handleshow("newpwd")}
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
                                <div className="form-group text-left">
                                  <label>Confirm Password</label>
                                  <div className="input-group">
                                    <input
                                      className={
                                        "form-control" +
                                        (errors.confirm_password &&
                                          touched.confirm_password
                                          ? " is-invalid state-invalid"
                                          : "")
                                      }
                                      placeholder="Enter your confirm password"
                                      type={
                                        !showConfirm === true
                                          ? "text"
                                          : "password"
                                      }
                                      name="confirm_password"
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      value={values.confirm_password}
                                      autoComplete="off"
                                    />
                                    <span
                                      className="input-group-text cp"
                                      onClick={() => handleshow("confirmpwd")}
                                    >
                                      {!showConfirm === true ? (
                                        <i className="far fa-eye-slash"></i>
                                      ) : (
                                        <i className="far fa-eye"></i>
                                      )}
                                    </span>
                                  </div>
                                  <span className="text-danger text-left d-block err-spn">
                                    {errors.confirm_password &&
                                      touched.confirm_password &&
                                      errors.confirm_password}
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
                                      <span className="sr-only ">Loading...</span>
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                  Submit
                                </button>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <h1>This link is expired ..</h1>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Formik>
      ) : (
        <></>
      )}

    </>
  );
};
export default CompleteAdminProfile;
