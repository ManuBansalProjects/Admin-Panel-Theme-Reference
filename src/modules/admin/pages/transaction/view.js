import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as TransactionService from "../../services/transactions.services";
import Breadcrums from "../../common/breadcrumbs";
import Loader from "../../common/loader";
import { capitalizeFirstLetter, formateDate, formateDateWithMonth, removeSpecialCharacter } from "../../../../utils/commonfunction";
import { useTranslation } from "react-i18next";
import { USER_ENQUIRY_TYPES } from "../../../../utils/Constants";

// import $ from "jquery";

const ViewTransaction = (props) => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  // const [query] = useSearchParams();
  const [showdefault, setShowDefault] = useState({});
  const breadcrumbs = [
    { title: t("link_dashboard"), url: "/admin/dashboard" },
    { title: t("Transactions"), url: `/admin/subscription/transaction/list/${params.pgno}` },
    { title: t("btn_view"), url: "" },
  ];

  useEffect(() => {
    TransactionService
      .Details(params.id)
      .then((response) => {
        setShowDefault(response && response.data ? response.data : []);
      })
      .catch((error) => {
        console.log("error=====>", error);
      });
  }, [params.id]);

  return (
    <>
      <Breadcrums data={breadcrumbs} />
      <div className="row row-sm">
        <div className="col-lg-12 col-md-12 animation_fade">
          <div className="card custom-card">
            <div className="card-body">
              <div>
                <h6 className="main-content-label mb-3">
                  {t("contact-us.view_contact_us")}
                </h6>
              </div>
              {showdefault && Object.keys(showdefault).length > 0 ? (
                <div className="row">
                  <div className="col-lg-12 form-group">
                    <table
                      id="simple-table"
                      className="table  table-bordered table-hover"
                    >
                      <tbody>

                        {/* Transaction details */}
                        <tr>
                          <th>{t("Transaction Id")}</th>
                          <td className="text-capitalize">
                            {showdefault && showdefault?.transaction_id
                              ? showdefault?.transaction_id
                              : "N/A"}
                          </td>
                        </tr>
                         <tr>
                          <th>{t("Amount")}</th>
                          <td className="text-capitalize">
                            {showdefault && showdefault?.amount
                              ? showdefault?.amount
                              : "N/A"}
                          </td>
                        </tr>
                         <tr>
                          <th>{t("Payment Status")}</th>
                          <td className="text-capitalize">
                            {showdefault && showdefault?.payment_status
                              ? showdefault?.payment_status
                              : "N/A"}
                          </td>
                        </tr>
                         <tr>
                          <th>{t("Currency")}</th>
                          <td className="text-capitalize">
                            {showdefault && showdefault?.currency
                              ? showdefault?.currency
                              : "N/A"}
                          </td>
                        </tr>

                        {/* User */}
                        <tr>
                          <th>{t("Customer")}</th>
                          <td className="text-capitalize">
                            {showdefault && showdefault?.user?.name
                              ? showdefault?.user?.name
                              : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <th>{t("Phone")}</th>
                          <td>
                            {showdefault && showdefault?.user?.phone_number
                              ? showdefault?.user?.phone_number
                              : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <th>{t("Email")}</th>
                          <td>
                            {showdefault && showdefault?.user?.email
                              ? showdefault?.user?.email
                              : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <th>{t("Country")}</th>
                          <td>
                            {showdefault && showdefault?.user?.country
                              ? showdefault?.user?.country
                              : "N/A"}
                          </td>
                        </tr>

                        {/* Subscription Details */}
                        <tr>
                          <th>{t("Plan Name")}</th>
                          <td>
                            {showdefault && showdefault?.subscription_history?.plan_name
                              ? showdefault?.subscription_history?.plan_name
                              : "N/A"}
                          </td>
                        </tr>      
                        <tr>
                          <th>{t("Plan Type")}</th>
                          <td>
                            {showdefault && showdefault?.subscription_history?.plan_type
                              ? showdefault?.subscription_history?.plan_type
                              : "N/A"}
                          </td>
                        </tr>      
                        <tr>
                          <th>{t("Balance Count")}</th>
                          <td>
                            {showdefault && showdefault?.subscription_history?.balance_count
                              ? showdefault?.subscription_history?.balance_count
                              : "N/A"}
                          </td>
                        </tr>      
                        <tr>
                          <th>{t("Plan Price")}</th>
                          <td>
                            {showdefault && showdefault?.subscription_history?.plan_price
                              ? showdefault?.subscription_history?.plan_price
                              : "N/A"}
                          </td>
                        </tr> 

                        {/* Coupon Details */}
                        <tr>
                          <th>{t("Coupon Name")}</th>
                          <td>
                            {showdefault && showdefault?.coupon_history?.coupon_name
                              ? showdefault?.coupon_history?.coupon_name
                              : "N/A"}
                          </td>
                        </tr>      
                        <tr>
                          <th>{t("Coupon Code")}</th>
                          <td>
                            {showdefault && showdefault?.coupon_history?.coupon_code
                              ? showdefault?.coupon_history?.coupon_code
                              : "N/A"}
                          </td>
                        </tr> 
                        <tr>
                          <th>{t("Coupon Type")}</th>
                          <td>
                            {showdefault && showdefault?.coupon_history?.coupon_type
                              ? showdefault?.coupon_history?.coupon_type
                              : "N/A"}
                          </td>
                        </tr> 
                        <tr>
                          <th>{t("Discount")}</th>
                          <td>
                            {showdefault && showdefault?.coupon_history?.discounted_amount
                              ? showdefault?.coupon_history?.discounted_amount
                              : "N/A"}
                          </td>
                        </tr> 

                        <tr>
                          <th>Subject</th>
                          <td>
                            {showdefault && showdefault.subject
                              ? showdefault.subject
                              : "N/A"}
                          </td>
                        </tr>

                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <Loader />
              )}
            </div>

            <div className="mt-2 back-button">
              <button
                className="btn ripple btn-dark"
                type="button"
                onClick={() =>
                  navigate(`/admin/subscription/transaction/list/${params.pgno}`)
                }
              >
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

export default ViewTransaction;
