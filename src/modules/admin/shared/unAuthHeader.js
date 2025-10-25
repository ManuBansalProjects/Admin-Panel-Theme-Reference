import React from "react";
import {
  setLocalKey,
} from "../../../utils/commonfunction";
import { useTranslation } from "react-i18next";

const UnAuthHeader = ({ updateHeader }) => {
  let { i18n } = useTranslation();
  const selected_language = localStorage.getItem("system_language") ? localStorage.getItem("system_language") : "en"

  let languageCode = {
    en: "EN",
    // ja: "日本語"
    ja: 'JA'
  }
  // console.log(languageCode[selected_language])


  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng); /* Change the language using i18next */
    setLocalKey("system_language", lng);
    // window.location.reload();
  };


  return (
    <>
      {/* <!-- Main Header--> */}
      <div className="d-flex justify-content-end">
        <div className="align-items-left">
          <div className="btn-group mobile-btn-group lang-box my-2 mx-4">
            <a
              className="nav-icon-button"
              data-bs-toggle="dropdown"
              id="dropdownLangButton"
              style={{color: "#6259ca"}}
              aria-expanded="false"
              href="/"
              onClick={(e) => e.preventDefault()}
            >
              <i className="fa fa-globe" style={{fontSize: "1rem"}} ></i>
              <span style={{fontSize: "1rem"}}>{" " + languageCode[selected_language]}</span>
            </a>
            <ul
              className="dropdown-menu right"
              aria-labelledby="dropdownLangButton"
            >
              <li>
                <button
                  onClick={() => {
                    changeLanguage("en")
                  }}
                  className="dropdown-item"
                >
                  English
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    changeLanguage("ja")
                  }
                  }
                  className="dropdown-item"
                >
                  Japanees
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* <!-- End Main Header--> */}
    </>
  );
};

export default UnAuthHeader;
