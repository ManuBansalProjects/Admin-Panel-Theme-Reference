import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import * as transactionService from "../../services/transaction.services";
import * as psychicService from "../../services/psychic.services";
import CustomPagination from "../../common/custompagination";
import Loader from "../../common/loader";
import Breadcrums from "../../common/breadcrumbs";
import {
  SWAL_SETTINGS
} from "../../../../utils/Constants";
import {
  getDate,
  handleServerValidations,
} from "../../../../utils/commonfunction";


const PayableTransactionTable = () => {
  const { t } = useTranslation();
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [list, setList] = useState([]);

  const [statsupdate, setStatusUpdate] = useState("false");
  const [datalength, setDataLength] = useState("");
  const [itemperpage] = useState(10);
  const [page, setPage] = useState(1);
  const [loader, setLoader] = useState(true);
  const [resetdate, setResetDate] = useState(false);
  // const [search] = useState({});
  const [globalsearch, setGlobalSearch] = useState("");
  const [search, setSearch] = useState({});
  const breadcrumbs = [
    { title: t("sidebar_link_dashboard"), url: "/admin/dashboard" },
    { title: t("Payable Transaction"), url: "" },
  ];
  const [selectedPsychic, setSelectedPsychic] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [psychicList, setPsychicList] = useState([]);
  const [creditIds, setCreditIds] = useState([]);
  const [transactionsList, setTransactionList] = useState([]);

  console.log("creditIds------------>", creditIds)

  const filteredItems = psychicList.filter(psychic =>
    psychic?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleTransactionSelection = (id) => {
    setCreditIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  function handelPayoutSubmit() {
    const payLoad = {
      psychic_id: selectedPsychic,
      credit_ids: creditIds
    }
    transactionService.CreatePayout(payLoad)
      .then((response) => {
        if (response.success) {
          setStatusUpdate(!statsupdate);
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
        console.log("error ====> ", error);
      });
  }

  useEffect(() => {
    const getData = setTimeout(() => {

      if (search) {
        setLoader(true);
        const formData = new FormData();
        formData.append("page", params.pgno);
        formData.append("per_page", itemperpage);
        formData.append("search", JSON.stringify(search));
        formData.append("global_search", globalsearch);
        transactionService
          .PayableList(formData)
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
    search,
    globalsearch,
    itemperpage,
    params.pgno,
  ]);

  const handelPsychicList = () => {
    psychicService.GetALlPsychic()
      .then((response) => {
        // console.log("pschic-->", response?.data?.list)
        setPsychicList(response?.data?.list ? response?.data?.list : []);
      })
      .catch(err => {
        console.log("Error===>", err)
      })
  }

  const handelPsychicTransactionList = (psychicId) => {
    transactionService
      .PsychicPayableList({ "psychic_id": psychicId })
      .then((response) => {
        // console.log('Psychic transactions -->', response);
        setTransactionList(response?.data?.list || []);
      })
      .catch((err) => {
        console.log('Error loading transactions:', err);
      });
  }

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
                {t("Payable Transaction")}
              </h6>
              <div className="d-flex align-items-center">
                {/* <div className="form-group mb-0 me-3">
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
                </div> */}
                {/* <div className="me-3">
                  <CustomRangepicker
                    GetDateRange={(e) => {
                      prepareSearch("createdAt", e);
                    }}
                    resetdate={resetdate}
                  />
                </div> */}
                {/* <div className="me-3">
                  <StatusFilter
                    data={showFilterlist}
                    prepareSearch={prepareSearch}
                  />
                </div> */}
                {/* <div className="form-group mb-0 filter_icon_container filter_design mr-3">
                  <div className="select-down-arrow">
                    <select className="form-control cp" id="defaultstatus" onChange={handelExpertiseFilter}>
                      <option value="">{t("Expertise")}</option>
                      {EXPERTISE?.map((exp, idx) => (
                        <option key={idx} value={exp.value}>{exp.name}</option>
                      ))}
                    </select>
                  </div>
                </div> */}
                {/* 
                <button
                  type="reset"
                  value="Reset"
                  onClick={resetFilter}
                  className="btn btn-warning float-right mr-2"
                >
                  {t("btn_reset_filter")}
                </button> */}
                <button
                  type="button"
                  className="btn btn-main-primary signbtn"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                  onClick={(e) => { setSearchTerm(""); setCreditIds([]); handelPsychicList(); e.preventDefault() }}
                >
                  Pay Out
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
                    <th className="position-relative select_head">
                      <span>{t("Booking Id")}</span>
                    </th>
                    <th className="">
                      <span>{t("Booking Date")}</span>
                    </th>
                    <th>
                      <div className="sorting_column">
                        <span>{t("Advisor")}</span>
                      </div>
                    </th>

                    <th>
                      <div className="sorting_column">
                        <span>{t("User")}</span>
                      </div>
                    </th>

                    <th>
                      <div className="rating_head">
                        <span>{t("Credit")}</span>
                      </div>
                    </th>

                    <th>
                      <div className="rating_head">
                        <span>{t("Amount")}</span>
                      </div>
                    </th>
                    {/* <th>Created By</th>
                    <th>Updated By</th> */}
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
                                <div className="d-flex">{row?.booking?.generated_booking_id}</div>
                              </td>

                              <td>
                                <div className="d-flex">{getDate(row?.booking?.date)}</div>
                              </td>

                              <td>
                                {row?.psychic?.name ? (
                                  <div className="d-flex">{row?.psychic?.name}</div>
                                ) : (
                                  <div className="d-flex">N/A</div>
                                )}
                              </td>

                              <td>
                                <div className="d-flex">
                                  {row?.user?.name ? row?.user?.name : "N/A"}
                                </div>
                              </td>

                              <td>
                                {row?.credit ? (
                                  <div className="d-flex">{row.credit}</div>
                                ) : (
                                  <div className="d-flex">N/A</div>
                                )}
                              </td>

                              <td>
                                {row?.amount ? (
                                  <div className="d-flex">{`€ ${row.amount.toFixed(2)}`}</div>
                                ) : (
                                  <div className="d-flex">N/A</div>
                                )}
                              </td>

                              {/* <td>
                                {row.createdAt
                                  ? formateDateWithMonth(row.createdAt)
                                  : "N/A"}
                              </td> */}
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
                    // path: "/admin/payable-transaction/list",
                    path: "/admin/transaction/list",
                  },
                ]}
              />
            ) : (
              ""
            )}
          </div>
        </div>
      </div>

      {/* Modal Spiritual Advisor */}

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Spiritual Advisor
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <ul className="list-group overflow-auto py-1" style={{ maxHeight: '250px' }}>
                {filteredItems.map((psychic) => (
                  <li key={psychic._id} className="list-group-item cp py-2" data-bs-toggle="modal" data-bs-target="#advisorModal" onClick={() => { handelPsychicTransactionList(psychic._id); setSelectedPsychic(psychic._id) }}>
                    {psychic?.name}
                  </li>
                ))}
                {(filteredItems.length <= 0) && <li className="px-1">No match found</li>}
              </ul>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* list modal */}

      <div
        className="modal fade"
        id="advisorModal"
        tabIndex="-1"
        aria-labelledby="advisorModalLabel"
        aria-hidden="true"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="advisorModalLabel">
                Transactions
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <table className="table table-bordered table-hover">
                <thead className="table-light">
                  <tr>
                    <th className="text-center">Select</th>
                    <th>Booking ID</th>
                    <th>Booking Date</th>
                    <th>Advisor</th>
                    <th>User</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactionsList.map((txn) => (
                    <tr key={txn._id}>
                      <td className=" text-center">
                        <input
                          type="checkbox"
                          className="cp"
                          checked={creditIds.includes(txn._id)}
                          onChange={() => toggleTransactionSelection(txn._id)}
                        />
                      </td>
                      <td>{txn?.booking?.generated_booking_id}</td>
                      <td>{getDate(txn?.booking?.date)}</td>
                      <td>{txn?.psychic?.name}</td>
                      <td>{txn?.user?.name}</td>
                      <td>€ {txn?.amount?.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-main-primary signbtn"
                data-bs-dismiss="modal"
                disabled={creditIds.length <= 0}
                onClick={handelPayoutSubmit}
              >
                Submit
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>



    </>
  );
};

export default PayableTransactionTable;
