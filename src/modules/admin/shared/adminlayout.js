import React, { useLayoutEffect, useMemo} from "react";
import Header from "./header";
import Footer from "./footer";
import SideBar from "./sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { setGlobalLoader } from "../../../redux/slices/globalLoader";
import { useDispatch, useSelector } from "react-redux";
import GlobalLoader from "./globalLoader";
import { setUserType } from "../../../redux/slices/userType";
import { addData } from "../../../redux/slices/globalDetails";
import * as globalSettings from "../services/globalsetting.services"
import { setTitle } from "../../../utils/commonfunction";

const AdminLayout = () => {
  const dispatch = useDispatch();
  const loaderState = useSelector((state) => state.globalLoader);
  const navigate = useNavigate();
  window.navigate_ = navigate;

  useMemo(()=> {
    globalSettings.Details().then((data)=> {
      dispatch(addData(data && data.data? data.data : null));
      setTitle(data?.data?.title ? data.data.title : "Reloaded Astrology");
    }).catch((error)=> {
      console.log("error--->", error)
    })
  },[])

  useLayoutEffect(() => {
    dispatch(setUserType("admin"));
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
    });
  }, []);

  return (
    <>
      {loaderState ? (
        <GlobalLoader />
      ) : (
        <div className="page">
          <SideBar />
          <Header />
          <div className="main-content side-content">
            <div className="container-fluid">
              <div className="inner-body">
                <Outlet />
              </div>
            </div>
          </div>
          <a href="#top" id="back-to-top">
            <i className="fe fe-arrow-up"></i>
          </a>
          <Footer />
        </div>
      )}
    </>
  );
};
export default AdminLayout;
