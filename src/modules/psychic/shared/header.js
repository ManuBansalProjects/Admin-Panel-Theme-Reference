import React, { use, useEffect, useState } from 'react';
import logo from "./../../../assets/website/images/logo.svg"
import languageFlag from "./../../../assets/website/images/language-flag.png"
import { Link } from 'react-router-dom';
import { languageSpoken, ROLE } from '../../../utils/Constants';
import { getLocalKey, logOutWithSwal, setLocalKey } from '../../../utils/commonfunction';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import i18next from 'i18next';

export default function Header() {
  const [flag, setFlag] = useState(getLocalKey("system_language_flag") || languageFlag);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  // const [selectedLanguage, setSelectedLanguage] = useState(languageSpoken[0].name); 
  // const [selectedFlag, setSelectedFlag] = useState(languageSpoken[0].flag); 
  const { t } = useTranslation();
  const psychicDetails = useSelector((state) => state?.psychicData?.data);
  const notificationCount = useSelector((state) => state?.notificationCount?.unread);

  useEffect(() => {
    const savedLanguageCode = localStorage.getItem('system_language') || localStorage.getItem('i18nextLng');

    if (savedLanguageCode) {
      const language = languageSpoken.find(lang => lang.code === savedLanguageCode);
      if (language) {
        setSelectedLanguage(language);
      }
    } else {
      setSelectedLanguage(languageSpoken[0]);
    }
  }, []);

  const handleToggleMenu = () => {
    const navbarCollapse = document.getElementById('navbarSupportedContent');
    const hamburgerBtn = document.querySelector('.navbar-toggler');

    if (navbarCollapse?.classList.contains('show')) {
      navbarCollapse.classList.remove('show');
      hamburgerBtn?.classList.add('collapsed');
      hamburgerBtn?.setAttribute('aria-expanded', 'false');
    } else {
      navbarCollapse?.classList.add('show');
      hamburgerBtn?.classList.remove('collapsed');
      hamburgerBtn?.setAttribute('aria-expanded', 'true');
    }
  };

  // const handleHideMenu = () => {
  //     const navbarCollapse = document.getElementById("navbarSupportedContent");
  //     if (navbarCollapse?.classList.contains("show")) {
  //         navbarCollapse.classList.remove("show");
  //     }
  // };

  useEffect(() => {
     const hamburgerBtn = document.querySelector('.navbar-toggler');
     if( hamburgerBtn ) {
      hamburgerBtn?.classList.add('collapsed');
     }
  }, []);
  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    // setSelectedLanguage(language.name);
    // setSelectedFlag(language.flag);

    i18next.changeLanguage(language?.code);
    setLocalKey("system_language", language?.code);
    setLocalKey("system_language_flag", language?.flag);
    setFlag(language?.flag);
    const evt = new CustomEvent("language_change");
    document.dispatchEvent(evt);
  };

  return (
    <header className='header-inner'>
      <nav className="navbar navbar-expand-lg">
        <div className="container">
          <Link to={`/`} role="link" aria-label="Reloaded Home" className="navbar-brand"><img alt="Reloaded logo" src={logo} /></Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse gap-2 navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-lg-0 gap-3">
              <li className="nav-item">
                <Link to={`/psychic`} onClick={handleToggleMenu} className="nav-link" aria-label={t("link_dashboard")}>{t("link_dashboard")}</Link>
              </li>
              <li className="nav-item">
                <Link 
                  className="bell-icon" 
                  onClick={handleToggleMenu} 
                  to="/psychic/notification"
                  aria-label={t("label_notifications")}
                >
                  <i className="ti ti-bell" aria-hidden="true"></i>
                  {console.log("notification data -->", notificationCount)}
                  <span className='bell-count' aria-live="polite" aria-atomic="true">{notificationCount}</span>
                </Link>
              </li>
              {/* <li className='dropdown'>
                <a className="dropdown-toggle btn btn-secondary nav-link language-btn d-flex align-items-center gap-2" href="#" data-bs-toggle="dropdown" aria-expanded="false">
                  <img src={languageFlag} />
                  <span>English</span>
                </a>
                <ul className="dropdown-menu">
                  {languageSpoken.map((language) => (
                    <li key={language.code}><a className="dropdown-item" href="#">{language.name}</a></li>
                  ))}
                </ul>
              </li> */}
              <li className="dropdown">
                <button
                  className="dropdown-toggle btn btn-secondary nav-link language-btn d-flex align-items-center gap-2"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  aria-haspopup="listbox"
                  aria-label={t("label_select_language")}
                  onKeyDown={(e) => {
                    if (e.code === 'Space') {
                      e.preventDefault();
                      e.target.click();
                    }
                  }}
                >
                  <img src={selectedLanguage?.flag} alt={`${selectedLanguage?.name} flag`} />
                  <span>{selectedLanguage?.name}</span>
                </button>
                <ul className="dropdown-menu" role="listbox">
                  {languageSpoken.map((language) => (
                    <li key={language.code}>
                      <button
                        className="dropdown-item"
                        role="option"
                        aria-selected={selectedLanguage?.code === language.code}
                        onClick={(e) => { e.preventDefault(); handleLanguageChange(language); handleToggleMenu(); }}
                      >
                        <img className='me-3' src={language.flag} alt={`${language.name} flag`} />
                        {language.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
            
            <div className='dropdown'>
              <button className="dropdown-toggle btn btn-primary nav-link d-flex align-items-center gap-2"
                // href="#" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
                type="button"
                aria-haspopup="menu"
                aria-label={t("label_my_profile")}
                onKeyDown={(e) => {
                  if (e.code === 'Space') {
                    e.preventDefault();
                    e.target.click();
                  }
                }}
              >
                <span>{psychicDetails?.name}</span>
              </button>
              <ul className="dropdown-menu" role="menu">
                <li role="none"><Link role="menuitem" onClick={handleToggleMenu} className="dropdown-item" to={`/psychic/profile`}>{t("list_heading_my_profile")}</Link></li>
                <li role="none"><Link role="menuitem" onClick={handleToggleMenu} className="dropdown-item" to={`/psychic/change-password`}>{t("change_password")}</Link></li>
                <li role="none"><button role="menuitem" className="dropdown-item" type="button" onClick={() => logOutWithSwal(ROLE.PSYCHIC)}>{t("label_logout")}</button></li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
