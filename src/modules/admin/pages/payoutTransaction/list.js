import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import * as transactionService from "../../services/transaction.services";
import * as psychicService from "../../services/psychic.services";
import CustomPagination from "../../common/custompagination";
import Sorting from "../../common/sorting";
import Loader from "../../common/loader";
import Breadcrums from "../../common/breadcrumbs";
import { EXPERTISE, SWAL_SETTINGS } from "../../../../utils/Constants";
import { capitalizeFirstLetter, formateDateWithMonth, handleServerValidations } from "../../../../utils/commonfunction";
import CustomRangepicker from "../../common/rangepicker";

const PayoutTransactionTable = () => {
    const { t } = useTranslation();
    const params = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [list, setList] = useState([]);
    const [statsupdate, setStatusUpdate] = useState("false");
    const [datalength, setDataLength] = useState("");
    const [itemperpage] = useState(10);
    const [sorting, setSorting] = useState({});
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
    const [selectedPayout, setSelectedPayout] = useState(null);
    const [paymentReference, setPaymentReference] = useState("");

    function handelConfirmPayoutSubmit() {
        const payLoad = {
            payout_id: selectedPayout._id,
            payment_reference: paymentReference,
            payout_status: "paid",
        };
        transactionService
            .ConfirmPayout(payLoad)
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
                formData.append("sort", JSON.stringify(sorting));
                formData.append("search", JSON.stringify(search));
                formData.append("global_search", globalsearch);
                transactionService
                    .PayoutList(formData)
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
        return () => clearTimeout(getData);
    }, [location, statsupdate, sorting, search, globalsearch, itemperpage, params.pgno]);

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
                            <h6 className="main-content-label">{t("Transaction")}</h6>
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

                                {/* <button
                  type="reset"
                  value="Reset"
                  onClick={resetFilter}
                  className="btn btn-warning float-right mr-2"
                >
                  {t("btn_reset_filter")}
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
                                        {/* <th>
                                            <div className="sorting_column">
                                                <span>{t("Advisor")}</span>
                                            </div>
                                        </th> */}

                                        <th>
                                            <div className="sorting_column">
                                                <span>Transaction Id</span>
                                            </div>
                                        </th>

                                        <th>
                                            <div className="rating_head">
                                                <span>{t("Total Amount")}</span>
                                            </div>
                                        </th>

                                        <th>
                                            <div className="sorting_column">
                                                <span>Payment Status</span>
                                            </div>
                                        </th>

                                        <th>
                                            <div className="rating_head">
                                                <span>{t("Created At")}</span>
                                            </div>
                                        </th>
                                        {/* <th>Payout Status</th> */}
                                        <th>Action</th>
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
                                                        <tr key={i}>
                                                            <td>{row ? (page - 1) * itemperpage + i + 1 : null}</td>

                                                            {/* <td>{row?.psychic?.name ? <div className="d-flex">{row?.psychic?.name}</div> : <div className="d-flex">N/A</div>}</td> */}
                                                            <td>{row?.payment_id}</td>

                                                            <td>
                                                                <div className="d-flex">{row?.total_amount ? `€ ${row?.total_amount?.toFixed(2)}` : "N/A"}</div>
                                                            </td>

                                                            <td>{row?.payment_status}</td>

                                                            <td>{row.createdAt ? formateDateWithMonth(row.createdAt) : "N/A"}</td>

                                                            {/* <td>
                                                                {row?.payout_status ? (
                                                                    <div
                                                                        className={`d-flex ${
                                                                            row.payout_status === "pending" ? "text-warning" : row.payout_status === "paid" ? "text-success" : "text-black"
                                                                        }`}
                                                                    >
                                                                        {capitalizeFirstLetter(row.payout_status)}
                                                                    </div>
                                                                ) : (
                                                                    <div className="d-flex">N/A</div>
                                                                )}
                                                            </td> */}

                                                            <td>
                                                                <div className="d-flex flex-wrap gap-2">
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-success"
                                                                        data-bs-toggle="modal"
                                                                        data-bs-target="#viewPayoutModal"
                                                                        onClick={(e) => {
                                                                            setSelectedPayout(row);
                                                                            e.preventDefault();
                                                                        }}
                                                                    >
                                                                        View Details
                                                                    </button>

                                                                    {row?.payout_status !== "paid" && (
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-main-primary signbtn"
                                                                            data-bs-toggle="modal"
                                                                            data-bs-target="#confirmPayoutModal"
                                                                            onClick={(e) => {
                                                                                setSelectedPayout(row);
                                                                                setPaymentReference("");
                                                                                e.preventDefault();
                                                                            }}
                                                                        >
                                                                            Confirm Payout
                                                                        </button>
                                                                    )}
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
                        <div className="" id="example1_info" role="status" aria-live="polite">
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
                                        // path: "/admin/payout-transaction/list",
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

            {/* confirm payment modal */}

            <div className="modal fade" id="confirmPayoutModal" tabIndex="-1" aria-labelledby="confirmPayoutLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
                <div className="modal-dialog" style={{ maxWidth: "700px", width: "90%" }}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="confirmPayoutModalLabel">
                                Confirm Payout
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="referenceInput" className="form-label">
                                    Payment Reference
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="referenceInput"
                                    placeholder="Enter payment reference"
                                    value={paymentReference}
                                    onChange={(e) => setPaymentReference(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-main-primary signbtn cp" data-bs-dismiss="modal" onClick={handelConfirmPayoutSubmit} disabled={paymentReference.trim() === ""}>
                                Submit
                            </button>
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* View Payout modal */}
            <div className="modal fade" id="viewPayoutModal" tabIndex="-1" aria-labelledby="viewPayoutLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
                <div className="modal-dialog" style={{ maxWidth: "700px", width: "90%" }}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="viewPayoutLabel">
                                Payout Details
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>

                        <div className="modal-body">
                            {selectedPayout ? (
                                <div className="p-2">
                                    <div className="row mb-3">
                                        <div className="col-md-4 fw-bold text-muted">Psychic:</div>
                                        <div className="col-md-8">{capitalizeFirstLetter(selectedPayout.psychic?.name) || "N/A"}</div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-md-4 fw-bold text-muted">Total Amount:</div>
                                        <div className="col-md-8 fw-bold">€{selectedPayout.total_amount.toFixed(2)}</div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-md-4 fw-bold text-muted">Payout Status:</div>
                                        <div className="col-md-8">
                                            <span className={`badge ${selectedPayout.payout_status === "paid" ? "bg-success" : "bg-warning text-dark"} fs-6`}>
                                                {capitalizeFirstLetter(selectedPayout.payout_status)}
                                            </span>
                                        </div>
                                    </div>

                                    {selectedPayout.paid_date && (
                                        <div className="row mb-3">
                                            <div className="col-md-4 fw-bold text-muted">Paid Date:</div>
                                            <div className="col-md-8">{new Date(selectedPayout.paid_date).toLocaleString()}</div>
                                        </div>
                                    )}

                                    {/* Updated Booking ID Section - label above list */}
                                    <div className="mb-3">
                                        <div className="fw-bold text-muted mb-2">Bookings :</div>
                                        {selectedPayout.credits && selectedPayout.credits.length > 0 ? (
                                            <ul className="list-group">
                                                {selectedPayout.credits.map((credit) => (
                                                    <li key={credit._id} className="list-group-item d-flex justify-content-between align-items-center">
                                                        Booking ID: {credit.generated_booking_id}
                                                        <span className="badge bg-primary fs-6">€{credit.amount.toFixed(2)}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <div className="text-muted">No credits available.</div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div>Loading payout details...</div>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PayoutTransactionTable;
