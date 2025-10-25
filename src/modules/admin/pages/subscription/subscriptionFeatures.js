import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { SubscriptionFeatureDetails, SubscriptionFeatureList, SubscriptionFeatureNameUpdate, SubscriptionFeatureUpdate } from '../../services/subscriptionFeature.services';
import { blockInvalidChar, globalLoader, handleServerValidations } from '../../../../utils/commonfunction';
import Swal from 'sweetalert2';
import { SWAL_SETTINGS } from '../../../../utils/Constants';
import { useNavigate } from 'react-router-dom';
import Breadcrums from '../../common/breadcrumbs';
import Loader from '../../common/loader';

const validationSchema = Yup.object().shape({
  features: Yup.array().of(
    Yup.object().shape({
      // name: Yup.string().required(),
      // type: Yup.string().required(),
      // endpoint: Yup.string().required(),
      // free: Yup.boolean(),
      // premium: Yup.boolean(),
      // credit_based: Yup.boolean(),
      // free_limit: Yup.string()
      //   .required("Required")
      //   .matches(/^(Unlimited|\d+(\/(day|month|year))?)$/, "Invalid limit format"),
      // premium_limit: Yup.string()
      //   .required("Required")
      //   .matches(/^(Unlimited|\d+(\/(day|month|year))?)$/, "Invalid limit format"),
    })
  ),
});

const SubscriptionFeature = () => {
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [changesFlag, setChangesFlag] = useState(false);

  const breadcrumbs = [
    { title: "Dashboard", url: "/admin/dashboard" },
    { title: "Subscription", url: "" },
  ];

  // Load features from backend
  useEffect(() => {
    setLoader(true);
    SubscriptionFeatureList()
      .then(data => {
        setInitialData(data && data.data && data.data.list ? data.data.list : [])
        setTimeout(() => setLoader(false), 300)
      })
      .catch(err => {
        console.error('Error fetching features:', err);
        setTimeout(() => setLoader(false), 300);
      });
  }, [changesFlag]);

  const formik = useFormik({
    enableReinitialize: true, // allows reinitializing when data is fetched
    initialValues: {
      features: initialData,
    },
    validationSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      globalLoader(true);
      let formData = new FormData();
      formData.append("features", JSON.stringify(values.features));

      SubscriptionFeatureUpdate(formData)
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
            // navigate(`/admin/subscription/subscription-feature`);
          } else {
            Swal.fire({
              icon: "error",
              text: handleServerValidations(response),
              ...SWAL_SETTINGS,
            });
            globalLoader(false);
          }
        })
        .catch((error) => {
          console.log("error ====> ", error);
          globalLoader(false);
        });
    },
  });

  const formikEditName = useFormik({
    enableReinitialize: true,
    initialValues: {
      feature_name: "",
    },
    // validationSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      globalLoader(true);
      let formData = new FormData();
      formData.append("feature_name", values.feature_name);
      formData.append("feature_id", values.feature_id);

      SubscriptionFeatureNameUpdate(formData)
        .then((response) => {
          setChangesFlag(!changesFlag);
          setSubmitting(false);
          if (response.success) {
            Swal.fire({
              icon: "success",
              text: response.message,
              ...SWAL_SETTINGS,
            });
            globalLoader(false);
          } else {
            Swal.fire({
              icon: "error",
              text: handleServerValidations(response),
              ...SWAL_SETTINGS,
            });
            globalLoader(false);
          }
        })
        .catch((error) => {
          console.log("error ====> ", error);
          globalLoader(false);
        });
    },
  });

  // console.log("-=-=-values0-==-=", formikEditName.values);
  // console.log("-=-=-formik.values==-=", formik.values);

  return (
    <div className="mt-4">
      <Breadcrums data={breadcrumbs} />
      <h2 className="mb-4">Feature Access</h2>
      {loader ? <Loader /> :
        <form onSubmit={formik.handleSubmit}>
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Feature</th>
                  {/* <th>Endpoint</th> */}
                  <th>Free</th>
                  <th>Premium</th>
                  <th>Credit-based</th>
                  <th>Credit-charge</th>
                  <th>Monthly Limit (Free)</th>
                  <th>Monthly Limit (Premium)</th>
                </tr>
              </thead>
              <tbody>
                {formik?.values?.features.map((feature, index) => (
                  <tr key={index}>
                    <td>
                      {(String(feature._id) == String(formikEditName.values.feature_id)) ?
                        <div className='d-flex justify-content-between align-content-between'>
                          <input
                            type="text"
                            className={`form-control`}
                            name={`feature_name`}
                            value={formikEditName.values.feature_name || ""}
                            onChange={formikEditName.handleChange}
                            onBlur={formikEditName.handleBlur}
                          />
                          {/* <div className=' text-center m-1 p-1'
                            onClick={() => {
                              if (!formikEditName.isSubmitting) {
                                formikEditName.handleSubmit();
                              }
                            }}>
                            <i className="fa fa-paper-plane sidemenu-icon cp"></i>
                          </div> */}
                          <div
                            className="text-center m-1 p-1"
                            style={{
                              cursor: formikEditName.isSubmitting ? "not-allowed" : "pointer",
                              opacity: formikEditName.isSubmitting ? 0.6 : 1,
                            }}
                            onClick={() => {
                              if (!formikEditName.isSubmitting) {
                                formikEditName.handleSubmit();
                              }
                            }}
                            title="Submit"
                          >
                            <i className="fa fa-paper-plane sidemenu-icon cp"></i>
                          </div>
                        </div>
                        :
                        <div className='d-flex justify-content-between'>
                          <span>{feature.feature}</span>
                          {/* <div className='p-1' onClick={() => {
                            formikEditName.setFieldValue("feature_id", feature._id);
                            formikEditName.setFieldValue("feature_name", feature.feature);
                          }}>
                            <i className="fa fa-edit sidemenu-icon cp"></i>
                          </div> */}
                        </div>
                      }
                      <div className="invalid-feedback">
                        {formikEditName.errors.feature_name}
                      </div>
                    </td>
                    {/* <td>{feature.feature}</td> */}
                    {/* <td>{feature.feature_slug}</td> */}
                    <td className='text-center'>
                      {/* <input
                      type="checkbox"
                      className=""
                      disabled
                      style={{ width: '20px', height: '20px' }}
                      {...formik.getFieldProps(`features[${index}].free`)}
                      checked={formik.values.features[index].free || false}
                    /> */}
                      {formik.values.features[index].free ? <i className="fas fa-check sidemenu-icon"></i> : <i className="fas fa-times sidemenu-icon"></i>}
                    </td>
                    <td className='text-center'>
                      {/* <input
                      type="checkbox"
                      // className="form-check-input"
                      className=""
                      disabled
                      style={{ width: '20px', height: '20px' }}
                      {...formik.getFieldProps(`features[${index}].premium`)}
                      checked={formik.values.features[index].premium || false}
                    /> */}
                      {formik.values.features[index].premium ? <i className="fas fa-check sidemenu-icon"></i> : <i className="fas fa-times sidemenu-icon"></i>}
                    </td>
                    <td className='text-center'>
                      {/* <input
                      type="checkbox"
                      className=""
                      disabled
                      style={{ width: '20px', height: '20px' }}
                      {...formik.getFieldProps(`features[${index}].credit_based`)}
                      checked={formik.values.features[index].credit_based || false}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        formik.setFieldValue(`features[${index}].credit_based`, isChecked);
                        if (!isChecked) {
                          formik.setFieldValue(`features[${index}].credit_charge`, null);
                          formik.setFieldValue(`features[${index}].free_limit`, null);
                          formik.setFieldValue(`features[${index}].premium_limit`, null);
                        }
                      }}
                    /> */}
                      {formik.values.features[index].credit_based ? <i className="fas fa-check sidemenu-icon"></i> : <i className="fas fa-times sidemenu-icon"></i>}
                    </td>
                    {formik.values.features[index].credit_based ?
                      <>
                        <td>
                          <input
                            type="text"
                            className={`form-control ${formik.touched.features?.[index]?.credit_charge &&
                              formik.errors.features?.[index]?.credit_charge
                              ? 'is-invalid'
                              : ''
                              }`}
                            name={`features[${index}].credit_charge`}
                            disabled={!formik.values.features[index].credit_based}
                            value={feature.credit_charge || ''}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            onKeyDown={blockInvalidChar}
                          />
                          <div className="invalid-feedback">
                            {formik.errors.features?.[index]?.credit_charge}
                          </div>
                        </td>
                        <td>
                          {formik.values.features[index].free_limit != null && formik.values.features[index].free_limit != undefined &&
                            <>
                              <input
                                type="text"
                                className={`form-control ${formik.touched.features?.[index]?.free_limit &&
                                  formik.errors.features?.[index]?.free_limit
                                  ? 'is-invalid'
                                  : ''
                                  }`}
                                name={`features[${index}].free_limit`}
                                disabled={!formik.values.features[index].credit_based}
                                value={feature.free_limit || ''}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                onKeyDown={blockInvalidChar}
                              />
                              <div className="invalid-feedback">
                                {formik.errors.features?.[index]?.free_limit}
                              </div>
                            </>}
                        </td>
                        <td>
                          {formik.values.features[index].premium_limit != null && formik.values.features[index].premium_limit != undefined &&
                            <>
                              <input
                                type="text"
                                className={`form-control ${formik.touched.features?.[index]?.premium_limit &&
                                  formik.errors.features?.[index]?.premium_limit
                                  ? 'is-invalid'
                                  : ''
                                  }`}
                                name={`features[${index}].premium_limit`}
                                disabled={!formik.values.features[index].credit_based}
                                value={feature.premium_limit || ''}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                onKeyDown={blockInvalidChar}
                              />
                              <div className="invalid-feedback">
                                {formik.errors.features?.[index]?.premium_limit}
                              </div>
                            </>}
                        </td>
                      </>
                      : <>
                        <td></td>
                        <td></td>
                        <td></td>
                      </>
                    }
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="btn ripple btn-main-primary signbtn my-3" type="submit">Save Changes</button>
        </form>
      }
    </div>
  );
};

export default SubscriptionFeature;
