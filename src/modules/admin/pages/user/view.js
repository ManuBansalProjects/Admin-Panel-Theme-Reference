import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Loader from "../../common/loader";
import { capitalizeFirstLetter, formateDate, formateDateWithMonth, getFormatedTime, handleServerValidations } from "../../../../utils/commonfunction";
import { useTranslation } from "react-i18next";
// import $ from "jquery";
import Breadcrums from "../../common/breadcrumbs";
import { subscribeForPremium, subscriptionHistoryList, unsubscribeFromPremium, userDetails } from "../../services/user.service";
import Swal from "sweetalert2";
import { SUBSCRIPTION_NAMES, SUBSCRIPTION_PRODUCT_IDS, SWAL_SETTINGS } from "../../../../utils/Constants";
import { SubscriptionHistoryList } from "../../services/subscriptionPlan.services";
import CustomRangepicker from "../../common/rangepicker";
import CustomPagination from "../../common/custompagination";

const UserView = (props) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const location = useLocation();
    const params = useParams();
    // const [query] = useSearchParams();

    const [showdefault, setShowDefault] = useState({});
    const [statsupdate, setStatusUpdate] = useState("false");
    const [activeTab, setActiveTab] = useState("details");
    const [subscriptionList, setSubscriptionList] = useState([]);
    const [datalength, setDataLength] = useState("");
    const [itemperpage] = useState(10);
    const [sorting, setSorting] = useState({});
    const [defaultSorting, setDefaultSorting] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState({});
    const [globalsearch, setGlobalSearch] = useState("");
    const [loader, setLoader] = useState(true);
    const [resetdate, setResetDate] = useState(false);

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


    useEffect(() => {
        if(activeTab != 'subscriptionHistory')return;

        const getData = setTimeout(() => {
          if (search) {
            setLoader(true);
            const formData = new FormData();
            formData.append("page", params.pgno);
            formData.append("per_page", itemperpage);
            formData.append("sort", JSON.stringify(sorting));
            formData.append("search", JSON.stringify(search));
            formData.append("global_search", globalsearch);
            SubscriptionHistoryList(formData)
              .then((data) => {
                setDataLength(data.data.total_records);
                setSubscriptionList(data && data.data && data.data.list ? data.data.list : []);
                setPage(data && data.data && data.data.page ? data.data.page : 1);
                setLoader(false);
              })
              .catch((error) => {
                 setLoader(false);
                console.log("error ====> ", error);
              });
          }
        }, 300);
        return () => clearTimeout(getData)
      }, [
        activeTab,
        location,
        statsupdate,
        sorting,
        search,
        globalsearch,
        itemperpage,
        params.pgno,
    ]);

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

    const handleSort = (e, column) => {
        setDefaultSorting(false);
        let sort = { order: 0, column: column };
        if (e.target.classList.contains("assc")) {
        sort.order = -1;
        } else {
        sort.order = 1;
        }
        setSorting(sort);
    };
  // sorting end

    // search or filter function
    const prepareSearch = (key, value) => {
        let sr = { ...search };
        if (String(value).length > 0) {
        sr[key] = value;
        } else {
        delete sr[key];
        }
        setSearch(sr);
    };

    const resetFilter = (e) => {
        e.preventDefault();
        setGlobalSearch("");
        prepareSearch();
        setSearch({});
        setResetDate(!resetdate);
        // $("#defaultstatus")[0].selectedIndex = 0;
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
                            {/* <li className="nav-item">
                                <button className={`nav-link ${activeTab === "subscriptionPlan" ? "active" : ""}`} onClick={() => setActiveTab("subscriptionPlan")}>
                                    {t("Subscription Plan")}
                                </button>
                            </li> */}
                            
                            {/* <li className="nav-item">
                                <button
                                    className={`nav-link ${activeTab === "subscriptionHistory" ? "active" : ""}`}
                                    onClick={() => {
                                        setActiveTab("subscriptionHistory");
                                    }}
                                >
                                    {t("Subscription History")}
                                </button>
                            </li> */}

                            {/* <li className="nav-item">
                                <button className={`nav-link ${activeTab === "questionnaire" ? "active" : ""}`} onClick={() => setActiveTab("questionnaire")}>
                                    {t("Questionnaire")}
                                </button>
                            </li> */}
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

                                    {/* subscription history section */}

                                    {/* {activeTab === "subscriptionHistory" && (
                                        <div className="animation_fade">
                                            <div className="card custom-card">
                                                <div className="card-body">
                                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                                        <h6 className="main-content-label">
                                                            {t("Subscription History")}
                                                        </h6>
                                                        <div className="d-flex align-items-center">
                                                            <div className="form-group mb-0 me-3">
                                                                <div className="form-group mb-0 rangepicker_container filter_design">
                                                                    <i className="fa fa-search calender_icon"></i>
                                                                    <input
                                                                        type="search"
                                                                        className="form-control"
                                                                        value={globalsearch}
                                                                        placeholder={t("input_placeholder_search")}
                                                                        onChange={(e) => {
                                                                            setGlobalSearch(e.target.value);
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="me-3">
                                                                <CustomRangepicker
                                                                    GetDateRange={(e) => {
                                                                    prepareSearch("createdAt", e);
                                                                    }}
                                                                    resetdate={resetdate}
                                                                />
                                                            </div>
                                                            
                                                            <button
                                                                type="reset"
                                                                value="Reset"
                                                                onClick={resetFilter}
                                                                className="btn btn-warning float-right mr-2"
                                                            >
                                                                {t("btn_reset_filter")}
                                                            </button>
                                                            
                                                        </div>
                                                    </div>
                                                    <div className="table-responsive">
                                                    <table className="table table-bordered border-t0 key-buttons text-nowrap w-100">
                                                        <thead>
                                                            <tr>
                                                                <th className="position-relative select_head">
                                                                    <span>{t("list_heading_sno")}</span>
                                                                </th>

                                                                <th>
                                                                    <div className="">
                                                                        <span>{t("Plan")}</span>
                                                                    </div>
                                                                </th>

                                                                <th className="position-relative select_head">
                                                                    <span>{t("Plan Type")}</span>
                                                                </th>      

                                                                <th className="position-relative select_head">
                                                                    <span>{t("Plan price")}</span>
                                                                </th>

                                                                <th className="position-relative select_head">
                                                                    <span>{t("Balance Count")}</span>
                                                                </th>

                                                                <th className="position-relative select_head">
                                                                    <span>{t("Customer")}</span>
                                                                </th>

                                                                <th className="position-relative select_head">
                                                                <   span>{t("Transaction Id")}</span>
                                                                </th>
                                                                
                                                                <th className="position-relative select_head">
                                                                    <span>{t("Amount")}</span>
                                                                </th>      

                                                                <th className="position-relative select_head">
                                                                    <span>{t("Coupon Code")}</span>
                                                                </th>

                                                                <th className="position-relative select_head">
                                                                    <span>{t("Discount")}</span>
                                                                </th>
                                                                

                                                                <th className="created_head">
                                                                    <div className="sorting_column">
                                                                        <span>{t("list_heading_created_date")}</span>
                                                                       
                                                                    </div>
                                                                </th>

                                                               
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {loader ? (
                                                                <tr>
                                                                <td colSpan={14}>
                                                                    <Loader />
                                                                </td>
                                                                </tr>
                                                            ) : (
                                                                <>
                                                                {subscriptionList.length ? (
                                                                    subscriptionList.map((row, i) => {
                                                                    return (
                                                                        <tr
                                                                        key={i}
                                                                        >
                                                                        <td>
                                                                            {row ? ((page - 1) * itemperpage) + i + 1 : null}
                                                                        </td>
                                                                        <td>
                                                                            {row?.plan_name || 'N/A'}
                                                                        </td>
                                                                        <td>
                                                                            {row?.plan_type || "N/A"}
                                                                        </td>
                                                                        <td>
                                                                            {row?.plan_price || "N/A"}
                                                                        </td>
                                                                        <td>
                                                                            {row?.balance_count || "N/A"}
                                                                        </td>
                                                                        <td>
                                                                            {row?.user?.name || "N/A"}
                                                                        </td>
                                                                        <td>
                                                                            {row?.transaction?.transaction_id || "N/A"}
                                                                        </td>
                                                                        <td>
                                                                            {row?.transaction?.amount || "N/A"}
                                                                        </td>
                                                                        <td>
                                                                            {row?.coupon_history?.coupon_code || "N/A"}
                                                                        </td>
                                                                        <td>
                                                                            {row?.coupon_history?.discounted_amount || "N/A"}
                                                                        </td>
                                                                        <td>
                                                                            {row.createdAt
                                                                            ? formateDateWithMonth(row.createdAt)
                                                                            : "N/A"}
                                                                        </td>
                                                                       
                                                                        </tr>
                                                                    );
                                                                    })
                                                                ) : (
                                                                    <tr>
                                                                    <td colSpan={14} className="text-center">
                                                                        {t("msg_no_records")}
                                                                    </td>
                                                                    </tr>
                                                                )}
                                                                </>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                    </div>
                                                    <div
                                                    className=""
                                                    id="example1_info"
                                                    role="status"
                                                    aria-live="polite"
                                                    >
                                                    <b>
                                                        {t("msg_total_records")} : {datalength ? datalength : "0"}
                                                    </b>
                                                    </div>
                                                    {datalength && datalength > 0 ? (
                                                    <CustomPagination
                                                        datalength={datalength}
                                                        itemperpage={itemperpage}
                                                        currentPage={page}
                                                        setPage={setPage}
                                                        pageRoute={[
                                                        {
                                                            name: "Psychic",
                                                            path: `/admin/user-management/user/view/${params.id}`,
                                                        },
                                                        ]}
                                                    />
                                                    ) : (
                                                    ""
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        // <div className="">
                                        //     <h5>{t("Subscription History")}</h5>
                                        //     <table className="table table-bordered table-hover">
                                        //         <thead>
                                        //             <tr>
                                        //                 <th>{t("Plan Type")}</th>
                                        //                 <th>{t("Start Date")}</th>
                                        //                 <th>{t("Expiry Date")}</th>
                                        //                 <th>{t("Status")}</th>
                                        //             </tr>
                                        //         </thead>
                                        //         <tbody>
                                        //             {subscriptionList?.map((subscriptionPlan) => (
                                        //                 <tr>
                                        //                     <td>{SUBSCRIPTION_NAMES[subscriptionPlan?.plan_type]}</td>
                                        //                     <td>{formateDateWithMonth(subscriptionPlan?.start_date)}</td>
                                        //                     <td>{formateDateWithMonth(subscriptionPlan?.end_date)}</td>
                                        //                     <td>{
                                        //                             subscriptionPlan?.status == '1' 
                                        //                             ? <span>ACTIVE</span> 
                                        //                             : <span className="text-danger">INACTIVE</span> 
                                        //                         }
                                        //                     </td>
                                        //                 </tr>
                                        //             ))}
                                        //         </tbody>
                                        //     </table>
                                        // </div>
                                    )} */}

                                   
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
