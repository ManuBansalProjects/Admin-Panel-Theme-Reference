import React, { useEffect } from 'react'
import { setGlobalLoader } from '../../../redux/slices/globalLoader';
import { useDispatch, useSelector } from 'react-redux';
import GlobalLoader from '../shared/globalLoader';

const Error404 = () => {
    const dispatch = useDispatch();
    const loaderState = useSelector((state) => state.globalLoader);

    useEffect(() => {
        Promise.all([import('rsuite/dist/rsuite.min.css'),
        import('bootstrap/dist/css/bootstrap.min.css'),
        import("../../../assets/admin/css/skins.css"),
        import("../../../assets/admin/css/icon-list.css"),
        import("../../../assets/admin/plugins/select2/css/select2.min.css"),
        import("../../../assets/admin/css/style.css"),
        import("../../../assets/admin/css/dark-style.css"),
        import("../../../assets/admin/css/colors/default.css"),
        import("../../../assets/admin/plugins/multipleselect/multiple-select.css"),
        import("../../../assets/admin/css/sidemenu/sidemenu.css"),
        import("../../../assets/admin/plugins/summernote/summernote-bs4.css"),
        import("../../../assets/admin/plugins/fileuploads/css/fileupload.css"),
        import("../../../assets/admin/plugins/fancyuploder/fancy_fileupload.css")]).then(() => {
            dispatch(setGlobalLoader(false));
        });
    }, []);


    return (
        loaderState ?
            <GlobalLoader /> :
            <div className="page main-signin-wrapper bg-primary construction">

                <div className="container ">
                    <div className="construction1 text-center details text-white">
                        <div className="row align-items-center">
                            <div className="col-lg-12">
                                <h1 className="tx-140 mb-0">404</h1>
                            </div>
                            <div className="col-lg-12 ">
                                <h1>Oops.The Page you are looking  for doesn't  exit..</h1>
                                <h6 className="tx-15 mt-3 mb-4 text-white-50">You may have mistyped the address or the page may have moved. Try searching below.</h6>
                                <a className="btn ripple btn-success text-center" href="/admin/dashboard">Back to Home</a>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
    )
}

export default Error404