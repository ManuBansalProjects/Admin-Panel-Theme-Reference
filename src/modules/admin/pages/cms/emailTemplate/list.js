import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import * as emailTemplateService from "../../../services/email.template";
import CustomPagination from "../../../common/custompagination";
import Sorting from "../../../common/sorting";
import Loader from "../../../common/loader";
import Breadcrums from "../../../common/breadcrumbs";
import $ from "jquery";
import {
  SWAL_SETTINGS,
  showFilterlist,
  EMAIL_TEMPLATE_TYPES,
} from "../../../../../utils/Constants";
import {
  formateDateWithMonth,
  handleServerValidations,
  hasPermission,
  TrimText,
} from "../../../../../utils/commonfunction";
import StatusFilter from "../../../common/statusFilter";
import CustomRangepicker from "../../../common/rangepicker";
import {
  Modal,
  Button,
  TagGroup,
} from "rsuite";
import { EMAIL_REGEX } from "../../../../../utils/Constants";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useTranslation } from "react-i18next";

const EmailTemplatesTableNews = () => {
  const {t} = useTranslation();
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
  const breadcrumbs = [
    { title: "Dashboard", url: "/admin/dashboard" },
    { title: "Newsletter Emails ", url: "" },
  ];
  const [resetdate, setResetDate] = useState(false);
  const [invitationData, setInvitationData] = useState();
  const [open, setOpen] = useState(false);
  const [emailData, setEmailData] = useState(false);
  const [emailModal, setEmailModal] = useState(false);
  /********** MULTI SELECT >>>>>>********* */
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [selectedAllData, setSelectedAllData] = useState(false);
  const selectAllCheckbox = useRef();
  /********** MULTI SELECT <<<<<<********* */

  useEffect(() => {
    const getData = setTimeout(() => {
      if (search) {
        setLoader(true);
        const formData = new FormData();
        formData.append("page", params.pgno);
        formData.append("per_page", itemperpage);
        formData.append("sort", JSON.stringify(sorting));
        formData.append("search", JSON.stringify(search));
        formData.append("global_search", globalsearch);
        formData.append("type", EMAIL_TEMPLATE_TYPES.PROMOTIONAL);
        emailTemplateService
          .List(formData)
          .then((data) => {
            setDataLength(data.data.total_records);
            setList(data && data.data && data.data.list ? data.data.list : []);
            /********** MULTI SELECT >>>>>>********* */
            setSelectedAllData(
              data && data.data && data.data.data_ids ? data.data.data_ids : []
            );
            /********** MULTI SELECT <<<<<<********* */
            setPage(data && data.data && data.data.page ? data.data.page : 1);
            setLoader(false);
          })
          .catch((error) => {
            console.log("error ====> ", error);
          });
      }
    }, 300);
    return () => clearTimeout(getData)
  }, [location, statsupdate, sorting, search, globalsearch]);

  const viewfunction = (row) => {
    navigate(`/admin/cms/promotional-email-templates/view/${row._id}`);
  };

  const goToEdit = (row) => {
    navigate(
      `/admin/cms/promotional-email-templates/${params.pgno}/edit/${row._id}`
    );
  };
  const goToDuplicate = (row) => {
    navigate(
      `/admin/cms/promotional-email-templates/add`, { state: row }
    );
  };

  const ChangeStatus = (data, Num) => {
    const formData = new FormData();
    let ids = Array.isArray(data) ? data : [data];
    formData.append("o_id", JSON.stringify(ids));
    formData.append("status", Num);
    Swal.fire({
      customClass: "swal-wide",
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#403fad",
      cancelButtonColor: "#f1388b",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        emailTemplateService
          .Status(formData)
          .then((response) => {
            if (response.success) {
              Swal.fire({
                icon: "success",
                text: response.message,
                ...SWAL_SETTINGS,
              });
              setStatusUpdate(!statsupdate);
            } else {
              Swal.fire({
                icon: "error",
                text: handleServerValidations(response),
                ...SWAL_SETTINGS,
              });
            }
          })
          .catch((error) => {
            console.log("error===>");
          });
      }
    });
  };

  function Deletefunction(data) {
    Swal.fire({
      customClass: "swal-wide",
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#403fad",
      cancelButtonColor: "#f1388b",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        let ids = Array.isArray(data) ? data : [data];
        const formdata = new FormData();
        formdata.append("o_id", JSON.stringify(ids));
        emailTemplateService
          .Delete(formdata)
          .then((response) => {
            setStatusUpdate(!statsupdate);
            if (response.success) {
              Swal.fire({
                icon: "success",
                text: response.message,
                ...SWAL_SETTINGS,
              });
              /** removing deleted ids from selectedRecords */
              setSelectedRecords((data) => data.filter((item) => {
                return ids.indexOf(item) === -1;
              }));
            } else {
              Swal.fire({
                icon: "error",
                text: handleServerValidations(response),
                ...SWAL_SETTINGS,
              });
            }
          })
          .catch((error) => {
            console.log("deleteError");
          });
      }
    });
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
  };
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
  };
  // search or filer end

  const resetFilter = (e) => {
    e.preventDefault();
    setGlobalSearch("");
    prepareSearch();
    setSearch({});
    // reset customrangepicker & customstatusfilter state using jquery//
    setResetDate(!resetdate);
    $("#defaultstatus")[0].selectedIndex = 0;
  };

  const handleInvitation = (row) => {
    setInvitationData(row);
    setOpen(true);
  };

  const onOkayClick = (email) => {
    if (email) {
      setOpen(false);
      emailTemplateService.TestEmail({ 'email': email, 'slug': invitationData?.slug }).then((response) => {
        if (response.success) {
          Swal.fire({
            icon: "success",
            text: response.message,
            ...SWAL_SETTINGS,
          });
        } else {
          Swal.fire({
            icon: "error",
            text: response?.message,
            ...SWAL_SETTINGS,
          });
        }
      }).catch((error) => {
        // console.log("error",error);
        Swal.fire({
          icon: "error",
          text: error?.message,
          ...SWAL_SETTINGS,
        });
      })
    }
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .trim()
      .required("Email is required")
      .matches(EMAIL_REGEX, "Email should be valid"),
  });

  /********** MULTI SELECT >>>>>>********* */
  useEffect(() => {
    if (selectedRecords.length === datalength) {
      selectAllCheckbox.current.indeterminate = false;
      selectAllCheckbox.current.checked = true;
    } else if (selectedRecords.length) {
      selectAllCheckbox.current.indeterminate = true;
    } else {
      selectAllCheckbox.current.indeterminate = false;
    }
  }, [selectedRecords]);

  const selectRecord = (userData, check) => {
    if (check) {
      setSelectedRecords((previousState) => [...previousState, userData._id]);
    } else {
      setSelectedRecords((previousState) => previousState.filter((item) => item !== userData._id));
    }
  };
  const handleSelectAll = (check) => {
    if (check) {
      setSelectedRecords(selectedAllData);
    } else {
      setSelectedRecords([]);
    }
  };
  const isSelected = (data) => {
    return selectedRecords.filter((item) => data?._id === item).length > 0;
  };
  /********** MULTI SELECT <<<<<<<<<********* */

  const previewEmail = (_id) => {
    setEmailModal(true);
    emailTemplateService.Details(_id).then(response => {
      setEmailData(response && response.data ? response.data : []);
    }).catch(error => {
      console.log("error=====>", error)
    })
  }

  return (
    <>
      <Breadcrums data={breadcrumbs} />
      {/* table section */}
      <div className="animation_fade">
        <div className="card custom-card">
          <div className="card-body">
           
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h6 className="main-content-label">Newsletter Emails </h6>
              <div className="d-flex align-items-center">
                <div className="form-group mb-0 me-3">
                  <div className="form-group mb-0 rangepicker_container filter_design">
                    <i className="fa fa-search calender_icon"></i>
                    <input
                      type="search"
                      className="form-control"
                      value={globalsearch}
                      placeholder="Search"
                      onChange={(e) => {
                        setGlobalSearch(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="me-3">
                  <CustomRangepicker
                    GetDateRange={(e) => {
                      prepareSearch("createdAt", e);
                    }}
                    resetdate={resetdate}
                  />
                </div>
                <div className="me-3">
                  <StatusFilter
                    data={showFilterlist}
                    prepareSearch={prepareSearch}
                  />
                </div>
                <button
                  type="reset"
                  value="Reset"
                  onClick={resetFilter}
                  className="btn btn-warning float-right mr-2"
                >
                  Reset Filter
                </button>
                {hasPermission('/admin/cms/promotional-email-templates/add') ?
                  <button
                    className="btn ripple btn-main-primary signbtn"
                    onClick={() =>
                      navigate(`/admin/cms/promotional-email-templates/add`)
                    }
                  >
                    Add New
                  </button>
                  : null}
              </div>
            </div>
            <div className="table-responsive">
              <table className="table table-bordered border-t0 key-buttons text-nowrap w-100">
                <thead>
                  <tr>
                  <th className='sr_head'>{t("list_heading_sno")}</th>
                    <th>
                      <div className="sorting_column">
                        <span>Titlse</span>
                        <Sorting
                          sort={sorting}
                          handleSort={handleSort}
                          column="title"
                        />
                      </div>
                    </th>
                    <th>
                      <div className="sorting_column">
                        <span>Subject</span>
                      </div>
                    </th>
                    <th>
                      <div className="sorting_column">
                        <span>Created Date</span>
                        <Sorting
                          sort={sorting}
                          handleSort={handleSort}
                          defaultSorting={defaultSorting}
                          column="createdAt"
                        />
                      </div>
                    </th>
                    <th>Created By</th>
                    <th>updated By</th>
                    <th className="status_head">Status</th>
                    <th className="action_head">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loader ? (
                    <tr>
                      <td colSpan={9}>
                        <Loader />
                      </td>
                    </tr>
                  ) : (
                    <>
                      {list.length ? (
                        list.map((row, i) => {
                          return (
                            <tr key={i}>
                              <td className={"position-relative " + (hasPermission('/admin/cms/promotional-email-templates/multi-select') ? '' : "d-none")}>
                                <div className="select-check-container">
                                  <label htmlFor={row?._id + "input"} style={{ lineHeight: 'unset' }}
                                    className="ckbox cp">
                                    <input
                                      id={row?._id + "input"}
                                      checked={isSelected(row)}
                                      onChange={(e) =>
                                        selectRecord(row, e?.target?.checked)
                                      }
                                      type="checkbox"
                                      className="form-check select-check cp" />
                                    <span></span>
                                  </label>
                                </div>
                              </td>
                              <td>{row.title ? TrimText(row.title, 20) : "N/A"}</td>
                              <td title={row.subject}>
                                {row.subject ? row.subject : "N/A"}
                              </td>
                              <td>
                                {row.createdAt
                                  ? formateDateWithMonth(row.createdAt)
                                  : "N/A"}
                              </td>

                              <td>{row?.user_data?.name ? <Link to={`/admin/staff/view/${row.user_data._id}`}>{row.user_data.name}</Link> : "N/A"}</td>
                              <td>{row?.updatedBy?.name ? <Link to={`/admin/staff/view/${row.updatedBy._id}`}>{row.updatedBy.name}</Link> : "N/A"}</td>

                              {hasPermission('/admin/cms/promotional-email-templates/status') ?
                                <td>
                                  {row.status === 1 ? (
                                    <button
                                      className="btn ripple btn-main-primary signbtn"
                                      onClick={() => {
                                        ChangeStatus(row?._id, 0);
                                      }}
                                    >
                                      Active
                                    </button>
                                  ) : (
                                    <button
                                      className="btn ripple btn-secondary"
                                      onClick={() => {
                                        ChangeStatus(row?._id, 1);
                                      }}
                                    >
                                      Inactive
                                    </button>
                                  )}
                                </td>
                                :
                                <td>{row?.status === 1 ? <span className="badge badge-success">Active</span> : <span className="badge badge-danger">Inactive</span>}</td>
                              }

                              <td>
                                <div className="d-flex">
                                  <button
                                    className="btn ripple btn-main-primary signbtn "
                                    onClick={() => {
                                      viewfunction(row);
                                    }}
                                  >
                                    View
                                  </button>
                                  {hasPermission('/admin/cms/promotional-email-templates/*/edit/*') ?
                                    <button
                                      className="btn ripple btn-success mlAction"
                                      onClick={() => {
                                        goToEdit(row);
                                      }}
                                    >
                                      Edit
                                    </button>
                                    : null}
                                  {hasPermission('/admin/cms/promotional-email-templates/delete') ?

                                    <button
                                      className="btn ripple btn-secondary mlAction"
                                      onClick={() => {
                                        Deletefunction(row?._id);
                                      }}
                                    >
                                      Delete
                                    </button>
                                    : null}
                                  {hasPermission('/admin/cms/promotional-email-templates/more') ?

                                    <div className="btn-group mlAction">
                                      <button
                                        type="button"
                                        className="btn btn-dark dropdown-toggle"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                      >
                                        More
                                      </button>
                                      <ul className="dropdown-menu">
                                        <li>
                                          {hasPermission('/admin/cms/promotional-email-templates/test') ?
                                            <a
                                              href="/"
                                              className="dropdown-item"
                                              onClick={(e) => {
                                                e.preventDefault();
                                                handleInvitation(row);
                                              }}

                                            >
                                              Test
                                            </a>
                                            : null}
                                          {hasPermission('/admin/cms/promotional-email-templates/preview') ?

                                            <button
                                              type="button"
                                              className="dropdown-item"
                                              onClick={() => previewEmail(row?._id)}
                                            >
                                              Preview
                                            </button>
                                            : null}
                                          {hasPermission('/admin/cms/promotional-email-templates/duplicate') ?
                                            <button
                                              type="button"
                                              className="dropdown-item"
                                              onClick={() => goToDuplicate(row)}
                                            >
                                              Duplicate
                                            </button>
                                            : null}
                                        </li>

                                      </ul>
                                    </div>
                                    : null}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={9} className="text-center">
                            No records
                          </td>
                        </tr>
                      )}
                    </>
                  )}
                </tbody>
              </table>
            </div>
            <div
              className=""
              id="example1_info"
              role="status"
              aria-live="polite"
            >
              <b>Total Records : {datalength ? datalength : "0"}</b>
            </div>
            {datalength && datalength > 0 ? (
              <CustomPagination
                datalength={datalength}
                itemperpage={itemperpage}
                currentPage={page}
                setPage={setPage}
                pageRoute={[
                  {
                    name: "emails",
                    path: "/admin/cms/promotional-email-templates/list",
                  },
                ]}
              />
            ) : (
              ""
            )}
          </div>
        </div>
        <Modal size={"lg"} open={open} onClose={() => setOpen(false)}>
          <Formik
            initialValues={{ email: "" }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              // Handle form submission here
            }}
          >
            {({ handleChange, handleBlur, values, errors, touched, isSubmitting }) => (
              <Form>
                <Modal.Header className="mb-3">
                  <Modal.Title>Send Email</Modal.Title>
                  <div className="form-group w-50 mt-4">
                    <Field
                      type="text"
                      name="email"
                      className={`form-control ${errors.email && touched.email
                          ? "is-invalid"
                          : ""
                        }`}
                      placeholder="Email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="invalid-feedback"
                    />
                  </div>
                  <TagGroup></TagGroup>
                </Modal.Header>
                <div className="clearfix"></div>
                <div className="w-100">
                  <table className="table table-hover cp table-bordered border-t0 key-buttons text-nowrap w-100"></table>
                </div>
                <Modal.Footer>
                  <Button onClick={() => setOpen(false)} appearance="subtle">
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    appearance="primary"
                    disabled={isSubmitting}
                    onClick={() => onOkayClick(values.email)}
                  >
                    Submit
                  </Button>
                </Modal.Footer>
              </Form>
            )}
          </Formik>
        </Modal>

        <Modal size={"lg"} open={emailModal} onClose={() => setEmailModal(false)}>
          <Modal.Header className="mb-3">
            <Modal.Title>Preview Email</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="border p-4 rounded">
              <h5 className="mb-3">{emailData && emailData.subject}</h5>
              <div dangerouslySetInnerHTML={{ __html: emailData && emailData.description ? emailData.description + '<div className="clearfix"></div>' : "N/A" }}></div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => setEmailModal(false)} appearance="subtle">
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      {/* tablesection end */}
      
      
    </>
  );
};

export default EmailTemplatesTableNews;
