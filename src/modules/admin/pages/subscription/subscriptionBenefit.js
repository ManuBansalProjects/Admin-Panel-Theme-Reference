import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { SubscriptionFeatureList, SubscriptionFeatureUpdate } from "../../services/subscriptionFeature.services";
import { blockInvalidChar, capitalizeFirstLetter, globalLoader, handleServerValidations } from "../../../../utils/commonfunction";
import Swal from "sweetalert2";
import { languageSpoken, SWAL_SETTINGS } from "../../../../utils/Constants";
import { useNavigate } from "react-router-dom";
import Breadcrums from "../../common/breadcrumbs";
import Loader from "../../common/loader";
import CustomCkeditor from "../../common/customeditor";
import { useTranslation } from "react-i18next";
import { SubscriptionBenefitsDetails, SubscriptionBenefitsUpdate } from "../../services/subscriptionBenifit.services";

const validationSchema = Yup.object().shape({
  free_subscription_benefit_en: Yup.string().required("Free Subscription Benefit in English is required"),
  free_subscription_benefit_de: Yup.string().required("Free Subscription Benefit in Dutch is required"),
  free_subscription_benefit_es: Yup.string().required("Free Subscription Benefit in Spanish is required"),
  free_subscription_benefit_hu: Yup.string().required("Free Subscription Benefit in Hungarian is required"),

  premium_subscription_benefit_en: Yup.string().required("Premium Subscription Benefit in English is required"),
  premium_subscription_benefit_de: Yup.string().required("Premium Subscription Benefit in Dutch is required"),
  premium_subscription_benefit_es: Yup.string().required("Premium Subscription Benefit in Spanish is required"),
  premium_subscription_benefit_hu: Yup.string().required("Premium Subscription Benefit in Hungarian is required"),

  credit_subscription_benefit_en: Yup.string().required("Credit Subscription Benefit in English is required"),
  credit_subscription_benefit_de: Yup.string().required("Credit Subscription Benefit in Dutch is required"),
  credit_subscription_benefit_es: Yup.string().required("Credit Subscription Benefit in Spanish is required"),
  credit_subscription_benefit_hu: Yup.string().required("Credit Subscription Benefit in Hungarian is required"),
});


const SubscriptionBenefit = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [showdefault, setShowdefault] = useState({});
    const [loader, setLoader] = useState(false);
    const [changesFlag, setChangesFlag] = useState(false);

    const breadcrumbs = [
        { title: "Dashboard", url: "/admin/dashboard" },
        { title: "Subscription Benefits", url: "" },
    ];

    // Load features from backend
    useEffect(() => {
        setLoader(true);
        SubscriptionBenefitsDetails()
            .then((data) => {
                setShowdefault(data && data.data ? data.data : {});
                setTimeout(() => setLoader(false), 300);
            })
            .catch((err) => {
                console.error("Error fetching features:", err);
                setTimeout(() => setLoader(false), 300);
            });
    }, [changesFlag]);

    const formik = useFormik({
        enableReinitialize: true, // allows reinitializing when data is fetched
        initialValues: {
            free_subscription_benefit_en: showdefault?.free_subscription_benefit_en || "",
            free_subscription_benefit_de: showdefault?.free_subscription_benefit_de || "",
            free_subscription_benefit_es: showdefault?.free_subscription_benefit_es || "",
            free_subscription_benefit_hu: showdefault?.free_subscription_benefit_hu || "",
            premium_subscription_benefit_en: showdefault?.premium_subscription_benefit_en || "",
            premium_subscription_benefit_de: showdefault?.premium_subscription_benefit_de || "",
            premium_subscription_benefit_es: showdefault?.premium_subscription_benefit_es || "",
            premium_subscription_benefit_hu: showdefault?.premium_subscription_benefit_hu || "",
            credit_subscription_benefit_en: showdefault?.credit_subscription_benefit_en || "",
            credit_subscription_benefit_de: showdefault?.credit_subscription_benefit_de || "",
            credit_subscription_benefit_es: showdefault?.credit_subscription_benefit_es || "",
            credit_subscription_benefit_hu: showdefault?.credit_subscription_benefit_hu || "",
        },
        validationSchema: validationSchema,
        onSubmit: (values, { setSubmitting, resetForm }) => {
            globalLoader(true);
            let formData = new FormData();
            formData.append("benefits", JSON.stringify(values));

            SubscriptionBenefitsUpdate(formData)
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

    // console.log("-=-=-values0-==-=", formikEditName.values);
    // console.log("-=-=-formik.values==-=", formik.values);

    return (
        <div className="mt-4">
            <Breadcrums data={breadcrumbs} />
            {loader ? (
                <Loader />
            ) : (
                <form onSubmit={formik.handleSubmit}>
                    <div className="row row-sm">
                        <div className="col-lg-12 col-md-12 animation_fade">
                            <div className="card custom-card">
                                <div className="card-body">
                                    <h6 className="main-content-label mb-3">Subscription Benefits</h6>

                                    {["free", "premium", "credit"].map((type) => (
                                        <div className="card p-3 mb-4 shadow-sm border" key={type}>
                                            <h5 className="mb-3 text-capitalize border-bottom pb-2 font-weight-semibold">
                                                {type === "credit" ? "Credit per Usage" : `${type.charAt(0).toUpperCase() + type.slice(1)} Subscription`}
                                            </h5>

                                            <div className="row">
                                                {languageSpoken.map((lang) => {
                                                    const fieldName = `${type}_subscription_benefit_${lang?.code}`;
                                                    const fieldLabel = `${type} subscription benefit (${lang?.name})`;
                                                    return (
                                                        <div className="col-md-6 mb-4" key={fieldName}>
                                                            <label htmlFor={fieldName} className="d-flex text-left font-weight-bold">
                                                                {capitalizeFirstLetter(fieldLabel)} <span className="requirestar ml-1">*</span>
                                                            </label>
                                                            <CustomCkeditor
                                                                fieldname={fieldName}
                                                                setFieldValue={formik.setFieldValue}
                                                                value={formik.values[fieldName]}
                                                                setFieldTouched={formik.setFieldTouched}
                                                            />
                                                            <span className="text-danger d-flex text-left">{formik.errors[fieldName] && formik.touched[fieldName] && formik.errors[fieldName]}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}

                                    <div className="mt-4">
                                        <button className="btn btn-info mr-2" type="submit">
                                            <i className="ace-icon fa fa-check bigger-110 mx-1"></i>
                                            {t("btn_save")}
                                        </button>
                                        <button className="btn ripple btn-secondary" type="button" onClick={() => navigate(-1)}>
                                            <i className="ace-icon fa fa-times bigger-110 mx-1"></i>
                                            {t("btn_cancel")}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
};

export default SubscriptionBenefit;
