import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Breadcrums from "../../common/breadcrumbs";
import { useTranslation } from "react-i18next";
import {
  EXPERTISE,
  GENDER,
  INPUT_LENGTH_15,
  languageSpoken,
  PHONE_NO_LENGTH,
  SWAL_SETTINGS,
  TEXTAREA_MAX_LENGTH,
} from "../../../../utils/Constants";
import {
  blockInvalidChar,
  DT,
  globalLoader,
  handleServerValidations,
  convertTimezoneToOffset
} from "../../../../utils/commonfunction";
import * as Yup from "yup";
import CustomError from "../../../../utils/customError";
import { Add } from "../../services/user.service";
import { cuisineOptions } from "../../../../utils/Constants";
import { DatePicker, TagPicker, TimePicker, Tooltip, Whisper } from "rsuite";
import PhoneInput from "../../../../utils/PhoneInput";
import { EMAIL_VALIDATION, PHONE_VALIDATION } from "../../../../utils/commonValidations";
import { useLoadScript } from '@react-google-maps/api';
import { format } from "date-fns";

const currentDate = new Date();
currentDate.setHours(0, 0 , 0, 0);

const LIBRARIES = ['places'];

const UserAdd = (props) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [previewimage, setPreviewImage] = useState("");
  const breadcrumbs = [
    { title: t("link_dashboard"), url: "/admin/dashboard" },
    {
      title: t("Users"),
      url: "/admin/user-management/user/list/1",
    },
    { title: t("link_add"), url: "" },
  ];

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().trim().max(100, "max_length_error").required("First name is required"),
    last_name: Yup.string().trim().max(100, "max_length_error").required("Last name is required"),
    // email: Yup.string()
    //   .trim()
    //   .email(t("label_email_invalid_format_error"))
    //   .test('no-uppercase', t("label_email_uppercase_error"), function (value) {
    //     if (value) {
    //       return !/[A-Z]/.test(value);
    //     }
    //     return true;
    //   })
    //   .required(t("label_email_required_error")),
    email: EMAIL_VALIDATION,
    phone_number: PHONE_VALIDATION,
    // expertise: Yup.string().trim().required("Expertise is required"),
    // experience: Yup.string().trim().required("Experience is required"),
    // language_spoken: Yup.string().required("Language spoken is required"),
    // rate_per_session: Yup.string().trim().required("Rate per session is required"),
    gender: Yup.string().trim().required("Gender is required"),
    city: Yup.string().trim().required("City is required"),
    state: Yup.string().trim().required("State is required"),
    country: Yup.string().trim().required("Country is required"),
    // pin_code: Yup.string().trim().required("Pin Code is required"),
    place_of_birth: Yup.string().trim().max(TEXTAREA_MAX_LENGTH, t("validation_max_input_characters")).required("Place of Birth is required"),
    date_of_birth: Yup.date().required("Date of Birth is required"),
    profile_image: Yup.mixed()
      .required(t('image_required_error'))
      .nullable()
      .test(
        'fileType',
        t('supported_file_error'),
        value => !value || ['image/jpg', 'image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(value.type)
      )
      .test(
        'fileSize',
        t('image_max_size_error'),
        value => !value || value.size <= 1.5 * 1024 * 1024
      ),
  });



  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      gender: "",
      // expertise: "tarot_reading",
      // experience: "",
      // language_spoken: "en",
      // rate_per_session: "",
      // availability_hours: "",
      city: "",
      state: "",
      country: "",
      // pin_code: "",
      place_of_birth: "",
      date_of_birth: "",
      time_of_birth: "",
      profile_image: "",
    },
    validateOnBlur: false,
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      globalLoader(true);
      setSubmitted(true);
      let formData = new FormData();
      formData.append("first_name", values.first_name);
      formData.append("last_name", values.last_name);
      formData.append("email", values.email);
      formData.append("phone_number", values.phone_number);
      formData.append("gender", values.gender);
      // formData.append("expertise", values.expertise);
      // formData.append("experience", values.experience);
      // formData.append("language_spoken", values.language_spoken);
      // formData.append("rate_per_session", values.rate_per_session);
      // formData.append("availability_hours", values.availability_hours);
      formData.append("city", values.city);
      formData.append("state", values.state);
      formData.append("country", values.country);
      // formData.append("pin_code", values.pin_code);
      formData.append("place_of_birth", values.place_of_birth);

      formData.append("latitude", values.latitude);
      formData.append("longitude", values.longitude);


      const dateOfBirth = new Date(values.date_of_birth);
      dateOfBirth.setHours(0, 0, 0, 0);
      const dateOfBirthISO = dateOfBirth.toISOString();
      formData.append("date_of_birth", dateOfBirthISO);

      formData.append("time_of_birth", values.time_of_birth);

      formData.append("profile_image", values.profile_image);

      Add(formData)
        .then((response) => {
          setSubmitting(false);
          if (response.success) {
            Swal.fire({
              icon: "success",
              text: response.message,
              ...SWAL_SETTINGS,
            });
            globalLoader(false);
            resetForm({ values: "" });
            navigate(`/admin/user-management/user/list/1`);
          } else {
            Swal.fire({
              icon: "error",
              text: handleServerValidations(response),
              ...SWAL_SETTINGS,
            });
            globalLoader(false);
            setSubmitted(false);
          }
        })
        .catch((error) => {
          console.log("error ====> ", error);
          Swal.fire({
              icon: "error",
              text: handleServerValidations(error),
              ...SWAL_SETTINGS,
            });
        });
    },
  });

   const { isLoaded, loadError } = useLoadScript({
      googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY, 
      libraries: LIBRARIES, 
    });
  
    const inputRef = useRef(null);
  
    useEffect(() => {
      if (isLoaded && window.google && inputRef.current) {
        const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
          types: ['geocode'], // Restrict to address types
        });
  
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place && place.geometry) {
            const latitude = place.geometry.location.lat();
            const longitude = place.geometry.location.lng();
  
            console.log(place);
            formik.setFieldValue('place_of_birth', place.formatted_address);
            formik.setFieldValue('latitude', latitude);
            formik.setFieldValue('longitude', longitude);
            formik.setFieldValue('city', "");
            formik.setFieldValue('state', "");
            formik.setFieldValue('country', "");
            // formik.setFieldValue('pin_code', "");
  
            // formik.setFieldValue('place_details', place);
            const timestamp = new Date().getTime() / 1000; // Current time in Unix timestamp format
            const timezoneUrl = `https://maps.googleapis.com/maps/api/timezone/json?location=${latitude},${longitude}&timestamp=${timestamp}&key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY}`;
  
            // Fetch the timezone information
            fetch(timezoneUrl)
              .then((response) => response.json())
              .then((data) => {
                if (data.status === 'OK') {
                  // Extract and set the timezone
                  const timezoneId = data.timeZoneId;
                  formik.setFieldValue('timezone', convertTimezoneToOffset(timezoneId));
                  console.log('Timezone:', convertTimezoneToOffset(timezoneId));
                  console.log('data time zone====---->:', data);
                } else {
                  console.error('Error fetching timezone:', data);
                }
              })
              .catch((error) => {
                console.error('Error:', error);
              });
  
          }
        });
      }
    }, [isLoaded]);
  
    if (loadError) return <div>Failed to load Google Maps API</div>;

  return (
    <>
      <Breadcrums data={breadcrumbs} />
      <form onSubmit={formik.handleSubmit}>
        <div className="row row-sm">
          <div className="col-lg-12 col-md-12 animation_fade">
            <div className="card custom-card">
              <div className="card-body">
                <div>
                  <h6 className="main-content-label mb-3">
                    {t("Add User")}
                  </h6>
                </div>
                <div className="row row-sm">

                  <div className="col-md-6 text-center form-group">
                    <label htmlFor="first_name" className="text-left d-flex">
                      {t("First Name")}:
                      <span className="requirestar">*</span>{" "}
                    </label>
                    <input
                      name="first_name"
                      id="first_name"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.first_name}
                      className="form-control"
                      placeholder={t("Enter first name")}
                    />
                    <span className="text-danger d-flex text-left">
                      <CustomError shortCodes={[INPUT_LENGTH_15]} name="first_name" form={formik} />
                    </span>
                  </div>

                  <div className="col-md-6 text-center form-group">
                    <label htmlFor="last_name" className="text-left d-flex">
                      {t("Last Name")}:
                      <span className="requirestar">*</span>{" "}
                    </label>
                    <input
                      name="last_name"
                      id="last_name"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.last_name}
                      className="form-control"
                      placeholder={t("Enter last name")}
                    />
                    <span className="text-danger d-flex text-left">
                      <CustomError shortCodes={[INPUT_LENGTH_15]} name="last_name" form={formik} />
                    </span>
                  </div>

                  <div className="col-lg-6 text-center form-group">
                    <label htmlFor="email" className="text-left d-flex">
                      {t("label_email")}:<span className="requirestar">*</span>{" "}
                    </label>
                    <input
                      name="email"
                      id="email"
                      type="email"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.email}
                      className="form-control"
                      placeholder={t("placeholder_email")}
                    />
                    <span className="text-danger d-flex text-left">
                      <CustomError name="email" form={formik} />
                    </span>
                  </div>

                  <div className="col-md-6 text-center form-group">
                    <label className="text-left d-flex" htmlFor="phone_number">
                      {t("label_phone_number")}:
                      <span className="requirestar">*</span>{" "}
                    </label>
                    <PhoneInput
                      name="phone_number"
                      id="phone_number"

                      onChange={(e) => { formik.setFieldValue('phone_number', e?.phone_number) }}

                      onBlur={formik.handleBlur}
                      value={formik.values.phone_number}
                      className="form-control"
                      placeholder={t('placeholder_phone_number')}

                    />
                    <span className="text-danger d-flex text-left">
                      <CustomError name="phone_number" form={formik} shortCodes={{ PHONE_MIN_LENGTH: PHONE_NO_LENGTH.min, PHONE_MAX_LENGTH: PHONE_NO_LENGTH.max }} />
                    </span>
                  </div>

                  <div className="col-md-6 text-center form-group">
                    <label htmlFor="gender" className="text-left d-flex">
                      {t("Gender")}:
                      <span className="requirestar">*</span>{" "}
                    </label>
                    <div className=" select-down-arrow">
                      <select
                        name="gender"
                        id="gender"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.gender}
                        className="form-control" >
                          <option key='' value=''>Select gender</option>
                        {(GENDER).map((gender, i) => {
                          return (
                            <option key={i} value={gender}>{t(`${gender}`)}</option>
                          )
                        })}
                      </select>
                      <span className="text-danger d-flex text-left">
                        <CustomError name="gender" form={formik} />
                      </span>
                    </div>
                  </div>
                  {/* <div className="col-md-6 text-center form-group">
                    <label htmlFor="expertise" className="text-left d-flex">
                      {t("Expertise Area")}:
                      <span className="requirestar">*</span>{" "}
                    </label>
                    <div className=" select-down-arrow">
                      <select
                        name="expertise"
                        id="expertise"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.expertise}
                        className="form-control" >
                        {(EXPERTISE).map((exp, i) => {
                          return (
                            <option key={i} value={exp.value}>{t(`${exp.name}`)}</option>
                          )
                        })}
                      </select>
                      <span className="text-danger d-flex text-left">
                        <CustomError name="expertise" form={formik} />
                      </span>
                    </div>
                  </div> */}

                  {/* <div className="col-md-6 text-center form-group">
                    <label htmlFor="experience" className="text-left d-flex">
                      {t("Experience (Year)")}:
                      <span className="requirestar">*</span>{" "}
                    </label>
                    <div className="input-group">
                      <input
                        name="experience"
                        id="experience"
                        type="number"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.experience}
                        className="form-control"
                        placeholder={t("Enter experience")}
                      />
                      <span className="input-group-text">Year</span>
                    </div>
                    <span className="text-danger d-flex text-left">
                      <CustomError name="experience" form={formik} />
                    </span>
                  </div> */}

                  {/* <div className="col-md-6 text-center form-group">
                    <label htmlFor="language_spoken" className="text-left d-flex">
                      {t("Language spoken")}:
                      <span className="requirestar">*</span>{" "}
                    </label>
                    <div className=" select-down-arrow">
                      <select
                        name="language_spoken"
                        id="language_spoken"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.language_spoken}
                        className="form-control" >
                        {(languageSpoken).map((value, i) => {
                          return (
                            <option key={i} value={value.code}>{t(`${value.name}`)}</option>
                          )
                        })}
                      </select>
                    </div>
                    <span className="text-danger d-flex text-left">
                      <CustomError name="language_spoken" form={formik} />
                    </span>
                  </div> */}

                  {/* <div className="col-md-6 text-center form-group">
                    <label htmlFor="rate_per_session" className="text-left d-flex">
                      {t("Rate Per Session")}:
                      <span className="requirestar">*</span>{" "}
                    </label>
                    <input
                      name="rate_per_session"
                      id="rate_per_session"
                      type="number"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.rate_per_session}
                      className="form-control"
                      placeholder={t("Enter rate per session")}
                    />
                    <span className="text-danger d-flex text-left">
                      <CustomError name="rate_per_session" form={formik} />
                    </span>
                  </div> */}

                   <div className="col-md-6 text-center form-group">
                      <label htmlFor="date_of_birth" className="text-left d-flex">
                        Date of Birth:
                        <span className="requirestar">*</span>{" "}
                      </label>
                      <DatePicker
                        oneTap={true}
                        classPrefix="userInput"
                        placeholder="Enter Date of Birth"
                        placement="autoVertical"
                        format="dd/MM/yyyy"
                        cleanable={false}
                        editable={false}
                        name="date_of_birth"
                        shouldDisableDate={(date) => date < currentDate}  // Disable past dates
                        onChange={(date) => formik.setFieldValue("date_of_birth", date)}
                        value={formik.values.date_of_birth}
                        onBlur={formik.handleBlur}
                        // caretAs={CustomBase64Caret}
                      />
                      <span className="text-danger d-flex text-left">
                        <CustomError name="date_of_birth" form={formik} />
                      </span>
                  </div>  

                  <div className="col-md-6 text-center form-group">
                    <label htmlFor="time_of_birth" className="text-left d-flex">
                      Time of Birth:
                    </label>
                    <TimePicker
                    // container={() => document.getElementById('ManageAvailability')} // important!
                      name='time_of_birth'
                      value={
                        formik.values?.time_of_birth
                          ? new Date(`2024-01-01T${formik.values.time_of_birth}:00`)
                          : null
                      }
                      onChange={(value) => {
                        const formatted = value ? format(value, "HH:mm") : "";
                        formik.setFieldValue("time_of_birth", formatted);
                      }}
                      onBlur={formik.handleBlur}
                      format="HH:mm"
                      placeholder="Enter Time of Birth"
                      // hideMinutes={minute => minute % 60 !== 0}
                      editable={false}
                      showNow={false}
                    />
                  </div>

                  <div className="col-md-6 text-center form-group">
                    <label htmlFor="place_of_birth" className="text-left d-flex">
                      Place of Birth:
                      <span className="requirestar">*</span>{' '}
                    </label>
                    <input
                      name="place_of_birth"
                      id="place_of_birth"
                      type="text"
                      ref={inputRef}
                      autoComplete="off"  
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.place_of_birth}
                      className="form-control"
                      placeholder={t('placeholder_address')}
                    />
                    <span className="text-danger d-flex text-left">
                      <CustomError shortCodes={['TEXTAREA_MAX_LENGTH']} name="place_of_birth" form={formik} />
                    </span>
                  </div>

                  <div className="col-md-6 text-center form-group">
                    <label htmlFor="city" className="text-left d-flex">
                      {t("City")}:
                      <span className="requirestar">*</span>{" "}
                    </label>
                    <input
                      name="city"
                      id="city"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.city}
                      className="form-control"
                      placeholder={t("Enter city")}
                      disabled={true}
                    />
                    <span className="text-danger d-flex text-left">
                      <CustomError name="city" form={formik} />
                    </span>
                  </div>

                  <div className="col-md-6 text-center form-group">
                    <label htmlFor="state" className="text-left d-flex">
                      {t("State")}:
                      <span className="requirestar">*</span>{" "}
                    </label>
                    <input
                      name="state"
                      id="state"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.state}
                      className="form-control"
                      placeholder={t("Enter state")}
                      disabled={true}
                    />
                    <span className="text-danger d-flex text-left">
                      <CustomError name="state" form={formik} />
                    </span>
                  </div>

                  <div className="col-md-6 text-center form-group">
                    <label htmlFor="country" className="text-left d-flex">
                      {t("Country")}:
                      <span className="requirestar">*</span>{" "}
                    </label>
                    <input
                      name="country"
                      id="country"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.country}
                      className="form-control"
                      placeholder={t("Enter country")}
                      disabled={true}
                    />
                    <span className="text-danger d-flex text-left">
                      <CustomError name="country" form={formik} />
                    </span>
                  </div>

                  {/* <div className="col-md-6 text-center form-group">
                    <label htmlFor="pin_code" className="text-left d-flex">
                      {t("Pin code")}:
                      <span className="requirestar">*</span>{" "}
                    </label>
                    <input
                      name="pin_code"
                      id="pin_code"
                      type="number"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.pin_code}
                      className="form-control"
                      placeholder={t("Enter pin code")}
                      disabled={true}
                    />
                    <span className="text-danger d-flex text-left">
                      <CustomError name="pin_code" form={formik} />
                    </span>
                  </div> */}

                  {/* <div className="col-md-6 text-center form-group">
                    <label htmlFor="place_of_birth" className="text-left d-flex">
                      Place of Birth:
                      <span className="requirestar">*</span>{" "}
                    </label>
                    <input
                      name="place_of_birth"
                      id="place_of_birth"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.place_of_birth}
                      className="form-control"
                      placeholder="Enter Place of Birth"
                    />
                    <span className="text-danger d-flex text-left">
                      <CustomError shortCodes={[TEXTAREA_MAX_LENGTH]} name="place_of_birth" form={formik} />
                    </span>
                  </div> */}

                   

                  <div className="col-lg-6 text-center form-group">
                    <label htmlFor="profile_image" className="text-left d-flex">
                      Profile Image:
                      {" "}
                      <Whisper
                        placement="top"
                        controlId="control-id-hover"
                        trigger="hover"
                        speaker={
                          <Tooltip>
                            {t("image_support_tooltip")}
                          </Tooltip>
                        }
                      >
                        <span className="field-more-info mt-1 ms-1 cp">
                          ?
                        </span>
                      </Whisper>
                    </label>
                    <input
                      className="form-control imgInput"
                      id="profile_image"
                      name="profile_image"
                      accept="image/*"
                      type="file"
                      onChange={(event) => {
                        formik.setFieldValue(
                          "profile_image",
                          event.target.files[0] || ""
                        );
                        event.target.files.length === 1
                          ? setPreviewImage(
                            URL.createObjectURL(event.target.files[0])
                          )
                          : setPreviewImage("");
                      }}
                    />
                    <span className="text-danger d-flex text-left">
                      <CustomError name="profile_image" form={formik} />
                    </span>

                    {previewimage ? (
                      <ul className="question-image-preview questions-ul">
                        <li className="pr_img_box">
                          <img
                            src={previewimage}
                            style={{ height: "100px" }}
                            alt={"Profile_Img"}
                          />
                          <div className="img_options">
                            <button type="button" className="text-danger"
                              onClick={() => {
                                // console.log(previewResImage , previewimage)
                                setPreviewImage("");
                                formik.setFieldValue("profile_image", null);
                                document.getElementById("profile_image").value = ""
                              }}>
                              <i className="ri-delete-bin-6-fill"></i>
                            </button>
                          </div>
                        </li>
                      </ul>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="mt-5">
                    <button
                      className="btn btn-info mr-2"
                      type="submit"
                      disabled={submitted ? true : null}
                    >
                      <i className="ace-icon fa fa-check bigger-110 mx-1"></i>
                      {t("btn_submit")}
                    </button>
                    <button
                      className="btn ripple btn-secondary"
                      type="button"
                      disabled={submitted ? true : null}
                      onClick={() => navigate(-1)}
                    >
                      <i className="ace-icon fa fa-times bigger-110 mx-1"></i>
                      {t("btn_cancel")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default UserAdd;