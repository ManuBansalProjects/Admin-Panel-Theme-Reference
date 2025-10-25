import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import logo from "./../../../assets/website/images/logo.svg"
import bgLogin from "./../../../assets/website/images/login-img.png"
import shapeLogin from "./../../../assets/website/images/stone-img.png"
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setGlobalLoader } from '../../../redux/slices/globalLoader';
import { useFormik } from 'formik';
import { psychicLogin } from '../services/psychic.services';
import Swal from 'sweetalert2';
import Cookies from "js-cookie";
import * as Yup from "yup";
import { COOKIES_EXPIRATION, ROLE, SWAL_SETTINGS } from '../../../utils/Constants';
import { getSessionKey, handleNavigation, handleServerValidations, removeSessionKey, setLocalKey, setSessionKey } from '../../../utils/commonfunction';
import { useTranslation } from 'react-i18next';
import CustomError from '../../../utils/customError';

export default function PsychicLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  window.navigate_ = navigate;
  const [show, setShow] = useState(true);
  const [loader, setLoader] = useState(false);
  const { t } = useTranslation();

  useLayoutEffect(() => {
    Promise.all([
      import("../../../assets/website/css/style.css"),
      import("../../../assets/website/css/components.css"),
      import("../../../assets/website/css/responsive.css")
    ]).then(() => {
      dispatch(setGlobalLoader(false));
    });
  }, []);

  const validateSchema = Yup.object().shape({
    email: Yup.string()
      .trim()
      .required(t("label_email_error")),
    // email: EMAIL_VALIDATION,
    password: Yup.string().trim().required(t("validation_password_required")),
  })

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validateSchema,
    onSubmit: values => {
      setLoader(true);
      let formData = new FormData();
      formData.append("email", values.email);
      formData.append("password", values.password);

      psychicLogin(formData)
        .then((response) => {
          setLoader(false);
          if (response.success) {
            if (getSessionKey("psychic-remember-me") === "true") {
              Cookies.set("psychic-email", response?.data?.email, {
                expires: COOKIES_EXPIRATION,
              });
              Cookies.set("psychic-password", values.password, {
                expires: COOKIES_EXPIRATION,
              });
            } else {
              Cookies.remove("psychic-email");
              Cookies.remove("psychic-password");
            }
            console.log('--------response.data', response.data);
            setLocalKey(ROLE.PSYCHIC, JSON.stringify(response.data));
            localStorage.setItem('psychic', JSON.stringify(response.data))
            console.log('--------localstorgare.get item', localStorage.getItem('psychic'));
            Swal.fire({
              icon: "success",
              text: response.message,
              ...SWAL_SETTINGS,
            });
            handleNavigation({
              successURL: "/psychic",
              role: ROLE.PSYCHIC
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
    },
  });

  /** Remember last logged-in user >>>> */
  useEffect(() => {
    const storedUsername = Cookies.get("psychic-email");
    const storeUserpass = Cookies.get("psychic-password");
    if (storedUsername) {
      formik.setFieldValue("email", storedUsername);
    }
    if (storeUserpass) {
      formik.setFieldValue("password", storeUserpass);
    }
  }, []);
  /** Remember last logged-in user <<<< */

  const handleshow = () => {
    setShow(!show);
  };

  function handleRememberMe(e) {
    console.log(e.target.checked);
    if (e.target.checked) {
      setSessionKey("psychic-remember-me", "true");
    } else {
      removeSessionKey("psychic-remember-me");
      Cookies.remove("psychic-email");
      Cookies.remove("psychic-password");
    }
  }

  return (
    <div className='auth-page login-page'>
      <div className='container'>
        <div className='row'>
          <div className='col-md-6'>
            <div className='auth-form login-form'>
              <div className='auth-form-header'>
                <a href='/' aria-label="Go to homepage" ><img alt='Reloaded logo' src={logo} /></a>
              </div>
              <div className='auth-form-body'>
                <h2>{t("link_login")}</h2>
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
                  <div className='form-group mb-3'>
                    <label htmlFor='password' className='form-label cp'>{t("label_password")}</label>
                    <div className="input-group">
                      <input
                        type={!show === true ? "text" : "password"}
                        name='password'
                        id='password'
                        className='form-control'
                        placeholder={t("placeholder_enter_password")}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                      />
                      <span className="input-group-text cp" onClick={handleshow} >
                        {!show === true ? (
                          <i className="far fa-eye-slash"></i>
                        ) : (
                          <i className="far fa-eye"></i>
                        )}
                      </span>
                    </div>
                    <span className="text-danger d-flex text-left">
                      <CustomError name="password" form={formik} />
                    </span>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input cp"
                      type="checkbox"
                      id="flexCheckDefault"
                      onChange={handleRememberMe}
                      value={"true"}
                      defaultChecked={
                        (Cookies.get("psychic-email"),
                          Cookies.get("psychic-password"))
                      }
                    />
                    <div className='d-flex align-items-center justify-content-between'>
                    <label className="form-check-label cp" htmlFor="flexCheckDefault">
                      {t("remember_me")}
                    </label>
                    <Link to={`/psychic/forget-password`} className="cp fw-bold text-primary">
                      {t("link_forget_password")}
                    </Link>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary mt-2">{t("link_login")}</button>
                </form>
              </div>
            </div>
          </div>
          <div className='bg-login-img'>
            <img src={bgLogin} alt='All planets astrology image' />
            <img src={shapeLogin} className='stone-img' alt="" role="presentation"  />
          </div>
        </div>
      </div>
    </div>
  )
}
