import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import * as emailTemplateService from '../../../services/email.template';
import CustomPagination from '../../../common/custompagination';
import Sorting from '../../../common/sorting';
import Loader from '../../../common/loader';
import Breadcrums from "../../../common/breadcrumbs";
import { SWAL_SETTINGS, EMAIL_TEMPLATE_TYPES } from '../../../../../utils/Constants';
import { formateDateWithMonth, handleServerValidations, TrimText } from '../../../../../utils/commonfunction';
import CustomRangepicker from '../../../common/rangepicker';
import { useTranslation } from "react-i18next";



const EmailTemplatesTable = () => {
    const { t } = useTranslation()
    const params = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [list, setList] = useState([]);
    const [statsupdate, setStatusUpdate] = useState("false");
    const [datalength, setDataLength] = useState("");
    const [itemperpage] = useState(10);
    const [sorting, setSorting] = useState({});
    const [defaultSorting, setDefaultSorting] = useState(true);
    const [page, setPage] = useState(1);
    const [loader, setLoader] = useState(true);
    const [search, setSearch] = useState({});
    const [globalsearch, setGlobalSearch] = useState("");
    const breadcrumbs = [{ title: t("sidebar_link_dashboard"), url: "/admin/dashboard" }, { title: t("sidebar_link_email_template"), url: "" }];
    const [resetdate, setResetDate] = useState(false);


    const queryParams = new URLSearchParams(location.search);
    const devParam = queryParams.get('dev');
    const showAddButton = devParam === 'true';
    const [isDevMode, setIsDevMode] = useState(showAddButton);

    useEffect(() => {
        setIsDevMode(showAddButton);
    }, [showAddButton]);


    useEffect(() => {
        if (search) {
            setLoader(true)
            const formData = new FormData()
            formData.append("page", params.pgno)
            formData.append("per_page", itemperpage)
            formData.append("sort", JSON.stringify(sorting))
            formData.append("search", JSON.stringify(search))
            formData.append("global_search", globalsearch)
            formData.append("type", EMAIL_TEMPLATE_TYPES.DEFAULT)
            emailTemplateService.List(formData).then(data => {
                setDataLength(data.data.total_records);
                setList(data && data.data && data.data.list ? data.data.list : []);

                setPage(data && data.data && data.data.page ? data.data.page : 1);
                setLoader(false)
            }).catch(error => {
                console.log("error ====> ", error);
            })
        }
    }, [location, statsupdate, sorting, search, globalsearch]);

    const viewfunction = (row) => {
        navigate(`/admin/cms/default-email-template/view/${row._id}`)
    }

    const goToEdit = (row) => {
        navigate(`/admin/cms/default-email-template/${params.pgno}/edit/${row._id}`)
    }

    function Deletefunction(data) {
        Swal.fire({
            customClass: 'swal-wide',
            title: t("msg_are_you_sure"),
            text: t("you_not_be_able_to_revert_this"),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#403fad',
            cancelButtonColor: '#f1388b',
            confirmButtonText: t("btn_yes_delete"),
            cancelButtonText: t("btn_cancel")
        }).then((result) => {
            if (result.isConfirmed) {
                let ids = Array.isArray(data) ? data : [data];
                const formdata = new FormData();
                formdata.append("o_id", JSON.stringify(ids));
                emailTemplateService.Delete(formdata).then(response => {
                    setStatusUpdate(!statsupdate)
                    if (response.success) {
                        Swal.fire({
                            icon: 'success',
                            text: response.message,
                            ...SWAL_SETTINGS
                        })

                    } else {
                        Swal.fire({
                            icon: 'error',
                            text: handleServerValidations(response),
                            ...SWAL_SETTINGS
                        })
                    }
                }).catch((error) => {
                    console.log("deleteError", error)
                });
            }
        })
    }

    // sorting function start
    const handleSort = (e, column) => {
        setDefaultSorting(false);
        let sort = { order: 0, column: column };
        if (e.target.classList.contains("assc")) {
            sort.order = -1;
        } else {
            sort.order = 1;
        }
        setSorting(sort);
    }
    // sorting end

    // search or filter function
    const prepareSearch = (key, value) => {
        let sr = { ...search };
        if (String(value).length > 0) {
            sr[key] = value;
        } else {
            delete sr[key];
        }
        setSearch(sr);
    }
    // search or filer end

    const resetFilter = (e) => {
        e.preventDefault()
        setGlobalSearch("")
        prepareSearch()
        setSearch({})
        // reset customrangepicker & customstatusfilter state using jquery//
        setResetDate(!resetdate)
    }






    return (
        <>
            <Breadcrums data={breadcrumbs} />
            {/* table section */}
            <div className="animation_fade">
                <div className="card custom-card">
                    <div className="card-body">

                        <div className='d-flex justify-content-between align-items-center mb-4'>
                            <h6 className="main-content-label">{t("sidebar_link_email_template")}</h6>
                            <div className='d-flex align-items-center'>
                                <div className='form-group mb-0 me-3'>
                                    <div className="form-group mb-0 rangepicker_container filter_design">
                                        <i className="fa fa-search calender_icon"></i>
                                        <input type="search" className="form-control" value={globalsearch} placeholder="Search" onChange={(e) => { setGlobalSearch(e.target.value) }} />
                                    </div>
                                </div>
                                <div className="me-3">
                                    <CustomRangepicker GetDateRange={(e) => { prepareSearch("createdAt", e) }} resetdate={resetdate} />
                                </div>
                                {/* <div className="me-3">
                                    <StatusFilter data={showFilterlist} prepareSearch={prepareSearch} />
                                </div> */}
                                <button type="reset" value='Reset' onClick={resetFilter} className="btn btn-warning float-right mr-2">{t("btn_reset_filter")}</button>
                                <>
                                    {isDevMode && (
                                        <button className="btn ripple btn-main-primary signbtn" onClick={() => navigate(`/admin/cms/default-email-template/add?dev=true`)}>Add New</button>
                                    )}
                                </>
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-bordered border-t0 key-buttons text-nowrap w-100">
                                <thead>
                                    <tr>
                                        <th className='sr_head'>{t("list_heading_sno")}</th>

                                        <th>
                                            <div className='sorting_column'>
                                                <span>{t("title")}</span>
                                                <Sorting sort={sorting} handleSort={handleSort} column="title" />
                                            </div>
                                        </th>
                                        <th>
                                            <div className='sorting_column'>
                                                <span>{t("label_slug")}</span>
                                            </div>
                                        </th>
                                        <th>
                                            <div className='sorting_column'>
                                                <span>{t("list_heading_subject")}</span>
                                            </div>
                                        </th>
                                        <th>
                                            <div className='sorting_column'>
                                                <span>{t("list_heading_created_date")}</span>
                                                <Sorting sort={sorting} handleSort={handleSort} defaultSorting={defaultSorting} column="createdAt" />
                                            </div>
                                        </th>
                                        <th className='action_head'>{t("list_heading_action")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loader ?
                                        <tr>
                                            <td colSpan={10}><Loader /></td>
                                        </tr> : <>
                                            {list.length ? list.map((row, i) => {
                                                return <tr key={i}>
                                                    <td>
                                                        {row ? ((page - 1) * itemperpage) + i + 1 : null}
                                                    </td>
                                                    <td>{row.title ? TrimText(row.title, 20) : "N/A"}</td>
                                                    <td>{row.slug ? row.slug : "N/A"}</td>
                                                    <td title={row.subject}>{row.subject ? row.subject : "N/A"}</td>
                                                    <td>{row.createdAt ? formateDateWithMonth(row.createdAt) : "N/A"}</td>

                                                    <td>
                                                        <div className="d-flex">
                                                            <button className="btn ripple btn-main-primary signbtn" onClick={() => { viewfunction(row) }}>{t("btn_view")}</button>

                                                            <button className="btn ripple btn-success mlAction" onClick={() => { goToEdit(row) }}>{t("btn_edit")}</button>

                                                            <>
                                                                {isDevMode && (
                                                                    <button className="btn ripple btn-secondary mlAction" onClick={() => { Deletefunction(row?._id) }}>{t("btn_delete")}</button>
                                                                )}
                                                            </>

                                                        </div>

                                                    </td>
                                                </tr>
                                            }) : <tr><td colSpan={10} className="text-center">{t("msg_no_records")}</td></tr>}
                                        </>}

                                </tbody>
                            </table>
                        </div>
                        <div className="" id="example1_info" role="status" aria-live="polite"><b>{t("msg_total_records")} : {datalength ? datalength : "0"}</b></div>
                        {datalength && datalength > 0 ?
                            <CustomPagination datalength={datalength} itemperpage={itemperpage} currentPage={page} setPage={setPage} pageRoute={[{ name: "email-templates", path: "/admin/cms/default-email-template/list" }]} /> : ""}
                    </div>
                </div>
            </div>
            {/* tablesection end */}
        </>
    )
}

export default EmailTemplatesTable