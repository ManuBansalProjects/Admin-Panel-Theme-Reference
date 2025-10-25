import React, { useEffect, useRef, useState } from 'react';
import logo from "./../../../assets/website/images/logo.svg"
import languageFlag from "./../../../assets/website/images/language-flag.png"
import { Link, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CMSOptions } from '../services/website.services';
import { languageSpoken, MENU_LOCATION } from '../../../utils/Constants';
import { getLocalKey, getUser, setLocalKey } from '../../../utils/commonfunction';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

function WebsiteHeader() {
  const [flag, setFlag] = useState(getLocalKey("system_language_flag") || languageFlag);
  const [selectedLanguage, setSelectedLanguage] = useState(null);  
  const { t } = useTranslation();
  const [globalData, setGlobalData] = useState({});
  const [dynamicOptions, setDynamicOptions] = useState([]);
  const globalSettings = useSelector((state) => state?.globalData?.state);
  const [isPsychicLoggedIn, setIsPsychicLoggedIn] = useState(null);
  const hamburgerBtn = useRef(null);

  useEffect(() => {
    if (globalSettings) {
      const data = JSON.parse(globalSettings)
      setGlobalData(data);
    }
  }, [globalSettings]);

  useEffect(() => {
    CMSOptions(MENU_LOCATION.menu_of_page_header).then((response) => {
      setDynamicOptions(response?.data);
    }).catch((error) => {
      console.log("error -->", error);
    });
  }, [getLocalKey("i18nextLng")]);

  useEffect(() => {
    const user = getUser("psychic");
    if (user.token) {
      setIsPsychicLoggedIn(true);
    }else{
      setIsPsychicLoggedIn(false);
    }
  }, []);
  
  useEffect(() => {
      const savedLanguageCode = localStorage.getItem('i18nextLng');
      console.log("hi---", savedLanguageCode)
      
      if (savedLanguageCode) {
        const language = languageSpoken.find(lang => lang.code === savedLanguageCode);
        if (language) {
          setSelectedLanguage(language);
        }
      } else {
        setSelectedLanguage(languageSpoken[0]); 
      }
    }, []);

     // const handleHideMenu = () => {
    //   const navbarCollapse = document.getElementById('navbarSupportedContent');
    //   if (navbarCollapse?.classList.contains('show')) {
    //     navbarCollapse.classList.remove('show');
    //   }
    // };
    const handleToggleMenu = () => {
        const navbarCollapse = document.getElementById("navbarSupportedContent");
        const hamburgerBtn = document.querySelector(".navbar-toggler");

        if (navbarCollapse?.classList.contains("show")) {
            navbarCollapse.classList.remove("show");
            hamburgerBtn?.classList.add("collapsed");
            hamburgerBtn?.setAttribute("aria-expanded", "false");
        } else {
            navbarCollapse?.classList.add("show");
            hamburgerBtn?.classList.remove("collapsed");
            hamburgerBtn?.setAttribute("aria-expanded", "true");
        }
    };

   const handleLanguageChange = (language) => {
      setSelectedLanguage(language);
      i18next.changeLanguage(language?.code);
      setLocalKey("system_language", language?.code);
      setLocalKey("system_language_flag", language?.flag);
      setFlag(language?.flag);
      const evt = new CustomEvent("language_change");
      document.dispatchEvent(evt);
      // if (hamburgerBtn.current) {
      //   console.log("hamburgerBtn.current-->", hamburgerBtn.current, language);
      //   hamburgerBtn.current.click(); // Close the hamburger menu after language change
      // }
      // const navbarCollapse = document.getElementById('navbarSupportedContent');
      // if (navbarCollapse?.classList.contains('show')) {
      //   navbarCollapse.classList.remove('show');
      // }
      handleToggleMenu(); // Close the menu after changing language
    };


  return (
    <header>
      <nav className="navbar navbar-expand-lg">
        <div className="container">
          <Link to={`/`} aria-label="Go to homepage" className="navbar-brand"><img alt="Reloaded logo" src={logo} /></Link>
          <button ref={hamburgerBtn} className="navbar-toggler collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse gap-4 navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-lg-0">
              <li className="nav-item">
                <NavLink to={`/`} onClick={handleToggleMenu} className="nav-link">{t('header_home')}</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to={`/about-us`} onClick={handleToggleMenu} className="nav-link">{t("header_about_us")}</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to={`/services`} onClick={handleToggleMenu} className="nav-link">{t("header_services")}</NavLink>
              </li>
              <li className="nav-item">
                <a className="nav-link download-app-btn" href="#">{t("header_download_app")}</a>
              </li>
              {dynamicOptions?.map((option, idx) => (
                <li key={idx} className="nav-item">
                  <NavLink to={`/org-info/${option?.slug}`} onClick={handleToggleMenu} className="nav-link">{option?.title}</NavLink>
                </li>
              ))}
            </ul>

                      <div className='header-right-btn d-flex align-items-center gap-2'>
          { !isPsychicLoggedIn && <Link to={`/inquiry`} className="btn btn-primary">{t("header_become_a_advisor")} </Link>}
            {isPsychicLoggedIn ? (
              <Link to={`/psychic`} className="btn btn-secondary" onClick={handleToggleMenu}>{t("link_dashboard")}</Link>
            ) : (
              <Link to={`/psychic/login`} className="btn btn-secondary" onClick={handleToggleMenu}>{t("header_login")}</Link>
            )}
            {/* <Link to={`/psychic/login`} className="btn btn-primary">{t("header_login")} </Link> */}
          <div className="dropdown">
                <a
                  className="dropdown-toggle btn btn-secondary nav-link language-btn d-flex align-items-center gap-2"
                  href="#"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  onKeyDown={(e) => {
                    if (e.code === 'Space') {
                      e.preventDefault();
                      e.target.click();
                    }
                  }}
                >
                  <img src={selectedLanguage?.flag} alt={`${selectedLanguage?.name} flag`} />
                  <span>{selectedLanguage?.code.toUpperCase()}</span>
                </a>
                <ul className="dropdown-menu">
                  {languageSpoken.map((language) => (
                    <li key={language.code}>
                      <a
                        className="dropdown-item"
                        href="#"
                        onClick={(e) => { e.preventDefault(); handleLanguageChange(language) }}
                      >
                        <img className='me-3' src={language.flag} alt={`${language.name} flag`} />
                        {language.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
          </div>
            
          </div>

        </div>
      </nav>
    </header>
  )
}

export default WebsiteHeader;
