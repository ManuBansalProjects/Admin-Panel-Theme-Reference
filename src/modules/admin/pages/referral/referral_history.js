import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import $ from "jquery";
import { showFilterlist, subscriptionPlanType, SWAL_SETTINGS } from "../../../../utils/Constants";
import { formateDateWithMonth, handleServerValidations, TrimText } from "../../../../utils/commonfunction";
import Sorting from "../../common/sorting";
import Loader from "../../common/loader";
import Breadcrums from "../../common/breadcrumbs";
import CustomRangepicker from "../../common/rangepicker";
import StatusFilter from "../../common/statusFilter";
import CustomPagination from "../../common/custompagination";
import * as referralSettingsService from "../../services/referralSettings.services";

const ReferralHistoryTable = () => {
  const { t } = useTranslation();
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [statsupdate, setStatusUpdate] = useState("false");
  const [datalength, setDataLength] = useState("");
  const [itemperpage] = useState(10);
  const [sorting, setSorting] = useState({});
  const [defaultSorting, setDefaultSorting] = useState(true);
  const [page, setPage] = useState(1);
  const [loader, setLoader] = useState(true);
  const [search, setSearch] = useState({});
  const [globalsearch, setGlobalSearch] = useState("");
  const breadcrumbs = [
    { title: t("link_dashboard"), url: "/admin/dashboard" },
    { title: t("Referral History"), url: "" },
  ];
  const [resetdate, setResetDate] = useState(false);

//   const queryParams = new URLSearchParams(location.search);
//   const devParam = queryParams.get('dev');
//   const showAddButton = devParam === 'true';
//   const [isDevMode, setIsDevMode] = useState(showAddButton);

//   useEffect(() => {
//     setIsDevMode(showAddButton);
//   }, [showAddButton]);

  useEffect(() => {
    const getData = setTimeout(() => {
      if (search) {
        setLoader(true);
        const formData = new FormData();
        formData.append("page", params.pgno);
        formData.append("per_page", itemperpage);
        formData.append("sort", JSON.stringify(sorting));
        formData.append("search", JSON.stringify(search));
        formData.append("global_search", globalsearch);
        referralSettingsService.ListReferralHistory(formData)
          .then((data) => {
            setDataLength(data.data.total_records);
            setList(data && data.data && data.data.list ? data.data.list : []);
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
    location,
    statsupdate,
    sorting,
    search,
    globalsearch,
    itemperpage,
    params.pgno,
  ]);

//   const viewfunction = (row) => {
//     navigate(
//       `/admin/subscription/history/${params.pgno}/view/${row._id}`
//     );
//   };

  // sorting function start
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
      {/* table section */}
      <div className="animation_fade">
        <div className="card custom-card">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h6 className="main-content-label">
                {t("Referral History")}
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
                {/* <div className="me-3">
                  <StatusFilter
                    data={showFilterlist}
                    prepareSearch={prepareSearch}
                  />
                </div> */}
                <button
                  type="reset"
                  value="Reset"
                  onClick={resetFilter}
                  className="btn btn-warning float-right mr-2"
                >
                  {t("btn_reset_filter")}
                </button>
                
                {/* <button
                  className="btn ripple btn-main-primary signbtn mr-2"
                  onClick={() =>
                    navigate(`/admin/subscription/subscription-plan/add`)
                  }
                >
                  {t("btn_add_new")}
                </button> */}
                
              </div>
            </div>
            <div className="table-responsive">
              <table className="table table-bordered border-t0 key-buttons text-nowrap w-100">
                <thead>
                  <tr>
                    <th className="position-relative select_head">
                      <span>{t("list_heading_sno")}</span>
                    </th>

                    <th className="position-relative select_head">
                      <span>{t("Referrer")}</span>
                    </th> 

                    <th className="position-relative select_head">
                      <span>{t("Referee")}</span>
                    </th>      

                    <th className="position-relative select_head">
                      <span>{t("Earning Type")}</span>
                    </th>

                    <th className="position-relative select_head">
                      <span>{t("Earning")}</span>
                    </th>                    

                    <th className="created_head">
                      <div className="sorting_column">
                        <span>{t("list_heading_created_date")}</span>
                        <Sorting
                          sort={sorting}
                          handleSort={handleSort}
                          defaultSorting={defaultSorting}
                          column="createdAt"
                        />
                      </div>
                    </th>

                    {/* <th className="status_head">{t("list_heading_status")}</th> */}
                    {/* <th className="action_head">{t("list_heading_action")}</th> */}
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
                      {list.length ? (
                        list.map((row, i) => {
                          return (
                            <tr
                              key={i}
                            >
                              <td>
                                {row ? ((page - 1) * itemperpage) + i + 1 : null}
                              </td>
                              <td>
                                {row?.referrer?.name || 'N/A'}
                              </td>
                              <td>
                                {row?.referee?.name || "N/A"}
                              </td>
                              <td>
                                {row?.earning_type || "N/A"}
                              </td>
                              <td>
                                {row?.earning || "N/A"}
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
                              {/* <td>
                                {row.status === 1 ? (
                                  <button
                                    className="btn ripple btn-main-primary signbtn"
                                  >
                                    {t("btn_active")}
                                  </button>
                                ) : (
                                  <button
                                    className="btn ripple btn-secondary"
                                  >
                                    {t("btn_inactive")}
                                  </button>
                                )}
                              </td> */}

                              {/* <td>
                                <div className="d-flex">
                                  <button
                                    className="btn ripple btn-main-primary signbtn"
                                    onClick={() => {
                                      viewfunction(row);
                                    }}
                                  >
                                    {t("btn_view")}
                                  </button>
                                  
                                </div>
                              </td> */}
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
                    path: "/admin/subscription/history/list",
                  },
                ]}
              />
            ) : (
              ""
            )}
          </div>
        </div>
      </div>

    </>
  );
};

export default ReferralHistoryTable
;
