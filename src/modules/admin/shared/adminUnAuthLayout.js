import React, { useLayoutEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { setGlobalLoader } from "../../../redux/slices/globalLoader";
import { useDispatch, useSelector } from "react-redux";
import GlobalLoader from "./globalLoader";
import UnAuthHeader from './unAuthHeader'
import { setTitle } from "../../../utils/commonfunction";

const AdminUnAuthLayout = () => {
    const dispatch = useDispatch();
    const loaderState = useSelector((state) => state.globalLoader);
    const navigate = useNavigate();
    window.navigate_ = navigate;


    useLayoutEffect(() => {
        // dispatch(setUserType("restaurant"));
        Promise.all([
            import("rsuite/dist/rsuite.min.css"),
            import("bootstrap/dist/css/bootstrap.min.css"),
            import("../../../assets/admin/css/skins.css"),
            import("../../../assets/admin/css/icon-list.css"),
            import("../../../assets/admin/plugins/select2/css/select2.min.css"),
            import("../../../assets/admin/css/style.css"),
            import("../../../assets/admin/css/dark-style.css"),
            import("../../../assets/admin/css/colors/default.css"),
            import(
                "../../../assets/admin/plugins/multipleselect/multiple-select.css"
            ),
            import("../../../assets/admin/css/sidemenu/sidemenu.css"),
            import("../../../assets/admin/plugins/summernote/summernote-bs4.css"),
            import("../../../assets/admin/plugins/fileuploads/css/fileupload.css"),
            import("../../../assets/admin/plugins/fancyuploder/fancy_fileupload.css"),
        ]).then(() => {
            dispatch(setGlobalLoader(false));
            setTitle("Reloaded Astrology"); 
        });
    }, []);

    return (
        <>
            {loaderState ? (
                <GlobalLoader />
            ) : (
                <div className="page">
                    {/* <UnAuthHeader /> */}
                    <Outlet />
                </div>
            )}
        </>
    );
};
export default AdminUnAuthLayout;
