import React, { useEffect, useLayoutEffect, useMemo } from "react";
import WebsiteHeader from "./header";
import WebsiteFooter from "./footer";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setGlobalLoader } from "../../../redux/slices/globalLoader";
import { addData } from "../../../redux/slices/globalDetails";
import { GlobalSettingsDetails } from "../services/website.services";
import { setTitle } from "../../../utils/commonfunction";
import { useTranslation } from "react-i18next";

function WebsiteLayout() {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  window.navigate_ = navigate;
  const params = useParams();
  const loc = useLocation();

  useLayoutEffect(() => {
    Promise.all([
      import("../../../assets/website/css/style.css"),
      import("../../../assets/website/css/components.css"),
      import("../../../assets/website/css/responsive.css")
    ]).then(() => {
      dispatch(setGlobalLoader(false));
    });
  }, []);

  useMemo(() => {
    GlobalSettingsDetails().then(async (globalDetails) => {
      dispatch(addData(JSON.stringify(globalDetails?.data)));
      setTitle(globalDetails?.title ? globalDetails?.title : "Reloaded Astrology")
      setTimeout(() => {
        dispatch(setGlobalLoader(false));
      }, 100);
    });
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    setTimeout(() => {
      if (hash) {
        const elem = document.querySelector(hash);
        if (elem) {
          const scroll = elem.offsetTop;
          if (scroll) {
            document.querySelector("html, body").scrollTop = scroll;
          }
        }
      } else {
        document.querySelector("html, body").scrollTop = 0;
      }
    }, 50);
  }, [loc, params?.slug]);

  return (
    <div>
       {/* Skip Link */}
        <a href="#website-main-section" className="skip-link">
            {t("skip_to_main_content")}
        </a>
      <WebsiteHeader />
      <div className="inner-wraper">
        <Outlet />
      </div>
      <WebsiteFooter />
    </div>
  );
}

export default WebsiteLayout;
