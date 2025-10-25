import React, { useEffect, useState } from 'react';
import footerLogo from "./../../../assets/website/images/footer-logo.svg"
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CMSOptions } from '../services/website.services';
import { MENU_LOCATION } from '../../../utils/Constants';
import { useTranslation } from 'react-i18next';
import { getLocalKey } from '../../../utils/commonfunction';

const WebsiteFooter = () => {
  const { t } = useTranslation();
  const [dynamicOptions, setDynamicOptions] = useState([]);
  const [globalData, setGlobalData] = useState({});
  const globalSettings = useSelector((state) => state?.globalData?.data);

  const handelScrollTop = () => {
    document.querySelector("html, body").scrollTop = 0;
  }

  useEffect(() => {
    if (globalSettings) {
      const data = JSON.parse(globalSettings)
      setGlobalData(data);
    }
  }, [globalSettings])

  useEffect(() => {
    CMSOptions(MENU_LOCATION.menu_of_page_footer).then((response) => {
      setDynamicOptions(response?.data);
    }).catch((error) => {
      console.log("error -->", error);
    });
  }, [getLocalKey("system_language")]);

  return (
    <footer>
      <div className="footer-main">
        <div className="container d-flex flex-column row-gap-4 justify-content-center align-items-center">
          <div className="footer-logo">
          <Link aria-label="Go to homepage" to={`/`}><img  alt='Reloaded logo' src={footerLogo} /></Link>    
          </div>
          <div className="footer-menu">
            <Link to={`/about-us`}>{t("header_about_us")}</Link>
            <Link to={`/services`}>{t("header_services")}</Link>
            <Link to={`/faq`}>{t("footer_faq")}</Link>
            <Link to={`/contact-us`}>{t("contact_us")}</Link>
            {/* <Link to={`/inquiry`}>Inquiry</Link> */}
            {
              dynamicOptions
                ?.filter((item) => item?.footer_location === "main")
                ?.map((item, i) => {
                  return (
                    <Link key={i} onClick={handelScrollTop} to={`/org-info/${item?.slug}`}>{item?.title}</Link>
                  )
                })
            }
          </div>
          <div className="footer-social-links">
            {globalData?.social_media_details?.map((socialMedia, idx) => (
              <a key={idx} href={socialMedia?.link} title={socialMedia?.title} target="_blank" rel="noreferrer" dangerouslySetInnerHTML={{ __html: (socialMedia?.icon) }} />
            ))}
            {/* <a href="#"><i className="ri-facebook-fill"></i></a>
            <a href="#"><i className="ri-instagram-fill"></i></a>
            <a href="#"><i className="ri-twitter-fill"></i></a>
            <a href="#"><i className="ri-youtube-fill"></i></a> */}
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <p className="m-0">{globalData?.copy_right_text}</p>
            <div className="footer-bottom-menu">
              {/* <Link to={`/privacy-policy`} >Privacy Policy</Link>
              <Link to={`/terms-conditions`}>Terms & Conditions</Link> */}
              {
              dynamicOptions
                ?.filter((item) => item?.footer_location === "base")
                ?.map((item, i) => {
                  return (
                    <Link key={i} onClick={handelScrollTop} to={`/org-info/${item?.slug}`}>{item?.title}</Link>
                  )
                })
            }
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default WebsiteFooter;
