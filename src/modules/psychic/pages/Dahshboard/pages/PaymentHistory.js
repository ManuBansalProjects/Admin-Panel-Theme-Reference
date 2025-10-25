import React, { useEffect, useState } from 'react';
import { capitalizeFirstLetter, getDate } from '../../../../../utils/commonfunction';
import PsychicPagination from '../../../shared/CommonPagination';
import { useTranslation } from 'react-i18next';
import { LOADER_TIMEOUT_TIME, SERVICES } from '../../../../../utils/Constants';
import Skeleton from 'react-loading-skeleton';
import RecordNotFound from '../../../../website/shared/RecordNotFound';
import { psychicPaymentList } from '../../../services/payment.services';

export default function PaymentHistory() {
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
        setDataLength(response?.data?.total_records)
        setPage(response && response.data && response.data.page ? response.data.page : 1);
        setPaymentData(response?.data?.list);
        setTimeout(() => {
          setLoader(false);
        }, LOADER_TIMEOUT_TIME);
      })
      .catch((error) => {
        console.log('Error fetching payment data: ', error);
        setTimeout(() => {
          setLoader(false);
        }, LOADER_TIMEOUT_TIME);
      })
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

    <div className='dashboard-right-container'>
      <div className='dashboard-header'>
        <h2 className='heading-22-bold'>{t("heading_payment_history")}</h2>
      </div>
      <div className='dashboard-body'>
        <div className='my-bookings-sec'>
          <div className="table-responsive" style={{ minHeight: "27rem" }}>
            {loader ?
              <table className="table table-striped">
                <thead>
                  <tr><td><Skeleton width="100%" height={30} /></td></tr>
                </thead>
                <tbody>
                  <tr><td><Skeleton width="100%" height={30} /></td></tr>
                  <tr><td><Skeleton width="100%" height={30} /></td></tr>
                  <tr><td><Skeleton width="100%" height={30} /></td> </tr>
                  <tr><td><Skeleton width="100%" height={30} /></td> </tr>
                  <tr><td><Skeleton width="100%" height={30} /></td> </tr>
                  <tr><td><Skeleton width="100%" height={30} /></td> </tr>
                  <tr><td><Skeleton width="100%" height={30} /></td> </tr>
                </tbody>
              </table>
              :
              paymentData?.length > 0 ?
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
                        <td>#{payment?.generated_booking_id}</td>
                        <td>{capitalizeFirstLetter(payment?.client?.name)}</td>
                        <td>{getDate(payment?.createdAt)}</td>
                        <td>{`${(payment?.credit)} credits`}</td>
                        <td>€{(payment?.amount)}</td>
                        {/* <td>{SERVICES[payment?.service]}</td> */}
                        {/* <td>{paymentMethod(payment)}</td> */}
                        <td>
                          <span className={payment?.credit_status === "pending" ? `text-warning` :
                            payment?.credit_status === "cancelled" ? `text-danger` :
                              `text-success`}>
                            {capitalizeFirstLetter(payment?.credit_status)}
                          </span>
                        </td>
                      </tr>
                    ))}

                  </tbody>
                </table>
                :
                <RecordNotFound />
            }
          </div>
          {!loader && paymentData?.length > 0 &&
            <PsychicPagination
              dataLength={dataLength}
              itemPerPage={itemPerPage}
              currentPage={page}
              setPage={setPage}
            />
          }
        </div>
      </div>

    </div>
  )
}
