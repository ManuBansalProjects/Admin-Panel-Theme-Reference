import React, { useState } from "react";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import Breadcrums from "../../common/breadcrumbs";
import { globalLoader, handleServerValidations } from "../../../../utils/commonfunction";
import CustomError from "../../../../utils/customError";
import { discountType, SWAL_SETTINGS } from "../../../../utils/Constants";
import { CouponAdd } from "../../services/coupon.services";
import { DatePicker } from "rsuite";

const currentDate = new Date();
currentDate.setHours(0, 0 , 0, 0);

const AddCoupon = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const breadcrumbs = [
    { title: t("link_dashboard"), url: "/admin/dashboard" },
    {
      title: t("Coupon"),
      url: "/admin/coupon/list/1",
    },
    { title: t("link_add"), url: "" },
  ];

  const validationSchema = Yup.object().shape({
    name: Yup.string().trim().required("Coupon name is required"),
    code: Yup.string().trim().required("Coupon code is required"),
    discount_type: Yup.string().trim().required("Discount type is required"),
    
    flat_amount: Yup.number()
      .typeError("Flat amount must be a number")
      .when("discount_type", {
        is: "flat_amount",
        then: (schema) =>
          schema
            .required("Flat amount is required")
            .min(0, "Flat amount cannot be less than 0")
            .max(10000000, "Flat amount cannot exceed 10000000"),
        otherwise: (schema) => schema.notRequired(),
      }),

    percentage: Yup.number()
      .typeError("Percentage must be a number")
      .when("discount_type", {
        is: "percentage",
        then: (schema) =>
          schema
            .required("Percentage is required")
            .min(0, "Percentage cannot be less than 0")
            .max(100, "Percentage cannot exceed 100"),
        otherwise: (schema) => schema.notRequired(),
      }),
    start_date: Yup.date().required("Start date is required"),
    end_date: Yup.date().required("End date is required"),
    uses_per_customer: Yup.string().trim().required("Limit per customer is required"),
  });

  const formik = useFormik({
    // enableReinitialize: true,
    initialValues: {
      name: "",
      code: '',
      discount_type: '',
      flat_amount: '',
      percentage: '',
      start_date: new Date(),
      end_date: '',
      uses_per_customer: '',
    },
    validateOnBlur: false,
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      globalLoader(true);
      setSubmitted(true);
      let formData = new FormData();
      formData.append("name", values.name);
      formData.append("code", values.code);
      formData.append("discount_type", values.discount_type);
      formData.append("flat_amount", values.flat_amount);
      formData.append("percentage", values.percentage);

      const startDate = new Date(values.start_date);
      startDate.setHours(0, 0, 0, 0);
      formData.append("start_date", startDate);

      const endDate = new Date(values.end_date);
      endDate.setHours(23, 59, 59, 999);
      formData.append("end_date", endDate);

      formData.append("uses_per_customer", values.uses_per_customer);

      CouponAdd(formData)
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
            navigate(`/admin/coupon/list/1`);
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
                    {t("Add Coupon")}
                  </h6>
                </div>

                <div className="row row-sm">
                  <div className="col-md-6 text-center form-group">
                    <label htmlFor="name" className="text-left d-flex">
                      {t("Name")}:
                      <span className="requirestar">*</span>{" "}
                    </label>
                    <input
                      name="name"
                      id="name"
                      type="text"
                      onChange={(event)=> {console.log(event.target.value); formik.handleChange(event)}}
                      onBlur={formik.handleBlur}
                      value={formik.values.name}
                      className="form-control"
                      placeholder={t("Enter plan price")}
                    />
                    <span className="text-danger d-flex text-left">
                      <CustomError name="name" form={formik} />
                    </span>
                  </div>

                   <div className="col-md-6 text-center form-group">
                    <label htmlFor="code" className="text-left d-flex">
                      {t("Code")}:
                      <span className="requirestar">*</span>{" "}
                    </label>
                    <input
                      name="code"
                      id="code"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.code}
                      className="form-control"
                      placeholder={t("Enter plan price")}
                    />
                    <span className="text-danger d-flex text-left">
                      <CustomError name="code" form={formik} />
                    </span>
                  </div>

                  <div className="col-md-6 text-center form-group">
                    <label htmlFor="discount_type" className="text-left d-flex">
                      {t("Discount Type")}:
                      <span className="requirestar">*</span>{" "}
                    </label>
                    <div className="select-down-arrow">
                      <select
                        name="discount_type"
                        id="discount_type"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.discount_type}
                        className="form-control"
                        placeholder={t("Select Discount Type")}
                      >
                        <option value={""}>Select</option>
                        {(discountType).map((value, i) => {
                          return (
                            <option key={i} value={value.value}>{t(`${value.name}`)}</option>
                          )
                        })}
                      </select>
                    </div>
                    <span className="text-danger d-flex text-left">
                      <CustomError name="discount_type" form={formik} />
                    </span>
                  </div>

                  {
                    formik.values.discount_type == 'flat_amount'
                    ? 
                      <div className="col-md-6 text-center form-group">
                        <label htmlFor="flat_amount" className="text-left d-flex">
                          {t("Flat Amount")}:
                          <span className="requirestar">*</span>{" "}
                        </label>
                        <input
                          name="flat_amount"
                          id="flat_amount"
                          type="number"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.flat_amount}
                          className="form-control"
                          placeholder={t("Enter Flat Amount")}
                        />
                        <span className="text-danger d-flex text-left">
                          <CustomError name="flat_amount" form={formik} />
                        </span>
                      </div>      
                    : 
                      <div className="col-md-6 text-center form-group">
                        <label htmlFor="percentage" className="text-left d-flex">
                          {t("Percentage")}:
                          <span className="requirestar">*</span>{" "}
                        </label>
                        <input
                          name="percentage"
                          id="percentage"
                          type="number"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.percentage}
                          className="form-control"
                          placeholder={t("Enter Percentage")}
                        />
                        <span className="text-danger d-flex text-left">
                          <CustomError name="percentage" form={formik} />
                        </span>
                      </div>      
                  }

                   <div className="col-md-6 text-center form-group">
                      <label htmlFor="start_date" className="text-left d-flex">
                        {t("Start Date")}:
                        <span className="requirestar">*</span>{" "}
                      </label>
                      <DatePicker
                        oneTap={true}
                        classPrefix="userInput"
                        placeholder={t("Start Date")}
                        placement="autoVertical"
                        format="dd/MM/yyyy"
                        cleanable={false}
                        editable={false}
                        name="start_date"
                        shouldDisableDate={(date) => date < currentDate}  // Disable past dates
                        onChange={(date) => formik.setFieldValue("start_date", date)}
                        value={formik.values.start_date}
                        onBlur={formik.handleBlur}
                        // caretAs={CustomBase64Caret}
                      />
                      <span className="text-danger d-flex text-left">
                        <CustomError name="start_date" form={formik} />
                      </span>
                  </div>  

                  <div className="col-md-6 text-center form-group">
                      <label htmlFor="end_date" className="text-left d-flex">
                        {t("End Date")}:
                        <span className="requirestar">*</span>{" "}
                      </label>
                      <DatePicker
                        oneTap={true}
                        classPrefix="userInput"
                        placeholder={t("End Date")}
                        placement="autoVertical"
                        format="dd/MM/yyyy"
                        cleanable={false}
                        editable={false}
                        name="end_date"
                        shouldDisableDate={(date) => date < currentDate}  // Disable past dates
                        onChange={(date) => formik.setFieldValue("end_date", date)}
                        value={formik.values.end_date}
                        onBlur={formik.handleBlur}
                        // caretAs={CustomBase64Caret}
                      />
                      <span className="text-danger d-flex text-left">
                        <CustomError name="end_date" form={formik} />
                      </span>
                  </div>  

                  <div className="col-md-6 text-center form-group">
                    <label htmlFor="uses_per_customer" className="text-left d-flex">
                      {t("Limit Per Customer")}:
                      <span className="requirestar">*</span>{" "}
                    </label>
                    <input
                      name="uses_per_customer"
                      id="uses_per_customer"
                      type="number"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.uses_per_customer}
                      className="form-control"
                      placeholder={t("Enter Limit per Customer")}
                    />
                    <span className="text-danger d-flex text-left">
                      <CustomError name="uses_per_customer" form={formik} />
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

export default AddCoupon;
