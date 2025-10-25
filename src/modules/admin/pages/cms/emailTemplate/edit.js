import React, { useEffect, useState } from 'react';
import { ErrorMessage, Formik } from 'formik';
import Swal from "sweetalert2"
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrums from '../../../common/breadcrumbs';
import CustomCkeditor from '../../../common/customeditor';
import * as emailTemplateService from '../../../services/email.template';
import { DEFAULT_EMAIL_OPTIONS, SWAL_SETTINGS } from '../../../../../utils/Constants';
import { copyText, handleServerValidations } from '../../../../../utils/commonfunction';
import * as Yup from 'yup';
import { Tooltip, Whisper,  } from 'rsuite';


const EmailTempEditNews = (props) => {
    const navigate = useNavigate()
    const params = useParams()
    const [showdefault, setShowDefault] = useState({})
    const [options] = useState(DEFAULT_EMAIL_OPTIONS);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [saveType, setSaveType] = useState('')

    const breadcrumbs = [{ title: "Dashboard", url: "/admin/dashboard" }, { title: "Newsletter Emails ", url: "/admin/cms/promotional-email-templates/list/1" }, { title: "Edit", url: "" }];

    const handleClick = (text) => {
        copyText(text);
        Swal.fire({
            icon: 'success',
            text: 'Copied',
            ...SWAL_SETTINGS,
        })
    }

    useEffect(() => {
        emailTemplateService.Details(params.id).then(response => {
            setShowDefault(response && response.data ? response.data : [])
            // setOptions(response && response.data.options ? addArray([...response.data.options,...DEFAULT_EMAIL_OPTIONS]) : []);
            setTimeout(() => {
                setDataLoaded(true);
            }, 100)
        }).catch(error => {
            console.log("error=====>", error)
        })
    }, [])


    const validationSchema = Yup.object().shape({
        title: Yup.string().required('Title is required').test('no-spaces', 'Title is required', (value) => value.trim()),
        subject: Yup.string().required("Subject is required").test('no-spaces', 'Subject is required', (value) => value.trim()),
        richtext: Yup.string().required("Description is required").test('no-spaces', 'Description is required', (value) => value.trim()),
    });

    return (
        <>
            <Breadcrums data={breadcrumbs} />
            <Formik
                enableReinitialize
                initialValues={{
                    title: showdefault && showdefault.title ? showdefault.title : "",
                    subject: showdefault && showdefault.subject ? showdefault.subject : "",
                    richtext: showdefault && showdefault.description ? showdefault.description : "",
                }}
                validationSchema={validationSchema}

                onSubmit={(values, { setSubmitting, resetForm }) => {
                    let formData = new FormData();
                    formData.append('o_id', params.id);
                    formData.append('title', values.title);
                    formData.append('subject', values.subject);
                    formData.append('description', values.richtext);
                    formData.append('options', JSON.stringify(options));
                    emailTemplateService.Edit(formData).then(response => {
                        setSubmitting(false);
                        if (response.success) {
                            Swal.fire({
                                icon: 'success',
                                text: response.message,
                                ...SWAL_SETTINGS
                            })
                            if (saveType !== 'Save') {
                                setTimeout(() => {
                                    navigate(`/admin/cms/promotional-email-templates/list/${params.pgno}`)
                                }, 1000);
                            }
                        } else {
                            Swal.fire({
                                icon: 'error',
                                text: handleServerValidations(response),
                                ...SWAL_SETTINGS
                            });
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
                                        <h6 className="main-content-label mb-3">Edit Newsletter Emails </h6>
                                    </div>
                                    <div className="row row-sm">
                                        <div className='col-md-12 text-center form-group'>
                                            <label htmlFor='title' className='text-left d-flex'>Title:<span className="requirestar">*</span> </label>
                                            <input name='title' id='title' type='text' onChange={handleChange} onBlur={handleBlur} value={values.title} className='form-control' />
                                            <span className='text-danger d-flex text-left'><ErrorMessage name={"title"} /></span>
                                        </div>

                                        {/* <div className='col-md-12 text-center form-group'>
                                            <label htmlFor='title_de' className='text-left d-flex'>Title In German:<span className="requirestar">*</span> </label>
                                            <input name='title_de' id='title_de' type='text' onChange={handleChange} onBlur={handleBlur} value={values.title_de} className='form-control' />
                                            <span className='text-danger d-flex text-left'><ErrorMessage name={"title_de"} /></span>
                                        </div> */}

                                        <div className='col-md-12 text-center form-group'>
                                            <label htmlFor='subject' className='text-left d-flex'>Subject (En):<span className="requirestar">*</span> </label>
                                            <input name='subject' type='text' id="subject" onChange={handleChange} onBlur={handleBlur} value={values.subject} className='form-control' />
                                            <span className='text-danger d-flex text-left'><ErrorMessage name={"subject"} /></span>
                                        </div>

                                        <div className='col-12'>
                                            <label className='text-left d-flex'>Dynamic Options:<span className="text-warning ms-2">(Click to copy)</span>
                                            <Whisper placement="top" controlId="control-id-hover" trigger="hover" speaker={<Tooltip>Short Codes to add User Personalized Details such as Name and Salutation - Click to Copy and then Paste.</Tooltip>}>
                                                    <span className="field-more-info mt-1 ms-1 cp">?</span>
                                                </Whisper>
                                            </label>
                                        </div>
                                        <div className="col-lg-12 mb-2">
                                                {options && options.map((item, index) => (
                                                    <span onClick={() => handleClick('{' + item.toUpperCase() + '}')} key={index} className="badge badge-dark my-2 me-2 cp">{'{' + item.toUpperCase() + '}'}</span>
                                                ))
                                                }
                                          </div>
                                        <div className='col-lg-12 text-center form-group'>
                                            <label htmlFor='subject' className='text-left d-flex'>Description (En):<span className="requirestar">*</span>
                                           </label>
                                            {
                                                dataLoaded ?
                                                    <CustomCkeditor
                                                        fieldname={"richtext"}
                                                        setFieldValue={setFieldValue}
                                                        value={values.richtext}
                                                        setFieldTouched={setFieldTouched}
                                                    />
                                                    :
                                                    ""
                                            }
                                            <span className='text-danger d-flex text-left'>{errors.richtext && touched.richtext && errors.richtext}</span>
                                        </div>

                                        {/* <div className='col-lg-12 text-center form-group'>
                                            <label htmlFor='subject' className='text-left d-flex'>Description In German:<span className="requirestar">*</span></label>
                                           
                                                <CustomCkeditor
                                                    fieldname={"richtext_de"}
                                                    setFieldValue={setFieldValue}
                                                    value={values.richtext_de}
                                                    setFieldTouched={setFieldTouched}
                                                />
                                               
                                            <span className='text-danger d-flex text-left'>{errors.richtext_de && touched.richtext_de && errors.richtext_de}</span>
                                        </div> */}
                                        <div className="">
                                            <button onClick={() => { setSaveType('Save') }} className="btn btn-info mr-2" type="submit" >
                                                <i className="ace-icon fa fa-check bigger-110 mx-1"></i>
                                                Save
                                            </button>
                                            <button onClick={() => { setSaveType('') }} className="btn btn-success mr-2" type="submit">
                                                <i className="ace-icon fa fa-check bigger-110 mx-1"></i>
                                                Save & Exit
                                            </button>
                                            <button className="btn ripple btn-secondary" type='button'  onClick={() => navigate(-1)}>
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

export default EmailTempEditNews