import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../common/loader";
import { formateDate } from "../../../../utils/commonfunction";
import { useTranslation } from "react-i18next";
import Breadcrums from "../../common/breadcrumbs";
import { subscriptionPlanType } from "../../../../utils/Constants";
import { SubscriptionPlanDetails } from "../../services/subscriptionPlan.services";

const SubscriptionPlanView = (props) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const params = useParams();
  const [showdefault, setShowDefault] = useState({});

  const breadcrumbs = [
    { title: t("link_dashboard"), url: "/admin/dashboard" },
    {
      title: t("Subscription Plan"),
      url: "/admin/subscription/subscription-plan/list/1",
    },
    { title: t("View"), url: "" },
  ];


  useEffect(() => {
    SubscriptionPlanDetails(params.id)
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
                  {t("View Subscription Plan")}
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
                          <th>{t("Plan name")}</th>
                          <td className="text-capitalize">
                            {showdefault?.plan_name || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <th>{t("Plan price")}</th>
                          <td className="text-capitalize">
                            {showdefault && showdefault.plan_price
                              ? showdefault.plan_price
                              : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <th>{t("Plan Type")}</th>
                          <td className="text-capitalize">
                            {showdefault && showdefault.plan_type
                              ? showdefault.plan_type
                              : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <th>{t("Balance Count")}</th>
                          <td className="text-capitalize">
                            {showdefault && showdefault.balance_count
                              ? showdefault.balance_count
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
                  navigate("/admin/subscription/subscription-plan/list/1")
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

export default SubscriptionPlanView;
