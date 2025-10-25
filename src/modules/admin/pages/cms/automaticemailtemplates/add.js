import React, { useEffect, useState } from 'react'
import { ErrorMessage, Formik } from 'formik'
import Swal from "sweetalert2"
import { useNavigate } from 'react-router-dom'
import * as emailTemplateService from '../../../services/email.template';
import Breadcrums from '../../../common/breadcrumbs';
import CustomCkeditor from '../../../common/customeditor';
import {EMAIL_TEMPLATE_TYPES, SWAL_SETTINGS } from '../../../../../utils/Constants';
import { globalLoader, handleServerValidations } from '../../../../../utils/commonfunction';
import * as Yup from 'yup';
import { useLocation } from 'react-router-dom'





const EmailTempAdd = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [submitted, setSubmitted] = useState(false);
    // const [options] = React.useState(DEFAULT_EMAIL_OPTIONS);
    const breadcrumbs = [{ title: "Dashboard", url: "/dashboard" }, { title: "Automatic Email ", url: "/admin/cms/default-email-template/list/1" }, { title: "Add", url: "" },];
    const queryParams = new URLSearchParams(location.search);
    const devParam = queryParams.get('dev');
    const showAddButton = devParam === 'true';

    // const handleClick = (text) => {
    //     copyText(text);
    //     Swal.fire({
    //         icon: 'success',
    //         text: 'Copied',
    //         ...SWAL_SETTINGS,
    //     })
    // }
    useEffect(() => {
        if (devParam === 'true' || devParam === true) {

        }
        else {
            navigate('/admin/cms/default-email-template/list/1');
        }
    }, [showAddButton, devParam]);


    const validationSchema = Yup.object().shape({
        title: Yup.string().required('Title is required').test('no-spaces', 'Title is required', (value) => value.trim()),
        slug: Yup.string().required("Slug is required").test('no-spaces', 'Slug is required', (value) => value.trim()),
        subject: Yup.string().required("Subject is required").test('no-spaces', 'Subject is required', (value) => value.trim()),
        richtext: Yup.string().required("Description is required").test('no-spaces', 'Description is required', (value) => value.trim()),
    });

    return (
        <>
            <Breadcrums data={breadcrumbs} />
            <Formik
                enableReinitialize
                initialValues={{
                    title: "",
                    title_de: "",
                    slug: "",
                    subject: "",
                    richtext: "",
                    // richtext_de: "",
                }}
                validateOnBlur={false}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                    globalLoader(true);
                    setSubmitted(true)
                    let formData = new FormData();
                    formData.append('title', values.title);
                    formData.append('title_de', values.title_de);
                    formData.append('type', EMAIL_TEMPLATE_TYPES.DEFAULT);
                    formData.append('subject', values.subject);
                    formData.append('description', values.richtext);
                    // formData.append('description_de', values.richtext_de);
                    formData.append('slug', values.slug);
                    // formData.append('options', JSON.stringify(options));
                    emailTemplateService.Add(formData).then(response => {
                        setSubmitting(false);
                        if (response.success) {
                            Swal.fire({
                                icon: 'success',
                                text: response.message,
                                ...SWAL_SETTINGS
                            })
                            globalLoader(false);
                            setTimeout(() => {
                                resetForm({ values: '' });
                                navigate(`/admin/cms/default-email-template/list/1`)
                            }, 2000);
                        } else {
                            Swal.fire({
                                icon: 'error',
                                text: handleServerValidations(response),
                                ...SWAL_SETTINGS
                            })
                            globalLoader(false);
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
                                        <h6 className="main-content-label mb-3">Add Automatic Email </h6>
                                    </div>
                                    <div className="row row-sm">
                                        <div className='col-md-6 text-center form-group'>
                                            <label htmlFor='title' className='text-left d-flex'>Title:<span className="requirestar">*</span> </label>
                                            <input name='title' id='title' type='text' onChange={handleChange} onBlur={handleBlur} value={values.title} className='form-control' />
                                            <span className='text-danger d-flex text-left'><ErrorMessage name={"title"} /></span>
                                        </div>
                                        {/* <div className='col-md-6 text-center form-group'>
                                            <label htmlFor='title_de' className='text-left d-flex'>Title In German:<span className="requirestar">*</span> </label>
                                            <input name='title_de' id='title_de' type='text' onChange={handleChange} onBlur={handleBlur} value={values.title_de} className='form-control' />
                                            <span className='text-danger d-flex text-left'><ErrorMessage name={"title_de"} /></span>
                                        </div> */}
                                        <div className='col-md-6 text-center form-group'>
                                            <label htmlFor='slug' className='text-left d-flex'>Slug:<span className="requirestar">*</span> </label>
                                            <input name='slug' type='text' id="slug" onChange={handleChange} onBlur={handleBlur} value={values.slug} className='form-control' />
                                            <span className='text-danger d-flex text-left'><ErrorMessage name={"slug"} /></span>
                                        </div>
                                        <div className='col-md-12 text-center form-group'>
                                            <label htmlFor='subject' className='text-left d-flex'>Subject:<span className="requirestar">*</span></label>
                                            <input name='subject' type='text' id="subject" onChange={handleChange} onBlur={handleBlur} value={values.subject} className='form-control' />
                                            <span className='text-danger d-flex text-left'><ErrorMessage name={"subject"} /></span>
                                        </div>

                                        {/* <div className='col-12'>
                                            <label htmlFor={"option" + (options.length - 1)} className='text-left d-flex'>Dynamic Options:<span className="text-warning ms-2">(Click to copy)</span> 
                                                <Whisper placement="top" controlId="control-id-hover" trigger="hover" speaker={<Tooltip>Short Codes to add User Personalized Details such as Name and Salutation - Click to Copy and then Paste</Tooltip>}>
                                                    <span className='field-more-info mt-1 ms-1 cp'>?</span>
                                                </Whisper></label>
                                        </div>
                                        <div className="col-lg-12 mb-2">
                                       
                                        {options && options.map((item, index) => (
                                        <span onClick={() => handleClick('{' + item.toUpperCase() + '}')} key={index} className="badge badge-dark my-2 me-2 cp">{'{' + item.toUpperCase() + '}'}</span>
                                                    ))
                                                    }
                                        </div> */}
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
                                            <button className="btn btn-main-primary signbtn mr-2" type="submit" disabled={submitted ? true : null}>
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

export default EmailTempAdd