import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import CustomPagination from "../../common/custompagination";
import Sorting from "../../common/sorting";
import Loader from "../../common/loader";
import Breadcrums from "../../common/breadcrumbs";
import $ from "jquery";
import {
  SWAL_SETTINGS,
  showFilterlist,
} from "../../../../utils/Constants";
import {
  capitalizeFirstLetter,
  formateDateWithMonth,
  handleServerValidations,
  removeSpecialCharacter,
  TrimText,
} from "../../../../utils/commonfunction";
import StatusFilter from "../../common/statusFilter";
import CustomRangepicker from "../../common/rangepicker";
import { List, Status, Delete } from "../../services/psychic.services";

const PsychicUserTable = () => {
  const { t } = useTranslation();
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [statsupdate, setStatusUpdate] = useState("false");
  const [featuredStatsupdate, setFeaturedStatusUpdate] = useState("false");
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
    { title: t("link_psychic"), url: "" },
  ];
  const [resetdate, setResetDate] = useState(false);





  const handleFeaturedChange = (featured, index) => {
    const id = list[index]._id;
    console.log(id);

    // Update the list state immutably
    setList(prevList =>
      prevList.map((item, i) =>
        i === index ? { ...item, featured: !featured } : item
      )
    );

    const formData = new FormData();
    formData.append("o_id", JSON.stringify(id));
    formData.append("featured", !featured);

    // ChangeFeaturedStatus(formData)
    //   .then((response) => {
    //     if (response.success) {
    //       Swal.fire({
    //         icon: "success",
    //         text: response.message,
    //         ...SWAL_SETTINGS,
    //       });
    //       setFeaturedStatusUpdate(!featuredStatsupdate);
    //     } else {
    //       Swal.fire({
    //         icon: "error",
    //         text: handleServerValidations(response),
    //         ...SWAL_SETTINGS,
    //       });
    //     }
    //   })
    //   .catch((error) => {
    //     console.log("Error:", error);
    //   });
  };

  /********** MULTI SELECT <<<<<<********* */

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
        List(formData)
          .then((data) => {
            setDataLength(data.data.total_records);
            // setSerialNo(data.data.offset);
            setList(data && data.data && data.data.list && Array.isArray(data.data.list) ? data.data.list : []);

            //   console.log("data.data.data_ids", data.data.data_ids);

            setPage(data && data.data && data.data.page ? data.data.page : 1);
            setLoader(false);
          })
          .catch((error) => {
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

  const viewfunction = (row) => {
    navigate(
      `/admin/psychic-management/psychic/view/${row._id}`
    );
  };

  const ChangeStatus = (data, Num) => {
    let ids = Array.isArray(data) ? data : [data];
    const formData = new FormData();
    formData.append("o_id", JSON.stringify(ids));
    formData.append("status", Num);
    Swal.fire({
      customClass: "swal-wide",
      title: t(`Are you sure you want to ${Num === 0 ? "deactivate" : "activate"} this Advisor ?`),
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: t("btn_cancel"),
      confirmButtonColor: "#403fad",
      cancelButtonColor: "#f1388b",
      confirmButtonText: t("btn_yes"),
    }).then((result) => {
      // console.log("result", result);
      if (result.isConfirmed) {
        Status(formData)
          .then((response) => {
            // console.log("kkkk---", response);
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



  function Deletefunction(data, email) {
    Swal.fire({
      customClass: "swal-wide",
      title: t("msg_are_you_sure"),
      text: t("you_not_be_able_to_revert_this"),
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: t("btn_cancel"),
      confirmButtonColor: "#403fad",
      cancelButtonColor: "#f1388b",
      confirmButtonText: t("btn_yes_delete"),
    }).then((result) => {
      if (result.isConfirmed) {
        const formdata = new FormData();
        let ids = Array.isArray(data) ? data : [data];
        // formdata.append("o_id", row._id);
        formdata.append("o_id", JSON.stringify(ids))
        formdata.append("email", email)
        Delete({o_id: data})
          .then((response) => {
            // console.log("🚀 ~ .then ~ response:", response);
            setStatusUpdate(!statsupdate);
            if (response.success) {
              Swal.fire({
                icon: "success",
                text: response.message,
                ...SWAL_SETTINGS,
              });

            } else {
              Swal.fire({
                icon: "error",
                text: handleServerValidations(response),
                ...SWAL_SETTINGS,
              });
            }
          })
          .catch((error) => {
            console.log("deleteError");
          });
      }
    });
  }

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
    $("#defaultstatus")[0].selectedIndex = 0;
  };


  const goToEdit = (row) => {
    navigate(
      `/admin/psychic-management/psychic/${params.pgno}/edit/${row._id}`
    );
  };


  // const planName = (row) => {
  //   return (row.enrollment_details && row.enrollment_details.plan_name ? (
  //     row.enrollment_details.days_in_expiry < 0 ?
  //       `capitalizeFirstLetter(${row.enrollment_details.plan_name})-Expired` :
  //       row.enrollment_details.plan_name
  //   ) : "None")
  // }

  const planName = (row) => {
    if (row && row.enrollment_details && row.enrollment_details.plan_name) {
      if (row.enrollment_details.days_in_expiry < 0) {
        return removeSpecialCharacter(`${capitalizeFirstLetter(row.enrollment_details.plan_name)}`) + `-Expired`;
      } else {
        return removeSpecialCharacter( capitalizeFirstLetter(row.enrollment_details.plan_name));
      }
    } else {
      return "None";
    }
  }

  const renewBtnShow = (row) => {
    return (
      row?.enrollment_details?.days_in_expiry && row?.enrollment_details?.days_in_expiry <= 5
    )
  }

  // const handleRoleFilterChange = (e) => {
  //   console.log("valuevalu1e", e.target.value);
  //   if (e.target.value) {
  //     prepareSearch("role", Number(e.target.value));
  //   } else {
  //     prepareSearch("role", "");
  //   }
  // };

  return (
    <>
      <Breadcrums data={breadcrumbs} />
      {/* table section */}
      <div className="animation_fade">
        <div className="card custom-card">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h6 className="main-content-label">
                {t("link_psychic")}
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
                <div className="me-3">
                  <StatusFilter
                    data={showFilterlist}
                    prepareSearch={prepareSearch}
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
                <button
                  className="btn ripple btn-main-primary signbtn mr-2"
                  onClick={() =>
                    navigate(`/admin/psychic-management/psychic/add`)
                  }
                >
                  {t("Create New Profile")}
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
                    <th style={{ width: "50px" }}>{t("list_heading_profile")}</th>

                    <th>
                      <div className="sorting_column">
                        <span>{t("label_name")}</span>
                        <Sorting
                          sort={sorting}
                          handleSort={handleSort}
                          column="name"
                        />
                      </div>
                    </th>
                    <th>{t("list_heading_email")}</th>
                    <th>
                      <div className="sorting_column">
                        <span>{t("list_heading_address")}</span>
                        <Sorting
                          sort={sorting}
                          handleSort={handleSort}
                          column="location"
                        />
                      </div>
                    </th>

                    <th className="">{t("list_heading_phone_number")}</th>


                    {/* <th className="">{t("label_plan_name")}</th>
                    <th className="">{t("label_expiry_date")}</th> */}

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
                    {/* <th>Created By</th>
                    <th>Updated By</th> */}
                    {/* <th className="status_head">{t("featured")}</th> */}
                    <th className="status_head">{t("list_heading_status")}</th>
                    <th className="action_head">{t("list_heading_action")}</th>
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
                                {row?.profile_image ? (
                                  <div className="row_image">
                                    <img
                                      className="rounded"
                                      alt="profile"
                                      src={row?.profile_image}
                                    />
                                  </div>
                                ) : (
                                  "N/A"
                                )}
                              </td>
                              <td>
                                {row?.name ? (
                                  <div className="d-flex">
                                    {row?.name ? row.name : "N/A"}
                                  </div>
                                ) : (
                                  <div className="d-flex">N/A</div>
                                )}
                              </td>
                              <td>{row?.email ? row.email : "N/A"}</td>
                              <td>{row?.address ? TrimText(capitalizeFirstLetter(row?.address,30)) : "N/A"} </td>
                              <td>{row?.phone_number ? row.phone_number : "N/A"}</td>
                              {/* <td>
                                {
                                  planName(row)
                                }
                              </td> */}

                              {/* <td>
                                {row.enrollment_details && row.enrollment_details.expiry_date
                                  ? formateDateWithMonth(row.enrollment_details.expiry_date)
                                  : "N/A"}
                              </td> */}

                              <td>
                                {row.createdAt
                                  ? formateDateWithMonth(row.createdAt)
                                  : "N/A"}
                              </td>

                              {/* <td>
                                <label className={"custom-switch"+ (row.status !== 1? " e_none" :"")}>
                                  <input disabled={row.status !== 1} type="checkbox" name="custom-switch-checkbox" className="custom-switch-input"
                                    checked={row.featured && row.status === 1 ? true : false}
                                    onChange={() => handleFeaturedChange(row.featured ? row.featured : false, i)} />
                                  <span className="custom-switch-indicator cp"></span>
                                </label>
                              </td> */}
                              <td>
                                {row.status === 1 ? (
                                  <button
                                    className="btn ripple btn-main-primary signbtn"
                                    onClick={() => {
                                      ChangeStatus(row?._id, 0);
                                    }}
                                  >
                                    {t("btn_active")}
                                  </button>
                                ) : (
                                  <button
                                    className="btn ripple btn-secondary"
                                    onClick={() => {
                                      ChangeStatus(row?._id, 1);
                                    }}
                                  >
                                    {t("btn_inactive")}
                                  </button>
                                )}
                              </td>

                              <td>
                                <div className="d-flex">
                                  <button
                                    className="btn ripple btn-main-primary signbtn"
                                    onClick={() => {
                                      viewfunction(row);
                                    }}
                                  >
                                    {t("btn_view")}
                                  </button>

                                  <button
                                    className="btn ripple btn-success mlAction"
                                    onClick={() => {
                                      goToEdit(row);
                                    }}
                                  >
                                    {t("btn_edit")}
                                  </button>
                                  {/* <button
                                    className="btn ripple btn-secondary mlAction"
                                    onClick={() => {
                                      Deletefunction(row?._id);
                                    }}
                                  >
                                    {t("btn_delete")}
                                  </button> */}


                                  {/* more */}
                                  <div className="btn-group mlAction">
                                    <button
                                      type="button"
                                      className="btn btn-dark dropdown-toggle"
                                      data-bs-toggle="dropdown"
                                      aria-expanded="false"
                                    >
                                      {t("More")}
                                    </button>
                                    <ul className="dropdown-menu">
                                      <li>
                                        <button
                                          className="dropdown-item"
                                          onClick={() => {
                                            Deletefunction(row?._id, row?.email);
                                          }}
                                        >
                                          {t("btn_delete")}
                                        </button>
                                      </li>
                                      {/* {row?.enrollment_details ?
                                        null
                                        : (
                                          <li>
                                            <button
                                              className="dropdown-item"
                                              onClick={() => {
                                                navigate(`/admin/cafe-management/cafe/enroll-cafe/${row._id}`)
                                              }}
                                            >
                                              {t("btn_enroll_cafe")}
                                            </button>
                                          </li>
                                         )}
                                      {renewBtnShow(row) ? (
                                        <li>
                                          <button
                                            className="dropdown-item"
                                            onClick={() => {
                                              navigate(`/admin/cafe-management/cafe/list/${row._id}/enroll-cafe/renew-plan`)
                                            }}
                                          >
                                            {t("btn_renew")}
                                          </button>
                                        </li>
                                      ) : null} */}

                                    </ul>
                                  </div>

                                  {/* more end */}
                                </div>
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
                    path: "/admin/psychic-management/psychic/list",
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

export default PsychicUserTable;
