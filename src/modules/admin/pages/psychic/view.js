import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../common/loader";
import { capitalizeFirstLetter, formateDate } from "../../../../utils/commonfunction";
import { useTranslation } from "react-i18next";
// import $ from "jquery";
import { Details } from "../../services/psychic.services";
import Breadcrums from "../../common/breadcrumbs";

const PsychicUserView = (props) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const params = useParams();
  // const [query] = useSearchParams();
  const [showdefault, setShowDefault] = useState({});

  const breadcrumbs = [
    { title: t("link_dashboard"), url: "/admin/dashboard" },
    {
      title: t("link_psychic"),
      url: "/admin/psychic-management/psychic/list/1",
    },
    { title: t("View"), url: "" },
  ];


  useEffect(() => {
    Details(params.id)
      .then((response) => {
        // console.log("View response-", response);
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

              {showdefault && Object.keys(showdefault).length > 0 ? (
                <div className="row">
                  <div className="col-lg-12 form-group">
                    <table
                      id="simple-table"
                      className="table  table-bordered table-hover"
                    >
                      <tbody>
                        <tr>
                          <th>{t("Image")}</th>
                          <td>
                            <img
                              src={
                                showdefault && showdefault.profile_image
                                  ? showdefault.profile_image
                                  : "N/A"
                              }
                              alt="profile"
                              style={{ height: "100px" }}
                            />
                          </td>
                        </tr>
                        <tr>
                          <th>{t("Name")}</th>
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
                            {showdefault && showdefault?.phone_number
                              ? showdefault.phone_number
                              : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <th>{t("Expertise")}</th>
                          <td>
                            {showdefault && showdefault?.expertise
                              ? showdefault.expertise
                              : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <th>{t("Experience")}</th>
                          <td>
                            {showdefault && showdefault?.experience
                              ? showdefault.experience
                              : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <th>{t("Language spoken")}</th>
                          <td>
                            {showdefault && showdefault?.language_spoken
                              ? showdefault.language_spoken
                              : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <th>{t("Chat Credit Rate")}</th>
                          <td>
                            {showdefault && showdefault?.chat_credit_rate
                              ? showdefault.chat_credit_rate
                              : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <th>{t("Audio Call Credit Rate")}</th>
                          <td>
                            {showdefault && showdefault?.audio_credit_rate
                              ? showdefault.audio_credit_rate
                              : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <th>{t("Video Call Credit Rate")}</th>
                          <td>
                            {showdefault && showdefault?.video_credit_rate
                              ? showdefault.video_credit_rate
                              : "N/A"}
                          </td>
                        </tr>
                        {/* <tr>
                          <th>{t("Availability hours")}</th>
                          <td>
                            {showdefault && showdefault?.availability_hours
                              ? showdefault.availability_hours
                              : "N/A"}
                          </td>
                        </tr> */}
                        <tr>
                          <th>{t("City")}</th>
                          <td>
                            {showdefault && showdefault?.city
                              ? showdefault.city
                              : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <th>{t("State")}</th>
                          <td>
                            {showdefault && showdefault?.state
                              ? showdefault.state
                              : "N/A"}
                          </td>
                        </tr>
                        {/* <tr>
                          <th>{t("Country")}</th>
                          <td>
                            {showdefault && showdefault?.country
                              ? showdefault.country
                              : "N/A"}
                          </td>
                        </tr> */}
                        <tr>
                          <th>{t("Pin code")}</th>
                          <td>
                            {showdefault && showdefault?.pin_code
                              ? showdefault.pin_code
                              : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <th>{t("label_address")}</th>
                          <td>
                            {showdefault && showdefault.address
                              ? capitalizeFirstLetter(showdefault.address)
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
            <div className="mt-2 back-button">
              <button
                className="btn ripple btn-dark"
                type="button"
                onClick={() =>
                  // navigate("/admin/psychic-management/psychic/list/1")
                  navigate(-1)
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

export default PsychicUserView;
