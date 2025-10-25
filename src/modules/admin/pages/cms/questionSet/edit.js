import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrums from "../../../common/breadcrumbs";
import { questionType, SWAL_SETTINGS, } from "../../../../../utils/Constants";
import { handleServerValidations, globalLoader } from "../../../../../utils/commonfunction";
import * as Yup from "yup";
import CustomError from "../../../../../utils/customError";
import { useTranslation } from "react-i18next";
import { EditQuestion, QuestionDetails } from "../../../services/question.services";
import Loader from "../../../common/loader";
import { COMMON_INPUT_VALIDATION } from "../../../../../utils/commonValidations";


const QuestionEdit = (props) => {
  const navigate = useNavigate();
  const params = useParams();
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [showDefault, setShowDefault] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);
  const breadcrumbs = [
    { title: t("link_dashboard"), url: "/admin/dashboard" },
    {
      title: t("Question"),
      url: "/admin/cms/question/list/1",
    },
    { title: t("Edit"), url: "" },
  ];

  useEffect(() => {
    QuestionDetails(params.id)
      .then((response) => {
        setShowDefault(response && response.data ? response.data : []);
        setTimeout(() => {
          setDataLoaded(true);
        }, 100);
      })
      .catch((error) => {
        console.log("error=====>", error);
      });
  }, [params.id]);


  const validationSchema = Yup.object().shape({
    question_title: Yup.string().trim().max(100, "max_length_error")
    .required("Option is required"),
    question_type: Yup.string().trim().max(100, "cannot exceed 100 words").required("Option type is required"),
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
      question_title: showDefault && showDefault.question_title ? showDefault.question_title : "",
      question_type: showDefault && showDefault.question_type ? showDefault.question_type : "",
      option: showDefault && showDefault.option ? showDefault.option : [{ option_slug: "", option_value: "", }]
    },
    validateOnBlur: false,
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      globalLoader(true);
      setSubmitted(true);
      let formData = new FormData();
      formData.append("o_id", params.id);
      formData.append("question_title", values.question_title);
      formData.append("question_type", values.question_type);
      formData.append("option", JSON.stringify(formik.values?.option));

      EditQuestion(formData)
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
            navigate(`/admin/cms/question/list/1`);
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
      { option_slug: "", option_value: "" },
    ]);
  };

  const handleRemoveOption = (index) => {
    const newOptions = formik.values.option.filter((_, i) => i !== index);
    formik.setFieldValue("option", newOptions);
  };

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
                      {t("Add Question")}
                    </h6>
                  </div>
                  <div className="row row-sm">

                    <div className="col-md-12 text-center form-group">
                      <label htmlFor="question_title" className="text-left d-flex">
                        {t("Question Title")}:
                        <span className="requirestar">*</span>{" "}
                      </label>
                      <input
                        name="question_title"
                        id="question_title"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.question_title}
                        className="form-control"
                        placeholder={t("Enter question title")}
                      />
                      <span className="text-danger d-flex text-left">
                        <CustomError name="question_title" form={formik} />
                      </span>
                    </div>

                    <div className="col-md-5 text-center form-group">
                      <label htmlFor="question_type" className="text-left d-flex">
                        {t("Question Type")}:
                        <span className="requirestar">*</span>{" "}
                      </label>
                      <div className=" select-down-arrow">
                        <select
                          name="question_type"
                          id="question_type"
                          type="text"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.question_type}
                          className="form-control"
                          placeholder={t("Enter question type")}
                        >
                          <option value={""}>Select</option>
                          {(questionType).map((value, i) => {
                            return (
                              <option key={i} value={value.value}>{t(`${value.name}`)}</option>
                            )
                          })}
                        </select>
                      </div>
                      <span className="text-danger d-flex text-left">
                        <CustomError name="question_type" form={formik} />
                      </span>
                    </div>

                    {formik?.values?.option?.map((option, index) => (
                      <div key={index} className="row">
                        <div className="col-md-5 text-center form-group">
                          <label htmlFor={`option_slug_${index}`} className="text-left d-flex">
                            {t("Option slug")}:
                            <span className="requirestar">*</span>{" "}
                          </label>
                          <input
                            name={`option[${index}].option_slug`}
                            id={`option_slug_${index}`}
                            type="text"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={option.option_slug}
                            className="form-control"
                            placeholder={t("Enter option slug")}
                          />
                          {/* <span className="text-danger d-flex text-left">
                                <CustomError name={`option[${index}].option_slug`} form={formik} />
                              </span> */}
                          {/* <span className='text-danger d-flex text-left'>{formik.errors.option[index].option_slug && formik.touched.option[index].option_slug && formik.errors.option[index].option_slug}</span> */}
                        </div>

                        <div className="col-md-5 text-center form-group">
                          <label htmlFor={`option_value_${index}`} className="text-left d-flex">
                            {t("Option value")}:
                            <span className="requirestar">*</span>{" "}
                          </label>
                          <input
                            name={`option[${index}].option_value`}
                            id={`option_value_${index}`}
                            type="text"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={option.option_value}
                            className="form-control"
                            placeholder={t("Enter option value")}
                          />
                          <span className="text-danger d-flex text-left">
                            <CustomError name={`option[${index}].option_value`} form={formik} />
                          </span>
                        </div>

                        {/* Remove Option Button */}
                        {formik.values.option.length > 1 && (
                          <div className="col-md-1 mt-2 text-center align-content-center">
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
                        <div className="col-md-1 mt-2 text-center align-content-center">
                          <button
                            type="button"
                            className="btn btn-success"
                            onClick={handleAddOption}
                          >
                            {t("Add")}
                          </button>
                        </div>
                      </div>
                    ))}

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
        : <Loader />
      }
    </>
  );
};

export default QuestionEdit;