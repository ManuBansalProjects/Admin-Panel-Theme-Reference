import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../common/loader";
import { formateDate } from "../../../../utils/commonfunction";
import { useTranslation } from "react-i18next";
import Breadcrums from "../../common/breadcrumbs";
import { discountTypeObj, subscriptionPlanType, subscriptionPlanTypeObj } from "../../../../utils/Constants";
import { CouponDetails } from "../../services/coupon.services";

const CouponView = (props) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const params = useParams();
  const [showdefault, setShowDefault] = useState({});

  const breadcrumbs = [
    { title: t("link_dashboard"), url: "/admin/dashboard" },
    {
      title: t("Coupons"),
      url: "/admin/coupon/list/1",
    },
    { title: t("View"), url: "" },
  ];


  useEffect(() => {
    CouponDetails(params.id)
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
                  {t("View Coupon")}
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
                        <tr>
                          <th>{t("Name")}</th>
                          <td className="text-capitalize">
                            {showdefault?.name || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <th>{t("Code")}</th>
                          <td className="text-capitalize">
                            {showdefault && showdefault.code
                              ? showdefault.code
                              : "N/A"}
                          </td>
                        </tr>

                        <tr>
                          <th>{t("Discount Type")}</th>
                          <td className="text-capitalize">
                            {showdefault && showdefault.discount_type
                              ? discountTypeObj[showdefault.discount_type]
                              : "N/A"}
                          </td>
                        </tr>
                        
                        {
                            showdefault.discount_type == 'flat_amount'
                            ? 
                              <tr>
                                <th>{t("Flat Amount")}</th>
                                <td className="text-capitalize">
                                  {showdefault && showdefault.flat_amount
                                    ? showdefault.flat_amount
                                    : "N/A"}
                                </td>
                              </tr>
                            : 
                              <tr>
                                <th>{t("Percentage")}</th>
                                <td className="text-capitalize">
                                  {showdefault && showdefault.percentage
                                    ? showdefault.percentage
                                    : "N/A"}
                                </td>
                              </tr>         
                        }  

                        <tr>
                          <th>{t("Subscription Type")}</th>
                          <td className="text-capitalize">
                            {showdefault && showdefault.plan_type
                              ? subscriptionPlanTypeObj[showdefault.plan_type]
                              : "N/A"}
                          </td>
                        </tr>

                        <tr>  
                          <th>{t("Start Date")}</th>
                          <td>
                            {showdefault && showdefault.start_date
                              ? formateDate(showdefault.start_date)
                              : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <th>{t("End Date")}</th>
                          <td>
                            {showdefault && showdefault.end_date
                              ? formateDate(showdefault.end_date)
                              : "N/A"}
                          </td>
                        </tr>  
                        <tr>
                          <th>{t("list_heading_created_date")}</th>
                          <td>
                            {showdefault && showdefault.createdAt
                              ? formateDate(showdefault.createdAt)
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
            <div className="ml-4 back-button mx-0">
              <button
                className="btn ripple btn-dark"
                type="button"
                onClick={() =>
                  navigate("/admin/coupon/list/1")
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

export default CouponView;
