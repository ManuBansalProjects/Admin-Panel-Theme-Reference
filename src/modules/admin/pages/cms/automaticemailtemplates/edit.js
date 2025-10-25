import React, { useEffect, useState } from 'react';
import { ErrorMessage, Formik } from 'formik';
import Swal from "sweetalert2";
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrums from '../../../common/breadcrumbs';
import CustomCkeditor from '../../../common/customeditor';
import * as emailTemplateService from '../../../services/email.template';
import { SWAL_SETTINGS } from '../../../../../utils/Constants';
import { globalLoader, handleServerValidations } from '../../../../../utils/commonfunction';
import * as Yup from 'yup';
import { Tooltip, Whisper } from 'rsuite';
import { copyText } from '../../../../../utils/commonfunction';
import { useTranslation } from 'react-i18next';




const EmailTempEdit = (props) => {
    const navigate = useNavigate();
    const params = useParams();
    const [showdefault, setShowDefault] = useState({});
    const [options, setOptions] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [saveType, setSaveType] = useState('')
    const {t} = useTranslation()
    const breadcrumbs = [{ title: t("sidebar_link_dashboard"), url: "/dashboard" }, { title: t("automatic_emails"), url: "/admin/cms/default-email-template/list/1" }, { title: t("btn_edit"), url: "" }]


    useEffect(() => {
        emailTemplateService.Details(params.id).then(response => {
            // console.log(response.data)
            setShowDefault(response && response.data ? response.data : []);
            // console.log(showdefault.description_ja)
            setOptions(response && response.data.options && response.data.options.length ? response.data.options : []);
            setTimeout(() => {
                setDataLoaded(true);
            }, 100);
        }).catch(error => {
            console.log("error=====>", error);
        });
    }, []);


    const validationSchema = Yup.object().shape({
        title: Yup.string().required(t("label_title_error")).max(50 , t("max_length_label_50")).test('no-spaces', t("label_title_error"), (value) => value.trim()),
        slug: Yup.string().required(t("label_slug_error")).test('no-spaces', t("label_slug_error"), (value) => value.trim()),
        subject: Yup.string().required(t("label_subject_error")).max(50 , t("max_length_label_50")).test('no-spaces', t("label_subject_error"), (value) => value.trim()),
        richtext: Yup.string().required(t("label_richtext_error")).test('no-spaces', t("label_richtext_error"), (value) => value.trim()),
    });

    const handleClick = (text) => {
        copyText(text);
        Swal.fire({
            icon: 'success',
            text: 'Copied',
            ...SWAL_SETTINGS,
        })
    }

    return (
        <>
            <Breadcrums data={breadcrumbs} />
            <Formik
                enableReinitialize
                initialValues={{
                    title: showdefault && showdefault.title ? showdefault.title : "",
                    title_de: showdefault && showdefault.title_de ? showdefault.title_de : "",
                    subject: showdefault && showdefault.subject ? showdefault.subject : "",
                    richtext: showdefault && showdefault.description ? showdefault.description : "",
                    // richtext_de: showdefault && showdefault.description_ja ? showdefault.description_ja : "",
                    slug: showdefault && showdefault.slug ? showdefault.slug : "",
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                    globalLoader(true);
                    let formData = new FormData();
                    formData.append('o_id', params.id)
                    formData.append('title', values.title);
                    formData.append('title_de', values.title_de);
                    formData.append('subject', values.subject);
                    formData.append('description', values.richtext);
                    // formData.append('description_ja', values.richtext_de);
                    formData.append('slug', values.slug);
                    // formData.append('options', JSON.stringify(options));
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
                                    navigate(`/admin/cms/default-email-template/list/${params.pgno}`)
                                }, 1000);
                            }
                            globalLoader(false);
                        } else {
                            Swal.fire({
                                icon: 'error',
                                text: handleServerValidations(response),
                                ...SWAL_SETTINGS
                            });
                            globalLoader(false);
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
                                        <h6 className="main-content-label mb-3">{t("edit_automatic_email")}</h6>
                                    </div>
                                    <div className="row row-sm">
                                        <div className='col-md-6 text-center form-group'>
                                            <label htmlFor='title' className='text-left d-flex'>{t("title")}:<span className="requirestar">*</span> </label>
                                            <input name='title' id='title' type='text' onChange={handleChange} onBlur={handleBlur} value={values.title} className='form-control' />
                                            <span className='text-danger d-flex text-left'><ErrorMessage name={"title"} /></span>
                                        </div>
                                        {/* <div className='col-md-6 text-center form-group'>
                                            <label htmlFor='title_de' className='text-left d-flex'>Title In German:<span className="requirestar">*</span> </label>
                                            <input name='title_de' id='title_de' type='text' onChange={handleChange} onBlur={handleBlur} value={values.title_de} className='form-control' />
                                            <span className='text-danger d-flex text-left'><ErrorMessage name={"title_de"} /></span>
                                        </div> */}
                                        <div className='col-md-6 text-center form-group'>
                                            <label htmlFor='slug' className='text-left d-flex'>{t("label_slug")}:<span className="requirestar">*</span> </label>
                                            <input disabled name='slug' type='text' id="slug" onChange={handleChange} onBlur={handleBlur} value={values.slug} className='form-control' />
                                            <span className='text-danger d-flex text-left'><ErrorMessage name={"slug"} /></span>
                                        </div>
                                        <div className='col-md-12 text-center form-group'>
                                            <label htmlFor='subject' className='text-left d-flex'>{t("list_heading_subject")}:<span className="requirestar">*</span> </label>
                                            <input name='subject' type='text' id="subject" onChange={handleChange} onBlur={handleBlur} value={values.subject} className='form-control' />
                                            <span className='text-danger d-flex text-left'><ErrorMessage name={"subject"} /></span>
                                        </div>
                                        {
                                            options && options.length ?
                                                <>
                                                    <div className='col-12'>
                                                        <label htmlFor={"option" + (options.length - 1)} className='text-left d-flex'>{t("label_dynamic_options")}<span className="text-warning ms-2">({t("click_to_copy")})</span>
                                                            <Whisper placement="top" controlId="control-id-hover" trigger="hover" speaker={<Tooltip>{t("short_code")}</Tooltip>}>
                                                                <span className='field-more-info mt-1 ms-1 cp'>?</span>
                                                            </Whisper></label>
                                                    </div>
                                                    <div className="col-lg-12 mb-2">
                                                        {options && options.map((item, index) => (
                                                            <span onClick={() => handleClick('{' + item.toUpperCase() + '}')} key={index} className="badge badge-dark my-2 me-2 cp">{'{' + item.toUpperCase() + '}'}</span>
                                                        ))
                                                        }
                                                    </div>
                                                </>
                                                : null
                                        }
                                        <div className='col-lg-12 text-center form-group'>
                                            <label htmlFor='subject' className='text-left d-flex'>{t("label_description")}<span className="requirestar">*</span></label>
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
                                        <div className="">
                                            <button onClick={() => { setSaveType('Save') }} className="btn btn-info mr-2" type="submit" >
                                                <i className="ace-icon fa fa-check bigger-110 mx-1"></i>
                                                {t("btn_save")}
                                            </button>
                                            <button onClick={() => { setSaveType('') }} className="btn btn-success mr-2" type="submit">
                                                <i className="ace-icon fa fa-check bigger-110 mx-1"></i>
                                               {t("btn_save_exit")}
                                            </button>
                                            <button className="btn ripple btn-secondary" type='button' onClick={() => navigate(-1)}>
                                                <i className="ace-icon fa fa-times bigger-110 mx-1"></i>
                                                {t("btn_cancel")}
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

export default EmailTempEdit