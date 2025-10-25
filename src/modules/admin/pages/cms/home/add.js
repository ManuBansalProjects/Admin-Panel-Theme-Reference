import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import Breadcrums from "../../../common/breadcrumbs";
import { globalLoader, handleServerValidations } from "../../../../../utils/commonfunction";
import CustomError from "../../../../../utils/customError";
import { SWAL_SETTINGS } from "../../../../../utils/Constants";
import { COMMON_INPUT_VALIDATION } from "../../../../../utils/commonValidations";
import CustomCkeditor from "../../../common/customeditor";
import { Tooltip, Whisper } from "rsuite";
import { AboutUsDetails, AddAboutUs, EditAboutUs } from "../../../services/aboutUs";
import Loader from "../../../common/loader";
import { HomePageSectionAdd, HomePageSectionDetails } from "../../../services/homePage.services";

const WebsiteHomeAdd = (props) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [previewSpiritualAdvisorVideo, setPreviewSpiritualAdvisorVideo] = useState("");
  const [previewImages, setPreviewImages] = useState([]);
  const [defaultData, setDefaultData] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);
  const breadcrumbs = [
    { title: t("link_dashboard"), url: "/admin/dashboard" },
    {
      title: t("Home Page Section"),
      url: "/admin/cms/question/list/1",
    },
    { title: t("link_add"), url: "" },
  ];

  useEffect(() => {
    HomePageSectionDetails()
      .then((response) => {
        setDefaultData(response?.data);
        setPreviewSpiritualAdvisorVideo(response?.data?.spiritual_advisor_video);
        // response?.data?.option?.map((opt) => (
        //   setPreviewImages((prev) => [...prev, opt.option_image])
        // ))
        setTimeout(() => {
          setDataLoaded(true);
        }, 100);
      })
      .catch((error) => {
        console.log("error=====>", error);
      })
  }, []);

  console.log("defaultData-->", defaultData);

  const validationSchema = Yup.object().shape({
    question_title: Yup.string().trim().max(100, "max_length_error")
      .required("Option is required")
      .concat(COMMON_INPUT_VALIDATION),
    question_type: Yup.string().trim().max(100, "Cannot exceed 100 words").required("Question type is required"),
    option: Yup.array()
      .min(1, 'At least one option is required')
      .of(
        Yup.object({
          option_slug: Yup.string()
            .min(1, 'Option slug cannot be empty')
            .required('Option slug is required'),
          option_value: Yup.string()
            .min(1, 'Option value cannot be empty')
            .required('Option value is required'),
        })
      )
      .required('Option array is required'),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      main_heading_en: defaultData && defaultData.main_heading_en ? defaultData.main_heading_en : "",
      main_heading_de: defaultData && defaultData.main_heading_de ? defaultData.main_heading_de : "",
      main_heading_es: defaultData && defaultData.main_heading_es ? defaultData.main_heading_es : "",
      main_heading_hu: defaultData && defaultData.main_heading_hu ? defaultData.main_heading_hu : "",
      main_description_en: defaultData && defaultData.main_description_en ? defaultData.main_description_en : "",
      main_description_de: defaultData && defaultData.main_description_de ? defaultData.main_description_de : "",
      main_description_es: defaultData && defaultData.main_description_es ? defaultData.main_description_es : "",
      main_description_hu: defaultData && defaultData.main_description_hu ? defaultData.main_description_hu : "",
      spiritual_advisor_heading_en: defaultData && defaultData.spiritual_advisor_heading_en ? defaultData.spiritual_advisor_heading_en : "",
      spiritual_advisor_heading_de: defaultData && defaultData.spiritual_advisor_heading_de ? defaultData.spiritual_advisor_heading_de : "",
      spiritual_advisor_heading_es: defaultData && defaultData.spiritual_advisor_heading_es ? defaultData.spiritual_advisor_heading_es : "",
      spiritual_advisor_heading_hu: defaultData && defaultData.spiritual_advisor_heading_hu ? defaultData.spiritual_advisor_heading_hu : "",
      spiritual_advisor_description_en: defaultData && defaultData.spiritual_advisor_description_en ? defaultData.spiritual_advisor_description_en : "",
      spiritual_advisor_description_de: defaultData && defaultData.spiritual_advisor_description_de ? defaultData.spiritual_advisor_description_de : "",
      spiritual_advisor_description_es: defaultData && defaultData.spiritual_advisor_description_es ? defaultData.spiritual_advisor_description_es : "",
      spiritual_advisor_description_hu: defaultData && defaultData.spiritual_advisor_description_hu ? defaultData.spiritual_advisor_description_hu : "",
      spiritual_advisor_video: defaultData && defaultData.spiritual_advisor_video ? defaultData.spiritual_advisor_video : "",
      services_heading_en: defaultData && defaultData.services_heading_en ? defaultData.services_heading_en : "",
      services_heading_de: defaultData && defaultData.services_heading_de ? defaultData.services_heading_de : "",
      services_heading_es: defaultData && defaultData.services_heading_es ? defaultData.services_heading_es : "",
      services_heading_hu: defaultData && defaultData.services_heading_hu ? defaultData.services_heading_hu : "",
      services_description_en: defaultData && defaultData.services_description_en ? defaultData.services_description_en : "",
      services_description_de: defaultData && defaultData.services_description_de ? defaultData.services_description_de : "",
      services_description_es: defaultData && defaultData.services_description_es ? defaultData.services_description_es : "",
      services_description_hu: defaultData && defaultData.services_description_hu ? defaultData.services_description_hu : "",
      how_we_work_heading_en: defaultData && defaultData.how_we_work_heading_en ? defaultData.how_we_work_heading_en : "",
      how_we_work_heading_de: defaultData && defaultData.how_we_work_heading_de ? defaultData.how_we_work_heading_de : "",
      how_we_work_heading_es: defaultData && defaultData.how_we_work_heading_es ? defaultData.how_we_work_heading_es : "",
      how_we_work_heading_hu: defaultData && defaultData.how_we_work_heading_hu ? defaultData.how_we_work_heading_hu : "",
      how_we_work_description_en: defaultData && defaultData.how_we_work_description_en ? defaultData.how_we_work_description_en : "",
      how_we_work_description_de: defaultData && defaultData.how_we_work_description_de ? defaultData.how_we_work_description_de : "",
      how_we_work_description_es: defaultData && defaultData.how_we_work_description_es ? defaultData.how_we_work_description_es : "",
      how_we_work_description_hu: defaultData && defaultData.how_we_work_description_hu ? defaultData.how_we_work_description_hu : "",
      download_app_heading_en: defaultData && defaultData.download_app_heading_en ? defaultData.download_app_heading_en : "",
      download_app_heading_de: defaultData && defaultData.download_app_heading_de ? defaultData.download_app_heading_de : "",
      download_app_heading_es: defaultData && defaultData.download_app_heading_es ? defaultData.download_app_heading_es : "",
      download_app_heading_hu: defaultData && defaultData.download_app_heading_hu ? defaultData.download_app_heading_hu : "",
      download_app_description_en: defaultData && defaultData.download_app_description_en ? defaultData.download_app_description_en : "",
      download_app_description_de: defaultData && defaultData.download_app_description_de ? defaultData.download_app_description_de : "",
      download_app_description_es: defaultData && defaultData.download_app_description_es ? defaultData.download_app_description_es : "",
      download_app_description_hu: defaultData && defaultData.download_app_description_hu ? defaultData.download_app_description_hu : "",
    },
    validateOnBlur: false,
    // validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      globalLoader(true);
      setSubmitted(true);
      let formData = new FormData();
      formData.append("main_heading_en", values.main_heading_en);
      formData.append("main_heading_de", values.main_heading_de);
      formData.append("main_heading_es", values.main_heading_es);
      formData.append("main_heading_hu", values.main_heading_hu);
      formData.append("main_description_en", values.main_description_en);
      formData.append("main_description_de", values.main_description_de);
      formData.append("main_description_es", values.main_description_es);
      formData.append("main_description_hu", values.main_description_hu);
      formData.append("spiritual_advisor_heading_en", values.spiritual_advisor_heading_en);
      formData.append("spiritual_advisor_heading_de", values.spiritual_advisor_heading_de);
      formData.append("spiritual_advisor_heading_es", values.spiritual_advisor_heading_es);
      formData.append("spiritual_advisor_heading_hu", values.spiritual_advisor_heading_hu);
      formData.append("spiritual_advisor_description_en", values.spiritual_advisor_description_en);
      formData.append("spiritual_advisor_description_de", values.spiritual_advisor_description_de);
      formData.append("spiritual_advisor_description_es", values.spiritual_advisor_description_es);
      formData.append("spiritual_advisor_description_hu", values.spiritual_advisor_description_hu);
      formData.append("spiritual_advisor_video", values.spiritual_advisor_video);
      formData.append("services_heading_en", values.services_heading_en);
      formData.append("services_heading_de", values.services_heading_de);
      formData.append("services_heading_es", values.services_heading_es);
      formData.append("services_heading_hu", values.services_heading_hu);
      formData.append("services_description_en", values.services_description_en);
      formData.append("services_description_de", values.services_description_de);
      formData.append("services_description_es", values.services_description_es);
      formData.append("services_description_hu", values.services_description_hu);
      formData.append("how_we_work_heading_en", values.how_we_work_heading_en);
      formData.append("how_we_work_heading_de", values.how_we_work_heading_de);
      formData.append("how_we_work_heading_es", values.how_we_work_heading_es);
      formData.append("how_we_work_heading_hu", values.how_we_work_heading_hu);
      formData.append("how_we_work_description_en", values.how_we_work_description_en);
      formData.append("how_we_work_description_de", values.how_we_work_description_de);
      formData.append("how_we_work_description_es", values.how_we_work_description_es);
      formData.append("how_we_work_description_hu", values.how_we_work_description_hu);
      formData.append("download_app_heading_en", values.download_app_heading_en);
      formData.append("download_app_heading_de", values.download_app_heading_de);
      formData.append("download_app_heading_es", values.download_app_heading_es);
      formData.append("download_app_heading_hu", values.download_app_heading_hu);
      formData.append("download_app_description_en", values.download_app_description_en);
      formData.append("download_app_description_de", values.download_app_description_de);
      formData.append("download_app_description_es", values.download_app_description_es);
      formData.append("download_app_description_hu", values.download_app_description_hu);

      HomePageSectionAdd(formData)
        .then((response) => {
          setSubmitting(false);
          if (response.success) {
            Swal.fire({
              icon: "success",
              text: response.message,
              ...SWAL_SETTINGS,
            });
            globalLoader(false);
            // resetForm({ values: "" });
            // navigate(`/admin/cms/about-us`);
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
        });
    },
  });

  const handleAddOption = () => {
    formik.setFieldValue("option", [
      ...formik.values.option,
      { option_name: "", option_designation: "", option_image: "" },
    ]);

    setPreviewImages([...previewImages, null]);
  };

  const handleRemoveOption = (index) => {
    const newOptions = formik.values.option.filter((_, i) => i !== index);
    formik.setFieldValue("option", newOptions);

    const newPreviewImages = [...previewImages];
    newPreviewImages.splice(index, 1);
    setPreviewImages(newPreviewImages);
  };

  const handleImageChange = (event, index) => {
    const file = event.target.files[0];

    if (file) {
      formik.setFieldValue(`option[${index}].option_image`, file);
      const newPreviewImages = [...previewImages];
      newPreviewImages[index] = URL.createObjectURL(file);
      setPreviewImages(newPreviewImages);
    } else {
      formik.setFieldValue(`option[${index}].option_image`, null);
      const newPreviewImages = [...previewImages];
      newPreviewImages[index] = null;
      setPreviewImages(newPreviewImages);
    }
  };

  console.log("value--->", formik.values);
  console.log("errors--->", formik.errors);
  // console.log("previewImages--->", previewImages);

  return (
    <>
      <Breadcrums data={breadcrumbs} />
      {dataLoaded ?
        <form onSubmit={formik.handleSubmit}>
          <div className="row row-sm">
            <div className="col-lg-12 col-md-12 animation_fade">
              <div className="card custom-card">
                <div className="card-body">
                  <div>
                    <h6 className="main-content-label mb-3">
                      {t("Website Home")}
                    </h6>
                  </div>
                  <div className="row row-sm">
                    <h3>Main section</h3>
                    <div className="col-md-6 text-center form-group">
                      <label htmlFor="main_heading_en" className="text-left d-flex">
                        {t("Main Heading (English)")}:
                        <span className="requirestar">*</span>{" "}
                      </label>
                      <input
                        name="main_heading_en"
                        id="main_heading_en"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.main_heading_en}
                        className="form-control"
                        placeholder={t("Enter heading 1 (English)")}
                      />
                      <span className="text-danger d-flex text-left">
                        <CustomError name="main_heading_en" form={formik} />
                      </span>
                    </div>

                    <div className="col-md-6 text-center form-group">
                      <label htmlFor="main_heading_de" className="text-left d-flex">
                        {t("Main Heading (German)")}:
                        <span className="requirestar">*</span>{" "}
                      </label>
                      <input
                        name="main_heading_de"
                        id="main_heading_de"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.main_heading_de}
                        className="form-control"
                        placeholder={t("Enter main heading (German)")}
                      />
                      <span className="text-danger d-flex text-left">
                        <CustomError name="main_heading_de" form={formik} />
                      </span>
                    </div>

                    <div className="col-md-6 text-center form-group">
                      <label htmlFor="main_heading_es" className="text-left d-flex">
                        {t("Main Heading (Spanish)")}:
                        <span className="requirestar">*</span>{" "}
                      </label>
                      <input
                        name="main_heading_es"
                        id="main_heading_es"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.main_heading_es}
                        className="form-control"
                        placeholder={t("Enter main heading (Spanish)")}
                      />
                      <span className="text-danger d-flex text-left">
                        <CustomError name="main_heading_es" form={formik} />
                      </span>
                    </div>

                    <div className="col-md-6 text-center form-group">
                      <label htmlFor="main_heading_hu" className="text-left d-flex">
                        {t("Main Heading (Hungary)")}:
                        <span className="requirestar">*</span>{" "}
                      </label>
                      <input
                        name="main_heading_hu"
                        id="main_heading_hu"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.main_heading_hu}
                        className="form-control"
                        placeholder={t("Enter main heading (Hungary)")}
                      />
                      <span className="text-danger d-flex text-left">
                        <CustomError name="main_heading_hu" form={formik} />
                      </span>
                    </div>

                    <div className="col-md-6 text-center form-group">
                      <label htmlFor="main_description_en" className="text-left d-flex">
                        {t("Main description (English)")}:
                        <span className="requirestar">*</span>{" "}
                      </label>
                      <textarea
                        name="main_description_en"
                        id="main_description_en"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.main_description_en}
                        className="form-control"
                        placeholder={t("Enter main description (English)")}
                      />
                      <span className="text-danger d-flex text-left">
                        <CustomError name="main_description_en" form={formik} />
                      </span>
                    </div>

                    <div className="col-md-6 text-center form-group">
                      <label htmlFor="main_description_de" className="text-left d-flex">
                        {t("Main description (German)")}:
                        <span className="requirestar">*</span>{" "}
                      </label>
                      <textarea
                        name="main_description_de"
                        id="main_description_de"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.main_description_de}
                        className="form-control"
                        placeholder={t("Enter main description (German)")}
                      />
                      <span className="text-danger d-flex text-left">
                        <CustomError name="main_description_de" form={formik} />
                      </span>
                    </div>

                    <div className="col-md-6 text-center form-group">
                      <label htmlFor="main_description_es" className="text-left d-flex">
                        {t("Main description (Spanish)")}:
                        <span className="requirestar">*</span>{" "}
                      </label>
                      <textarea
                        name="main_description_es"
                        id="main_description_es"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.main_description_es}
                        className="form-control"
                        placeholder={t("Enter main description (Spanish)")}
                      />
                      <span className="text-danger d-flex text-left">
                        <CustomError name="main_description_es" form={formik} />
                      </span>
                    </div>

                    <div className="col-md-6 text-center form-group">
                      <label htmlFor="main_description_hu" className="text-left d-flex">
                        {t("Main description (Hungary)")}:
                        <span className="requirestar">*</span>{" "}
                      </label>
                      <textarea
                        name="main_description_hu"
                        id="main_description_hu"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.main_description_hu}
                        className="form-control"
                        placeholder={t("Enter main description (Hungary)")}
                      />
                      <span className="text-danger d-flex text-left">
                        <CustomError name="main_description_hu" form={formik} />
                      </span>
                    </div>

                    {/* <div className="col-lg-6 text-center form-group">
                      <label htmlFor="image1" className="text-left d-flex">
                        {t("Image 1")}:
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
                          <span className="field-more-info mt-1 ms-1 cp"> ? </span>
                        </Whisper>
                      </label>
                      <input
                        className="form-control imgInput"
                        id="image1"
                        name="image1"
                        accept="image/*"
                        type="file"
                        onChange={(event) => {
                          formik.setFieldValue(
                            "image1",
                            event.target.files[0] || ""
                          );
                          event.target.files.length === 1
                            ? setPreviewImage1(
                              URL.createObjectURL(event.target.files[0])
                            )
                            : setPreviewImage1("");
                        }}
                      />
                      <span className="text-danger d-flex text-left">
                        <CustomError name="image1" form={formik} />
                      </span>

                      {previewimage1 ? (
                        <ul className="question-image-preview questions-ul">
                          <li className="pr_img_box">
                            <img
                              src={previewimage1}
                              style={{ height: "100px" }}
                              alt={"Profile_Img"}
                            />
                            <div className="img_options">
                              <button type="button" className="text-danger"
                                onClick={() => {
                                  // console.log(previewResImage , previewimage1)
                                  setPreviewImage1("");
                                  formik.setFieldValue("image1", null);
                                  document.getElementById("image1").value = ""
                                }}>
                                <i className="ri-delete-bin-6-fill"></i>
                              </button>
                            </div>
                          </li>
                        </ul>
                      ) : (
                        ""
                      )}
                    </div> */}
                    <hr></hr>

                    {/* // Section spiritual advisor  */}
                    <h3 className="mt-4">Spiritual Advisor Section</h3>
                    <div className="col-md-6 text-center form-group">
                      <label htmlFor="spiritual_advisor_heading_en" className="text-left d-flex">
                        {t("Spiritual advisor heading (English)")}:
                        <span className="requirestar">*</span>{" "}
                      </label>
                      <input
                        name="spiritual_advisor_heading_en"
                        id="spiritual_advisor_heading_en"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.spiritual_advisor_heading_en}
                        className="form-control"
                        placeholder={t("Spiritual advisor heading (English)")}
                      />
                      <span className="text-danger d-flex text-left">
                        <CustomError name="spiritual_advisor_heading_en" form={formik} />
                      </span>
                    </div>

                    <div className="col-md-6 text-center form-group">
                      <label htmlFor="spiritual_advisor_heading_de" className="text-left d-flex">
                        {t("Spiritual advisor heading (German)")}:
                        <span className="requirestar">*</span>{" "}
                      </label>
                      <input
                        name="spiritual_advisor_heading_de"
                        id="spiritual_advisor_heading_de"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.spiritual_advisor_heading_de}
                        className="form-control"
                        placeholder={t("Spiritual advisor heading (German)")}
                      />
                      <span className="text-danger d-flex text-left">
                        <CustomError name="spiritual_advisor_heading_de" form={formik} />
                      </span>
                    </div>

                    <div className="col-md-6 text-center form-group">
                      <label htmlFor="spiritual_advisor_heading_es" className="text-left d-flex">
                        {t("Spiritual advisor heading (Spanish)")}:
                        <span className="requirestar">*</span>{" "}
                      </label>
                      <input
                        name="spiritual_advisor_heading_es"
                        id="spiritual_advisor_heading_es"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.spiritual_advisor_heading_es}
                        className="form-control"
                        placeholder={t("Spiritual advisor heading (Spanish)")}
                      />
                      <span className="text-danger d-flex text-left">
                        <CustomError name="spiritual_advisor_heading_es" form={formik} />
                      </span>
                    </div>

                    <div className="col-md-6 text-center form-group">
                      <label htmlFor="spiritual_advisor_heading_hu" className="text-left d-flex">
                        {t("Spiritual advisor heading (Hungarian)")}:
                        <span className="requirestar">*</span>{" "}
                      </label>
                      <input
                        name="spiritual_advisor_heading_hu"
                        id="spiritual_advisor_heading_hu"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.spiritual_advisor_heading_hu}
                        className="form-control"
                        placeholder={t("Spiritual advisor heading (Hungarian)")}
                      />
                      <span className="text-danger d-flex text-left">
                        <CustomError name="spiritual_advisor_heading_hu" form={formik} />
                      </span>
                    </div>

                    <div className="col-md-6 text-center form-group">
                      <label htmlFor="spiritual_advisor_description_en" className="text-left d-flex">
                        {t("Spiritual advisor description (English)")}:
                        <span className="requirestar">*</span>{" "}
                      </label>
                      <textarea
                        name="spiritual_advisor_description_en"
                        id="spiritual_advisor_description_en"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.spiritual_advisor_description_en}
                        className="form-control"
                        placeholder={t("Spiritual advisor description (English)")}
                      />
                      <span className="text-danger d-flex text-left">
                        <CustomError name="spiritual_advisor_description_en" form={formik} />
                      </span>
                    </div>

                    <div className="col-md-6 text-center form-group">
                      <label htmlFor="spiritual_advisor_description_de" className="text-left d-flex">
                        {t("Spiritual advisor description (German)")}:
                        <span className="requirestar">*</span>{" "}
                      </label>
                      <textarea
                        name="spiritual_advisor_description_de"
                        id="spiritual_advisor_description_de"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.spiritual_advisor_description_de}
                        className="form-control"
                        placeholder={t("Spiritual advisor description (German)")}
                      />
                      <span className="text-danger d-flex text-left">
                        <CustomError name="spiritual_advisor_description_de" form={formik} />
                      </span>
                    </div>

                    <div className="col-md-6 text-center form-group">
                      <label htmlFor="spiritual_advisor_description_es" className="text-left d-flex">
                        {t("Spiritual advisor description (Spanish)")}:
                        <span className="requirestar">*</span>{" "}
                      </label>
                      <textarea
                        name="spiritual_advisor_description_es"
                        id="spiritual_advisor_description_es"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.spiritual_advisor_description_es}
                        className="form-control"
                        placeholder={t("Spiritual advisor description (Spanish)")}
                      />
                      <span className="text-danger d-flex text-left">
                        <CustomError name="spiritual_advisor_description_es" form={formik} />
                      </span>
                    </div>

                    <div className="col-md-6 text-center form-group">
                      <label htmlFor="spiritual_advisor_description_hu" className="text-left d-flex">
                        {t("Spiritual advisor description (Hungarian)")}:
                        <span className="requirestar">*</span>{" "}
                      </label>
                      <textarea
                        name="spiritual_advisor_description_hu"
                        id="spiritual_advisor_description_hu"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.spiritual_advisor_description_hu}
                        className="form-control"
                        placeholder={t("Spiritual advisor description (Hungarian)")}
                      />
                      <span className="text-danger d-flex text-left">
                        <CustomError name="spiritual_advisor_description_hu" form={formik} />
                      </span>
                    </div>

                    <div className="col-lg-6 text-center form-group">
                      <label htmlFor="spiritual_advisor_video" className="text-left d-flex">
                        {t("Spiritual Advisor Video")}:
                        {" "}
                        <Whisper
                          placement="top"
                          controlId="control-id-hover"
                          trigger="hover"
                          speaker={
                            <Tooltip>
                              {t("video_support_tooltip")}
                            </Tooltip>
                          }
                        >
                          <span className="field-more-info mt-1 ms-1 cp"> ? </span>
                        </Whisper>
                      </label>
                      <input
                        className="form-control videoInput"
                        id="spiritual_advisor_video"
                        name="spiritual_advisor_video"
                        accept="video/*"
                        type="file"
                        onChange={(event) => {
                          const file = event.target.files[0] || "";
                          formik.setFieldValue("spiritual_advisor_video", file);
                          if (file) {
                            setPreviewSpiritualAdvisorVideo(URL.createObjectURL(file));
                          } else {
                            setPreviewSpiritualAdvisorVideo("");
                          }
                        }}
                      />
                      <span className="text-danger d-flex text-left">
                        <CustomError name="spiritual_advisor_video" form={formik} />
                      </span>

                      {/* Optional video preview */}
                      {previewSpiritualAdvisorVideo && (
                        <div className="mt-2 text-start">
                          <video
                            controls
                            width="300"
                            src={previewSpiritualAdvisorVideo}
                          >
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      )}
                    </div>


                    <hr></hr>

                    {/* // Services  */}
                    <h3 className="mt-4">Services Section</h3>
                    <div className="col-md-6 text-center form-group">
                      <label htmlFor="services_heading_en" className="text-left d-flex">
                        {t("Services heading (English)")}:
                        <span className="requirestar">*</span>{" "}
                      </label>
                      <input
                        name="services_heading_en"
                        id="services_heading_en"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.services_heading_en}
                        className="form-control"
                        placeholder={t("Services heading (English)")}
                      />
                      <span className="text-danger d-flex text-left">
                        <CustomError name="services_heading_en" form={formik} />
                      </span>
                    </div>

                    <div className="col-md-6 text-center form-group">
                      <label htmlFor="services_heading_de" className="text-left d-flex">
                        {t("Services heading (German)")}:
                        <span className="requirestar">*</span>{" "}
                      </label>
                      <input
                        name="services_heading_de"
                        id="services_heading_de"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.services_heading_de}
                        className="form-control"
                        placeholder={t("Services heading (German)")}
                      />
                      <span className="text-danger d-flex text-left">
                        <CustomError name="services_heading_de" form={formik} />
                      </span>
                    </div>

                    <div className="col-md-6 text-center form-group">
                      <label htmlFor="services_heading_es" className="text-left d-flex">
                        {t("Services heading (Spanish)")}:
                        <span className="requirestar">*</span>{" "}
                      </label>
                      <input
                        name="services_heading_es"
                        id="services_heading_es"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.services_heading_es}
                        className="form-control"
                        placeholder={t("Services heading (Spanish)")}
                      />
                      <span className="text-danger d-flex text-left">
                        <CustomError name="services_heading_es" form={formik} />
                      </span>
                    </div>

                    <div className="col-md-6 text-center form-group">
                      <label htmlFor="services_heading_hu" className="text-left d-flex">
                        {t("Services heading (Hungarian)")}:
                        <span className="requirestar">*</span>{" "}
                      </label>
                      <input
                        name="services_heading_hu"
                        id="services_heading_hu"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.services_heading_hu}
                        className="form-control"
                        placeholder={t("Services heading (Hungarian)")}
                      />
                      <span className="text-danger d-flex text-left">
                        <CustomError name="services_heading_hu" form={formik} />
                      </span>
                    </div>

                    <div className="col-md-6 text-center form-group">
                      <label htmlFor="services_description_en" className="text-left d-flex">
                        {t("Services description (English)")}:
                        <span className="requirestar">*</span>{" "}
                      </label>
                      <textarea
                        name="services_description_en"
                        id="services_description_en"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.services_description_en}
                        className="form-control"
                        placeholder={t("Services description (English)")}
                      />
                      <span className="text-danger d-flex text-left">
                        <CustomError name="services_description_en" form={formik} />
                      </span>
                    </div>

                    <div className="col-md-6 text-center form-group">
                      <label htmlFor="services_description_de" className="text-left d-flex">
                        {t("Services description (German)")}:
                        <span className="requirestar">*</span>{" "}
                      </label>
                      <textarea
                        name="services_description_de"
                        id="services_description_de"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.services_description_de}
                        className="form-control"
                        placeholder={t("Services description (German)")}
                      />
                      <span className="text-danger d-flex text-left">
                        <CustomError name="services_description_de" form={formik} />
                      </span>
                    </div>

                    <div className="col-md-6 text-center form-group">
                      <label htmlFor="services_description_es" className="text-left d-flex">
                        {t("Services description (Spanish)")}:
                        <span className="requirestar">*</span>{" "}
                      </label>
                      <textarea
                        name="services_description_es"
                        id="services_description_es"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.services_description_es}
                        className="form-control"
                        placeholder={t("Services description (Spanish)")}
                      />
                      <span className="text-danger d-flex text-left">
                        <CustomError name="services_description_es" form={formik} />
                      </span>
                    </div>

                    <div className="col-md-6 text-center form-group">
                      <label htmlFor="services_description_hu" className="text-left d-flex">
                        {t("Services description (Hungarian)")}:
                        <span className="requirestar">*</span>{" "}
                      </label>
                      <textarea
                        name="services_description_hu"
                        id="services_description_hu"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.services_description_hu}
                        className="form-control"
                        placeholder={t("Services description (Hungarian)")}
                      />
                      <span className="text-danger d-flex text-left">
                        <CustomError name="services_description_hu" form={formik} />
                      </span>
                    </div>

                    <hr></hr>

                    {/* // How we work  */}
                    <h3 className="mt-4">How We Work</h3>
                    <div className="col-md-6 text-center form-group">
                      <label htmlFor="how_we_work_heading_en" className="text-left d-flex">
                        {t("How we work heading (English)")}:
                        <span className="requirestar">*</span>{" "}
                      </label>
                      <input
                        name="how_we_work_heading_en"
                        id="how_we_work_heading_en"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.how_we_work_heading_en}
                        className="form-control"
                        placeholder={t("How we work heading (English)")}
                      />
                      <span className="text-danger d-flex text-left">
                        <CustomError name="how_we_work_heading_en" form={formik} />
                      </span>
                    </div>

                    <div className="col-md-6 text-center form-group">
                      <label htmlFor="how_we_work_heading_de" className="text-left d-flex">
                        {t("How we work heading (German)")}:
                        <span className="requirestar">*</span>{" "}
                      </label>
                      <input
                        name="how_we_work_heading_de"
                        id="how_we_work_heading_de"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.how_we_work_heading_de}
                        className="form-control"
                        placeholder={t("How we work heading (German)")}
                      />
                      <span className="text-danger d-flex text-left">
                        <CustomError name="how_we_work_heading_de" form={formik} />
                      </span>
                    </div>

                    <div className="col-md-6 text-center form-group">
                      <label htmlFor="how_we_work_heading_es" className="text-left d-flex">
                        {t("How we work heading (Spanish)")}:
                        <span className="requirestar">*</span>{" "}
                      </label>
                      <input
                        name="how_we_work_heading_es"
                        id="how_we_work_heading_es"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.how_we_work_heading_es}
                        className="form-control"
                        placeholder={t("How we work heading (Spanish)")}
                      />
                      <span className="text-danger d-flex text-left">
                        <CustomError name="how_we_work_heading_es" form={formik} />
                      </span>
                    </div>

                    <div className="col-md-6 text-center form-group">
                      <label htmlFor="how_we_work_heading_hu" className="text-left d-flex">
                        {t("How we work heading (Hungarian)")}:
                        <span className="requirestar">*</span>{" "}
                      </label>
                      <input
                        name="how_we_work_heading_hu"
                        id="how_we_work_heading_hu"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.how_we_work_heading_hu}
                        className="form-control"
                        placeholder={t("How we work heading (Hungarian)")}
                      />
                      <span className="text-danger d-flex text-left">
                        <CustomError name="how_we_work_heading_hu" form={formik} />
                      </span>
                    </div>

                    <div className="col-md-6 text-center form-group">
                      <label htmlFor="how_we_work_description_en" className="text-left d-flex">
                        {t("How we work description (English)")}:
                        <span className="requirestar">*</span>{" "}
                      </label>
                      <textarea
                        name="how_we_work_description_en"
                        id="how_we_work_description_en"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.how_we_work_description_en}
                        className="form-control"
                        placeholder={t("How we work description (English)")}
                      />
                      <span className="text-danger d-flex text-left">
                        <CustomError name="how_we_work_description_en" form={formik} />
                      </span>
                    </div>

                    <div className="col-md-6 text-center form-group">
                      <label htmlFor="how_we_work_description_de" className="text-left d-flex">
                        {t("How we work description (German)")}:
                        <span className="requirestar">*</span>{" "}
                      </label>
                      <textarea
                        name="how_we_work_description_de"
                        id="how_we_work_description_de"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.how_we_work_description_de}
                        className="form-control"
                        placeholder={t("How we work description (German)")}
                      />
                      <span className="text-danger d-flex text-left">
                        <CustomError name="how_we_work_description_de" form={formik} />
                      </span>
                    </div>

                    <div className="col-md-6 text-center form-group">
                      <label htmlFor="how_we_work_description_es" className="text-left d-flex">
                        {t("How we work description (Spanish)")}:
                        <span className="requirestar">*</span>{" "}
                      </label>
                      <textarea
                        name="how_we_work_description_es"
                        id="how_we_work_description_es"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.how_we_work_description_es}
                        className="form-control"
                        placeholder={t("How we work description (Spanish)")}
                      />
                      <span className="text-danger d-flex text-left">
                        <CustomError name="how_we_work_description_es" form={formik} />
                      </span>
                    </div>

                    <div className="col-md-6 text-center form-group">
                      <label htmlFor="how_we_work_description_hu" className="text-left d-flex">
                        {t("How we work description (Hungarian)")}:
                        <span className="requirestar">*</span>{" "}
                      </label>
                      <textarea
                        name="how_we_work_description_hu"
                        id="how_we_work_description_hu"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.how_we_work_description_hu}
                        className="form-control"
                        placeholder={t("How we work description (Hungarian)")}
                      />
                      <span className="text-danger d-flex text-left">
                        <CustomError name="how_we_work_description_hu" form={formik} />
                      </span>
                    </div>

                    <hr></hr>

                    {/* // Download App */}
                    <h3 className="mt-4">Download App</h3>
                    <div className="col-md-6 text-center form-group">
                      <label htmlFor="download_app_heading_en" className="text-left d-flex">
                        {t("Download app heading (English)")}:
                        <span className="requirestar">*</span>{" "}
                      </label>
                      <input
                        name="download_app_heading_en"
                        id="download_app_heading_en"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.download_app_heading_en}
                        className="form-control"
                        placeholder={t("Download app heading (English)")}
                      />
                      <span className="text-danger d-flex text-left">
                        <CustomError name="download_app_heading_en" form={formik} />
                      </span>
                    </div>

                    <div className="col-md-6 text-center form-group">
                      <label htmlFor="download_app_heading_de" className="text-left d-flex">
                        {t("Download app heading (German)")}:
                        <span className="requirestar">*</span>{" "}
                      </label>
                      <input
                        name="download_app_heading_de"
                        id="download_app_heading_de"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.download_app_heading_de}
                        className="form-control"
                        placeholder={t("Download app heading (German)")}
                      />
                      <span className="text-danger d-flex text-left">
                        <CustomError name="download_app_heading_de" form={formik} />
                      </span>
                    </div>

                    <div className="col-md-6 text-center form-group">
                      <label htmlFor="download_app_heading_es" className="text-left d-flex">
                        {t("Download app heading (Spanish)")}:
                        <span className="requirestar">*</span>{" "}
                      </label>
                      <input
                        name="download_app_heading_es"
                        id="download_app_heading_es"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.download_app_heading_es}
                        className="form-control"
                        placeholder={t("Download app heading (Spanish)")}
                      />
                      <span className="text-danger d-flex text-left">
                        <CustomError name="download_app_heading_es" form={formik} />
                      </span>
                    </div>

                    <div className="col-md-6 text-center form-group">
                      <label htmlFor="download_app_heading_hu" className="text-left d-flex">
                        {t("Download app heading (Hungarian)")}:
                        <span className="requirestar">*</span>{" "}
                      </label>
                      <input
                        name="download_app_heading_hu"
                        id="download_app_heading_hu"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.download_app_heading_hu}
                        className="form-control"
                        placeholder={t("Download app heading (Hungarian)")}
                      />
                      <span className="text-danger d-flex text-left">
                        <CustomError name="download_app_heading_hu" form={formik} />
                      </span>
                    </div>

                    <div className="col-md-6 text-center form-group">
                      <label htmlFor="download_app_description_en" className="text-left d-flex">
                        {t("Download app description (English)")}:
                        <span className="requirestar">*</span>{" "}
                      </label>
                      <textarea
                        name="download_app_description_en"
                        id="download_app_description_en"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.download_app_description_en}
                        className="form-control"
                        placeholder={t("Download app description (English)")}
                      />
                      <span className="text-danger d-flex text-left">
                        <CustomError name="download_app_description_en" form={formik} />
                      </span>
                    </div>

                    <div className="col-md-6 text-center form-group">
                      <label htmlFor="download_app_description_de" className="text-left d-flex">
                        {t("Download app description (German)")}:
                        <span className="requirestar">*</span>{" "}
                      </label>
                      <textarea
                        name="download_app_description_de"
                        id="download_app_description_de"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.download_app_description_de}
                        className="form-control"
                        placeholder={t("Download app description (German)")}
                      />
                      <span className="text-danger d-flex text-left">
                        <CustomError name="download_app_description_de" form={formik} />
                      </span>
                    </div>

                    <div className="col-md-6 text-center form-group">
                      <label htmlFor="download_app_description_es" className="text-left d-flex">
                        {t("Download app description (Spanish)")}:
                        <span className="requirestar">*</span>{" "}
                      </label>
                      <textarea
                        name="download_app_description_es"
                        id="download_app_description_es"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.download_app_description_es}
                        className="form-control"
                        placeholder={t("Download app description (Spanish)")}
                      />
                      <span className="text-danger d-flex text-left">
                        <CustomError name="download_app_description_es" form={formik} />
                      </span>
                    </div>

                    <div className="col-md-6 text-center form-group">
                      <label htmlFor="download_app_description_hu" className="text-left d-flex">
                        {t("Download app description (Hungarian)")}:
                        <span className="requirestar">*</span>{" "}
                      </label>
                      <textarea
                        name="download_app_description_hu"
                        id="download_app_description_hu"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.download_app_description_hu}
                        className="form-control"
                        placeholder={t("Download app description (Hungarian)")}
                      />
                      <span className="text-danger d-flex text-left">
                        <CustomError name="download_app_description_hu" form={formik} />
                      </span>
                    </div>

                    <hr></hr>

                    <div className="mt-5">
                      <button
                        className="btn btn-info mr-2"
                        type="submit"
                      // disabled={submitted ? true : null}
                      >
                        <i className="ace-icon fa fa-check bigger-110 mx-1"></i>
                        {t("btn_submit")}
                      </button>
                      <button
                        className="btn ripple btn-secondary"
                        type="button"
                        // disabled={submitted ? true : null}
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
        : <Loader />
      }
    </>
  );
};

export default WebsiteHomeAdd;
