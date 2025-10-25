import React, { useEffect, useState } from 'react'
import { Field, FieldArray, Formik } from 'formik'
import Swal from "sweetalert2"
import $ from "jquery"
import { json, useNavigate, useParams } from 'react-router-dom'
import * as eventsService from '../services/events.services';
import * as questionSetServices from '../services/questionset';
// import Breadcrums from '../../common/breadcrumbs';
import Breadcrums from '../common/breadcrumbs';
import CustomCkeditor from '../common/customeditor';
import { SWAL_SETTINGS } from '../../../utils/Constants';
import { handleServerValidations } from '../../../utils/commonfunction';
import CustomDatetimepicker from '../common/customDatetimepicker';
import CustomTimepicker from '../common/timepicker';
import * as venueService from '../services/venue.services';
import * as workBookService from '../services/workshop.service';

const MapInput = (props) => {
    const navigate = useNavigate()
    const params = useParams()
    const [submitted, setSubmitted] = useState(false)
    const [previewimage, setPreviewImage] = useState("")
    const [queSetList, setQuesetList] = useState([])
    const [venueList, setVenueList] = useState([])
    const [workshopList, setWorkShopList] = useState([])
    const breadcrumbs = [{ title: "Dashboard", url: "/admin/dashboard" }, { title: "Events", url: "/admin/events/list/1" }, { title: "Add", url: "" },]


    useEffect(() => {
        questionSetServices.Options().then(response => {
            setQuesetList(response && response.data ? response.data : [])
        }).catch(error => {
            console.log("error=====>", error)
        })
        venueService.Options().then(response => {
            setVenueList(response && response.data ? response.data : [])
        }).catch(error => {
            console.log("error=====>", error)
        })
        workBookService.Options().then(response => {
            setWorkShopList(response && response.data ? response.data : [])
        }).catch(error => {
            console.log("error", error)
        })
    }, [])

    return (
        <>
            <Breadcrums data={breadcrumbs} />
            <Formik
                enableReinitialize
                initialValues={{
                    title: "",
                    questionsetid: "",
                    short_desc: "",
                    richtext: "",
                    files: "",
                    timetable: [{
                        title: "",
                        venue_id: "",
                        workshop_id: "",
                        start_date: "",
                        start_time: "",
                        end_time: ""
                    }],
                }}
                validate={values => {
                    const error = {
                        timetable: []
                    };
                    if (!values.title) error.title = "Title is required";
                    if (!values.questionsetid) error.questionsetid = "Question Set is required";
                    if (!values.short_desc) error.short_desc = "Short Description is required";
                    if (!values.richtext) error.richtext = "Description is required";
                    if (!values.files) {
                        error.files = 'Image is required';
                    } else if (!values.files.name.match(/\.(jpg|jpeg|png|webp|avif|gif)$/)) {
                        error.files = 'Invalid Format';
                    }
                    // values.timetable.map((item, index) => {
                    //     if (!item.title) {
                    //         error.EventError = "Event title is required"
                    //     }
                    //     if (!item.venue_id) {
                    //         error.VenueError = "Venue is required"
                    //     }
                    //     if (!item.workshop_id) {
                    //         error.WorkshopError = "Workshop is required"
                    //     }
                    //     if (!item.start_date) {
                    //         error.StartDateError = "Start Date is required"
                    //     }
                    //     if (!item.start_time) {
                    //         error.Start_TimeError = "Start Time is required"
                    //     }
                    //     if (!item.end_time) {
                    //         error.End_TimeError = "End Time is required"
                    //     }
                    // })
                    values.timetable.map((item, index) => {
                        error.timetable.push({});
                        // if (!item.title) {
                        //     error.timetable[index]['title'] = "Event title is required"
                        // }
                        if (!values.timetable[index].title) {
                            error.timetable[index]['title'] = "Event title is required"
                        }
                        if (!item.venue_id) {
                            error.timetable[index]['venue_id'] = "Venue is required"
                        }
                        if (!item.workshop_id) {
                            error.timetable[index]['workshop_id'] = "Workshop is required"
                        }
                        if (!item.start_date) {
                            error.timetable[index]['start_date'] = "Start Date is required"
                        }
                        if (!item.start_time) {
                            error.timetable[index]['start_time'] = "Start Time is required"
                        }
                        if (!item.end_time) {
                            error.timetable[index]['end_time'] = "End Time is required"
                        }
                    })
                    return error;
                }}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                    setSubmitted(true)
                    let formData = new FormData();
                    formData.append('title', values.title);
                    formData.append('question_set_id', values.questionsetid);
                    formData.append('short_description', values.short_desc);
                    formData.append('description', values.richtext);
                    formData.append('image', values.files);
                    formData.append('timetable', JSON.stringify(values.timetable));
                    eventsService.Add(formData).then(response => {
                        setSubmitting(false);
                        if (response.success) {
                            Swal.fire({
                                icon: 'success',
                                text: response.message,
                                ...SWAL_SETTINGS
                            })
                            setTimeout(() => {
                                resetForm({ values: '' });
                                navigate(`/admin/events/list/1`)
                            }, 2000);
                        } else {
                            Swal.fire({
                                icon: 'error',
                                text: handleServerValidations(response),
                                ...SWAL_SETTINGS
                            })
                            setSubmitted(false)
                        }
                    }).catch(error => {
                        console.log("error ====> ", error);
                    })
                }}
            >{({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                setFieldValue,
                setFieldTouched,
                isSubmitting,

            }) => (
                <form onSubmit={handleSubmit}>
                    <div className="row row-sm">
                        <div className="col-lg-12 col-md-12 animation_fade">
                            <div className="card custom-card">
                                <div className="card-body">
                                    <div>
                                        <h6 className="main-content-label mb-3">Add Event</h6>
                                    </div>
                                    <div className="row row-sm">
                                        <div className='col-md-6 text-center form-group'>
                                            <label htmlFor='title' className='text-left d-flex'>Title:<span className="requirestar">*</span> </label>
                                            <input
                                                name='title'
                                                id='title'
                                                type='text'
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.title}
                                                className='form-control' />
                                            <span className='text-danger d-flex text-left'>{errors.title && touched.title && errors.title}</span>
                                        </div>
                                        <div className="col-lg-6 text-center form-group">
                                            <label htmlFor='questionsetid' className='text-left d-flex'>Question Set:<span className="requirestar">*</span> </label>
                                            <div className="form-group">
                                                <Field as='select' id="questionsetid" name={"questionsetid"} className="form-control select2" onBlur={handleBlur}>
                                                    <option value="" label="Select">Select{" "}</option>
                                                    {queSetList && queSetList.length > 0 && queSetList.map((option, i) => {
                                                        return (
                                                            <option key={i} value={option._id}>
                                                                {option.title}
                                                            </option>
                                                        );
                                                    })}
                                                </Field>
                                                <span className='text-danger d-flex text-left'>{errors.questionsetid && touched.questionsetid && errors.questionsetid}</span>
                                            </div>
                                        </div>

                                        {/* DYNAMIC OPTION CODE START FOR EVENT OPTIONS */}
                                        <div className="col-lg-12 mb-2">
                                            <FieldArray
                                                name="timetable"
                                                render={arrayHelpers => (
                                                    <div className='row'>
                                                        {values.timetable && values.timetable.length > 0 ? (
                                                            values.timetable.map((item, index) => (
                                                                <div className='col-lg-12' key={index}>
                                                                    <div className='w-100 dynamic_options' key={index}>
                                                                        <div className='row'>
                                                                            <div className='col-md-3 text-center form-group'>
                                                                                <label htmlFor='timetable[${index}].title' className='text-left d-flex'>Title:<span className="requirestar">*</span> </label>
                                                                                <input type='text'
                                                                                    className='form-control'
                                                                                    name={`timetable[${index}].title`}
                                                                                    onChange={handleChange}
                                                                                    // onBlur={handleBlur} 
                                                                                    onBlur={() => {
                                                                                        setFieldTouched(`timetable[${index}].title`, true);
                                                                                    }}
                                                                                />
                                                                              {!values.timetable[index].title && touched.timetable && touched.timetable[index] && touched.timetable[index].title ? <span className='text-danger d-flex text-left'>{errors.timetable && errors.timetable[index] && errors.timetable[index].title}</span> : ""}
                                                                            </div>
                                                                            <div className='col-md-3 text-center form-group'>
                                                                                <label htmlFor='timetable[${index}].venue_id' className='text-left d-flex'>Venue:<span className="requirestar">*</span> </label>
                                                                                <Field as='select'
                                                                                    id="timetable[${index}].venue_id"
                                                                                    name={`timetable[${index}].venue_id`}
                                                                                    className="form-control select2"
                                                                                    onBlur={() => {
                                                                                        setFieldTouched(`timetable[${index}].venue_id`, true);
                                                                                    }}
                                                                                >
                                                                                    <option value="" label="Select">Select{" "}</option>
                                                                                    {venueList && venueList.length > 0 && venueList.map((option, i) => {
                                                                                        return (
                                                                                            <option key={i} value={option._id}>
                                                                                                {option.title}
                                                                                            </option>
                                                                                        );
                                                                                    })}
                                                                                </Field>
                                                                                {!item.venue_id && touched.timetable && touched.timetable[index] && touched.timetable[index].venue_id ? <span className='text-danger d-flex text-left'>{errors.timetable && errors.timetable[index] && errors.timetable[index].venue_id}</span> : ""}
                                                                            </div>
                                                                            <div className='col-md-3 text-center form-group'>
                                                                                <label htmlFor='timetable[${index}].workshop_id' className='text-left d-flex'>Workshop:<span className="requirestar">*</span> </label>
                                                                                <Field as='select' id="timetable[${index}].workshop_id" name={`timetable[${index}].workshop_id`} className="form-control select2">
                                                                                    <option value="" label="Select">Select{" "}</option>
                                                                                    {workshopList && workshopList.length > 0 && workshopList.map((option, i) => {
                                                                                        return (
                                                                                            <option key={i} value={option._id}>
                                                                                                {option.title}
                                                                                            </option>
                                                                                        );
                                                                                    })}
                                                                                </Field>
                                                                                {!item.workshop_id && touched.timetable && touched.timetable[index] && touched.timetable[index].workshop_id ? <span className='text-danger d-flex text-left'>{errors.timetable && errors.timetable.length && errors.timetable[index].workshop_id}</span> : ""}
                                                                            </div>
                                                                            <div className='col-md-3 text-center form-group'>
                                                                                <label htmlFor='match_date' className='text-left d-flex'>Start Date:<span className="requirestar">*</span> </label>
                                                                                <CustomDatetimepicker setField={setFieldValue} fieldname={`timetable[${index}].start_date`} placeholder={"Start"} setFieldTouched={setFieldTouched} />
                                                                                {!item.start_date && touched.timetable && touched.timetable[index] && touched.timetable[index].start_date ? <span className='text-danger d-flex text-left'>{errors.timetable && errors.timetable.length && errors.timetable[index].start_date}</span> : ""}
                                                                            </div>
                                                                            <div className='col-md-3 text-center form-group'>
                                                                                <label htmlFor='start_time' className='text-left d-flex'>Start Time:<span className="requirestar">*</span> </label>
                                                                                <CustomTimepicker setField={setFieldValue} fieldname={`timetable[${index}].start_time`} placeholder={"Start-time"} setFieldTouched={setFieldTouched} />
                                                                                {!item.start_time && touched.timetable && touched.timetable[index] && touched.timetable[index].start_time ? <span className='text-danger d-flex text-left'>{errors.timetable && errors.timetable.length && errors.timetable[index].start_time}</span> : ""}
                                                                            </div>
                                                                            <div className='col-md-3 text-center form-group'>
                                                                                <label htmlFor='end_time' className='text-left d-flex'>End Time:<span className="requirestar">*</span> </label>
                                                                                <CustomTimepicker setField={setFieldValue} fieldname={`timetable[${index}].end_time`} placeholder={"End-Time"} setFieldTouched={setFieldTouched} />
                                                                                {!item.end_time && touched.timetable && touched.timetable[index] && touched.timetable[index].end_time ? <span className='text-danger d-flex text-left'>{errors.timetable && errors.timetable.length && errors.timetable[index].end_time}</span> : ""}
                                                                            </div>
                                                                            <div className='col-md-3 text-center form-group'>
                                                                                <label className='text-left d-flex' style={{ opacity: 0 }}>Actions</label>
                                                                                <div className="text-center form-group">
                                                                                    <div className='d-flex'>
                                                                                        {
                                                                                            values.timetable.length > 1 ?
                                                                                                <button
                                                                                                    type="button"
                                                                                                    className="ml-2 op_button danger"
                                                                                                    onClick={() => arrayHelpers.remove(index)} // remove a friend from the list
                                                                                                >
                                                                                                    <i className="ti-close"></i>
                                                                                                </button>
                                                                                                : ""
                                                                                        }
                                                                                        {
                                                                                            index == (values.timetable.length - 1) ?
                                                                                                <button
                                                                                                    type="button"
                                                                                                    role='button'
                                                                                                    className="ml-2 op_button success disabled"
                                                                                                    onClick={() => arrayHelpers.push({})}  // push an empty string in an array
                                                                                                    disabled={!item.title && !item.venue_id && !item.workshop_id && !item.start_date && !item.start_time && !item.end_time ? true : ""}
                                                                                                ><i className="ti-plus"></i>
                                                                                                </button>
                                                                                                : ""
                                                                                        }
                                                                                    </div></div>

                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                            ))
                                                        ) : null}
                                                    </div>
                                                )}
                                            />
                                        </div>
                                        {/* Dynamic option end */}

                                        <div className='col-md-12 text-center form-group'>
                                            <label htmlFor='short_desc' className='text-left d-flex'>Short Description:<span className="requirestar">*</span></label>
                                            <textarea name='short_desc' type='text' id="short_desc" onChange={handleChange} onBlur={handleBlur} value={values.short_desc} className='form-control' />
                                            <span className='text-danger d-flex text-left'>{errors.short_desc && touched.short_desc && errors.short_desc}</span>
                                        </div>

                                        <div className='col-lg-12 text-center form-group'>
                                            <label htmlFor='subject' className='text-left d-flex'>Description:<span className="requirestar">*</span></label>
                                            <CustomCkeditor
                                                fieldname={"richtext"}
                                                setFieldValue={setFieldValue}
                                                value={values.richtext}
                                                setFieldTouched={setFieldTouched}
                                            />
                                            <span className='text-danger d-flex text-left'>{errors.richtext && touched.richtext && errors.richtext}</span>
                                        </div>

                                        <div className='col-lg-12 text-center form-group'>
                                            <label htmlFor='files' className='text-left d-flex'>Image:<span className="requirestar">*</span> </label>
                                            <input className='form-control imgInput' id="files" name="files" accept="image/*" type="file" onChange={(event) => {
                                                setFieldValue("files", event.currentTarget.files[0] || "");
                                                { event.currentTarget.files.length == 1 ? (setPreviewImage(URL.createObjectURL(event.currentTarget.files[0]))) : (setPreviewImage("")) }
                                            }} />
                                            <span className='text-danger d-flex text-left' id="errortext">{errors.files && touched.files && errors.files}</span>
                                        </div>
                                        {
                                            previewimage ?
                                                <div className='mb-4'>
                                                    <img src={previewimage} style={{ height: "100px" }} />
                                                </div> : ""
                                        }
                                        <div className="">
                                            <button className="btn btn-info mr-2" type="submit" disabled={submitted ? true : null}>
                                                <i className="ace-icon fa fa-check bigger-110 mx-1"></i>
                                                Submit
                                            </button>
                                            <button className="btn ripple btn-secondary" type='button' disabled={submitted ? true : null} onClick={() => navigate(-1)}>
                                                <i className="ace-icon fa fa-times bigger-110 mx-1"></i>
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            )}
            </Formik>
        </>
    )
}

export default MapInput
