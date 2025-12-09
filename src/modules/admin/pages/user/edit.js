import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrums from "../../common/breadcrumbs";
import { SWAL_SETTINGS, PHONE_NO_LENGTH, INPUT_MAX_25, TEXTAREA_MAX_LENGTH, languageSpoken, EXPERTISE, GENDER, INPUT_LENGTH_25, INPUT_LENGTH_20, INPUT_LENGTH_100 } from "../../../../utils/Constants";
import {
  handleServerValidations,
  DT,
  globalLoader,
  convertTimezoneToOffset
} from "../../../../utils/commonfunction";
import * as Yup from "yup";
import CustomError from "../../../../utils/customError";
import { useTranslation } from "react-i18next";
import { Details, Edit } from "../../services/psychic.services";
import { cuisineOptions } from "../../../../utils/Constants";
import { DatePicker, TagPicker, Tooltip, Whisper } from "rsuite";
import PhoneInput from "../../../../utils/PhoneInput";
import { EMAIL_VALIDATION, PHONE_VALIDATION } from "../../../../utils/commonValidations";
import logo from '../../../../assets/admin/img/calenderLogo.png';
import { userDetails, userEdit } from "../../services/user.service";
import { useLoadScript } from '@react-google-maps/api';

const CustomBase64Caret = () => (
  <img
    src={logo}
    alt="Custom Caret"
    style={{ width: 20, height: 20 }}
  />
);

const LIBRARIES = ['places'];
const UserEdit = (props) => {
  const navigate = useNavigate();
  const params = useParams();
  const { t } = useTranslation();
  const [showdefault, setShowDefault] = useState({});
  const [previewimage, setPreviewImage] = useState("");
  const [saveType, setSaveType] = useState("");
  const breadcrumbs = [
    { title: t("link_dashboard"), url: "/admin/dashboard" },
    {
      title: t("User"),
      url: "/admin/user-management/user/list/1",
    },
    { title: t("Edit"), url: "" },
  ];

  useEffect(() => {
    userDetails(params.id)
      .then((response) => {
        setShowDefault(response && response.data ? response.data : []);
        setPreviewImage(response?.data?.profile_image);
      })
      .catch((error) => {
        console.log("error=====>", error);
      });
  }, [params.id]);


  const validationSchema = Yup.object().shape({
    first_name: Yup.string().trim().max(100, "max_length_error").required("First name is required"),
    last_name: Yup.string().trim().max(100, "max_length_error").required("Last name is required"),
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
    pin_code: Yup.string().trim().required("Pin Code is required"),
    place_of_birth: Yup.string().trim().max(TEXTAREA_MAX_LENGTH, t("validation_max_input_characters")).required('Place of Birth is required'),
    // date_of_birth: Yup.string().trim().required("Date of Birth is required"),
    // time_of_birth: Yup.string().trim().required("Time of Birth is required"),
    // place_of_birth: Yup.string().max(TEXTAREA_MAX_LENGTH, DT(t("validation_max_input_characters"), [TEXTAREA_MAX_LENGTH])).required("Place of Birth is required"),
    profile_image: Yup.mixed()
      .required(t('image_required_error'))
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
      gender: showdefault && showdefault.gender ? showdefault.gender : "",
      city: showdefault.city || '',
      state: showdefault.state || '',
      country: showdefault.country || '',
      pin_code: showdefault.pin_code || '',
      place_of_birth: showdefault.place_of_birth || '',
      // date_of_birth: showdefault && showdefault.date_of_birth ? showdefault.date_of_birth : "",
      // time_of_birth: showdefault && showdefault.time_of_birth ? showdefault.time_of_birth : "",
      // place_of_birth: showdefault && showdefault.place_of_birth ? showdefault.place_of_birth : "",
      // latitude: showdefault && showdefault.latitude ? showdefault.latitude : "",
      // longitude: showdefault && showdefault.longitude ? showdefault.longitude : "",
      // timezone: showdefault && showdefault.timezone ? showdefault.timezone : "",
      profile_image: showdefault && showdefault.profile_image ? showdefault.profile_image : "",
    },
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      globalLoader(true);
      let formData = new FormData();
      formData.append("o_id", params.id);
      formData.append("first_name", values.first_name);
      formData.append("last_name", values.last_name);
      formData.append("email", values.email);
      formData.append("phone_number", values.phone_number);
      formData.append("gender", values.gender);
      // formData.append("date_of_birth", values.date_of_birth);
      // formData.append("time_of_birth", values.time_of_birth);
      // formData.append("place_of_birth", values.place_of_birth);
      // formData.append("latitude", values.latitude);
      // formData.append("longitude", values.longitude);
      // formData.append("timezone", values.timezone);
      formData.append("city", values.city);
      formData.append("state", values.state);
      formData.append("country", values.country);
      formData.append("pin_code", values.pin_code);
      formData.append("place_of_birth", values.place_of_birth);
      formData.append("profile_image", values.profile_image);
      userEdit(formData)
        .then((response) => {
          setSubmitting(false);
          if (response.success) {
            Swal.fire({
              icon: "success",
              text: response.message,
              ...SWAL_SETTINGS,
            });
            globalLoader(false);
            if (saveType !== "Save") {
              navigate(`/admin/user-management/user/list/1`);
            }
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
                    {t("Edit User")}
                  </h6>
                </div>
                <div className="row row-sm">

                  <div className="col-md-6 text-center form-group">
                    <label htmlFor="first_name" className="text-left d-flex">
                      {t("First name")}:
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
                      <CustomError shortCodes={[INPUT_MAX_25]} name="first_name" form={formik} />
                    </span>
                  </div>
                  <div className="col-md-6 text-center form-group">
                    <label htmlFor="last_name" className="text-left d-flex">
                      {t("Last name")}:
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
                      <CustomError shortCodes={[INPUT_MAX_25]} name="last_name" form={formik} />
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
                    />
                    <span className="text-danger d-flex text-left">
                      <CustomError name="country" form={formik} />
                    </span>
                  </div>

                  <div className="col-md-6 text-center form-group">
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
                    />
                    <span className="text-danger d-flex text-left">
                      <CustomError name="pin_code" form={formik} />
                    </span>
                  </div>

                  <div className="col-md-6 text-center form-group">
                    <label htmlFor="address" className="text-left d-flex">
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
                  </div>

                  {/* <div className="col-md-6 text-center form-group">
                    <label htmlFor="date_of_birth" className="text-left d-flex">
                      {t("Date of birth")}:
                      <span className="requirestar">*</span>{" "}
                    </label>
                    <DatePicker
                      oneTap={true}
                      classPrefix="userInput"
                      placeholder={t("placeholder_date")}
                      placement="autoVertical"
                      format="dd/MM/yyyy"
                      cleanable={false}
                      editable={false}
                      name="date_of_birth"
                      // shouldDisableDate={(date) => isBefore(date, new Date(yesterday))}
                      onChange={(e) => {
                        formik.setFieldTouched("date_of_birth", true);
                        formik.setFieldValue("date_of_birth", e);
                      }}
                      value={new Date(formik.values.date_of_birth)}
                      onBlur={formik.handleBlur}
                      caretAs={CustomBase64Caret}
                    />
                    <CustomError name="date_of_birth" form={formik} className="text-danger" />
                    <span className="text-danger d-flex text-left">
                      <CustomError name="date_of_birth" form={formik} />
                    </span>
                  </div>

                  <div className="col-md-6 text-center form-group">
                    <label htmlFor="time_of_birth" className="text-left d-flex">
                      {t("Time of Birth")}:
                      <span className="requirestar">*</span>{" "}
                    </label>
                    <DatePicker
                      classPrefix="userInput"
                      placement="autoVertical"
                      format="HH:mm"
                      cleanable={false}
                      editable={true}
                      name="time_of_birth"
                      onChange={(e) => {
                        formik.setFieldTouched("time_of_birth", true);
                        formik.setFieldValue("time_of_birth", e);
                      }}
                      value={new Date(formik.values.time_of_birth)}
                      onBlur={formik.handleBlur}
                    />
                    <span className="text-danger d-flex text-left">
                      <CustomError name="time_of_birth" form={formik} />
                    </span>
                  </div>
                  */}

                  {/* <div className="col-md-6 text-center form-group">
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
                  </div>  */}

                  <div className="col-lg-6 text-center form-group">
                    <label htmlFor="restaurant_logo" className="text-left d-flex">
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
                            alt={"profileImg"}
                          />
                        </li>
                      </ul>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="mt-5">
                    <button
                      onClick={() => {
                        setSaveType("Save");
                      }}
                      className="btn btn-info mr-2"
                      type="submit"
                    >
                      <i className="ace-icon fa fa-check bigger-110 mx-1"></i>
                      {t("btn_save")}
                    </button>
                    <button
                      onClick={() => {
                        setSaveType("");
                      }}
                      className="btn btn-success mr-2"
                      type="submit"
                    >
                      <i className="ace-icon fa fa-check bigger-110 mx-1"></i>
                      {t("btn_save_exit")}
                    </button>
                    <button
                      className="btn ripple btn-secondary"
                      type="button"
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

export default UserEdit;