import React, { useState, useEffect } from "react";
import logo from "./../../../../assets/website/images/logo.svg"
import bgLogin from "./../../../../assets/website/images/login-img.png"
import shapeLogin from "./../../../../assets/website/images/stone-img.png"
import { useFormik } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ATLEAST_ONE_CAPITAL_REGEX, ATLEAST_ONE_NUMBER_REGEX, ATLEAST_ONE_SMALL_REGEX, ATLEAST_ONE_SPECIAL_CHARACTER_REGEX, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, SWAL_SETTINGS } from "../../../../utils/Constants";
import Swal from "sweetalert2";
import { globalLoader, handleServerValidations } from "../../../../utils/commonfunction";
// import { useTranslation } from "react-i18next";
import CustomError from "../../../../utils/customError";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import * as Yup from 'yup';
import { psychicResetPassword } from "../../services/psychic.services";

const PsychicResetPassword = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const [newshow, setNewShow] = useState("false");
    const [conformshow, setConformShow] = useState("false");
    const { t } = useTranslation();

    const resetPswValidationSchema = Yup.object().shape({
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

    useEffect(() => {
        // if (!state?.validate_string || state?.validate_string.length === 0) {
        //     navigate("/psychic/login");
        // }
    }, [state, navigate]);

    const formik = useFormik({
        initialValues: {
            newPassword: "",
            confirmPassword: ""
        },
        validationSchema: resetPswValidationSchema,
        onSubmit: (values, { resetForm }) => {
            globalLoader(true);
            const formData = new FormData();
            formData.append("new_password", values.newPassword);
            formData.append("confirm_password", values.confirmPassword);
            formData.append("validate_string", state.validate_string);

            psychicResetPassword(formData)
                .then((response) => {
                    globalLoader(false);
                    if (response.success) {
                        Swal.fire({
                            icon: "success",
                            text: response.message,
                            ...SWAL_SETTINGS,
                        });
                        resetForm();
                        navigate(`/psychic/login`);
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
                    console.log("error--->", error);
                });
        }
    });

    const handleshow = (event) => {
        if (event === "newpwd") {
            setNewShow(!newshow);
        }
        if (event === "confirmpwd") {
            setConformShow(!conformshow);
        }
    };

    return (
            <div className='auth-page login-page'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-6'>
                            <div className='auth-form login-form'>
                                <div className='auth-form-header'>
                                    <a href='/' aria-label="Go to homepage"><img src={logo} alt='Reloaded logo' /></a>
                                </div>
                                <div className='auth-form-body'>
                                    <h2>{t("link_forget_password")}</h2>
                                    <form onSubmit={formik.handleSubmit}>
                                        <div className="form-group mb-2">
                                            <label htmlFor="newPassword" className="form-label">{t('label_new_password')} <span>*</span></label>
                                            <div className="input-group">
                                                <input
                                                    type={!newshow ? "text" : "password"}
                                                    id="newPassword"
                                                    name="newPassword"
                                                    className="form-control border-end-0"
                                                    placeholder={t("placeholder_new_password")}
                                                    value={formik.values.newPassword}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                />
                                                <span style={{fontSize: "25px"}} className="input-group-text cp restaurant-password-toggle" onClick={() => { handleshow("newpwd"); }}
                                                >
                                                    {newshow === true ? (
                                                        <i className="ti ti-eye"></i>
                                                    ) : (
                                                        <i className="ti ti-eye-off"></i>
                                                    )}

                                                </span>
                                            </div>
                                            <CustomError name="newPassword" form={formik} className="text-danger" />
                                        </div>
                                        <div className="form-group mb-2">
                                            <label htmlFor="confirmPassword" className="form-label">{t("label_confirm_password")}<span>*</span></label>
                                            <div className="input-group">
                                                <input
                                                    type={!conformshow ? "text" : "password"}
                                                    id="confirmPassword"
                                                    name="confirmPassword"
                                                    className="form-control border-end-0"
                                                    placeholder={t("placeholder_confirm_password")}
                                                    value={formik.values.confirmPassword}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                />
                                                <span style={{fontSize: "25px"}} className="input-group-text cp restaurant-password-toggle" onClick={() => { handleshow("confirmpwd"); }}
                                                >
                                                    {conformshow === true ? (
                                                        <i className="ti ti-eye"></i>
                                                    ) : (
                                                        <i className="ti ti-eye-off"></i>
                                                    )}
                                                </span>
                                            </div>
                                            <CustomError name="confirmPassword" form={formik} className="text-danger" />
                                        </div>

                                        <button className="btn btn-primary mt-4 justify-content-center"> {t("btn_submit")}</button>
                                    </form>
                                    <div className="login-cta-bottom mt-3">
                                        <p className="mb-2">
                                            {t("did_you_remembered_your_password")}?{" "}
                                            {t("label_try_to")} <Link className="text-primary fw-bold" to="/psychic/login">{t("link_login")}</Link>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='bg-login-img'>
                            <img src={bgLogin} alt="" role="presentation" />
                            <img src={shapeLogin} className='stone-img' alt="" role="presentation" />
                        </div>
                    </div>
                </div>
            </div>
    );
};

export default PsychicResetPassword;
