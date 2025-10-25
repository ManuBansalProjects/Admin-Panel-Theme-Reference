import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as testimonialService from "../../services/testimonial.services";
import Breadcrums from "../../common/breadcrumbs";
import Loader from "../../common/loader";
import { breakWord, formateDate } from "../../../../utils/commonfunction";
import { useTranslation } from "react-i18next";

// import $ from "jquery";

const TestimonialView = (props) => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  // const [query] = useSearchParams();
  const [showdefault, setShowDefault] = useState({});
  const breadcrumbs = [
    { title: t("sidebar_link_dashboard"), url: "/admin/dashboard" },
    {
      title: t("sidebar_link_testimonial"),
      url: "/admin/testimonial-management/testimonial/list/1",
    },
    { title: t("btn_view"), url: "" },
  ];

  useEffect(() => {
    testimonialService
      .Details(params.id)
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
              <div>
                <h6 className="main-content-label mb-3">
                  {t("btn_view")} {t("sidebar_link_testimonial")}
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
                          <th>{t("label_profile_picture")}</th>
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
                          <th>{t("label_name")}</th>
                          <td className="text-capitalize">
                            {showdefault && showdefault.name
                              ? showdefault.name
                              : "N/A"}
                          </td>
                        </tr>

                        {/* <tr>
                          <th>Role</th>
                          <td>{decideRole(showdefault.role)}</td>
                        </tr> */}

                        <tr>
                          <th>{t("label_address")}</th>
                          <td>
                            {showdefault && showdefault.address
                              ? showdefault.address
                              : "N/A"}
                          </td>
                        </tr>

                        <tr>
                          <th>{t("label_city")}</th>
                          <td>
                            {showdefault && showdefault.city
                              ? showdefault.city
                              : "N/A"}
                          </td>
                        </tr>

                        <tr>
                          <th>{t("label_country")}</th>
                          <td>
                            {showdefault && showdefault.country
                              ? showdefault.country
                              : "N/A"}
                          </td>
                        </tr>

                        {/* <tr>
                          <th>{t("label_review")}</th>
                          <td className="text-capitalize">
                            {showdefault && showdefault.testimonial_text
                              ? breakWord(showdefault.testimonial_text)
                              : "N/A"}
                          </td>
                        </tr> */}

                        <tr>
                          <th>{t("label_rating")}</th>
                          <td className="text-capitalize">
                            {showdefault && showdefault.rating
                              ? showdefault.rating
                              : "N/A"}
                          </td>
                        </tr>

                        <tr>
                          <th>
                            {t("sidebar_link_testimonial")} {t("label_text")}
                          </th>
                          <td className="text-capitalize">
                            {showdefault && showdefault.testimonial_text
                              ? breakWord(showdefault.testimonial_text)
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
                        <tr>
                          <th>{t("label_modified_date")}</th>
                          <td>
                            {showdefault && showdefault.updatedAt
                              ? formateDate(showdefault.updatedAt)
                              : "N/A"}
                          </td>
                        </tr>
                        {/* <tr>
                          <th>Restaurant Images</th>
                          <td>
                            {showdefault && showdefault.images ? (
                              showdefault.images.map((img, i) => (
                                <img
                                  key={i}
                                  src={img}
                                  alt="Img"
                                  style={{
                                    height: "100px",
                                    marginLeft: ".5rem",
                                  }}
                                />
                              ))
                            ) : (
                              <div>N/A</div>
                            )}
                          </td>
                        </tr> */}
                      </tbody>
                    </table>
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
                  navigate("/admin/testimonial-management/testimonial/list/1")
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

export default TestimonialView;
