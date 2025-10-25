import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { ATLEAST_ONE_CAPITAL_REGEX, ATLEAST_ONE_NUMBER_REGEX, ATLEAST_ONE_SMALL_REGEX, ATLEAST_ONE_SPECIAL_CHARACTER_REGEX, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, SWAL_SETTINGS } from '../../../utils/Constants';
import Swal from 'sweetalert2';
import { handleServerValidations } from '../../../utils/commonfunction';
import CustomError from '../../../utils/customError';
import { updatePsychicPassword } from '../services/profile.services';

export default function ChangePassword() {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [oldShow, setOldShow] = useState(false);
  const [newShow, setNewShow] = useState(false);
  const [confShow, setConfShow] = useState(false);
  const [addSubmissionLoader, setAddSubmissionLoader] = useState(false);

  const validationSchema = Yup.object().shape({
    old_password: Yup.string().required(t("label_old_password_error")),
    new_password: Yup.string()
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
    confirm_password: Yup.string()
      .required(t("label_confirm_password_error"))
      .oneOf([Yup.ref("new_password"), null], t("password_validation_does_not_match")),
  });

  const formik = useFormik({
    initialValues: { old_password: "", new_password: "", confirm_password: "" },
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      setSubmitted(true);
      let formData = new FormData();
      formData.append("old_password", values.old_password);
      formData.append("new_password", values.new_password);
      formData.append("confirm_password", values.confirm_password);
      setAddSubmissionLoader(true);
      updatePsychicPassword(formData)
        .then((response) => {
          setAddSubmissionLoader(false);
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
          setAddSubmissionLoader(false);
          setSubmitted(false);
          console.log("error ====> ", error);
        });


    }
  })

  const handleshow = (event) => {
    if (event === "oldShow") {
      setOldShow(!oldShow);
    }
    if (event === "newShow") {
      setNewShow(!newShow);
    }
    if (event === "confShow") {
      setConfShow(!confShow);
    }
  };

  return (
    <div>
      <div className='inner-container py-5'>
        <div className='container'>
          <div className='row justify-content-center'>
            <div className='col-md-4'>
              <div className='profile-wrapper'>
                <div className='profile-header mb-5'>
                  <h1 className='heading-30-semibold text-center'>{t("change_password")}</h1>
                </div>
                <form onSubmit={formik.handleSubmit}>
                  <div className='profile-body'>
                    <div className='row row-gap-3'>
                      <div className='col-md-12'>
                        <div className='form-group'>
                          <label htmlFor='old_password' className='form-label'>{t("label_old_password")}</label>
                          <div className='input-group'>
                            <input
                              id="old_password"
                              name="old_password"
                              type={oldShow ? 'text' : 'password'}
                              className='form-control'
                              placeholder={t("placeholder_old_password")}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.old_password}
                            />
                            <span style={{ fontSize: "30px" }} className="input-group-text cp restaurant-password-toggle" onClick={() => { handleshow("oldShow") }} >
                              {!oldShow === true ? (<i className="ti ti-eye"></i>) : (<i className="ti ti-eye-off"></i>)}
                            </span>
                          </div>
                          <span className="text-danger d-flex text-left">
                            <CustomError name="old_password" form={formik} />
                          </span>
                        </div>
                      </div>
                      <div className='col-md-12'>
                        <div className='form-group'>
                          <label htmlFor='new_password' className='form-label'>{t("label_new_password")}</label>
                          <div className='input-group'>
                            <input
                              type={newShow ? 'text' : 'password'}
                              name='new_password'
                              id='new_password'
                              className='form-control'
                              placeholder={t("placeholder_new_password")}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.new_password}
                            />
                            <span style={{ fontSize: "30px" }} className="input-group-text cp restaurant-password-toggle" onClick={() => { handleshow("newShow") }} >
                              {!newShow === true ? (<i className="ti ti-eye"></i>) : (<i className="ti ti-eye-off"></i>)}
                            </span>
                          </div>
                          <span className="text-danger d-flex text-left">
                            <CustomError name="new_password" form={formik} />
                          </span>
                        </div>
                      </div>
                      <div className='col-md-12'>
                        <div className='form-group'>
                          <label className='form-label'>{t("label_confirm_new_password")}</label>
                          <div className='input-group'>
                            <input
                              id="confirm_password"
                              name="confirm_password"
                              type={confShow ? "text" : "password"}
                              className='form-control'
                              placeholder={t("placeholder_confirm_new_password")}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.confirm_password}
                            />
                            <span style={{ fontSize: "30px" }} className="input-group-text cp restaurant-password-toggle" onClick={() => { handleshow("confShow") }} >
                              {!confShow === true ? (<i className="ti ti-eye"></i>) : (<i className="ti ti-eye-off"></i>)}
                            </span>
                          </div>
                          <span className="text-danger d-flex text-left">
                            <CustomError name="confirm_password" form={formik} />
                          </span>
                        </div>
                      </div>
                      <div className='col-md-12 text-center'>
                        <button className='btn btn-primary' style={{width: "148px"}}>{t("btn_submit")}</button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
