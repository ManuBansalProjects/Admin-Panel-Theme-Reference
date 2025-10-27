import React, { useEffect, useState } from "react";
import { Formik, FieldArray, Field } from "formik";
import Swal from "sweetalert2";
import * as referralSettingsService from "../../services/referralSettings.services";
import Breadcrums from "../../common/breadcrumbs";
import {
  blockInvalidChar,
  handleServerValidations,
} from "../../../../utils/commonfunction";
import { earningType, SWAL_SETTINGS } from "../../../../utils/Constants";
import Loader from "../../common/loader";
import { URL_REGEX, amountRegex, MOBILE_NUMBER_REGEX } from "../../../../utils/Constants";
import { useTranslation } from "react-i18next";
import { Toggle, Tooltip, Whisper } from "rsuite";
import "rsuite/dist/rsuite.min.css";

const ReferralSettings = (props) => {
  const { t } = useTranslation();
  const [showdefault, setShowDefault] = useState({});
  // const [ setContactNumber] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [previewimage, setPreviewImage] = useState("");
  const breadcrumbs = [
    { title: t("sidebar_link_dashboard"), url: "/admin/dashboard" },
    { title: 'Referral Settings', url: "" },
  ];

  useEffect(() => {
    referralSettingsService
      .GetReferralSettings()
      .then((response) => {
        setShowDefault(response && response.data ? response?.data : {});
        setTimeout(() => {
          setDataLoaded(true);
        }, 100);
      })
      .catch((error) => {
        console.log("error=====>", error);
        setDataLoaded(true);
      });
  }, []);

  const ChangeStatus= (status)=>{
    referralSettingsService
      .ChangeReferralSettingsStatus(status)
      .then((response) => {
        Swal.fire({
          icon: "success",
          text: response.message,
          ...SWAL_SETTINGS,
        });
        setTimeout(() => {
          setDataLoaded(true);
        }, 100);
      })
      .catch((error) => {
        console.log("error=====>", error);
        setDataLoaded(true);
      });
  }



  return (
    <>
      <Breadcrums data={breadcrumbs} />
      {dataLoaded ? (
        <Formik

          validateOnChange={true}
          enableReinitialize
          initialValues={{
            earning_type: showdefault.earning_type || "",
            earning: showdefault.earning || "",
            status: showdefault.status || "",
          }}
          validate={(values) => {

            let error = {};
            // { console.log("values--",values.Address)}

            if(!values?.earning_type){
              error.earning_type = "Earning type is required"
            }
            if(!values?.earning){
              error.earning = "Earning is required"
            }
            
            if(values?.earning_type == 'discount' && values?.earning > 50){
              error.earning = "Discount percentage should not be greater than 50"
            }

            
            return error;
          }}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            setSubmitted(true);
            let formData = new FormData();
            formData.append("earning_type", values.earning_type);
            formData.append("earning", values.earning);
            
            referralSettingsService
              .UpdateReferralSettings(formData)
              .then((response) => {
                if (response.success) {
                  Swal.fire({
                    icon: "success",
                    text: response.message,
                    ...SWAL_SETTINGS,
                  });
                  setTimeout(() => {
                    setSubmitted(false);
                  }, 2000);
                } else {
                  Swal.fire({
                    icon: "error",
                    text: handleServerValidations(response),
                    ...SWAL_SETTINGS,
                  });
                  setSubmitted(false);
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
            isSubmitting,
            setFieldTouched,
          }) => (
            <form onSubmit={handleSubmit}>
              {console.log("values", values)}
              {console.log("error", errors)}
              <div className="row row-sm">
                <div className="col-lg-12 col-md-12 animation_fade">
                  <div className="card custom-card">
                    <div className="card-body">
                      
                      <div className="row row-sm">
                        
                         <div className="mb-3">
                          <label htmlFor="earning_type" className="text-left d-flex">
                            Status:
                            <span className="requirestar">*</span>{" "}
                          </label>
                          <Toggle
                            checked={values.status}
                            onChange={(value) => {
                              setFieldValue('status', value);
                              ChangeStatus(value);
                            }}
                            checkedChildren="ON"
                            unCheckedChildren="OFF"
                          />
                        </div>


                        <div className="col-md-6 text-center form-group">
                          <label htmlFor="earning_type" className="text-left d-flex">
                            Earning Type:
                            <span className="requirestar">*</span>{" "}
                          </label>
                          <div className="select-down-arrow">
                            <select
                              name="earning_type"
                              id="earning_type"
                              type="text"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.earning_type}
                              className="form-control"
                              placeholder={t("Select Earning Type")}
                            >
                              <option value={""}>Select</option>
                              {(earningType).map((value, i) => {
                                return (
                                  <option key={i} value={value.value}>{t(`${value.name}`)}</option>
                                )
                              })}
                            </select>
                          </div>
                          <span className="text-danger d-flex text-left">
                            {errors.earning_type &&
                              touched.earning_type &&
                              errors.earning_type}
                          </span>
                        </div>

                        <div className="col-md-6">
                        </div>      

                        <div className="col-md-6 text-center form-group">
                          <label
                            htmlFor="earning"
                            className="text-left d-flex"
                          >
                            Earning:<span className="requirestar">*</span>
                          </label>
                          <input
                            name="earning"
                            type="number"
                            id="earning"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.earning}
                            className="form-control"
                            placeholder={ values?.earning_type == 'discount' ? 'Enter discount percentage' : 'Enter credits'}
                          />
                          <span className="text-danger d-flex text-left">
                            {errors.earning &&
                              touched.earning &&
                              errors.earning}
                          </span>
                        </div>

                        <div className="">
                          <button
                            className="btn btn-main-primary signbtn mr-2"
                            type="submit"
                            disabled={submitted ? true : null}
                            onClick={() => {
                              setSubmitClicked(true);
                            }}
                          >
                            <i className="ace-icon fa fa-check bigger-110 mx-1"></i>
                            {t("btn_submit")}
                          </button>
                        </div>
                        {/* ) : null} */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}
        </Formik>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default ReferralSettings;


