import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toHtml from 'html-react-parser'
// import { formateDate } from '../../helpers/commonFunctions'
import * as emailTemplateService from '../../../services/email.template';
import Breadcrums from '../../../common/breadcrumbs';
import Loader from '../../../common/loader'
import { formateDate, showStatus } from '../../../../../utils/commonfunction';


const ViewEmailTempNews = (props) => {
    const navigate = useNavigate()
    const params = useParams()
    const [showdefault, setShowDefault] = useState({})
    const breadcrumbs = [{ title: "Dashboard", url: "/dashboard" }, { title: "Newsletter Emails ", url: "/admin/cms/promotional-email-templates/list/1" }, { title: "View", url: "" },]


    useEffect(() => {
        emailTemplateService.Details(params.id).then(response => {
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
                                <h6 className="main-content-label mb-3">View Newsletter Emails </h6>
                            </div>
                            {showdefault && Object.keys(showdefault).length > 0 ? <div className='row'>
                                <div className="col-lg-12 form-group">
                                    <table id="simple-table" className="table  table-bordered table-hover">
                                        <tbody>
                                            <tr>
                                                <th>Title</th>
                                                <td>{showdefault && showdefault.title ? showdefault.title : "N/A"}</td>
                                            </tr>
                                            {/* <tr>
                                                <th>Title In German</th>
                                                <td>{showdefault && showdefault.title_de ? showdefault.title_de : "N/A"}</td>
                                            </tr> */}
                                            <tr>
                                                <th>Slug</th>
                                                <td>{showdefault && showdefault.slug ? showdefault.slug : "N/A"}</td>
                                            </tr>
                                            <tr>
                                                <th>Subject</th>
                                                <td><div className="editorcontant">{showdefault && showdefault.subject ? showdefault.subject : "N/A"}</div></td>
                                            </tr>
                                            <tr>
                                                <th>Dynamic Options</th>
                                                <td>
                                                    {
                                                        showdefault && showdefault.options && showdefault.options.length > 0 ?
                                                            showdefault.options.map((item, index) => {
                                                                return (
                                                                    <span key={index} className={index === 0 ? "badge badge-pill badge-primary-light text-capitalize" : "badge badge-pill badge-primary-light text-capitalize ms-2"}>{'{' + item.toUpperCase() + '}'}</span>
                                                                )
                                                            })
                                                            : "N/A"
                                                    }
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>Created Date</th>
                                                <td>{showdefault && showdefault.createdAt ? (formateDate(showdefault.createdAt)) : "N/A"}</td>
                                            </tr>
                                            <tr>
                                                <th>Status</th>
                                                <td>{showdefault && showdefault.status === 0 ? toHtml(showStatus(showdefault.status)) : toHtml(showStatus(showdefault.status))}</td>
                                            </tr>
                                            <tr>
                                                <th>Modified Date</th>
                                                <td>{showdefault && showdefault.updatedAt ? formateDate(showdefault.updatedAt) : "N/A"}</td>
                                            </tr>
                                            <tr>
                                                <td colSpan={2}>
                                                    <div dangerouslySetInnerHTML={{ __html: showdefault && showdefault.description ? showdefault.description : "N/A" }}></div>
                                                </td>
                                            </tr>
                                            {/* <tr>
                                                <td colSpan={2}>
                                                    <div dangerouslySetInnerHTML={{ __html: showdefault && showdefault.description_de ? showdefault.description_de : "N/A" }}></div>
                                                </td>
                                            </tr> */}
                                        </tbody>
                                    </table>
                                        <div className="mt-5">
                                        <button className="btn ripple btn-dark" type='button' onClick={() => navigate(-1)}>
                                            <i className="ace-icon-solid ion-arrow-return-left bigger-110 mx-1"></i>
                                            Back
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

export default ViewEmailTempNews