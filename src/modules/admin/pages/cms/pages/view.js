import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toHtml from "html-react-parser";
import Breadcrums from "../../../common/breadcrumbs";
import Loader from "../../../common/loader";
import { breakWord, formateDate, showStatus } from "../../../../../utils/commonfunction";
import * as pageServices from "../../../services/pages.services";
import { useTranslation } from "react-i18next";

const PageView = () => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  const [showdefault, setShowDefault] = useState({});
  const breadcrumbs = [
    { title: t("sidebar_link_dashboard"), url: "/admin/dashboard" },
    { title: t("sidebar_link_pages"), url: "/admin/cms/pages/list/1" },
    { title: t("btn_view"), url: "" },
  ];
 
  // const selected_language = localStorage.getItem("system_language")
  // console.log(selected_language)

  useEffect(() => {
    pageServices
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
                          <th>{t("label_page_title_en")} </th>
                          <td className="text-capitalize">
                            {showdefault && showdefault?.title_en
                              ? showdefault.title_en
                              : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <th>{t("label_page_title_de")} </th>
                          <td className="text-capitalize">
                            {showdefault && showdefault?.title_de
                              ? showdefault.title_de
                              : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <th>{t("label_page_title_es")} </th>
                          <td className="text-capitalize">
                            {showdefault && showdefault?.title_es
                              ? showdefault.title_es
                              : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <th>{t("label_page_title_hu")} </th>
                          <td className="text-capitalize">
                            {showdefault && showdefault?.title_hu
                              ? showdefault.title_hu
                              : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <th>{t("label_slug_of_page")}</th>
                          <td>
                            {showdefault && showdefault.slug
                              ? showdefault.slug
                              : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <th>{t("menu_location")}</th>
                          <td>
                            {showdefault && showdefault.menu_location
                              ? showdefault.menu_location
                              : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <th>{t("footer_location")}</th>
                          <td>
                            {showdefault && showdefault.footer_location
                              ? showdefault.footer_location
                              : "N/A"}
                          </td>
                        </tr>
                        
                        <tr>
                          <th>{t("label_short_description_en")}</th>
                          <td>
                            {showdefault && showdefault?.short_description_en
                              ? breakWord(showdefault.short_description_en)
                              : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <th>{t("label_short_description_de")}</th>
                          <td>
                            {showdefault && showdefault?.short_description_de
                              ? breakWord(showdefault.short_description_de)
                              : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <th>{t("label_short_description_es")}</th>
                          <td>
                            {showdefault && showdefault?.short_description_es
                              ? breakWord(showdefault.short_description_es)
                              : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <th>{t("label_short_description_hu")}</th>
                          <td>
                            {showdefault && showdefault?.short_description_hu
                              ? breakWord(showdefault.short_description_hu)
                              : "N/A"}
                          </td>
                        </tr>
                        
                        <tr>
                          <th>{t("list_heading_status")}</th>
                          <td>
                            {showdefault && showdefault?.status === 0
                              ? toHtml(showStatus(showdefault.status))
                              : toHtml(showStatus(showdefault.status))}
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
                            {showdefault && showdefault?.updatedAt
                              ? formateDate(showdefault.updatedAt)
                              : "N/A"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    
                    <h1 className="main-content-label mb-3 mt-3 fa-2x font-weight-bolder">{t("label_long_description_en")}:</h1>
                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          showdefault && showdefault?.description_en
                            ? showdefault.description_en
                            : "N/A",
                      }}
                    ></div>

                    <h1 className="main-content-label mb-3 mt-3 fa-2x font-weight-bolder">{t("label_long_description_de")}:</h1>
                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          showdefault && showdefault?.description_de
                            ? showdefault.description_de
                            : "N/A",
                      }}
                    ></div>

                    <h1 className="main-content-label mb-3 mt-3 fa-2x font-weight-bolder">{t("label_long_description_es")}:</h1>
                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          showdefault && showdefault?.description_es
                            ? showdefault.description_es
                            : "N/A",
                      }}
                    ></div>

                    <h1 className="main-content-label mb-3 mt-3 fa-2x font-weight-bolder">{t("label_long_description_hu")}:</h1>
                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          showdefault && showdefault?.description_hu
                            ? showdefault.description_hu
                            : "N/A",
                      }}
                    ></div>

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

export default PageView;
