import React, { useEffect, useState } from 'react'
import profileImage from "./../../../assets/website/images/profile.png"
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { editPsychicProfile, psychicProfileDetails } from '../services/profile.services';
import * as Yup from 'yup';
import { COMMON_INPUT_VALIDATION, NO_HTML_TAG, PHONE_VALIDATION } from '../../../utils/commonValidations';
import { EXPERTISE, INPUT_LENGTH_40, INPUT_LENGTH_50, INPUT_MAX_25, languageSpoken, PHONE_NO_LENGTH, ROLE, SWAL_SETTINGS, TEXTAREA_MAX_LENGTH, TEXTAREA_MAX_LENGTH_200 } from '../../../utils/Constants';
import { useFormik } from 'formik';
import { blockInvalidChar, DT, formDataToObject, globalLoader, handleServerValidations, setLocalKey } from '../../../utils/commonfunction';
import Swal from 'sweetalert2';
import CustomError from '../../../utils/customError';
import { useDispatch } from 'react-redux';
import { addPsychicData } from '../../../redux/slices/psychicDetails';
import PhoneInput from '../../../utils/PhoneInput';
export default function PsychicProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [showdefault, setShowDefault] = useState({});
  const [previewimage, setPreviewImage] = useState("");

  useEffect(() => {
    psychicProfileDetails()
      .then((response) => {
        setShowDefault(response && response.data ? response.data : []);
        setPreviewImage(response?.data?.profile_image);
      })
      .catch((error) => {
        console.log("error=====>", error);
      });
  }, []);

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().trim()
      .max(INPUT_LENGTH_40, DT(t("max_length_error_40"), [INPUT_LENGTH_40]))
      .concat(COMMON_INPUT_VALIDATION)
      .required(t("label_first_name_error")),
    last_name: Yup.string().trim()
      .max(INPUT_LENGTH_40, DT(t("max_length_error_40"), [INPUT_LENGTH_40]))
      .concat(COMMON_INPUT_VALIDATION)
      .required(t("label_last_name_error")),
    // last_name: Yup.string().trim().max(100, t("max_length_error")).required(t("label_last_name_error")),
    email: Yup.string()
      .trim()
      .email(t("label_email_invalid_format_error"))
      .test('custom-email', 'Invalid email format', (value) => {
        const regex = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$');
        return value && regex.test(value);
      })
      .required(t("label_email_required_error")),
    phone_number: PHONE_VALIDATION,
    expertise: Yup.string().trim().required(t("err_expertise_is_required")),
    experience: Yup.number()
      .min(0, "err_min_limit")
      .max(100, "err_max_limit")
      .required(t("err_experience_is_required")),
    language_spoken: Yup.string().required(t("err_language_spoken_is_required")),
    // credit_per_session: Yup.number().min(1, t("err_min_limit")).max(100000000, t("err_max_limit")).required("err_credit_per_session"),
    chat_credit_rate: Yup.number().min(1, t("err_min_limit")).max(100000000, t("err_max_limit")).required("err_chat_credit_rate"),
    audio_credit_rate: Yup.number().min(1, t("err_min_limit")).max(100000000, t("err_max_limit")).required("err_audio_credit_rate"),
    video_credit_rate: Yup.number().min(1, t("err_min_limit")).max(100000000, t("err_max_limit")).required("err_video_credit_rate"),
    city: Yup.string().trim()
      .max(INPUT_LENGTH_50, DT(t("max_length_error_50"), [INPUT_LENGTH_50]))
      .concat(COMMON_INPUT_VALIDATION)
      .concat(NO_HTML_TAG)
      .required(t("err_city_is_required")),
    state: Yup.string().trim()
      .max(INPUT_LENGTH_50, DT(t("max_length_error_50"), [INPUT_LENGTH_50]))
      .concat(COMMON_INPUT_VALIDATION)
      .concat(NO_HTML_TAG)
      .required(t("err_state_is_required")),
    pin_code: Yup.string().trim().required("err_pin_code_is_required").matches(/^[1-9]\d*$/, "err_pin_code_invalid"),
    bio: Yup.string().trim().required(t("err_bio_is_required")).max(TEXTAREA_MAX_LENGTH_200, DT(t("max_bio_length"), [TEXTAREA_MAX_LENGTH_200])),
    experience_summary: Yup.string().trim().required(t("err_experience_summary_is_required")).max(TEXTAREA_MAX_LENGTH_200, DT(t("max_experience_summary_length"), [TEXTAREA_MAX_LENGTH_200])),
    // consolation_fee: Yup.number().min(0, t("err_min_limit")).max(10000000, t("err_max_limit")).required(t("err_consolation_fee_is_required")),
    address: Yup.string()
      .max(TEXTAREA_MAX_LENGTH, DT(t("validation_max_input_characters"), [TEXTAREA_MAX_LENGTH]))
      .concat(COMMON_INPUT_VALIDATION)
      .concat(NO_HTML_TAG)
      .required(t("label_location_error")),
    profile_image: Yup.mixed()
      .nullable()
      .test(
        'fileOrUrl',
        'supported_file_error',
        value => {
          if (!value) return true;
          if (typeof value === 'string') return /^(http|https):\/\/[^\s$.?#].[^\s]*$/gm.test(value);
          return ['image/jpg', 'image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(value.type);
        }
      )
      .test(
        'fileSize',
        'image_max_size_error',
        value => {
          if (!value || typeof value === 'string') return true;
          return value.size <= 1.5 * 1024 * 1024;
        }
      ),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      first_name: showdefault && showdefault.first_name ? showdefault.first_name : "",
      last_name: showdefault && showdefault.last_name ? showdefault.last_name : "",
      email: showdefault && showdefault.email ? showdefault.email : "",
      phone_number: showdefault && showdefault?.phone_number ? showdefault?.phone_number : "",
      bio: showdefault && showdefault.bio ? showdefault.bio : "",
      experience_summary: showdefault && showdefault.experience_summary ? showdefault.experience_summary : "",
      expertise: showdefault && showdefault.expertise ? showdefault.expertise : "",
      experience: showdefault && showdefault.experience ? showdefault.experience : "",
      language_spoken: showdefault && showdefault.language_spoken ? showdefault.language_spoken : "",
      // credit_per_session: showdefault && showdefault.credit_per_session ? showdefault.credit_per_session : "",
      chat_credit_rate: showdefault && showdefault.chat_credit_rate ? showdefault.chat_credit_rate : "",
      audio_credit_rate: showdefault && showdefault.audio_credit_rate ? showdefault.audio_credit_rate : "",
      video_credit_rate: showdefault && showdefault.video_credit_rate ? showdefault.video_credit_rate : "",
      availability_hours: showdefault && showdefault.availability_hours ? showdefault.availability_hours : "",
      city: showdefault && showdefault.city ? showdefault.city : "",
      state: showdefault && showdefault.state ? showdefault.state : "",
      pin_code: showdefault && showdefault.pin_code ? showdefault.pin_code : "",
      address: showdefault && showdefault.address ? showdefault.address : "",
      // consolation_fee: showdefault && showdefault.consolation_fee ? showdefault.consolation_fee : "",
      profile_image: showdefault && showdefault.profile_image ? showdefault.profile_image : "",
    },
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      globalLoader(true);
      let formData = new FormData();
      // formData.append("o_id", params.id);
      formData.append("first_name", values.first_name);
      formData.append("last_name", values.last_name);
      formData.append("email", values.email);
      formData.append("phone_number", values.phone_number);
      formData.append("bio", values.bio);
      formData.append("experience_summary", values.experience_summary);
      formData.append("expertise", values.expertise);
      formData.append("experience", values.experience);
      formData.append("language_spoken", values.language_spoken);
      // formData.append("credit_per_session", values.credit_per_session);
      formData.append("chat_credit_rate", values.chat_credit_rate);
      formData.append("audio_credit_rate", values.audio_credit_rate);
      formData.append("video_credit_rate", values.video_credit_rate);
      formData.append("availability_hours", values.availability_hours);
      formData.append("city", values.city);
      formData.append("state", values.state);
      // formData.append("country", values.country);
      formData.append("pin_code", values.pin_code);
      formData.append("address", values.address);
      // formData.append("consolation_fee", values.consolation_fee);
      formData.append("profile_image", values.profile_image);
      const data = formDataToObject(formData);
      const finalData = { name: `${values.first_name} ${values.last_name}`, token: showdefault.token, ...data };
      editPsychicProfile(formData)
        .then((response) => {
          setSubmitting(false);
          if (response.success) {
            Swal.fire({
              icon: "success",
              text: response.message,
              ...SWAL_SETTINGS,
            });
            globalLoader(false);
            dispatch(addPsychicData(finalData));
          } else {
            Swal.fire({
              icon: "error",
              text: handleServerValidations(response),
              ...SWAL_SETTINGS,
            });
          }
          globalLoader(false);
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            text: handleServerValidations(error),
            ...SWAL_SETTINGS,
          });
          console.log("error ====> ", error);
        });
    },
  });

  return (
    <div className='inner-container py-5'>
      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col-md-9'>
            <div className='profile-wrapper'>
              <div className='profile-header mb-5'>
                <h1 className='heading-30-semibold text-center'>{t("heading_my_profile")}</h1>
              </div>
              <form onSubmit={formik.handleSubmit}>
                <div className='profile-body'>
                  <div className='d-flex flex-column row-gap-4'>
                    <div className='profile-image-card'>
                      <h4 className='heading-20-semibold'>{t("label_profile_picture")}</h4>
                      <div className='profile-image-wrapper'>
                        <img src={previewimage ? previewimage : profileImage} alt="profile-image" />
                        <label aria-label='Upload' className='btn btn-primary btn-icon btn-icon-32'><i className='ti ti-upload'></i>
                          <input
                            type="file"
                            id="profile_image"
                            name="profile_image"
                            accept="image/*"
                            onChange={(event) => {
                              formik.setFieldValue("profile_image", event.target.files[0] || "");
                              event.target.files.length === 1 ? setPreviewImage(URL.createObjectURL(event.target.files[0])) : setPreviewImage("");
                            }}
                          />
                        </label>
                        <span className="text-danger d-flex justify-content-center text-left">
                          <CustomError name="profile_image" form={formik} />
                        </span>
                      </div>
                    </div>
                    <div className='card'>
                      <div className='card-body'>
                        <h4 className='heading-20-semibold mb-3'>{t("label_personal_information")}</h4>
                        <div className='row row-gap-3'>
                          <div className='col-md-6'>
                            <div className='form-group'>
                              <label htmlFor='first_name' className='form-label cp'>{t("label_first_name")}</label>
                              <input type="text" className='form-control' id='first_name' name='first_name' placeholder={t("placeholder_first_name")} value={formik.values.first_name} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                              <span className="text-danger d-flex text-left">
                                <CustomError shortCodes={[INPUT_MAX_25]} name="first_name" form={formik} />
                              </span>
                            </div>
                          </div>
                          <div className='col-md-6'>
                            <div className='form-group'>
                              <label htmlFor='last_name' className='form-label'>{t("label_last_name")}</label>
                              <input type="text" className='form-control' placeholder={t("placeholder_last_name")} id='last_name' name='last_name' value={formik.values.last_name} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                              <span className="text-danger d-flex text-left">
                                <CustomError shortCodes={[INPUT_MAX_25]} name="last_name" form={formik} />
                              </span>
                            </div>
                          </div>
                          <div className='col-md-6'>
                            <div className='form-group'>
                              <label htmlFor='email' className='form-label'>{t("label_email_id")}</label>
                              <input disabled type="email" className='form-control' placeholder={t("placeholder_email_address")} id='email' name='email' value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                              <span className="text-danger d-flex text-left">
                                <CustomError name="email" form={formik} />
                              </span>
                            </div>
                          </div>
                          {/* <div className='col-md-6'>
                            <div className='form-group'>
                              <label htmlFor='phone_number' className='form-label'>{t("list_heading_phone_number")}</label>
                              <input type="text" className='form-control' placeholder={t("placeholder_phone_number")} id='phone_number' name='phone_number' value={formik.values.phone_number} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                              <span className="text-danger d-flex text-left">
                                <CustomError name="phone_number" form={formik} />
                              </span>
                            </div>
                          </div> */}
                          <div className='col-md-6'>
                            <div className='form-group'>
                              <label htmlFor='phone_number' className='form-label'>{t("list_heading_phone_number")}</label>
                              <PhoneInput
                                name="phone_number"
                                id="phone_number"
                                placeholder={t('placeholder_phone_number')}
                                onChange={(e) => { formik.setFieldValue('phone_number', e?.phone_number) }}
                                onBlur={formik.handleBlur}
                                value={formik.values.phone_number}
                                className="form-control"
                              />
                              <span className="text-danger d-flex text-left">
                                <CustomError name="phone_number" form={formik} shortCodes={{ PHONE_MIN_LENGTH: PHONE_NO_LENGTH.min, PHONE_MAX_LENGTH: PHONE_NO_LENGTH.max }} />
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='card'>
                      <div className='card-body'>
                        <h4 className='heading-20-semibold mb-3'>{t("label_professional_information")}</h4>
                        <div className='row row-gap-3'>
                          <div className='col-md-12'>
                            <div className='form-group'>
                              <label htmlFor='bio' className='form-label'>{t("label_bio_introduction")}</label>
                              <textarea className='form-control' placeholder={t("placeholder_bio_introduction")} id='bio' name='bio' value={formik.values.bio} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                              <span className="text-danger d-flex text-left">
                                <CustomError name="bio" form={formik} />
                              </span>
                            </div>
                          </div>
                          <div className='col-md-6'>
                            <div className='form-group'>
                              <label htmlFor='expertise' className='form-label'>{t("label_expertise_area")}</label>
                              <select className='form-control' id='expertise' name='expertise' value={formik.values.expertise} onChange={formik.handleChange} onBlur={formik.handleBlur} >
                                <option value="">{t("input_select_text")}</option>
                                {EXPERTISE.map((exp, i) => (
                                  <option key={i} value={exp.value}>{exp.name}</option>
                                ))}
                              </select>
                            </div>
                            <span className="text-danger d-flex text-left">
                              <CustomError name="expertise" form={formik} />
                            </span>
                          </div>
                          <div className='col-md-6'>
                            <div className='form-group'>
                              <label htmlFor='language_spoken' className='form-label'>{t("label_language_spoken")}</label>
                              <select className='form-control' id='language_spoken' name='language_spoken' value={formik.values.language_spoken} onChange={formik.handleChange} onBlur={formik.handleBlur} >
                                <option value="">{t("input_select_text")}</option>
                                {languageSpoken.map((lang, i) => (
                                  <option key={i} value={lang.code}>{lang.name}</option>
                                ))}
                              </select>
                              <span className="text-danger d-flex text-left">
                                <CustomError name="language_spoken" form={formik} />
                              </span>
                            </div>
                          </div>
                          <div className='col-md-6'>
                            <div className='form-group'>
                              <label htmlFor='experience' className='form-label'>{t("label_experience")} </label>
                              <div className='input-group'>
                                <input type="number" className='form-control' placeholder={t("placeholder_enter_experience")} id='experience' name='experience' value={formik.values.experience} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                <span className='input-group-text'>{t("label_year")}</span>
                              </div>
                              <span className="text-danger d-flex text-left">
                                <CustomError name="experience" form={formik} />
                              </span>
                            </div>
                          </div>
                          {/* <div className='col-md-6'>
                            <div className='form-group'>
                              <label htmlFor='credit_per_session' className='form-label'>{t("label_credit_per_session")}</label>
                              <input type="number" className='form-control' placeholder={t("placeholder_credit_per_session")} id='credit_per_session' name='credit_per_session' value={formik.values.credit_per_session} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                              <span className="text-danger d-flex text-left">
                                <CustomError name="credit_per_session" form={formik} />
                              </span>
                            </div>
                          </div> */}
                          <div className='col-md-12'>
                            <div className='form-group'>
                              <label htmlFor='experience_summary' className='form-label'>{t("label_experience_summary")}</label>
                              <textarea className='form-control' placeholder={t("placeholder_experience_summary")} id='experience_summary' name='experience_summary' value={formik.values.experience_summary} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                              <span className="text-danger d-flex text-left">
                                <CustomError name="experience_summary" form={formik} />
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='card'>
                      <div className='card-body'>
                        <h4 className='heading-20-semibold mb-3'>{t("label_address")}</h4>
                        <div className='row row-gap-3'>
                          <div className='col-md-6'>
                            <div className='form-group'>
                              <label htmlFor='city' className='form-label'>{t("label_city")}</label>
                              <input type='text' className='form-control' id='city' name='city' placeholder={t("placeholder_city")} value={formik.values.city} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                              <span className="text-danger d-flex text-left">
                                <CustomError name="city" form={formik} />
                              </span>
                            </div>
                          </div>
                          <div className='col-md-6'>
                            <div className='form-group'>
                              <label htmlFor='state' className='form-label'>{t("label_state")} </label>
                              <input type="text" className='form-control' placeholder={t("placeholder_state")} id='state' name='state' value={formik.values.state} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                              <span className="text-danger d-flex text-left">
                                <CustomError name="state" form={formik} />
                              </span>
                            </div>
                          </div>
                          <div className='col-md-6'>
                            <div className='form-group'>
                              <label htmlFor='pin_code' className='form-label'>{t("label_pin_code")}</label>
                              <input type="number" className='form-control' placeholder={t("placeholder_pin_code")} id='pin_code' name='pin_code' value={formik.values.pin_code} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                              <span className="text-danger d-flex text-left">
                                <CustomError name="pin_code" form={formik} />
                              </span>
                            </div>
                          </div>
                          <div className='col-md-6'>
                            <div className='form-group'>
                              <label htmlFor='address' className='form-label'>{t("label_address_location")}</label>
                              <input type="text" className='form-control' id='address' name='address' placeholder={t("placeholder_address_location")} value={formik.values.address} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                              <span className="text-danger d-flex text-left">
                                <CustomError name="address" form={formik} />
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='card'>
                      <div className='card-body'>
                        <h4 className='heading-20-semibold mb-3'>{t("label_credit_charge_per_session")}</h4>
                        <div className='row row-gap-3'>
                          {/* <div className='col-md-12'>
                            <div className='form-group'>
                              <label htmlFor='consolation_fee' className='form-label'>{t("label_consolation_fee_per_session")}</label>
                              <input type='number' className='form-control' id='consolation_fee' name='consolation_fee' placeholder={t("placeholder_amount")} value={formik.values.consolation_fee} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                              <span className="text-danger d-flex text-left">
                                <CustomError name="consolation_fee" form={formik} />
                              </span>
                            </div>
                          </div> */}
                          <div className='col-md-6'>
                            <div className='form-group'>
                              <label htmlFor='chat_credit_rate' className='form-label'>{t("label_chat_credit_rate")}</label>
                              <input type='number' className='form-control' id='chat_credit_rate' name='chat_credit_rate' placeholder={t("placeholder_credit_rate")} value={formik.values.chat_credit_rate} onChange={formik.handleChange} onBlur={formik.handleBlur} onKeyDown={blockInvalidChar} />
                              <span className="text-danger d-flex text-left">
                                <CustomError name="chat_credit_rate" form={formik} />
                              </span>
                            </div>
                          </div>
                          <div className='col-md-6'>
                            <div className='form-group'>
                              <label htmlFor='audio_credit_rate' className='form-label'>{t("label_audio_call_credit_rate")}</label>
                              <input type='number' className='form-control' id='audio_credit_rate' name='audio_credit_rate' placeholder={t("placeholder_credit_rate")} value={formik.values.audio_credit_rate} onChange={formik.handleChange} onBlur={formik.handleBlur} onKeyDown={blockInvalidChar}/>
                              <span className="text-danger d-flex text-left">
                                <CustomError name="audio_credit_rate" form={formik} />
                              </span>
                            </div>
                          </div>
                          <div className='col-md-6'>
                            <div className='form-group'>
                              <label htmlFor='video_credit_rate' className='form-label'>{t("label_video_call_credit_rate")}</label>
                              <input type='number' className='form-control' id='video_credit_rate' name='video_credit_rate' placeholder={t("placeholder_credit_rate")} value={formik.values.video_credit_rate} onChange={formik.handleChange} onBlur={formik.handleBlur} onKeyDown={blockInvalidChar} />
                              <span className="text-danger d-flex text-left">
                                <CustomError name="video_credit_rate" form={formik} />
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='button-profile-wrapper text-center'>
                      <button className='btn btn-primary'>{t("btn_update")}</button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}