import React, { useState } from "react";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import Breadcrums from "../../common/breadcrumbs";
import { globalLoader, handleServerValidations } from "../../../../utils/commonfunction";
import CustomError from "../../../../utils/customError";
import { subscriptionPlanType, SWAL_SETTINGS } from "../../../../utils/Constants";
import { SubscriptionPlanAdd } from "../../services/subscriptionPlan.services";

const AddSubscriptionPlan = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const breadcrumbs = [
    { title: t("link_dashboard"), url: "/admin/dashboard" },
    {
      title: t("Subscription Plan"),
      url: "/admin/subscription/subscription-plan/list/1",
    },
    { title: t("link_add"), url: "" },
  ];

  const validationSchema = Yup.object().shape({
    plan_name: Yup.string().trim().required("Plan name is required"),
    plan_price: Yup.number()
      .typeError("Price must be a number")
      .required("Price is required")
      .min(0, "Price cannot be less than 0")
      .max(10000000, "Price cannot exceed 10000000"),
    plan_type: Yup.string().trim().required("Plan type is required"),
    balance_count: Yup.string().trim().required("Balance count is required"),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      plan_name: "",
      plan_price: "",
      plan_type: "",
      balance_count: ""
    },
    validateOnBlur: false,
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      globalLoader(true);
      setSubmitted(true);
      let formData = new FormData();
      formData.append("plan_name", values.plan_name);
      formData.append("plan_price", values.plan_price);
      formData.append("plan_type", values.plan_type);
      formData.append("balance_count", values.balance_count);

      SubscriptionPlanAdd(formData)
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
            navigate(`/admin/subscription/subscription-plan/list/1`);
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
                    {t("Add Subscription plan")}
                  </h6>
                </div>
                <div className="row row-sm">

                  <div className="col-md-6 text-center form-group">
                    <label htmlFor="plan_name" className="text-left d-flex">
                      {t("Plan Name")}:
                      <span className="requirestar">*</span>{" "}
                    </label>
                    <input
                      name="plan_name"
                      id="plan_name"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.plan_name}
                      className="form-control"
                      placeholder={t("Enter plan price")}
                    />
                    <span className="text-danger d-flex text-left">
                      <CustomError name="plan_name" form={formik} />
                    </span>
                  </div>

                  <div className="col-md-6 text-center form-group">
                    <label htmlFor="plan_price" className="text-left d-flex">
                      {t("Plan price")}:
                      <span className="requirestar">*</span>{" "}
                    </label>
                    <input
                      name="plan_price"
                      id="plan_price"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.plan_price}
                      className="form-control"
                      placeholder={t("Enter plan price")}
                    />
                    <span className="text-danger d-flex text-left">
                      <CustomError name="plan_price" form={formik} />
                    </span>
                  </div>

                  <div className="col-md-6 text-center form-group">
                    <label htmlFor="plan_type" className="text-left d-flex">
                      {t("Plan Type")}:
                      <span className="requirestar">*</span>{" "}
                    </label>
                    <div className="select-down-arrow">
                      <select
                        name="plan_type"
                        id="plan_type"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.plan_type}
                        className="form-control"
                        placeholder={t("Select Plan Type")}
                      >
                        <option value={""}>Select</option>
                        {(subscriptionPlanType).map((value, i) => {
                          return (
                            <option key={i} value={value.value}>{t(`${value.name}`)}</option>
                          )
                        })}
                      </select>
                    </div>
                    <span className="text-danger d-flex text-left">
                      <CustomError name="plan_type" form={formik} />
                    </span>
                  </div>

                  <div className="col-md-6 text-center form-group">
                    <label htmlFor="balance_count" className="text-left d-flex">
                      {t("Balance Count")}:
                      <span className="requirestar">*</span>{" "}
                    </label>
                    <input
                      name="balance_count"
                      id="balance_count"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.balance_count}
                      className="form-control"
                      placeholder={formik.values.plan_type == 'question' ? t("Enter Questions Count") : t("Enter Reports Count")}
                    />
                    <span className="text-danger d-flex text-left">
                      <CustomError name="balance_count" form={formik} />
                    </span>
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

export default AddSubscriptionPlan;
