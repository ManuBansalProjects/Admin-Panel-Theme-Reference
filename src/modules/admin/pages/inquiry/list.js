import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import * as inquiriesService from "../../services/inquiry.services";
import CustomPagination from "../../common/custompagination";
import Sorting from "../../common/sorting";
import Loader from "../../common/loader";
import Breadcrums from "../../common/breadcrumbs";
import {
  EXPERTISE,
  SWAL_SETTINGS
} from "../../../../utils/Constants";
import {
  capitalizeFirstLetter,
  formateDateWithMonth,
  handleServerValidations,
  TrimText,
} from "../../../../utils/commonfunction";
import CustomRangepicker from "../../common/rangepicker";


const InquiryTable = () => {
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
  const [resetdate, setResetDate] = useState(false);

  // const [search] = useState({});
  const [globalsearch, setGlobalSearch] = useState("");
  const [search, setSearch] = useState({});
  const breadcrumbs = [
    { title: t("sidebar_link_dashboard"), url: "/admin/dashboard" },
    { title: t("sidebar_link_inquiries"), url: "" },
  ];
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
        inquiriesService
          .List(formData)
          .then((data) => {
            setDataLength(data.data.total_records);
            // setSerialNo(data.data.offset);
            setList(data && data.data && data.data.list ? data?.data?.list : []);
            // console.log("data.data.=====>", data.data);

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
      `/admin/inquiry/view/${row._id}`
    );
  };


  function Deletefunction(data) {
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
        formdata.append("o_id", data);
        inquiriesService
          .Delete(formdata)
          .then((response) => {
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

  const handelExpertiseFilter = (e) => {
    prepareSearch("expertise", e.target.value);
  }
  // search or filer end

  const resetFilter = (e) => {
    e.preventDefault();
    setGlobalSearch("");
    prepareSearch();
    setSearch({});
    setResetDate(!resetdate);
    // $("#defaultstatus")[0].selectedIndex = 0;
  };

  // const goToEdit = (row) => {
  //   navigate(
  //     `/admin/testimonial-management/testimonial/${params.pgno}/edit/${row._id}`
  //   );
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
                {t("sidebar_link_inquiries")}
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
                <div className="form-group mb-0 filter_icon_container filter_design mr-3">
                  <div className="select-down-arrow">
                    <select className="form-control cp" id="defaultstatus" onChange={handelExpertiseFilter}>
                      <option value="">{t("Expertise")}</option>
                      {EXPERTISE?.map((exp, idx) => (
                      <option key={idx} value={exp.value}>{exp.name}</option>
                      ))}
                    </select>
                  </div>

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
                      <div className="sorting_column">
                        <span>{t("list_heading_name")}</span>
                        <Sorting
                          sort={sorting}
                          handleSort={handleSort}
                          column="name"
                        />
                      </div>
                    </th>

                    <th>
                      <div className="sorting_column">
                        <span>{t("label_email")}</span>
                        <Sorting
                          sort={sorting}
                          handleSort={handleSort}
                          column="email"
                        />
                      </div>
                    </th>

                    <th>
                      <div className="rating_head">
                        <span>{t("label_phone_number")}</span>
                      </div>
                    </th>

                    <th>
                      <div className="rating_head">
                        <span>{t("Expertise")}</span>
                      </div>
                    </th>

                    {/* <th>
                      <div className="sorting_column">
                        <span>{t("list_heading_address")}</span>
                        <Sorting
                          sort={sorting}
                          handleSort={handleSort}
                          column="location"
                        />
                      </div>
                    </th> */}

                    {/* <th className="status_head">SUBSCRIBE</th> */}
                    {/* <th className="created_head">
                      <div className="sorting_column">
                        <span>{t("Inquiry date")}</span>
                        <Sorting
                          sort={sorting}
                          handleSort={handleSort}
                          defaultSorting={defaultSorting}
                          column="createdAt"
                        />
                      </div>
                    </th>  */}
                    {/* <th>Created By</th>
                    <th>Updated By</th> */}
                    <th className="action_head">{t("list_heading_action")}</th>
                  </tr>
                </thead>
                <tbody>
                  {loader ? (
                    <tr>
                      <td colSpan={10}>
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
                                {row?.name ? (
                                  <div className="d-flex">
                                    {row?.name ? row.name : "N/A"}
                                  </div>
                                ) : (
                                  <div className="d-flex">"N/A"</div>
                                )}
                              </td>

                              <td>
                                {row?.email ? (
                                  <div className="d-flex">{row.email}</div>
                                ) : (
                                  <div className="d-flex">N/A</div>
                                )}
                              </td>

                              <td>
                                {row?.phone_number ? (
                                  <div className="d-flex">{row.phone_number}</div>
                                ) : (
                                  <div className="d-flex">N/A</div>
                                )}
                              </td>

                              <td>
                                {row?.expertise ? (
                                  <div className="d-flex">{EXPERTISE.find(expertise => expertise.value === row.expertise)?.name || capitalizeFirstLetter(row.expertise)}</div>
                                ) : (
                                  <div className="d-flex">N/A</div>
                                )}
                              </td>

                              {/* <td>
                                {row?.address ? (
                                  <div className="d-flex">{TrimText(row.address)}</div>
                                ) : (
                                  <div className="d-flex">N/A</div>
                                )}
                              </td> */}

                              {/* <td>
                                {row.createdAt
                                  ? formateDateWithMonth(row.createdAt)
                                  : "N/A"}
                              </td> */}

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
                          <td colSpan={10} className="text-center">
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
                    name: "Inquiry",
                    path: "/admin/inquiry/list",
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

export default InquiryTable;
