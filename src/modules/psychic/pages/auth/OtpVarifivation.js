import React, { useState, useEffect } from "react";
import logo from "./../../../../assets/website/images/logo.svg"
import bgLogin from "./../../../../assets/website/images/login-img.png"
import shapeLogin from "./../../../../assets/website/images/stone-img.png"
import { useTranslation } from "react-i18next";
import { Formik, Form, Field } from "formik";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SWAL_SETTINGS } from "../../../../utils/Constants";
import Swal from "sweetalert2";
import { globalLoader, handleServerValidations } from "../../../../utils/commonfunction";
import OtpInput from "react-otp-input";
import { psychicResendOTP, psychicVerifyOTP } from "../../services/psychic.services";
import * as Yup from 'yup';

function PsychicVerifyOtp() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = useLocation();
    const [otp, setOtp] = useState("");
    const [resendDisabled, setResendDisabled] = useState(false);
    const [counter, setCounter] = useState(0);

    const otpValidationSchema = Yup.object().shape({
        otp: Yup.string()
            .required(t("validation_OTP_is_required"))
            .length(4, t("otp_error_msg"))
            .matches(/^\d{4}$/, t("invalid_otp")),
    });

    const initialValues = {
        otp: "",
    };

    useEffect(() => {
        if (!state?.email || state?.email.length === 0) {
            navigate("/psychic/login");
        }
        let timer;
        if (counter > 0) {
            timer = setTimeout(() => setCounter(counter - 1), 1000);
        } else {
            setResendDisabled(false);
        }
        return () => clearTimeout(timer);
    }, [counter]);

    const handleSubmit = async (values, actions) => {
        const otpValue = values.otp;
        console.log(otpValue)
        globalLoader(true);

        try {
            await otpValidationSchema.validate(values, { abortEarly: false });
            let formData = new FormData();
            formData.append("email", state?.email);
            formData.append("otp", otpValue);
            formData.append("type", "psychic_password_reset");
            psychicVerifyOTP(formData)
                .then((response) => {
                    globalLoader(false)
                    if (response.success && location.pathname.includes("otp-verification")) {
                        Swal.fire({
                            icon: "success",
                            text: response.message,
                            ...SWAL_SETTINGS,
                        });
                        navigate(`/psychic/reset-password`, { state: { validate_string: response?.data?.validate_string } });
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
            actions.setSubmitting(false);
        } catch (error) {
            console.log(error)
            const validationErrors = {};
            actions.setErrors(validationErrors);
            globalLoader(false);
        }
    };

    const handleResend = async () => {
        globalLoader(true);
        setResendDisabled(true);
        setCounter(30);

        let formData = new FormData();
        formData.append("email", state?.email);
        formData.append("type", "psychic_password_reset");
        psychicResendOTP(formData)
            .then((response) => {
                globalLoader(false);
                if (response.success) {
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
                globalLoader(false);
                console.log("error: ", error);
            });
    };

    return (
        <>
            <div className='auth-page login-page'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-6'>
                            <div className='auth-form login-form'>
                                <div className='auth-form-header'>
                                    <a href='/' aria-label="Go to homepage"><img src={logo} alt='Reloaded logo'/></a>
                                </div>
                                <div className='auth-form-body'>
                                    <h2>{t("link_forget_password")}</h2>
                                    <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={otpValidationSchema}>
                                        {({ errors, touched, setFieldValue }) => (
                                            <Form>
                                                <div className={`d-flex w-100 justify-content-between ${errors.otp && touched.otp ? '' : 'mb-4'}`}>
                                                    <div className="col-md-3 number-otp-section">
                                                        <Field name="otp">
                                                            {({ field }) => (
                                                                <OtpInput
                                                                    {...field}
                                                                    value={otp}
                                                                    inputType="number"
                                                                    onChange={(value) => {
                                                                        setOtp(value);
                                                                        setFieldValue("otp", value);
                                                                    }}
                                                                    numInputs={4}
                                                                    separator={<span>-</span>}
                                                                    renderInput={(props, index) => (
                                                                        <input
                                                                            {...props}
                                                                            key={index}
                                                                            className="form-control"
                                                                            style={{ width: "6rem", marginRight: "10px", textAlign: "center", fontWeight: 600 }}
                                                                            maxLength="1"
                                                                            autoFocus={index === 0 ? true : false}
                                                                            placeholder="-"
                                                                        />
                                                                    )}
                                                                />
                                                            )}
                                                        </Field>
                                                    </div>
                                                </div>
                                                {errors.otp && touched.otp && <div className="text-danger mb-4">{errors.otp}</div>}

                                                <button className={"btn btn-primary justify-content-center"} type="submit">
                                                    {t("verify_otp")}
                                                </button>
                                            </Form>
                                        )}
                                    </Formik>
                                    <div className="login-cta-bottom mt-3">
                                        <p>
                                            {t("otp_not_receive")}{" "}
                                            <a
                                                className={`${resendDisabled ? " disabled" : ""} text-primary fw-bold`}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (!resendDisabled) {
                                                        handleResend();
                                                    }
                                                }}
                                                href="/"
                                            >
                                                {t("btn_resend")}
                                            </a>
                                            {resendDisabled && <span className="text-secondary ms-2">({counter})</span>}
                                        </p>
                                        <p className="">
                                            <Link
                                                className="text-primary fw-bold"
                                                to={'/psychic/login'}
                                            >
                                                {t("link_back_to_login")}
                                            </Link>

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
        </>
    );
}

export default PsychicVerifyOtp;
