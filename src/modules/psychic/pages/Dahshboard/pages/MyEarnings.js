import React, { useEffect, useState } from "react";
import { capitalizeFirstLetter, getDate } from "../../../../../utils/commonfunction";
import PsychicPagination from "../../../shared/CommonPagination";
import { useTranslation } from "react-i18next";
import { LOADER_TIMEOUT_TIME, SERVICES, STATUS_CLASS } from "../../../../../utils/Constants";
import Skeleton from "react-loading-skeleton";
import RecordNotFound from "../../../../website/shared/RecordNotFound";
import { psychicPaymentList } from "../../../services/payment.services";
import totalearning from "../../../../../assets/website/images/totalearning.png";
import totalreceivable from "../../../../../assets/website/images/totalreceivable.png";
import { Link } from "react-router-dom";

export default function MyEarnings() {
    const [paymentData, setPaymentData] = useState([]);
    const [dataLength, setDataLength] = useState("");
    const [itemPerPage] = useState(7);
    const [page, setPage] = useState(1);
    const { t } = useTranslation();
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        setLoader(true);
        const formData = new FormData();
        formData.append("page", page);
        formData.append("per_page", itemPerPage);
        psychicPaymentList(formData)
            .then((response) => {
                setDataLength(response?.data?.total_records);
                setPage(response && response.data && response.data.page ? response.data.page : 1);
                setPaymentData(response?.data?.list);
                setTimeout(() => {
                    setLoader(false);
                }, LOADER_TIMEOUT_TIME);
            })
            .catch((error) => {
                console.log("Error fetching payment data: ", error);
                setTimeout(() => {
                    setLoader(false);
                }, LOADER_TIMEOUT_TIME);
            });
    }, [page, itemPerPage]);

    function paymentMethod(payment) {
        if (payment?.payment_method_type === "Card" && payment?.funding_type && payment?.card_brand) {
            return `${capitalizeFirstLetter(payment?.card_brand)} ${capitalizeFirstLetter(payment?.funding_type)} ${payment?.payment_method_type}`;
        } else if (payment?.payment_method_type === "Card" && payment?.funding_type) {
            return `${capitalizeFirstLetter(payment?.funding_type)} ${payment?.payment_method_type}`;
        } else if (payment?.payment_method_type) {
            return capitalizeFirstLetter(payment?.payment_method_type);
        } else if (payment?.card_brand) {
            return capitalizeFirstLetter(payment?.card_brand);
        }
    }

    return (
        <div className="dashboard-right-container">
            <div className="dashboard-header">
                <h2 className="heading-22-bold">{t("heading_my_earnings")}</h2>
            </div>
            <div className="dashboard-body">
                <div className="my-bookings-sec">
                    <div className="row g-3">
                        <div className="col-6">
                            <div className="card">
                                <ul>
                                    <li class="d-flex justify-content-between g-5 align-items-center w-100">
                                        <div class="box-title-icon  align-items-center flex-columm gap-3">
                                            <span className="body-card">{t("total_payout")}</span>
                                            <p className=" m-0 card-body-1">€ 4000</p>
                                        </div>
                                        <img src={totalearning} alt={t("total_payout")} />
                                    </li>
                                </ul>

                                {/* <img src='/assets/website/images/total-earning' alt='image'/> */}
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="card">
                                <ul>
                                    <li class="d-flex justify-content-between g-5 align-items-center w-100">
                                        <div class="box-title-icon  align-items-center flex-columm gap-3">
                                            <span className="body-card pb-0">{t("current_receivable")}</span>
                                            <p className=" m-0 card-body-1">€ 2000</p>
                                        </div>
                                        <img src={totalreceivable} alt={t("current_receivable")} />
                                    </li>
                                </ul>
                                {/* <p className='card-body pb-0'>{t('current_receivable')}</p>
                <p className='card-body'>€ 2000</p> */}
                            </div>
                        </div>
                    </div>

                    <div className="table-responsive" style={{ minHeight: "27rem" }}>
                        {loader ? (
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <td>
                                            <Skeleton width="100%" height={30} />
                                        </td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <Skeleton width="100%" height={30} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <Skeleton width="100%" height={30} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <Skeleton width="100%" height={30} />
                                        </td>{" "}
                                    </tr>
                                    <tr>
                                        <td>
                                            <Skeleton width="100%" height={30} />
                                        </td>{" "}
                                    </tr>
                                    <tr>
                                        <td>
                                            <Skeleton width="100%" height={30} />
                                        </td>{" "}
                                    </tr>
                                    <tr>
                                        <td>
                                            <Skeleton width="100%" height={30} />
                                        </td>{" "}
                                    </tr>
                                    <tr>
                                        <td>
                                            <Skeleton width="100%" height={30} />
                                        </td>{" "}
                                    </tr>
                                </tbody>
                            </table>
                        ) : paymentData?.length > 0 ? (
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>{t("label_booking_id")}</th>
                                        <th>{t("label_name")}</th>
                                        <th>{t("label_date_time")}</th>
                                        <th>{t("title_credit")}</th>
                                        <th>{t("title_amount")}</th>
                                        {/* <th>{t("label_purpose")}</th> */}
                                        {/* <th>{t("label_payment_method")}</th> */}
                                        <th>{t("list_heading_status")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paymentData?.map((payment, index) => (
                                        <tr key={index}>
                                            <td>
                                                <Link className="cp fw-bold" style={{ color: "var(--primary)" }} to={`/psychic/my-booking-view/${payment?.booking_id}`}>
                                                    #{payment?.generated_booking_id}
                                                </Link>
                                            </td>
                                            <td>{capitalizeFirstLetter(payment?.client?.name)}</td>
                                            <td>{getDate(payment?.createdAt, "YYYY-MM-DD", true, false, false)}</td>
                                            {/* <td>{getDate(payment?.createdAt)}</td> */}
                                            <td>{`${payment?.transaction_type === "debit" ? "+" : "-"} ${payment?.credit} ${t("credits")}`}</td>
                                            <td>€{Number(payment?.amount).toFixed(2)}</td>
                                            {/* <td>{SERVICES[payment?.service]}</td> */}
                                            {/* <td>{paymentMethod(payment)}</td> */}
                                            <td>
                                                <span className={`fw-bold ${STATUS_CLASS[payment?.credit_status] || STATUS_CLASS.default}`}>{t(payment?.credit_status)}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <RecordNotFound />
                        )}
                    </div>
                    {!loader && paymentData?.length > 0 && <PsychicPagination dataLength={dataLength} itemPerPage={itemPerPage} currentPage={page} setPage={setPage} />}
                </div>
            </div>
        </div>
    );
}
