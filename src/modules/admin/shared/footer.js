import React from "react";
import { useSelector } from "react-redux";

const Footer = () => {
  const globalSettings = useSelector((state)=>state?.globalData?.data);

  return (
    <div className="main-footer text-center">
      <div className="container">
        <div className="row row-sm">
          <div className="col-md-12">
            <span>
              {globalSettings?.copy_right_text}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
