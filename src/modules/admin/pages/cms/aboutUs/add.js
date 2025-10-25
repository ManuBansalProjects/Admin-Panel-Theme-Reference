import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import Breadcrums from "../../../common/breadcrumbs";
import { globalLoader, handleServerValidations } from "../../../../../utils/commonfunction";
import CustomError from "../../../../../utils/customError";
import { AddQuestion } from "../../../services/question.services";
import { questionType, SWAL_SETTINGS } from "../../../../../utils/Constants";
import { COMMON_INPUT_VALIDATION } from "../../../../../utils/commonValidations";
import CustomCkeditor from "../../../common/customeditor";
import { Tooltip, Whisper } from "rsuite";
import { AboutUsDetails, AddAboutUs, EditAboutUs } from "../../../services/aboutUs";
import Loader from "../../../common/loader";

const AboutUsAdd = (props) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [previewimage1, setPreviewImage1] = useState("");
  const [previewimage2, setPreviewImage2] = useState("");
  const [previewImages, setPreviewImages] = useState([]);
  const [defaultData, setDefaultData] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);
  const breadcrumbs = [
    { title: t("link_dashboard"), url: "/admin/dashboard" },
    {
      title: t("About Us"),
      url: "/admin/cms/about-us",
    },
    { title: t("link_add"), url: "" },
  ];

  useEffect(() => {
    AboutUsDetails()
      .then((response) => {
        setDefaultData(response?.data);
        setPreviewImage1(response?.data?.image1);
        setPreviewImage2(response?.data?.image2);
        response?.data?.option?.map((opt) => (
          setPreviewImages((prev) => [...prev, opt.option_image])
        ))
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
      heading1_en: defaultData && defaultData.heading1_en ? defaultData.heading1_en : "",
      heading1_de: defaultData && defaultData.heading1_de ? defaultData.heading1_de : "",
      heading1_es: defaultData && defaultData.heading1_es ? defaultData.heading1_es : "",
      heading1_hu: defaultData && defaultData.heading1_hu ? defaultData.heading1_hu : "",
      content1_en: defaultData && defaultData.content1_en ? defaultData.content1_en : "",
      content1_de: defaultData && defaultData.content1_de ? defaultData.content1_de : "",
      content1_es: defaultData && defaultData.content1_es ? defaultData.content1_es : "",
      content1_hu: defaultData && defaultData.content1_hu ? defaultData.content1_hu : "",
      image1: defaultData && defaultData.image1 ? defaultData.image1 : "",
      heading2_en: defaultData && defaultData.heading2_en ? defaultData.heading2_en : "",
      heading2_de: defaultData && defaultData.heading2_de ? defaultData.heading2_de : "",
      heading2_es: defaultData && defaultData.heading2_es ? defaultData.heading2_es : "",
      heading2_hu: defaultData && defaultData.heading2_hu ? defaultData.heading2_hu : "",
      content2_en: defaultData && defaultData.content2_en ? defaultData.content2_en : "",
      content2_de: defaultData && defaultData.content2_de ? defaultData.content2_de : "",
      content2_es: defaultData && defaultData.content2_es ? defaultData.content2_es : "",
      content2_hu: defaultData && defaultData.content2_hu ? defaultData.content2_hu : "",
      image2: defaultData && defaultData.image2 ? defaultData.image2 : "",
      // option: [
      //   {
      //     option_name:  "",
      //     option_designation: "",
      //     option_image: "",
      //   }
      // ]
      option: (defaultData && defaultData.option && defaultData.option.length > 0)
        ? defaultData.option.map((opt) => ({
          option_name: opt.option_name,
          option_designation: opt.option_designation,
          option_image: opt.option_image,
        }))
        : [
          {
            option_name: "",
            option_designation: "",
            option_image: "",
          }
        ]
    },
    validateOnBlur: false,
    // validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      globalLoader(true);
      setSubmitted(true);
      let formData = new FormData();
      formData.append("heading1_en", values.heading1_en);
      formData.append("heading1_de", values.heading1_de);
      formData.append("heading1_es", values.heading1_es);
      formData.append("heading1_hu", values.heading1_hu);
      formData.append("content1_en", values.content1_en);
      formData.append("content1_de", values.content1_de);
      formData.append("content1_es", values.content1_es);
      formData.append("content1_hu", values.content1_hu);
      formData.append("image1", values.image1);
      formData.append("heading2_en", values.heading2_en);
      formData.append("heading2_de", values.heading2_de);
      formData.append("heading2_es", values.heading2_es);
      formData.append("heading2_hu", values.heading2_hu);
      formData.append("content2_en", values.content2_en);
      formData.append("content2_de", values.content2_de);
      formData.append("content2_es", values.content2_es);
      formData.append("content2_hu", values.content2_hu);
      formData.append("image2", values.image2);
      // formData.append("option", JSON.stringify(formik.values?.option));
      values.option.forEach((option, index) => {
        formData.append('image_list', option.option_image);
        // formData.append(`option[${index}][option_name]`, option.option_name);
        // formData.append(`option[${index}][option_designation]`, option.option_designation);

        // if (option.option_image) {
        //   formData.append(`option[${index}][option_image]`, option.option_image);
        // }
      });
      formData.append('option', JSON.stringify(values.option));

      AddAboutUs(formData)
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

  // console.log("value--->", formik.values);
  // console.log("errors--->", formik.errors);
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
                      {t("About Us")}
                    </h6>
                  </div>
                  <div className="row row-sm">
                    <h3>Section 1</h3>
                    <div className="col-md-6 text-center form-group">
                      <label htmlFor="heading1_en" className="text-left d-flex">
                        {t("Heading 1 (English)")}:
                        <span className="requirestar">*</span>{" "}
                      </label>
                      <input
                        name="heading1_en"
                        id="heading1_en"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.heading1_en}
                        className="form-control"
                        placeholder={t("Enter heading 1 (English)")}
                      />
                      <span className="text-danger d-flex text-left">
                        <CustomError name="heading1_en" form={formik} />
                      </span>
                    </div>

                    <div className="col-md-6 text-center form-group">
                      <label htmlFor="heading1_de" className="text-left d-flex">
                        {t("Heading 1 (German)")}:
                        <span className="requirestar">*</span>{" "}
                      </label>
                      <input
                        name="heading1_de"
                        id="heading1_de"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.heading1_de}
                        className="form-control"
                        placeholder={t("Enter heading 1 (German)")}
                      />
                      <span className="text-danger d-flex text-left">
                        <CustomError name="heading1_de" form={formik} />
                      </span>
                    </div>

                    <div className="col-md-6 text-center form-group">
                      <label htmlFor="heading1_es" className="text-left d-flex">
                        {t("Heading 1 (Spanish)")}:
                        <span className="requirestar">*</span>{" "}
                      </label>
                      <input
                        name="heading1_es"
                        id="heading1_es"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.heading1_es}
                        className="form-control"
                        placeholder={t("Enter heading 1 (Spanish)")}
                      />
                      <span className="text-danger d-flex text-left">
                        <CustomError name="heading1_es" form={formik} />
                      </span>
                    </div>

                    <div className="col-md-6 text-center form-group">
                      <label htmlFor="heading1_hu" className="text-left d-flex">
                        {t("Heading 1 (Hungarian)")}:
                        <span className="requirestar">*</span>{" "}
                      </label>
                      <input
                        name="heading1_hu"
                        id="heading1_hu"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.heading1_hu}
                        className="form-control"
                        placeholder={t("Enter heading 1 (Hungarian)")}
                      />
                      <span className="text-danger d-flex text-left">
                        <CustomError name="heading1_hu" form={formik} />
                      </span>
                    </div>

                    <div className="col-lg-12 text-center form-group">
                      <label htmlFor="content1_en" className="text-left d-flex">
                        {t("Content 1 (English)")}:<span className="requirestar">*</span>
                      </label>
                      <CustomCkeditor
                        fieldname={"content1_en"}
                        setFieldValue={formik.setFieldValue}
                        value={formik.values.content1_en}
                        setFieldTouched={formik.setFieldTouched}
                      />
                      <span className="text-danger d-flex text-left">
                        {formik.errors.content1_en &&
                          formik.touched.content1_en &&
                          formik.errors.content1_en}
                      </span>
                    </div>

                    <div className="col-lg-12 text-center form-group">
                      <label htmlFor="content1_de" className="text-left d-flex">
                        {t("Content 1 (German)")}:<span className="requirestar">*</span>
                      </label>
                      <CustomCkeditor
                        fieldname={"content1_de"}
                        setFieldValue={formik.setFieldValue}
                        value={formik.values.content1_de}
                        setFieldTouched={formik.setFieldTouched}
                      />
                      <span className="text-danger d-flex text-left">
                        {formik.errors.content1_de &&
                          formik.touched.content1_de &&
                          formik.errors.content1_de}
                      </span>
                    </div>

                    <div className="col-lg-12 text-center form-group">
                      <label htmlFor="content1_es" className="text-left d-flex">
                        {t("Content 1 (Spanish)")}:<span className="requirestar">*</span>
                      </label>
                      <CustomCkeditor
                        fieldname={"content1_es"}
                        setFieldValue={formik.setFieldValue}
                        value={formik.values.content1_es}
                        setFieldTouched={formik.setFieldTouched}
                      />
                      <span className="text-danger d-flex text-left">
                        {formik.errors.content1_es &&
                          formik.touched.content1_es &&
                          formik.errors.content1_es}
                      </span>
                    </div>

                    <div className="col-lg-12 text-center form-group">
                      <label htmlFor="content1_hu" className="text-left d-flex">
                        {t("Content 1 (Hungarian)")}:<span className="requirestar">*</span>
                      </label>
                      <CustomCkeditor
                        fieldname={"content1_hu"}
                        setFieldValue={formik.setFieldValue}
                        value={formik.values.content1_hu}
                        setFieldTouched={formik.setFieldTouched}
                      />
                      <span className="text-danger d-flex text-left">
                        {formik.errors.content1_hu &&
                          formik.touched.content1_hu &&
                          formik.errors.content1_hu}
                      </span>
                    </div>

                    <div className="col-lg-6 text-center form-group">
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
                    </div>

                    {/* // Section 2  */}
                    <hr></hr>
                    <h3 className="mt-4">Section 2</h3>
                    <div className="col-md-6 text-center form-group">
                      <label htmlFor="heading2_en" className="text-left d-flex">
                        {t("Heading 2 (English)")}:
                        <span className="requirestar">*</span>{" "}
                      </label>
                      <input
                        name="heading2_en"
                        id="heading2_en"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.heading2_en}
                        className="form-control"
                        placeholder={t("Enter heading 2 (English)")}
                      />
                      <span className="text-danger d-flex text-left">
                        <CustomError name="heading2_en" form={formik} />
                      </span>
                    </div>

                    <div className="col-md-6 text-center form-group">
                      <label htmlFor="heading2_de" className="text-left d-flex">
                        {t("Heading 2 (German)")}:
                        <span className="requirestar">*</span>{" "}
                      </label>
                      <input
                        name="heading2_de"
                        id="heading2_de"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.heading2_de}
                        className="form-control"
                        placeholder={t("Enter heading 2 (German)")}
                      />
                      <span className="text-danger d-flex text-left">
                        <CustomError name="heading2_de" form={formik} />
                      </span>
                    </div>

                    <div className="col-md-6 text-center form-group">
                      <label htmlFor="heading2_es" className="text-left d-flex">
                        {t("Heading 2 (Spanish)")}:
                        <span className="requirestar">*</span>{" "}
                      </label>
                      <input
                        name="heading2_es"
                        id="heading2_es"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.heading2_es}
                        className="form-control"
                        placeholder={t("Enter heading 2 (Spanish)")}
                      />
                      <span className="text-danger d-flex text-left">
                        <CustomError name="heading2_es" form={formik} />
                      </span>
                    </div>

                    <div className="col-md-6 text-center form-group">
                      <label htmlFor="heading2_hu" className="text-left d-flex">
                        {t("Heading 2 (Hungarian)")}:
                        <span className="requirestar">*</span>{" "}
                      </label>
                      <input
                        name="heading2_hu"
                        id="heading2_hu"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.heading2_hu}
                        className="form-control"
                        placeholder={t("Enter heading 2 (Hungarian)")}
                      />
                      <span className="text-danger d-flex text-left">
                        <CustomError name="heading2_hu" form={formik} />
                      </span>
                    </div>

                    <div className="col-lg-12 text-center form-group">
                      <label htmlFor="content2_en" className="text-left d-flex">
                        {t("Content 2 (English)")}:<span className="requirestar">*</span>
                      </label>
                      <CustomCkeditor
                        fieldname={"content2_en"}
                        setFieldValue={formik.setFieldValue}
                        value={formik.values.content2_en}
                        setFieldTouched={formik.setFieldTouched}
                      />
                      <span className="text-danger d-flex text-left">
                        {formik.errors.content2_en &&
                          formik.touched.content2_en &&
                          formik.errors.content2_en}
                      </span>
                    </div>

                    <div className="col-lg-12 text-center form-group">
                      <label htmlFor="content2_de" className="text-left d-flex">
                        {t("Content 2 (German)")}:<span className="requirestar">*</span>
                      </label>
                      <CustomCkeditor
                        fieldname={"content2_de"}
                        setFieldValue={formik.setFieldValue}
                        value={formik.values.content2_de}
                        setFieldTouched={formik.setFieldTouched}
                      />
                      <span className="text-danger d-flex text-left">
                        {formik.errors.content2_de &&
                          formik.touched.content2_de &&
                          formik.errors.content2_de}
                      </span>
                    </div>

                    <div className="col-lg-12 text-center form-group">
                      <label htmlFor="content2_es" className="text-left d-flex">
                        {t("Content 2 (Spanish)")}:<span className="requirestar">*</span>
                      </label>
                      <CustomCkeditor
                        fieldname={"content2_es"}
                        setFieldValue={formik.setFieldValue}
                        value={formik.values.content2_es}
                        setFieldTouched={formik.setFieldTouched}
                      />
                      <span className="text-danger d-flex text-left">
                        {formik.errors.content2_es &&
                          formik.touched.content2_es &&
                          formik.errors.content2_es}
                      </span>
                    </div>

                    <div className="col-lg-12 text-center form-group">
                      <label htmlFor="content2_hu" className="text-left d-flex">
                        {t("Content 2 (Hungarian)")}:<span className="requirestar">*</span>
                      </label>
                      <CustomCkeditor
                        fieldname={"content2_hu"}
                        setFieldValue={formik.setFieldValue}
                        value={formik.values.content2_hu}
                        setFieldTouched={formik.setFieldTouched}
                      />
                      <span className="text-danger d-flex text-left">
                        {formik.errors.content2_hu &&
                          formik.touched.content2_hu &&
                          formik.errors.content2_hu}
                      </span>
                    </div>

                    <div className="col-lg-6 text-center form-group">
                      <label htmlFor="image2" className="text-left d-flex">
                        {t("Image 2")}:
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
                        id="image2"
                        name="image2"
                        accept="image/*"
                        type="file"
                        onChange={(event) => {
                          formik.setFieldValue(
                            "image2",
                            event.target.files[0] || ""
                          );
                          event.target.files.length === 1
                            ? setPreviewImage2(
                              URL.createObjectURL(event.target.files[0])
                            )
                            : setPreviewImage2("");
                        }}
                      />
                      <span className="text-danger d-flex text-left">
                        <CustomError name="image2" form={formik} />
                      </span>

                      {previewimage2 ? (
                        <ul className="question-image-preview questions-ul">
                          <li className="pr_img_box">
                            <img
                              src={previewimage2}
                              style={{ height: "100px" }}
                              alt={"Profile_Img"}
                            />
                            <div className="img_options">
                              <button type="button" className="text-danger"
                                onClick={() => {
                                  setPreviewImage2("");
                                  formik.setFieldValue("image2", null);
                                  document.getElementById("image2").value = ""
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

                    {/* ======= Out teams ======== */}

                    <h5 className="mt-4">Our Team</h5>
                    {formik?.values?.option?.map((option, index) => (
                      <div key={index} className="row">
                        <div className="col-md-6 text-center form-group">
                          <label htmlFor={`option_name_${index}`} className="text-left d-flex">
                            {t("Name")}:
                            <span className="requirestar">*</span>{" "}
                          </label>
                          <input
                            name={`option[${index}].option_name`}
                            id={`option_name_${index}`}
                            type="text"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={option.option_name}
                            className="form-control"
                            placeholder={t("Enter name")}
                          />
                          {/* <span className="text-danger d-flex text-left">
                          <CustomError name={`option[${index}].option_name`} form={formik} />
                        </span> */}
                          {/* <span className='text-danger d-flex text-left'>{formik.errors.option[index].option_name && formik.touched.option[index].option_name && formik.errors.option[index].option_name}</span> */}
                        </div>

                        <div className="col-md-6 text-center form-group">
                          <label htmlFor={`option_designation_${index}`} className="text-left d-flex">
                            {t("Designation")}:
                            <span className="requirestar">*</span>{" "}
                          </label>
                          <input
                            name={`option[${index}].option_designation`}
                            id={`option_designation_${index}`}
                            type="text"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={option.option_designation}
                            className="form-control"
                            placeholder={t("Enter designation")}
                          />
                          <span className="text-danger d-flex text-left">
                            <CustomError name={`option[${index}].option_designation`} form={formik} />
                          </span>
                        </div>

                        {/* ====================Image section================ */}

                        <div className="col-lg-6 text-center form-group">
                          <label htmlFor={`option_image_${index}`} className="text-left d-flex">
                            {t("Image")}:
                            <Whisper
                              placement="top"
                              controlId="control-id-hover"
                              trigger="hover"
                              speaker={<Tooltip>{t("image_support_tooltip")}</Tooltip>}
                            >
                              <span className="field-more-info mt-1 ms-1 cp"> ? </span>
                            </Whisper>
                          </label>
                          <input
                            className="form-control imgInput"
                            id={`option_image_${index}`}
                            name={`option[${index}].option_image`}
                            accept="image/*"
                            type="file"
                            onChange={(event) => handleImageChange(event, index)}
                          />

                          {previewImages[index] && (
                            <ul className="question-image-preview questions-ul">
                              <li className="pr_img_box">
                                <img
                                  src={previewImages[index]}
                                  style={{ height: "100px" }}
                                  alt={`Profile_Img_${index}`}
                                />
                                {/* <div className="img_options">
                                  <button
                                    type="button"
                                    className="text-danger"
                                    onClick={() => {
                                      setPreviewImages(prevState => {
                                        const updatedState = [...prevState];
                                        updatedState[index] = null;
                                        return updatedState;
                                      });
                                      formik.setFieldValue(`option[${index}].option_image`, null);
                                      document.getElementById(`option_image_${index}`).value = "";
                                    }}
                                  >
                                    <i className="ri-delete-bin-6-fill"></i>
                                  </button>
                                </div> */}
                              </li>
                            </ul>
                          )}
                        </div>

                        {/* ===============Image section end================= */}
                        <div className="col-md-6 text-center form-group"></div>

                        {/* Remove Option Button */}
                        {(index === (formik.values.option?.length) - 1) && (
                          <div className="col-md-1 mb-4 text-center align-content-center">
                            <button
                              type="button"
                              className="btn btn-danger"
                              onClick={() => handleRemoveOption(index)}
                            >
                              {t("Remove")}
                            </button>
                          </div>
                        )}
                        {/* Add Option Button */}
                        {(index === (formik.values.option?.length) - 1) && <div className="col-md-1 mb-4 text-center align-content-center">
                          <button
                            type="button"
                            className="btn btn-success w-100"
                            onClick={handleAddOption}
                          >
                            {t("Add")}
                          </button>
                        </div>}
                      </div>
                    ))}

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

export default AboutUsAdd;
