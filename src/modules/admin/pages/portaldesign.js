import React, { useEffect, useState } from 'react'
import { Field, Formik } from 'formik';
import Breadcrums from '../common/breadcrumbs';
import Swal from "sweetalert2"
import $ from "jquery"
import {  SWAL_SETTINGS } from '../../../utils/Constants';
import * as portalDesignService from '../../admin/services/portal.design.services';
import { handleServerValidations, hasPermission } from '../../../utils/commonfunction';


const PortalDesign = () => {
    const [previewimage1, setPreviewImage1] = useState("");
    const [previewimage2, setPreviewImage2] = useState("");
    const [previewimage3, setPreviewImage3] = useState("");
    const [previewimage4, setPreviewImage4] = useState("");
    const [previewimage5, setPreviewImage5] = useState("");
    const [showdefault, setShowDefault] = useState({})
    const [submitted, setSubmitted] = useState(false);
    const [reset, setReset] = useState(0)
    const breadcrumbs = [{ title: "Dashboard", url: "/admin/dashboard" }, { title: "Portal Designer", url: "" }]

    useEffect(() => {
        portalDesignService.Details().then((response) => {
            setShowDefault(response && response.data ? response.data : []);
            setPreviewImage1(response.data.logo_transparent);
            setPreviewImage2(response.data.logo_short);
            setPreviewImage3(response.data.reverse_logo);
            setPreviewImage4(response.data.favicon_icon);
            setPreviewImage5(response.data.inner_banner);
            if(reset){
                document.getElementById('logo_full').src=response?.data?.logo_transparent;
                document.getElementById('logo_short').src=response?.data?.logo_short;
                document.title=response?.data?.general?.title;
            }
        }).catch((error) => {
            console.log("error=====>", error)
        })
    }, [reset])


    const handleDefaultsetting = () => {
        portalDesignService.ResetSetting().then((response) => {
            if (response.success) {
                setReset((new Date()).getTime())
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
            console.log("error=====>", error)
        })
    }

    return (
        <>
            <>
                <Breadcrums data={breadcrumbs} />
                <Formik
                    enableReinitialize
                    initialValues={{
                        generals: showdefault && showdefault.general ? showdefault.general : {
                            title: "",
                            fontFamily: ""
                        },
                        font_colors: showdefault && showdefault.font_colors ? showdefault.font_colors : {
                            primary_color_black: "",
                            primary_color_white: "",
                            active_color: "",
                            paragraph_color: ""
                        },
                        background_colors: showdefault && showdefault.background_colors ? showdefault.background_colors : {
                            primary_active_color: "",
                            secondary_active_color: "",
                            footer_background_color: "",
                            footer_bottom_background_color: "",
                            header_background_color: "",
                        },
                        fontsize: showdefault && showdefault.font_sizes ? showdefault.font_sizes : {
                            h1: "",
                            h2: "",
                            h3: "",
                            h4: "",
                            h5: "",
                            h6: "",
                            paragraph: ""
                        },
                        logo_transparent: showdefault && showdefault.logo_transparent ? showdefault.logo_transparent : "",
                        logo_short: showdefault && showdefault.logo_short ? showdefault.logo_short : "",
                        reverse_logo: showdefault && showdefault.reverse_logo ? showdefault.reverse_logo : "",
                        favicon_icon: showdefault && showdefault.favicon_icon ? showdefault.favicon_icon : "",
                        inner_banner: showdefault && showdefault.inner_banner ? showdefault.inner_banner : "",
                        custom_css: showdefault && showdefault.custom_css ? showdefault.custom_css : "",
                    }}
                    validate={values => {
                        let error = {};
                        if (values.generals) {
                            error.generals = {}
                            if (!values.generals.title || !values.generals.title.trim()) {
                                error.generals.title = "Title is required"
                            }
                            if (!values.generals.fontFamily || !values.generals.fontFamily.trim()) {
                                error.generals.fontFamily = "Font is required"
                            }
                        }
                        if (values.logo_transparent === undefined || values?.logo_transparent?.type || !values.logo_transparent) {
                            if (!values.logo_transparent || values.logo_transparent === undefined) {
                                error.logo_transparent = 'Logo is required';
                            } else if (!values.logo_transparent.name.match(/\.(jpg|jpeg|png|webp|avif|gif)$/)) {
                                error.logo_transparent = 'Invalid Format';
                                $('#imagefileerror').text('Invalid Format');
                            } else {
                                $('#imagefileerror').text('');
                            }
                        }
                        if (values.logo_short === undefined || values?.logo_short?.type || !values.logo_short) {
                            if (!values.logo_short || values.logo_short === undefined) {
                                error.logo_short = 'Logo is required';
                            } else if (!values.logo_short.name.match(/\.(jpg|jpeg|png|webp|avif|gif)$/)) {
                                error.logo_short = 'Invalid Format';
                                $('#imagefileerror').text('Invalid Format');
                            } else {
                                $('#imagefileerror').text('');
                            }
                        }
                        if (values.reverse_logo === undefined || values?.reverse_logo?.type || !values.reverse_logo) {
                            if (!values.reverse_logo || values.reverse_logo === undefined) {
                                error.reverse_logo = 'Logo is required';
                            } else if (!values.reverse_logo.name.match(/\.(jpg|jpeg|png|webp|avif|gif)$/)) {
                                error.reverse_logo = 'Invalid Format';
                                $('#imagefileerror').text('Invalid Format');
                            } else {
                                $('#imagefileerror').text('');
                            }
                        }
                        if (values.favicon_icon === undefined || values?.favicon_icon?.type || !values.favicon_icon) {
                            if (!values.favicon_icon || values.favicon_icon === undefined) {
                                error.favicon_icon = 'Logo is required';
                            } else if (!values.favicon_icon.name.match(/\.(jpg|jpeg|png|webp|avif|gif)$/)) {
                                error.favicon_icon = 'Invalid Format';
                                $('#imagefileerror').text('Invalid Format');
                            } else {
                                $('#imagefileerror').text('');
                            }
                        }
                        if (values.inner_banner === undefined || values?.inner_banner?.type || !values.inner_banner) {
                            if (!values.inner_banner || values.inner_banner === undefined) {
                                error.inner_banner = 'Logo is required';
                            } else if (!values.inner_banner.name.match(/\.(jpg|jpeg|png|webp|avif|gif)$/)) {
                                error.inner_banner = 'Invalid Format';
                                $('#imagefileerror').text('Invalid Format');
                            } else {
                                $('#imagefileerror').text('');
                            }
                        }
                        if (values.font_colors) {
                            error.font_colors = {};
                            if (!values.font_colors.primary_color_black || !values.font_colors.primary_color_black.trim()) {
                                error.font_colors.primary_color_black = "Color is required";
                            }
                            if (!values.font_colors.primary_color_white || !values.font_colors.primary_color_white.trim()) {
                                error.font_colors.primary_color_white = "Color is required";
                            }
                            if (!values.font_colors.active_color || !values.font_colors.active_color.trim()) {
                                error.font_colors.active_color = "Color is required";
                            }
                            if (!values.font_colors.paragraph_color || !values.font_colors.paragraph_color.trim()) {
                                error.font_colors.paragraph_color = "Color is required";
                            }
                        }
                        if (values.background_colors) {
                            error.background_colors = {};
                            if (!values.background_colors.primary_active_color || !values.background_colors.primary_active_color.trim()) {
                                error.background_colors.primary_active_color = "Color is required";
                            }
                            if (!values.background_colors.secondary_active_color || !values.background_colors.secondary_active_color.trim()) {
                                error.background_colors.secondary_active_color = "Color is required";
                            }
                            if (!values.background_colors.footer_background_color || !values.background_colors.footer_background_color.trim()) {
                                error.background_colors.footer_background_color = "Color is required";
                            }
                            if (!values.background_colors.footer_bottom_background_color || !values.background_colors.footer_bottom_background_color.trim()) {
                                error.background_colors.footer_bottom_background_color = "Color is required";
                            }
                            if (!values.background_colors.header_background_color || !values.background_colors.header_background_color.trim()) {
                                error.background_colors.header_background_color = "Color is required";
                            }
                        }
                        if (values.fontsize) {
                            error.fontsize = {};
                            if (!values.fontsize.h1 || !values.fontsize.h1.trim()) {
                                error.fontsize.h1 = "Font size is required";
                            }
                            if (!values.fontsize.h2 || !values.fontsize.h2.trim()) {
                                error.fontsize.h2 = "Font size is required";
                            }
                            if (!values.fontsize.h3 || !values.fontsize.h3.trim()) {
                                error.fontsize.h3 = "Font size is required";
                            }
                            if (!values.fontsize.h4 || !values.fontsize.h4.trim()) {
                                error.fontsize.h4 = "Font size is required";
                            }
                            if (!values.fontsize.h5 || !values.fontsize.h5.trim()) {
                                error.fontsize.h5 = "Font size is required";
                            }
                            if (!values.fontsize.h6 || !values.fontsize.h6.trim()) {
                                error.fontsize.h6 = "Font size is required";
                            }
                            if (!values.fontsize.paragraph || !values.fontsize.paragraph.trim()) {
                                error.fontsize.paragraph = "Font size is required";
                            }
                        }
                        if (Object.keys(error.font_colors).length === 0) {
                            delete error.font_colors;
                        }
                        if (Object.keys(error.background_colors).length === 0) {
                            delete error.background_colors;
                        }
                        if (Object.keys(error.generals).length === 0) {
                            delete error.generals;
                        }
                        if (Object.keys(error.fontsize).length === 0) {
                            delete error.fontsize;
                        }
                        console.log("error",error);
                        return error;
                    }}
                    onSubmit={(values, { setSubmitting, resetForm }) => {
                        setSubmitted(true)
                        let formData = new FormData();
                        formData.append('general', JSON.stringify(values.generals));
                        formData.append('font_sizes', JSON.stringify(values.fontsize));
                        formData.append('font_colors', JSON.stringify(values.font_colors));
                        formData.append('background_colors', JSON.stringify(values.background_colors));
                        formData.append('logo_transparent', values.logo_transparent);
                        formData.append('favicon_icon', values.favicon_icon);
                        formData.append('inner_banner', values.inner_banner);
                        formData.append('logo_short', values.logo_short);
                        formData.append('reverse_logo', values.reverse_logo);
                        formData.append('custom_css', values.custom_css);
                        portalDesignService.Update(formData).then(response => {
                            if (response.success) {
                                document.title = values.generals.title
                                Swal.fire({
                                    icon: 'success',
                                    text: response.message,
                                    ...SWAL_SETTINGS
                                })
                                portalDesignService.Details().then((response) => {
                                    document.getElementById('logo_full').src=response?.data?.logo_transparent;
                                    document.getElementById('logo_short').src=response?.data?.logo_short;
                                }).catch((error) => {
                                    console.log("error",error);
                                })
                                setTimeout(() => {
                                    setSubmitted(false)
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
                    isSubmitting,
                }) => (
                    <form onSubmit={handleSubmit}>
                        <div className="row row-sm">
                            <div className="col-lg-12 col-md-12 animation_fade">
                                <div className="card custom-card">
                                    <div className="card-body">
                                        <div className='d-flex justify-content-between align-items-center'>
                                            <h6 className="main-content-label mb-3">PORTAL DESIGNER</h6>
                                            {hasPermission('/admin/cms/portal-design/reset') ?
                                            <button type="button" className="btn btn-warning" onClick={() => { handleDefaultsetting() }}>Reset Settings</button>
                                            :null}
                                        </div>
                                        <div className="row row-sm">
                                            <div className='col-lg-12 text-center'>
                                                <div className="row">
                                                    <div className="col-12 mb-2 mt-3">
                                                        <h5 className="text-start">General</h5>
                                                    </div>
                                                    <div className="col-md-6 form-group">
                                                        <label className="text-left d-flex" htmlFor='Email'>Title:<span className="requirestar">*</span></label>
                                                        <Field className="form-control" id="" name="generals.title" placeholder="Title" />
                                                        <span className='text-danger d-flex text-left'>{errors && touched.generals && touched.generals.title && errors.generals && errors.generals.title}</span>
                                                    </div>
                                                    <div className="col-md-6 form-group">
                                                        <label className="text-left d-flex" htmlFor='Email'>Font Family :<span className="requirestar">*</span></label>
                                                        <Field className="form-control" id="" name="generals.fontFamily" placeholder="Font" />
                                                        <span className='text-danger d-flex text-left'>{errors && touched.generals && touched.generals.fontFamily && errors.generals && errors.generals.fontFamily}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-lg-12 text-center'>
                                                <div className="row">
                                                    <div className="col-12 mb-2 mt-3">
                                                        <h5 className="text-start">Font Colors</h5>
                                                    </div>
                                                    <div className="col-md-3 form-group">
                                                        <label className="text-left d-flex" htmlFor='font_colors'>Primary Color Black:<span className="requirestar">*</span></label>
                                                        <div className="input-group">
                                                            <Field className="form-control" id="font_colors" name="font_colors.primary_color_black" placeholder="Primary color" />
                                                            <input type="color" className="form-control form-control-color" style={{ maxWidth: "50px" }} onChange={handleChange} value={values.font_colors.primary_color_black} name='font_colors.primary_color_black' title="Choose your color" />
                                                        </div>
                                                        <span className='text-danger d-flex text-left'>{errors && touched.font_colors && touched.font_colors.primary_color_black && errors.font_colors && errors.font_colors.primary_color_black}</span>
                                                    </div>
                                                    <div className="col-md-3 form-group">
                                                        <label className="text-left d-flex" htmlFor='font_colors'>Primary Color White:<span className="requirestar">*</span></label>
                                                        <div className="input-group">
                                                            <Field className="form-control" id="font_colors" name="font_colors.primary_color_white" placeholder="Primary color" />
                                                            <input type="color" className="form-control form-control-color" style={{ maxWidth: "50px" }} onChange={handleChange} value={values.font_colors.primary_color_white} name='font_colors.primary_color_white' title="Choose your color" />
                                                        </div>
                                                        <span className='text-danger d-flex text-left'>{errors && touched.font_colors && touched.font_colors.primary_color_white && errors.font_colors && errors.font_colors.primary_color_white}</span>
                                                    </div>
                                                    <div className="col-md-3 form-group">
                                                        <label className="text-left d-flex" htmlFor='font_colors'>Active Color:<span className="requirestar">*</span></label>
                                                        <div className="input-group">
                                                            <Field className="form-control" id="font_colors" name="font_colors.active_color" placeholder="Primary color" />
                                                            <input type="color" className="form-control form-control-color" style={{ maxWidth: "50px" }} onChange={handleChange} value={values.font_colors.active_color} name='font_colors.active_color' title="Choose your color" />
                                                        </div>
                                                        <span className='text-danger d-flex text-left'>{errors && touched.font_colors && touched.font_colors.active_color && errors.font_colors && errors.font_colors.active_color}</span>
                                                    </div>
                                                    <div className="col-md-3 form-group">
                                                        <label className="text-left d-flex" htmlFor='font_colors'>Paragraph Color:<span className="requirestar">*</span></label>
                                                        <div className="input-group">
                                                            <Field className="form-control" id="font_colors" name="font_colors.paragraph_color" placeholder="Primary color" />
                                                            <input type="color" className="form-control form-control-color" style={{ maxWidth: "50px" }} onChange={handleChange} value={values.font_colors.paragraph_color} name='font_colors.paragraph_color' title="Choose your color" />
                                                        </div>
                                                        <span className='text-danger d-flex text-left'>{errors && touched.font_colors && touched.font_colors.paragraph_color && errors.font_colors && errors.font_colors.paragraph_color}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-lg-12 text-center'>
                                                <div className="row">
                                                    <div className="col-12 mb-2 mt-3">
                                                        <h5 className="text-start">Background Colors</h5>
                                                    </div>
                                                    <div className="col-md-3 form-group">
                                                        <label className="text-left d-flex" htmlFor='background_colors'>Primary Active Color:<span className="requirestar">*</span></label>
                                                        <div className="input-group">
                                                            <Field className="form-control" id="background_colors" name="background_colors.primary_active_color" placeholder="Primary color" />
                                                            <input type="color" className="form-control form-control-color" style={{ maxWidth: "50px" }} onChange={handleChange} value={values.background_colors.primary_active_color} name='background_colors.primary_active_color' title="Choose your color" />
                                                        </div>
                                                        <span className='text-danger d-flex text-left'>{errors && touched.background_colors && touched.background_colors.primary_active_color && errors.background_colors && errors.background_colors.primary_active_color}</span>
                                                    </div>
                                                    <div className="col-md-3 form-group">
                                                        <label className="text-left d-flex" htmlFor='background_colors'>Secondary Active Color:<span className="requirestar">*</span></label>
                                                        <div className="input-group">
                                                            <Field className="form-control" id="background_colors" name="background_colors.secondary_active_color" placeholder="Primary color" />
                                                            <input type="color" className="form-control form-control-color" style={{ maxWidth: "50px" }} onChange={handleChange} value={values.background_colors.secondary_active_color} name='background_colors.secondary_active_color' title="Choose your color" />
                                                        </div>
                                                        <span className='text-danger d-flex text-left'>{errors && touched.background_colors && touched.background_colors.secondary_active_color && errors.background_colors && errors.background_colors.secondary_active_color}</span>
                                                    </div>
                                                    <div className="col-md-3 form-group">
                                                        <label className="text-left d-flex" htmlFor='background_colors'>Header Background Color:<span className="requirestar">*</span></label>
                                                        <div className="input-group">
                                                            <Field className="form-control" id="background_colors" name="background_colors.header_background_color" placeholder="Primary color" />
                                                            <input type="color" className="form-control form-control-color" style={{ maxWidth: "50px" }} onChange={handleChange} value={values.background_colors.header_background_color} name='background_colors.header_background_color' title="Choose your color" />
                                                        </div>
                                                        <span className='text-danger d-flex text-left'>{errors && touched.background_colors && touched.background_colors.header_background_color && errors.background_colors && errors.background_colors.header_background_color}</span>
                                                    </div>
                                                    <div className="col-md-3 form-group">
                                                        <label className="text-left d-flex" htmlFor='background_colors'>Footer Background Color:<span className="requirestar">*</span></label>
                                                        <div className="input-group">
                                                            <Field className="form-control" id="background_colors" name="background_colors.footer_background_color" placeholder="Primary color" />
                                                            <input type="color" className="form-control form-control-color" style={{ maxWidth: "50px" }} onChange={handleChange} value={values.background_colors.footer_background_color} name='background_colors.footer_background_color' title="Choose your color" />
                                                        </div>
                                                        <span className='text-danger d-flex text-left'>{errors && touched.background_colors && touched.background_colors.footer_background_color && errors.background_colors && errors.background_colors.footer_background_color}</span>
                                                    </div>
                                                    <div className="col-md-3 form-group">
                                                        <label className="text-left d-flex" htmlFor='background_colors'>Footer Bottom Background Color:<span className="requirestar">*</span></label>
                                                        <div className="input-group">
                                                            <Field className="form-control" id="background_colors" name="background_colors.footer_bottom_background_color" placeholder="Primary color" />
                                                            <input type="color" className="form-control form-control-color" style={{ maxWidth: "50px" }} onChange={handleChange} value={values.background_colors.footer_bottom_background_color} name='background_colors.footer_bottom_background_color' title="Choose your color" />
                                                        </div>
                                                        <span className='text-danger d-flex text-left'>{errors && touched.background_colors && touched.background_colors.footer_bottom_background_color && errors.background_colors && errors.background_colors.footer_bottom_background_color}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-lg-12 text-center form-group'>
                                                <div className="row">
                                                    <div className="col-12 mb-2 mt-3">
                                                        <h5 className="text-start">Font Sizes</h5>
                                                    </div>
                                                    <div className="col-md-3 form-group">
                                                        <label className="text-left d-flex" htmlFor='Email'>Heading 1:<span className="requirestar">*</span></label>
                                                        <Field className="form-control" id="" name="fontsize.h1" placeholder="Heading 1" />
                                                        <span className='text-danger d-flex text-left'>{errors && touched.fontsize && touched.fontsize.h1 && errors.fontsize && errors.fontsize.h1}</span>
                                                    </div>
                                                    <div className="col-md-3 form-group">
                                                        <label className="text-left d-flex" htmlFor='Email'>Heading 2:<span className="requirestar">*</span></label>
                                                        <Field className="form-control" id="" name="fontsize.h2" placeholder="Heading 2" />
                                                        <span className='text-danger d-flex text-left'>{errors && touched.fontsize && touched.fontsize.h2 && errors.fontsize && errors.fontsize.h2}</span>
                                                    </div>
                                                    <div className="col-md-3 form-group">
                                                        <label className="text-left d-flex" htmlFor='Email'>Heading 3:<span className="requirestar">*</span></label>
                                                        <Field className="form-control" id="" name="fontsize.h3" placeholder="Heading 3" />
                                                        <span className='text-danger d-flex text-left'>{errors && touched.fontsize && touched.fontsize.h3 && errors.fontsize && errors.fontsize.h3}</span>
                                                    </div>
                                                    <div className="col-md-3 form-group">
                                                        <label className="text-left d-flex" htmlFor='Email'>Heading 4:<span className="requirestar">*</span></label>
                                                        <Field className="form-control" id="" name="fontsize.h4" placeholder="Heading 4" />
                                                        <span className='text-danger d-flex text-left'>{errors && touched.fontsize && touched.fontsize.h4 && errors.fontsize && errors.fontsize.h4}</span>
                                                    </div>
                                                    <div className="col-md-3 form-group">
                                                        <label className="text-left d-flex" htmlFor='Email'>Heading 5:<span className="requirestar">*</span></label>
                                                        <Field className="form-control" id="" name="fontsize.h5" placeholder="Heading 5" />
                                                        <span className='text-danger d-flex text-left'>{errors && touched.fontsize && touched.fontsize.h5 && errors.fontsize && errors.fontsize.h5}</span>
                                                    </div>
                                                    <div className="col-md-3 form-group">
                                                        <label className="text-left d-flex" htmlFor='Email'>Heading 6:<span className="requirestar">*</span></label>
                                                        <Field className="form-control" id="" name="fontsize.h6" placeholder="Heading 6" />
                                                        <span className='text-danger d-flex text-left'>{errors && touched.fontsize && touched.fontsize.h6 && errors.fontsize && errors.fontsize.h6}</span>
                                                    </div>
                                                    <div className="col-md-3 form-group">
                                                        <label className="text-left d-flex" htmlFor='Email'>Paragraph:<span className="requirestar">*</span></label>
                                                        <Field className="form-control" id="" name="fontsize.paragraph" placeholder="Paragraph" />
                                                        <span className='text-danger d-flex text-left'>{errors && touched.fontsize && touched.fontsize.paragraph && errors.fontsize && errors.fontsize.paragraph}</span>
                                                    </div>
                                                    <div className="col-md-12 form-group">
                                                        <label className="text-left d-flex" htmlFor='Email'>Custom CSS:</label>
                                                        <textarea className="form-control" id="exampleFormControlTextarea1" rows="5" name='custom_css' value={values.custom_css} onChange={handleChange} onBlur={handleBlur}></textarea>
                                                        {/* <span className='text-danger d-flex text-left'>{errors && touched.fontsize && touched.fontsize.paragraph && errors.fontsize && errors.fontsize.paragraph}</span> */}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-lg-12 text-center'>
                                                <div className="row">
                                                    <div className="col-12 mb-2 mt-3">
                                                        <h5 className="text-start">Logos</h5>
                                                    </div>
                                                    <div className="col-md-4 form-group">
                                                        <label className="text-left d-flex" htmlFor='Email'>Logo Transparent:<span className="requirestar">*</span></label>
                                                        <input className='form-control imgInput' id="logo_transparent" name="logo_transparent" type="file" onChange={(event) => {
                                                            setFieldValue("logo_transparent", event.currentTarget.files[0]);
                                                            if(event.currentTarget.files.length === 1){
                                                                setPreviewImage1(URL.createObjectURL(event.currentTarget.files[0]))
                                                            }
                                                            else{
                                                                setPreviewImage1("")
                                                            }
                                                        }} />
                                                        <span className='text-danger d-flex text-left' id='imagefileerror'>{errors.logo_transparent && touched.logo_transparent && errors.logo_transparent}</span>
                                                        {
                                                            previewimage1 ?
                                                                <div className='mt-4 text-start'>
                                                                    <img src={previewimage1} style={{ height: "100px" }} alt="" />
                                                                </div> : <></>
                                                        }
                                                    </div>
                                                    <div className="col-md-4 form-group">
                                                        <label className="text-left d-flex" htmlFor='Email'>Logo Short:<span className="requirestar">*</span></label>
                                                        <input className='form-control imgInput' id="logo_short" name="logo_short" type="file" onChange={(event) => {
                                                            setFieldValue("logo_short", event.currentTarget.files[0]);
                                                            if(event.currentTarget.files.length === 1){
                                                                setPreviewImage2(URL.createObjectURL(event.currentTarget.files[0]))
                                                            }
                                                            else{
                                                                setPreviewImage2("")
                                                            }
                                                        }} />
                                                        <span className='text-danger d-flex text-left' id='imagefileerror'>{errors.logo_short && errors.logo_short}</span>
                                                        {
                                                            previewimage2 ?
                                                                <div className='mt-4 text-start'>
                                                                    <img src={previewimage2} style={{ height: "100px" }} alt="" />
                                                                </div> : ""
                                                        }
                                                    </div>
                                                    <div className="col-md-4 form-group">
                                                        <label className="text-left d-flex" htmlFor='Email'>Reverse Logo:<span className="requirestar">*</span></label>
                                                        <input className='form-control imgInput' id="reverse_logo" name="reverse_logo" type="file" onChange={(event) => {
                                                            setFieldValue("reverse_logo", event.currentTarget.files[0]);
                                                            if(event.currentTarget.files.length === 1){
                                                                setPreviewImage3(URL.createObjectURL(event.currentTarget.files[0]))
                                                            }
                                                            else{
                                                                setPreviewImage3("")
                                                            }
                                                            }} />
                                                        <span className='text-danger d-flex text-left' id='imagefileerror'>{errors.reverse_logo}</span>
                                                        {/* <span className='text-danger d-flex text-left' id='imagefileerror'>{errors.reverse_logo && touched.reverse_logo && errors.reverse_logo}</span> */}
                                                        {
                                                            previewimage3 ?
                                                                <div className='mt-4 text-start'>
                                                                    <img src={previewimage3} style={{ height: "100px" }} alt="" />
                                                                </div> : <></>
                                                        }
                                                    </div>
                                                    <div className="col-md-4 form-group">
                                                        <label className="text-left d-flex" htmlFor='Email'>Favicon Icon:<span className="requirestar">*</span></label>
                                                        <input className='form-control imgInput' id="favicon_icon" name="favicon_icon" type="file" onChange={(event) => {
                                                            setFieldValue("favicon_icon", event.currentTarget.files[0]);
                                                            if(event.currentTarget.files.length === 1){
                                                                setPreviewImage4(URL.createObjectURL(event.currentTarget.files[0]))
                                                            }
                                                            else{
                                                                setPreviewImage4("")
                                                            }
                                                        }} />
                                                        <span className='text-danger d-flex text-left' id='imagefileerror'>{errors.favicon_icon && touched.favicon_icon && errors.favicon_icon}</span>
                                                        {
                                                            previewimage4 ?
                                                                <div className='mt-4 text-start'>
                                                                    <img src={previewimage4} style={{ height: "100px" }} alt="" />
                                                                </div> : <></>
                                                        }
                                                    </div>
                                                    <div className="col-md-4 form-group">
                                                        <label className="text-left d-flex" htmlFor='Email'>Inner Banner:<span className="requirestar">*</span></label>
                                                        <input className='form-control imgInput' id="inner_banner" name="inner_banner" type="file" onChange={(event) => {
                                                            setFieldValue("inner_banner", event.currentTarget.files[0]);
                                                            if(event.currentTarget.files.length === 1){
                                                                setPreviewImage5(URL.createObjectURL(event.currentTarget.files[0]))
                                                            }
                                                            else{
                                                                setPreviewImage5("")
                                                            }
                                                        }} />
                                                        <span className='text-danger d-flex text-left' id='imagefileerror'>{errors.inner_banner && touched.inner_banner && errors.inner_banner}</span>
                                                        {
                                                            previewimage5 ?
                                                                <div className='mt-4 text-start'>
                                                                    <img src={previewimage5} style={{ height: "100px" }} alt="" />
                                                                </div> : ""
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            {hasPermission('/admin/cms/portal-design/submit') ?
                                            <div className="">
                                                <button className="btn btn-main-primary signbtn mr-2" type="submit" disabled={submitted ? true : null}>
                                                    <i className="ace-icon fa fa-check bigger-110 mx-1"></i>
                                                    Submit
                                                </button>
                                                {/* <button className="btn ripple btn-secondary" type='button' disabled={submitted ? true : null} onClick={() => navigate(-1)}>
                                                    <i className="ace-icon fa fa-times bigger-110 mx-1"></i>
                                                    Cancel
                                                </button> */}
                                            </div>
                                            :null}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                )}
                </Formik>
            </>
        </>
    )
}

export default PortalDesign