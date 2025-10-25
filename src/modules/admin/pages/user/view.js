import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../common/loader";
import { capitalizeFirstLetter, formateDate, formateDateWithMonth, getFormatedTime, handleServerValidations } from "../../../../utils/commonfunction";
import { useTranslation } from "react-i18next";
// import $ from "jquery";
import Breadcrums from "../../common/breadcrumbs";
import { subscribeForPremium, subscriptionHistoryList, unsubscribeFromPremium, userDetails } from "../../services/user.service";
import Swal from "sweetalert2";
import { SUBSCRIPTION_NAMES, SUBSCRIPTION_PRODUCT_IDS, SWAL_SETTINGS } from "../../../../utils/Constants";

const UserView = (props) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const params = useParams();
    // const [query] = useSearchParams();
    const [showdefault, setShowDefault] = useState({});
    const [statsupdate, setStatusUpdate] = useState("false");
    const [activeTab, setActiveTab] = useState("details");
    const [subscriptionList, setSubscriptionList] = useState([]);

    const breadcrumbs = [
        { title: t("link_dashboard"), url: "/admin/dashboard" },
        {
            title: t("User"),
            url: "/admin/user-management/user/list/1",
        },
        { title: t("View"), url: "" },
    ];

    useEffect(() => {
        userDetails(params.id)
            .then((response) => {
                // console.log("View response-", response);
                setShowDefault(response && response.data ? response.data : []);
            })
            .catch((error) => {
                console.log("error=====>", error);
            });
    }, [params.id, statsupdate]);

    const handleSubscriptionHistory = () => {
        subscriptionHistoryList(params.id)
            .then((response) => {
                setSubscriptionList(response?.data?.list);
            })
            .catch((err) => {
                console.log("Err===>", err);
            });
    };

    const SubscribePremiumPlan = (o_id, plan_type) => {
        Swal.fire({
            customClass: "swal-wide",
            title: t(`Are you sure you want to provide this user ${SUBSCRIPTION_NAMES[plan_type]} subscription ?`),
            icon: "warning",
            showCancelButton: true,
            cancelButtonText: t("btn_cancel"),
            confirmButtonColor: "#403fad",
            cancelButtonColor: "#f1388b",
            confirmButtonText: t("btn_yes"),
        }).then((result) => {
            if (result.isConfirmed) {
                subscribeForPremium({ o_id: o_id, plan_type: plan_type })
                    .then((response) => {
                        if (response.success) {
                            Swal.fire({
                                icon: "success",
                                text: response.message,
                                ...SWAL_SETTINGS,
                            });
                            setStatusUpdate(!statsupdate);
                        } else {
                            Swal.fire({
                                icon: "error",
                                text: handleServerValidations(response),
                                ...SWAL_SETTINGS,
                            });
                        }
                    })
                    .catch((error) => {
                        console.log("error===>");
                    });
            }
        });
    };
    const UnsubscribePremiumPlan = (o_id) => {
        Swal.fire({
            customClass: "swal-wide",
            title: t(`Are you sure you want to unsubscribe this user from the premium plan?`),
            icon: "warning",
            showCancelButton: true,
            cancelButtonText: t("btn_cancel"),
            confirmButtonColor: "#403fad",
            cancelButtonColor: "#f1388b",
            confirmButtonText: t("btn_yes"),
        }).then((result) => {
            if (result.isConfirmed) {
                unsubscribeFromPremium({ o_id: o_id })
                    .then((response) => {
                        if (response.success) {
                            Swal.fire({
                                icon: "success",
                                text: response.message,
                                ...SWAL_SETTINGS,
                            });
                            setStatusUpdate(!statsupdate);
                        } else {
                            Swal.fire({
                                icon: "error",
                                text: handleServerValidations(response),
                                ...SWAL_SETTINGS,
                            });
                        }
                    })
                    .catch((error) => {
                        console.log("error===>");
                    });
            }
        });
    };

    return (
        <>
            <Breadcrums data={breadcrumbs} />
            <div className="row row-sm">
                <div className="col-lg-12 col-md-12 animation_fade">
                    <div className="card custom-card">
                        <ul className="nav nav-tabs mb-2 mt-3 ms-4">
                            <li className="nav-item">
                                <button className={`nav-link ${activeTab === "details" ? "active" : ""}`} onClick={() => setActiveTab("details")}>
                                    {t("View Details")}
                                </button>
                            </li>
                            <li className="nav-item">
                                <button className={`nav-link ${activeTab === "subscriptionPlan" ? "active" : ""}`} onClick={() => setActiveTab("subscriptionPlan")}>
                                    {t("Subscription Plan")}
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${activeTab === "subscriptionHistory" ? "active" : ""}`}
                                    onClick={() => {
                                        setActiveTab("subscriptionHistory");
                                        handleSubscriptionHistory();
                                    }}
                                >
                                    {t("Subscription History")}
                                </button>
                            </li>
                            <li className="nav-item">
                                <button className={`nav-link ${activeTab === "questionnaire" ? "active" : ""}`} onClick={() => setActiveTab("questionnaire")}>
                                    {t("Questionnaire")}
                                </button>
                            </li>
                        </ul>

                        <div className="card-body">
                            {showdefault && Object.keys(showdefault).length > 0 ? (
                                <div className="row">
                                    {activeTab === "details" && (
                                        <div className="col-lg-12 form-group">
                                            <table id="simple-table" className="table table-bordered table-hover">
                                                <tbody>
                                                    {/* Profile Info Table (excluding subscription) */}
                                                    <tr>
                                                        <th>{t("Image")}</th>
                                                        <td>
                                                            <img src={showdefault?.profile_image || "N/A"} alt="profile" style={{ height: "100px" }} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th>{t("Name")}</th>
                                                        <td className="text-capitalize">{showdefault?.name || "N/A"}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>{t("label_email")}</th>
                                                        <td>{showdefault?.email || "N/A"}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>{t("label_phone_number")}</th>
                                                        <td>{showdefault?.phone_number || "N/A"}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>{t("Gender")}</th>
                                                        <td>{showdefault?.gender || "N/A"}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>{t("Country")}</th>
                                                        <td className="text-capitalize">{showdefault?.country || "N/A"}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>{t("State")}</th>
                                                        <td className="text-capitalize">{showdefault?.state || "N/A"}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>{t("City")}</th>
                                                        <td className="text-capitalize">{showdefault?.city || "N/A"}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>{t("Pin Code")}</th>
                                                        <td className="text-capitalize">{showdefault?.pin_code || "N/A"}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>{t("Address")}</th>
                                                        <td className="text-capitalize">{showdefault?.address || "N/A"}</td>
                                                    </tr>
                                                    {/* <tr>
                                                        <th>{t("Date of Birth")}</th>
                                                        <td>{showdefault?.date_of_birth ? formateDate(showdefault.date_of_birth) : "N/A"}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>{t("Time of Birth")}</th>
                                                        <td>{showdefault?.time_of_birth ? getFormatedTime(showdefault.time_of_birth) : "N/A"}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>{t("Place of birth")}</th>
                                                        <td>{showdefault?.place_of_birth || "N/A"}</td>
                                                    </tr> */}
                                                    <tr>
                                                        <th>{t("list_heading_created_date")}</th>
                                                        <td>{showdefault?.createdAt ? formateDate(showdefault.createdAt) : "N/A"}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    {/* Separate Subscription Plan Section */}
                                    {activeTab === "subscriptionPlan" && (
                                        <div className="col-lg-12">
                                            <div className="card shadow-sm border">
                                                <div className="card-body">
                                                    <h5 className="mb-3">{t("Subscription Plan")}</h5>

                                                    {/* Extract values for clarity */}
                                                    {(() => {
                                                        const isFreePlan = showdefault?.subscription_plan === "free";
                                                        const expiryDate = new Date(showdefault?.subscription_expiry);
                                                        const isExpired = !showdefault?.subscription_expiry || expiryDate <= new Date();
                                                        const isPremium = showdefault?.subscription_plan === "premium";
                                                        const isPremiumAndActive = isPremium && !isExpired;

                                                        if (isPremiumAndActive) {
                                                            return (
                                                                <>
                                                                    <p>
                                                                        <strong>{t("Current Plan")}:</strong> {capitalizeFirstLetter(showdefault.subscription_plan)}
                                                                    </p>
                                                                    <p>
                                                                        <strong>{t("Plan Type")}:</strong> {SUBSCRIPTION_NAMES[showdefault.subscription_type]}
                                                                    </p>
                                                                    <p>
                                                                        <strong>{t("Expiry Date")}:</strong> {expiryDate.toLocaleDateString()}
                                                                    </p>
                                                                    <button className="btn btn-danger mt-2" onClick={() => UnsubscribePremiumPlan(showdefault._id)}>
                                                                        {t("Unsubscribe from Premium")}
                                                                    </button>
                                                                </>
                                                            );
                                                        } else {
                                                            return (
                                                                <>
                                                                    <p className="mb-2">{t("No active subscription. Choose a plan below:")}</p>
                                                                    <select
                                                                        className="form-select w-auto d-inline-block me-2"
                                                                        onChange={(e) => {
                                                                            const newPlan = e.target.value;
                                                                            if (!newPlan) return;
                                                                            console.log("Selected plan:", newPlan);
                                                                            SubscribePremiumPlan(showdefault._id, newPlan);
                                                                        }}
                                                                        defaultValue=""
                                                                    >
                                                                        <option value="" disabled> {t("Select a plan")} </option>
                                                                        <option value={SUBSCRIPTION_PRODUCT_IDS.ONE_MONTH_SUBSCRIPTION}>{t("Monthly")}</option>
                                                                        <option value={SUBSCRIPTION_PRODUCT_IDS.THREE_MONTH_SUBSCRIPTION}>{t("Quarterly")}</option>
                                                                        <option value={SUBSCRIPTION_PRODUCT_IDS.TWELVE_MONTH_SUBSCRIPTION}>{t("Yearly")}</option>
                                                                    </select>
                                                                </>
                                                            );
                                                        }
                                                    })()}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* subscription history section */}

                                    {activeTab === "subscriptionHistory" && subscriptionList?.length > 0 && (
                                        <div className="">
                                            <h5>{t("Subscription History")}</h5>
                                            <table className="table table-bordered table-hover">
                                                <thead>
                                                    <tr>
                                                        <th>{t("Plan Type")}</th>
                                                        <th>{t("Start Date")}</th>
                                                        <th>{t("Expiry Date")}</th>
                                                        <th>{t("Status")}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {subscriptionList?.map((subscriptionPlan) => (
                                                        <tr>
                                                            <td>{SUBSCRIPTION_NAMES[subscriptionPlan?.plan_type]}</td>
                                                            <td>{formateDateWithMonth(subscriptionPlan?.start_date)}</td>
                                                            <td>{formateDateWithMonth(subscriptionPlan?.end_date)}</td>
                                                            <td>{
                                                                    subscriptionPlan?.status == '1' 
                                                                    ? <span>ACTIVE</span> 
                                                                    : <span className="text-danger">INACTIVE</span> 
                                                                }
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    {/* Questionnaire */}
                                    {activeTab === "questionnaire" && showdefault?.question_set?.length > 0 && (
                                        <div className="">
                                            <h5>{t("Profile Questionnaire")}</h5>
                                            <table className="table table-bordered table-hover">
                                                <thead>
                                                    <tr>
                                                        <th>{t("Question")}</th>
                                                        <th>{t("Answer")}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {showdefault?.question_set?.map((questionAns, index) => {
                                                        const matchedOptions = questionAns?.question?.option.filter((opt) => questionAns.option.includes(opt.option_slug));
                                                        return (
                                                            <tr key={index}>
                                                                <td>{questionAns?.question?.question_title}</td>
                                                                <td>
                                                                    <ul style={{ margin: 0, paddingLeft: "20px" }}>
                                                                        {matchedOptions?.map((opt, idx) => (
                                                                            <li key={idx}>{opt.option_value}</li>
                                                                        ))}
                                                                    </ul>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Loader />
                            )}
                        </div>

                        {/* Back Button */}
                        <div className="mt-2 back-button">
                            <button className="btn ripple btn-dark" type="button" onClick={() => navigate(-1)}>
                                <i className="ace-icon-solid ion-arrow-return-left bigger-110 mx-1"></i>
                                {t("btn_back")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserView;
