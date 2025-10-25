import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as contactUsService from "../../services/contactUs.services";
import Breadcrums from "../../common/breadcrumbs";
import Loader from "../../common/loader";
import { capitalizeFirstLetter, formateDate, formateDateWithMonth, removeSpecialCharacter } from "../../../../utils/commonfunction";
import { useTranslation } from "react-i18next";
import { USER_ENQUIRY_TYPES } from "../../../../utils/Constants";

// import $ from "jquery";

const ViewContactUs = (props) => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  // const [query] = useSearchParams();
  const [showdefault, setShowDefault] = useState({});
  const breadcrumbs = [
    { title: t("contact-us.link_dashboard"), url: "/admin/dashboard" },
    {
      title: t("contact-us.link_contact_us"),
      url: "/admin/contact-us/list/1",
    },
    { title: t("btn_view"), url: "" },
  ];

  useEffect(() => {
    contactUsService
      .Details({ _id: params.id })
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

                        <tr>
                          <th>{t("contact-us.label_name")}</th>
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
                          <th>Subject</th>
                          <td>
                            {showdefault && showdefault.subject
                              ? showdefault.subject
                              : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <th>{t("contact-us.label_contact_us_date")}</th>
                          <td>
                            {showdefault && showdefault.createdAt
                              ? formateDateWithMonth(showdefault.createdAt)
                              : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <th>Message</th>
                          <td style={{ wordBreak: 'break-word' }}>
                            {showdefault && showdefault.message
                              ? capitalizeFirstLetter(showdefault.message)
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
                  navigate("/admin/contact-us/list/1")
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

export default ViewContactUs;
