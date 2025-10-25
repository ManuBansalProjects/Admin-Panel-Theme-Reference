import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toHtml from 'html-react-parser';
import * as ServicesService from '../../../services/services.services';
import Breadcrums from '../../../common/breadcrumbs';
import Loader from '../../../common/loader';
import { breakWord, formateDate, showStatus } from '../../../../../utils/commonfunction';
import { useTranslation } from 'react-i18next';


const ServiceView = () => {
  const navigate = useNavigate()
  const {t} = useTranslation()
  const params = useParams()
  const [showdefault, setShowDefault] = useState({})
  const breadcrumbs = [{ title: t('sidebar_link_dashboard'), url: "/admin/dashboard" }, { title: t("Services"), url: "/admin/cms/services/list/1" }, { title: t("btn_view"), url: "" }];


  useEffect(() => {
    ServicesService.Details(params.id).then(response => {
      setShowDefault(response && response.data ? response.data : [])
    }).catch(error => {
      console.log("error=====>", error)
    })
  }, [])


  return (
    <>
      <Breadcrums data={breadcrumbs} />
      <div className="row row-sm">
        <div className="col-lg-12 col-md-12 animation_fade">
          <div className="card custom-card">
            <div className="card-body">
              <div>
                <h6 className="main-content-label mb-3">{t("btn_view")+" "+t("Services")}</h6>
              </div>
              {showdefault && Object.keys(showdefault).length > 0 ? <div className='row'>
                <div className="col-lg-12 form-group">
                  <table id="simple-table" className="table  table-bordered table-hover">
                    <tbody>
                      <tr>
                        <th>{t("Title (English)")}</th>
                        <td>{showdefault && showdefault.title_en ? showdefault.title_en : "N/A"}</td>
                      </tr>
                      <tr>
                        <th>{t("Title (German)")}</th>
                        <td>{showdefault && showdefault.title_de ? showdefault.title_de : "N/A"}</td>
                      </tr>
                      <tr>
                        <th>{t("Title (Spanish)")}</th>
                        <td>{showdefault && showdefault.title_es ? showdefault.title_es : "N/A"}</td>
                      </tr>
                      <tr>
                        <th>{t("Title (Hungarian)")}</th>
                        <td>{showdefault && showdefault.title_hu ? showdefault.title_hu : "N/A"}</td>
                      </tr>
                      <tr>
                        <th>{t("label_image")}</th>
                        <td><img src={showdefault && showdefault.image ? showdefault.image : ""} alt={showdefault?.title} style={{ height: "100px" }} /></td>
                      </tr>
                      <tr>
                        <th>{t("list_heading_status")}</th>
                        <td>{showdefault && showdefault.status === 0 ? toHtml(showStatus(showdefault.status)) : toHtml(showStatus(showdefault.status))}</td>
                      </tr>
                      <tr>
                        <th>{t("list_heading_created_date")}</th>
                        <td>{showdefault && showdefault.createdAt ? formateDate(showdefault.createdAt) : "N/A"}</td>
                      </tr>
                      <tr>
                        <th>{t("label_modified_date")}</th>
                        <td>{showdefault && showdefault.updatedAt ? formateDate(showdefault.updatedAt) : "N/A"}</td>
                      </tr>
                      <tr>
                        <td colSpan={2}>
                          <h5>Description (English)</h5>
                         { showdefault && showdefault.description_en ? breakWord(showdefault.description_en): "N/A" }
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={2}>
                          <h5>Description (German)</h5>
                         { showdefault && showdefault.description_de ? breakWord(showdefault.description_de): "N/A" }
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={2}>
                          <h5>Description (Spanish)</h5>
                         { showdefault && showdefault.description_es ? breakWord(showdefault.description_es): "N/A" }
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={2}>
                          <h5>Description (Hungarian)</h5>
                         { showdefault && showdefault.description_hu ? breakWord(showdefault.description_hu): "N/A" }
                        </td>
                      </tr>
                      {/* <tr>
                        <td colSpan={2}>
                          <div dangerouslySetInnerHTML={{ __html: showdefault && showdefault.description_ja ? breakWord(showdefault.description_ja) : "N/A" }}></div>
                        </td>
                      </tr> */}
                    </tbody>
                    </table>
                  <div className="mt-5">
                    <button className="btn ripple btn-dark" type='button' onClick={() => navigate(-1)}>
                      <i className="ace-icon-solid ion-arrow-return-left bigger-110 mx-1"></i>
                      {t("btn_back")}
                    </button>
                  </div>
                </div>
              </div> : <Loader />}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ServiceView