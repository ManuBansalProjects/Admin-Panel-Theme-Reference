import React from "react";
import logo from "./../../../../assets/website/images/logo.svg"
import bgLogin from "./../../../../assets/website/images/login-img.png"
import shapeLogin from "./../../../../assets/website/images/stone-img.png"
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import * as Yup from 'yup';
import { globalLoader, handleServerValidations } from "../../../../utils/commonfunction";
import CustomError from "../../../../utils/customError";
import { EMAIL_REGEX, SWAL_SETTINGS } from "../../../../utils/Constants";
import { psychicForgetPassword } from "../../services/psychic.services";
import { EMAIL_VALIDATION } from "../../../../utils/commonValidations";

const ForgetPasswordPsychic = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const forgetPasswordValidationSchema = Yup.object().shape({
        // email: Yup.string()
        //     .trim()
        //     .required(t("label_email_error"))
        //     .matches(EMAIL_REGEX, t("label_email_validation_error")),
        email: EMAIL_VALIDATION,
    })

    const formik = useFormik({
        initialValues: { email: "" },
        validationSchema: forgetPasswordValidationSchema,
        onSubmit: (values, { resetForm }) => {
            globalLoader(true);
            const formData = new FormData();
            formData.append("email", values.email);

            psychicForgetPassword(formData)
                .then((response) => {
                    globalLoader(false)
                    if (response.success) {
                        Swal.fire({
                            icon: "success",
                            text: response.message,
                            ...SWAL_SETTINGS,
                        });
                        resetForm();
                        navigate(
                            `/psychic/otp-verification`, { state: { email: values.email } }
                        );
                    } else {
                        Swal.fire({
                            icon: "error",
                            text: handleServerValidations(response),
                            ...SWAL_SETTINGS,
                        });
                    }
                })
                .catch((error) => {
                    globalLoader(false);
                    console.log("error--->", error)
                });
        }
    });

    return (
        <div className='auth-page login-page'>
            <div className='container'>
                <div className='row'>
                    <div className='col-md-6'>
                        <div className='auth-form login-form'>
                            <div className='auth-form-header'>
                                <a href='/' aria-label="Go to homepage"><img src={logo} alt="Reloaded logo" /></a>
                            </div>
                            <div className='auth-form-body'>
                                <h2>{t("link_forget_password")}</h2>
                                <form onSubmit={formik.handleSubmit} >
                                    <div className='form-group mb-3'>
                                        <label htmlFor='email' className='form-label cp'>{t("label_login_ID")}</label>
                                        <input
                                            type='email'
                                            name='email'
                                            id='email'
                                            className='form-control'
                                            placeholder={t("placeholder_login_ID")}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.email}
                                        />
                                        <span className="text-danger d-flex text-left">
                                            <CustomError name="email" form={formik} />
                                        </span>
                                    </div>
                                    <div>
                                    <Link to={`/psychic/login`} className="cp text-primary fw-bold">
                                        {t("link_back_to_login")}
                                    </Link>
                                    </div>
                                    <button type="submit" className="btn btn-primary mt-2">{t("btn_submit")}</button>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className='bg-login-img'>
                        <img src={bgLogin} alt="" role="presentation" aria-hidden="true"/>
                        <img src={shapeLogin} className='stone-img' alt="" role="presentation" aria-hidden="true" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgetPasswordPsychic;
