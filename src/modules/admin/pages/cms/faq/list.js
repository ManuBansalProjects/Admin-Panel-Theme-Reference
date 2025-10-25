import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import Swal from "sweetalert2";
import $ from "jquery";
import Breadcrums from "../../../common/breadcrumbs";
import Loader from "../../../common/loader";
import StatusFilter from "../../../common/statusFilter";
import { SWAL_SETTINGS, showFilterlist } from "../../../../../utils/Constants";
import {
  TrimText,
  formateDateWithMonth,
  handleServerValidations,
} from "../../../../../utils/commonfunction";
import CustomPagination from "../../../common/custompagination";
import Sorting from "../../../common/sorting";
import * as faqServices from "../../../services/faq.services";
import { useTranslation } from "react-i18next";
import CustomRangepicker from '../../../common/rangepicker';

const FAQTable = () => {
  const params = useParams();
  const { t } = useTranslation()
  const location = useLocation();
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [statsupdate, setStatusUpdate] = useState("false");
  const [datalength, setDataLength] = useState();
  const [itemperpage] = useState(10);
  const [sorting, setSorting] = useState({});
  const [defaultSorting, setDefaultSorting] = useState(true);
  const [page, setPage] = useState(1);
  const [loader, setLoader] = useState(true);
  const [search, setSearch] = useState({});
  const [globalsearch, setGlobalSearch] = useState("");
  const breadcrumbs = [
    { title: t("faq.link_dashboard"), url: "/admin/dashboard" },
    { title: t("faq.link_faq"), url: "" },
  ];
  const [resetdate, setResetDate] = useState(false);

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
        faqServices
          .List(formData)
          .then((data) => {
            setDataLength(data.data.total_records);
            setList(data && data.data && data.data.list ? data.data.list : []);
            setLoader(false);
          })
          .catch((error) => {
            setTimeout(() => {
              setLoader(false);
            }, 500)
            console.log("error ====> ", error);
          });
      }
    }, 300);

    return () => clearTimeout(getData);
  }, [location, statsupdate, sorting, search, globalsearch]);

  const viewfunction = (row) => {
    navigate(`/admin/cms/faq/view/${row._id}`);
  };
  const Editfunction = (row) => {
    navigate(`/admin/cms/faq/${params.pgno}/edit/${row._id}`);
  };

  const ChangeStatus = (data, Num) => {
    const formData = new FormData();
    let ids = Array.isArray(data) ? data : [data];
    formData.append("o_id", JSON.stringify(ids));
    formData.append("status", Num);
    Swal.fire({
      customClass: "swal-wide",
      title: t(`Are you sure you want to ${Num === 0 ? "deactivate" : "activate"} this FAQ ?`),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#403fad",
      cancelButtonColor: "#f1388b",
      confirmButtonText: t("btn_yes"),
      cancelButtonText: t("btn_cancel")
    }).then((result) => {
      if (result.isConfirmed) {
        faqServices
          .Status(formData)
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

  function Deletefunction(data) {
    Swal.fire({
      customClass: "swal-wide",
      title: t("msg_are_you_sure"),
      text: t("you_not_be_able_to_revert_this"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#403fad",
      cancelButtonColor: "#f1388b",
      confirmButtonText: t("btn_yes_delete"),
      cancelButtonText: t("btn_cancel")
    }).then((result) => {
      if (result.isConfirmed) {
        let ids = Array.isArray(data) ? data : [data];
        faqServices
          .Delete(ids)
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
            console.log("deleteError");
          });
      }
    });
  }

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
  // search or filer end

  const resetFilter = (e) => {
    e.preventDefault();
    setGlobalSearch("");
    prepareSearch();
    setSearch({});
    // reset customrangepicker & customstatusfilter state using jquery//
    setResetDate(!resetdate);
    $("#defaultstatus")[0].selectedIndex = 0;
  };




  return (
    <>
      <Breadcrums data={breadcrumbs} />
      {/* table section */}
      <div className="animation_fade">
        <div className="card custom-card overflow-hidden">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h6 className="main-content-label">{t("faq.heading_cms_faq")}</h6>
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
                    className="cp"
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
                  className="btn ripple btn-main-primary signbtn"
                  onClick={() => navigate(`/admin/cms/faq/add`)}
                >
                  {t("btn_add_new")}
                </button>
              </div>
            </div>
            <div className="table-responsive">
              <table
                id="example-input"
                className="table table-bordered border-t0 key-buttons text-nowrap w-100"
              >
                <thead>
                  <tr>
                    <th className='sr_head'>{t("faq.list_heading_sno")}</th>
                    {/* <th>
                      <div className="sorting_column">
                        <span>{t("list_heading_name")}</span>
                        <Sorting
                          sort={sorting}
                          handleSort={handleSort}
                          column="name"
                        />
                      </div>
                    </th> */}
                    <th>
                      <div className="sorting_column">
                        <span>{t("faq.list_heading_title")} (English)</span>
                        <Sorting
                          sort={sorting}
                          handleSort={handleSort}
                          column="title"
                        />
                      </div>
                    </th>
                    <th className="created_head">
                      <div className="sorting_column">
                        <span>{t("list_heading_created_date")}</span>
                        <Sorting
                          sort={sorting}
                          defaultSorting={defaultSorting}
                          handleSort={handleSort}
                          column="createdAt"
                        />
                      </div>
                    </th>
                    <th className="status_head">{t("list_heading_status")}</th>
                    <th className="action_head">{t("list_heading_action")}</th>
                  </tr>
                </thead>
                <tbody>
                  {loader ? (
                    <tr>
                      <td colSpan={13}>
                        <Loader />
                      </td>
                    </tr>
                  ) : (
                    <>
                      {list.length ? (
                        list.map((row, i) => {
                          return (
                            <tr key={i}>

                              <td>
                                {row ? ((page - 1) * itemperpage) + i + 1 : null}
                              </td>
                              <td>
                                {row?.title_en ? TrimText(row.title_en, 40) : "N/A"}
                              </td>
                              <td>
                                {row?.createdAt
                                  ? formateDateWithMonth(row.createdAt)
                                  : "N/A"}
                              </td>
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
                                    className="btn ripple btn-main-primary signbtn "
                                    onClick={() => {
                                      viewfunction(row);
                                    }}
                                  >
                                    {t("btn_view")}
                                  </button>

                                  <button
                                    className="btn ripple btn-success mlAction"
                                    onClick={() => {
                                      Editfunction(row);
                                    }}
                                  >
                                    {t("btn_edit")}
                                  </button>

                                  <button
                                    type="button"
                                    className="btn ripple btn-secondary mlAction"
                                    onClick={() => {
                                      Deletefunction(row?._id);
                                    }}
                                  >
                                    {t("btn_delete")}
                                  </button>

                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={13} className="text-center">
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
              <b>{t("msg_total_records")} : {datalength ? datalength : "0"}</b>
            </div>
            {datalength && datalength > 0 ? (
              <CustomPagination
                datalength={datalength}
                itemperpage={itemperpage}
                setPage={setPage}
                currentPage={page}
                pageRoute={[
                  { name: "PageTable", path: "/admin/cms/faq/list" },
                ]}
              />
            ) : (
              ""
            )}
          </div>
          <div></div>
        </div>
      </div>
      {/* tablesection end */}

    </>
  );
};

export default FAQTable;
