import React, { useEffect, useLayoutEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setGlobalLoader } from "../../../redux/slices/globalLoader";
import { setTitle } from "../../../utils/commonfunction";

function PsychicAuthLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  window.navigate_ = navigate;

  useLayoutEffect(() => {
    Promise.all([
      import("../../../assets/website/css/style.css"),
      import("../../../assets/website/css/components.css"),
      import("../../../assets/website/css/responsive.css")
    ]).then(() => {
      dispatch(setGlobalLoader(false));
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setTitle("Reloaded Astrology");
        
        setTimeout(() => {
          dispatch(setGlobalLoader(false));
        }, 100);
      } catch (error) {
        console.error("Error fetching psychic details:", error);
        dispatch(setGlobalLoader(false));
      }
    };
  
    fetchData();
  }, [dispatch]);

  return (
    <div>
      <div className="inner-wraper">
        <Outlet />
      </div>
    </div>
  );
}

export default PsychicAuthLayout;
