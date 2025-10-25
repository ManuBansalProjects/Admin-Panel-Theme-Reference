import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toHtml from "html-react-parser";
import Breadcrums from "../../../common/breadcrumbs";
import Loader from "../../../common/loader";
import { breakWord, capitalizeFirstLetter, formateDate, showStatus } from "../../../../../utils/commonfunction";
import * as faqServices from "../../../services/faq.services";
import { useTranslation } from "react-i18next";

const FAQView = () => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  const [showdefault, setShowDefault] = useState({});
  const breadcrumbs = [
    { title: t("faq.link_dashboard"), url: "/admin/dashboard" },
    { title: t("faq.link_faq"), url: "/admin/cms/faq/list/1" },
    { title: t("faq.link_view"), url: "" },
  ];
 
  // const selected_language = localStorage.getItem("system_language")
  // console.log(selected_language)

  useEffect(() => {
    faqServices
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
                <h6 className="main-content-label mb-3">{t("faq.heading_view")}</h6>
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
                          <th>{t("faq.list_heading_title_en")} </th>
                          <td className="text-capitalize">
                            {showdefault && showdefault?.title_en ? showdefault.title_en : "N/A"}
                          </td>
                        </tr>
                        
                        <tr>
                          <th>{t("faq.list_heading_title_de")} </th>
                          <td className="text-capitalize">
                            {showdefault && showdefault?.title_de ? showdefault.title_de : "N/A"}
                          </td>
                        </tr>
                        
                        <tr>
                          <th>{t("faq.list_heading_title_es")} </th>
                          <td className="text-capitalize">
                            {showdefault && showdefault?.title_es ? showdefault.title_es : "N/A"}
                          </td>
                        </tr>
                        
                        <tr>
                          <th>{t("faq.list_heading_title_hu")} </th>
                          <td className="text-capitalize">
                            {showdefault && showdefault?.title_hu ? showdefault.title_hu : "N/A"}
                          </td>
                        </tr>
                        
                        <tr>
                          <th>{t("faq.label_status")}</th>
                          <td>
                            {showdefault && showdefault?.status === 0 ? toHtml(showStatus(showdefault.status)) : toHtml(showStatus(showdefault.status))}
                          </td>
                        </tr>
                        <tr>
                          <th>{t("list_heading_created_date")}</th>
                          <td>
                            {showdefault && showdefault.createdAt  ? formateDate(showdefault.createdAt) : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <th>{t("list_heading_modified_date")}</th>
                          <td>
                            {showdefault && showdefault?.updatedAt ? formateDate(showdefault.updatedAt) : "N/A"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    
                    <h6 className="main-content-label mb-3">{t("faq.label_description_en")}:</h6>
                    <div className="text-capitalize"
                      dangerouslySetInnerHTML={{
                        __html:
                          showdefault && showdefault?.description_en ? showdefault.description_en : "N/A",
                      }}
                    ></div>

                    <h6 className="main-content-label mb-3">{t("faq.label_description_de")}:</h6>
                    <div className="text-capitalize"
                      dangerouslySetInnerHTML={{
                        __html:
                          showdefault && showdefault?.description_de ? showdefault.description_de : "N/A",
                      }}
                    ></div>

                    <h6 className="main-content-label mb-3">{t("faq.label_description_es")}:</h6>
                    <div className="text-capitalize"
                      dangerouslySetInnerHTML={{
                        __html:
                          showdefault && showdefault?.description_es ? showdefault.description_es : "N/A",
                      }}
                    ></div>

                    <h6 className="main-content-label mb-3">{t("faq.label_description_hu")}:</h6>
                    <div className="text-capitalize"
                      dangerouslySetInnerHTML={{
                        __html:
                          showdefault && showdefault?.description_hu ? showdefault.description_hu : "N/A",
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

export default FAQView;
