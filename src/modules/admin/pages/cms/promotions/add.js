import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Breadcrums from "../../../common/breadcrumbs";
import CustomCkeditor from "../../../common/customeditor";
import * as promotionServices from "../../../services/promotions";
import * as couponServices from "../../../services/coupon.services";
import { SWAL_SETTINGS, MENU_LOCATION, showFilterlist, INPUT_LENGTH_50, INPUT_LENGTH_100, FOOTER_LOCATION, subscriptionPlanType } from "../../../../../utils/Constants";
import {
  DT,
  globalLoader,
  handleServerValidations,
} from "../../../../../utils/commonfunction";
import { Tooltip, Whisper } from "rsuite";
import { useTranslation } from "react-i18next";
import { COMMON_INPUT_VALIDATION } from "../../../../../utils/commonValidations";
import * as Yup from "yup";

const PromotionAdd = () => {
  const navigate = useNavigate();
  const { t } = useTranslation()
  const [submitted, setSubmitted] = useState(false);
  // const [dataLoaded, setDataLoaded] = useState(false);
  const [initialValues, setInitialValues] = useState({
    title: '',
    promotion_type: '',
    coupon_id: ''
  });
  const [couponDropdown, setCouponDropDown] = useState([]);

  const breadcrumbs = [
    { title: t("sidebar_link_dashboard"), url: "/admin/dashboard" },
    { title: 'Promotions', url: "/admin/cms/promotions/list/1" },
    { title: t("link_add"), url: "" },
  ];

   const validationSchema = Yup.object().shape({
    title: Yup.string()
      .trim()
      .required("Title is required")
      .max(INPUT_LENGTH_50, `Maximum ${INPUT_LENGTH_50} characters allowed`)
      .concat(COMMON_INPUT_VALIDATION),
  
    promotion_type: Yup.string()
      .trim()
      .required("Promotion Type is required"),
  
    coupon_id: Yup.string()
      .trim()
      .required("Coupon is required")
  });

  const getCouponOptions = (promotionType)=>{
     couponServices
          .getAllCoupons(`promotion_type=${promotionType}`)
          .then((data) => {
            setCouponDropDown(data && data.data ? data.data : []);
          })
          .catch((error) => {
            console.log("error=====>", error);
          });
  }


  return (
    <>
      <Breadcrums data={breadcrumbs} />
    
        <Formik
          initialValues={initialValues}
          validateOnBlur={false}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            setSubmitted(true);
            globalLoader(true);
            
            let formData = new FormData();
            formData.append("title", values.title);
            formData.append("promotion_type", values.promotion_type);
            formData.append("coupon_id", values.coupon_id);

            promotionServices
              .Add(formData)
              .then((response) => {
                setSubmitting(false);
                if (response.success) {
                  Swal.fire({
                    icon: "success",
                    text: response.message,
                    ...SWAL_SETTINGS,
                  });
                  setTimeout(() => {
                    resetForm({ values: "" });
                    globalLoader(false);
                    navigate(`/admin/cms/promotions/list/1`);
                  }, 1000);
                } else {
                  Swal.fire({
                    icon: "error",
                    text: handleServerValidations(response),
                    ...SWAL_SETTINGS,
                  });
                  setSubmitted(false);
                  globalLoader(false);
                }
              })
              .catch((error) => {
                console.log("error ====> ", error);
              });
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            setFieldTouched,
            isSubmitting,
          }) => (
            <form onSubmit={handleSubmit}>
              <div className="row row-sm">
                <div className="col-lg-12 col-md-12 animation_fade">
                  <div className="card custom-card">
                    <div className="card-body">
                      <div>
                        <h6 className="main-content-label mb-3">Add Promotion</h6>
                      </div>
                      <div className="row row-sm">
                       

                        <div className="col-lg-6 text-center form-group">
                          <label htmlFor="title" className="text-left d-flex">
                           Title:<span className="requirestar">*</span>
                            <Whisper
                              placement="top"
                              controlId="control-id-hover"
                              trigger="hover"
                              speaker={
                                <Tooltip>
                                  {t("tooltip_page_title")}
                                </Tooltip>
                              }
                            >
                            </Whisper>
                          </label>
                          <input
                            name="title"
                            id="title"
                            type="text"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.title}
                            className="form-control"
                          />
                          <span className="text-danger d-flex text-left">
                            {errors.title && touched.title && t(errors.title)}
                          </span>
                        </div>

                        <div className="col-lg-6 text-center form-group">
                          <label htmlFor="promotion_type" className="text-left d-flex">
                            Promotion Type:<span className="requirestar">*</span>
                            <Whisper
                              placement="top"
                              controlId="control-id-hover"
                              trigger="hover"
                              speaker={
                                <Tooltip>
                                  {t("tooltip_page_title")}
                                </Tooltip>
                              }
                            >
                              <span className="field-more-info mt-1 ms-1 cp">
                                ?
                              </span>
                            </Whisper>
                          </label>
                          <div className="select-down-arrow">
                            <select
                              name="promotion_type"
                              id="promotion_type"
                              type="text"
                              onChange={(event)=> {handleChange(event); getCouponOptions(event.target.value) }}
                              onBlur={handleBlur}
                              value={values.promotion_type}
                              className="form-control"
                              placeholder={t("Select Promotion Type")}
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
                            {errors.promotion_type && touched.promotion_type && t(errors.promotion_type)}
                          </span>
                        </div>

                        <div className="col-lg-6 text-center form-group">
                          <label htmlFor="coupon_id" className="text-left d-flex">
                            Coupon:<span className="requirestar">*</span>
                            <Whisper
                              placement="top"
                              controlId="control-id-hover"
                              trigger="hover"
                              speaker={
                                <Tooltip>
                                  {t("tooltip_page_title")}
                                </Tooltip>
                              }
                            >
                            </Whisper>
                          </label>
                          <div className="select-down-arrow">
                            <select
                              name="coupon_id"
                              id="coupon_id"
                              type="text"
                              onChange={(event)=> {handleChange(event); }}
                              onBlur={handleBlur}
                              value={values.coupon_id}
                              className="form-control"
                              placeholder={t("Select Coupon")}
                            >
                              <option value={""}>Select</option>
                              {couponDropdown?.map((value, i) => {
                                return (
                                  <option key={i} value={value._id}>{t(`${value.code}`)}</option>
                                )
                              })}
                            </select>
                          </div>
                          <span className="text-danger d-flex text-left">
                            {errors.coupon_id && touched.coupon_id && errors.coupon_id}
                          </span>
                        </div>

                        <div className="">
                          <button
                            className="btn btn-main-primary signbtn mr-2"
                            type="submit"
                            disabled={submitted ? true : null}
                          >
                            <i className="ace-icon fa fa-check bigger-110 mx-1"></i>
                            {t("btn_submit")}
                          </button>
                          <butthu
                            className="btn ripplehutn-secondary"
                            type="button"
                            disabled={submitted ? true : null}
                            onClick={() => navigate(-1)}
                          >
                            <i className="ace-icon fa fa-times bigger-110 mx-1"></i>
                            {t("btn_cancel")}
                          </butthu>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}
        </Formik>
      
    </>
  );
};

export default PromotionAdd;
