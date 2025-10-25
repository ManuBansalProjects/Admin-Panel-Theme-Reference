import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as inquiriesService from "../../services/inquiry.services";
import Breadcrums from "../../common/breadcrumbs";
import Loader from "../../common/loader";
import { formateDate, formateDateWithMonth, removeSpecialCharacter } from "../../../../utils/commonfunction";
import { useTranslation } from "react-i18next";
import { USER_ENQUIRY_TYPES } from "../../../../utils/Constants";

// import $ from "jquery";

const ViewInquiry = (props) => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  // const [query] = useSearchParams();
  const [showdefault, setShowDefault] = useState({});
  const breadcrumbs = [
    { title: t("sidebar_link_dashboard"), url: "/admin/dashboard" },
    {
      title: t("sidebar_link_inquiries"),
      url: "/admin/inquiry/list/1",
    },
    { title: t("btn_view"), url: "" },
  ];

  useEffect(() => {
    inquiriesService
      .Details({ o_id: params.id })
      .then((response) => {
        console.log("View response-", response);
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
                  VIEW INQUIRY
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
                          <th>{t("label_name")}</th>
                          <td className="text-capitalize">
                            {showdefault && showdefault.name
                              ? showdefault.name
                              : "N/A"}
                          </td>
                        </tr>

                        <tr>
                          <th>{t("label_email")}</th>
                          <td>
                            {showdefault && showdefault.email
                              ? showdefault.email
                              : "N/A"}
                          </td>
                        </tr>

                        <tr>
                          <th>{t("label_phone_number")}</th>
                          <td>
                            {showdefault && showdefault.phone_number
                              ? showdefault.phone_number
                              : "N/A"}
                          </td>
                        </tr>

                        <tr>
                          <th>{t("Expertise")}</th>
                          <td>
                            {showdefault && showdefault.expertise
                              ? showdefault.expertise
                              : "N/A"}
                          </td>
                        </tr>

                        <tr>
                          <th className="text-capitalize">{t("label_address")}</th>
                          <td>
                            {showdefault && showdefault.address
                              ? showdefault.address
                              : "N/A"}
                          </td>
                        </tr>

                        <tr>
                          <th>{t("Inquiry Date")}</th>
                          <td>
                            {showdefault && showdefault.createdAt
                              ? formateDateWithMonth(showdefault.createdAt)
                              : "N/A"}
                          </td>
                        </tr>
                        {/* <tr>
                          <th>{t("label_modified_date")}</th>
                          <td>
                            {showdefault && showdefault.updatedAt
                              ? formateDate(showdefault.updatedAt)
                              : "N/A"}
                          </td>
                        </tr> */}
                      
                      </tbody>
                    </table>

                    <h5 className="mb-3 mt-3 font-weight-bolder">{t("label_description")}:</h5>
                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          showdefault && showdefault?.description
                            ? showdefault.description
                            : "N/A",
                      }}
                    ></div>
                  </div>
                </div>
              ) : (
                <Loader />
              )}
            </div>

            <div className="mt-5 back-button">
              <button
                className="btn ripple btn-dark"
                type="button"
                onClick={() =>
                  navigate("/admin/inquiry/list/1")
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

export default ViewInquiry;
