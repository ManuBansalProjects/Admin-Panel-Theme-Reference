import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toHtml from "html-react-parser";
import Breadcrums from "../../../common/breadcrumbs";
import Loader from "../../../common/loader";
import { breakWord, formateDate, showStatus } from "../../../../../utils/commonfunction";
import * as promotionServices from "../../../services/promotions";
import { useTranslation } from "react-i18next";

const PromotionView = () => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  const [showdefault, setShowDefault] = useState({});
  const breadcrumbs = [
    { title: t("sidebar_link_dashboard"), url: "/admin/dashboard" },
    { title: 'Promotions', url: "/admin/cms/promotions/list/1" },
    { title: t("btn_view"), url: "" },
  ];
 
  // const selected_language = localStorage.getItem("system_language")
  // console.log(selected_language)

  useEffect(() => {
    promotionServices
      .Details(params.id)
      .then((data) => {
        setShowDefault(data && data.data ? data.data : []);
      })
      .catch((error) => {
        console.log("error=====>", error);
      });
  }, []);

  
  return (
    <>
      <Breadcrums data={breadcrumbs} />
      <div className="row row-sm">
        <div className="col-lg-12 col-md-12 animation_fade">
          <div className="card custom-card">
            <div className="card-body">
              <div>
                <h6 className="main-content-label mb-3">{t("view_cms")}</h6>
              </div>
              {showdefault && Object.keys(showdefault)?.length > 0 ? (
                <div className="row">
                  <div className="col-lg-12 form-group">
                    <table
                      id="simple-table"
                      className="table  table-bordered table-hover"
                    >
                      <tbody>
                        
                        <tr>
                          <th>Title </th>
                          <td className="text-capitalize">
                            {showdefault && showdefault?.title
                              ? showdefault.title
                              : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <th>Promotion Type</th>
                          <td className="text-capitalize">
                            {showdefault && showdefault?.promotion_type
                              ? showdefault.promotion_type
                              : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <th>Coupon Code </th>
                          <td className="text-capitalize">
                            {showdefault && showdefault?.coupon
                              ? showdefault.coupon?.code
                              : "N/A"}
                          </td>
                        </tr>
                       
                      </tbody>
                    </table>
                    
                   

                    <div className="mt-5">
                      <button
                        className="btn ripple btn-dark"
                        type="button"
                        onClick={() => navigate(-1)}
                      >
                        <i className="ace-icon-solid ion-arrow-return-left bigger-110 mx-1"></i>
                        {t("btn_back")}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Loader />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PromotionView;
