import React, { useEffect, useState } from "react";
import $ from "jquery";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import {
  getLocalKey,
  getUser,
  logOutUser,
  setLocalKey,
} from "../../../utils/commonfunction";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { ROLE } from "../../../utils/Constants";

const Header = ({ updateHeader }) => {
  const [profile, setProfile] = useState("");
  const showprofile = useSelector((state) => state.profile);
  const [username, setUserName] = useState("");
  let { i18n, t } = useTranslation();
  const selected_language = localStorage.getItem("system_language") ? localStorage.getItem("system_language") : "en"
  let languageCode = {
    en: "EN",
    // ja: "日本語"
    ja: 'JA'
  }
  // console.log(languageCode[selected_language])

  useEffect(() => {
    const getuser = getUser(ROLE.SUPER_ADMIN);
    const trimmedName = (getuser?.name)?.slice(0, 25);
    setUserName(trimmedName);
    // setUserName(getuser.name);
    setProfile(
      showprofile && showprofile.file
        ? URL.createObjectURL(showprofile.file)
        : getuser.profile_image
    );
  }, [showprofile]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng); /* Change the language using i18next */
    setLocalKey("system_language", lng);
    
  };

  // useEffect(() => {
  //   const getuser = getUser();
  //   setUserName(getuser.name);
  //   setProfile(
  //     showprofile && showprofile.file
  //       ? URL.createObjectURL(showprofile.file)
  //       : getuser.profile_image
  //   );
  // }, [showprofile]);

  useEffect(() => {
    $(document).ready(function () {
      $(".showpop").click(function () {
        $(".main-profile-menu").addClass("show");
      });
      $(".fixed_bg").click(function () {
        $(".main-profile-menu").removeClass("show");
      });
    });
  }, []);

  const toggleSidebar = (e) => {
    e.preventDefault();
    if ($("body").hasClass("main-sidebar-hide")) {
      $("body").removeClass("main-sidebar-hide"); console.log(languageCode.seleccted_language)
    } else {
      $("body").addClass("main-sidebar-hide");
    }
  };

  const logout = () => {
    Swal.fire({
      customClass: "swal-wide",
      title: t("msg_are_you_sure"),
      text: t("text_you_want_to_logout"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#403fad",
      cancelButtonColor: "#f1388b",
      confirmButtonText: t("btn_yes"),
      cancelButtonText: t("btn_cancel")
    }).then((result) => {
      if (result.isConfirmed) {
        logOutUser(ROLE.SUPER_ADMIN);
      }
    });
  };
  function getRoleName() {
    let roleName = null;
    const userData = getLocalKey(ROLE.SUPER_ADMIN) ? JSON.parse(getLocalKey(ROLE.SUPER_ADMIN)) : {};
    let role = userData.role;
    switch (role) {
      case ROLE.SUPER_ADMIN:
        roleName = t("role_super_admin");
        break;
      case ROLE.RESTAURANT:
        roleName = t("sidebar_link_restaurant");
        break;
      case ROLE.STAFF:
        roleName = "role_staff";
        break;
      default:
        roleName = "role_unknown";
    }
    return roleName;
  }

  return (
    <>
      {/* <!-- Main Header--> */}
      <div className="main-header side-header">
        <div className="container-fluid">
          <div className="main-header-left">
            <a
              className="main-header-menu-icon e_none"
              href="/"
              id="mainSidebarToggle"
              onClick={toggleSidebar}
            >
              <span></span>
            </a>
          </div>
          <div className="main-header-center">
            <div className="responsive-logo">
              {/* <a href="index.html"><img src={logo} className="mobile-logo" alt="logo" /></a> */}
              {/* <a href="index.html"><img src="../assets/img/brand/Mask Group 1.png" className="mobile-logo" alt="logo" /></a>
							<a href="index.html"><img src="../assets/img/brand/Mask Group 1.png" className="mobile-logo-dark" alt="logo" /></a> */}
            </div>
          </div>
          <div className="main-header-right">
            {/* <div className="align-items-left">
              <div className="btn-group mobile-btn-group lang-box my-2 mx-4">
                <a
                  className="nav-icon-button"
                  data-bs-toggle="dropdown"
                  id="dropdownLangButton"
                  aria-expanded="false"
                  href="/"
                  style={{color: "#6259ca"}}
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
            </div> */}

            <div
              className={`dropdown main-profile-menu d-flex align-items-center`}
            >
              {/* <a className="d-flex" href="javascript:void(0)">
								<span className="main-img-user" onClick={() => setShowProfile(!showprofile)}><img alt="avatar" src="../assets/img/brand/Mask Group 1@2x.png"/></span>
							</a> */}
              <button className="d-flex border-0 bg-white showpop">
                {/* <span className="main-img-user">
                  <FaUserCog size={30} />
                </span> */}
                <span className="main-img-user">
                  <img alt="avatar" src={profile} />
                </span>
              </button>
              <div className="dropdown-menu">
                <span className="fixed_bg"></span>  
                <div
                  className="position-relative headerdropdown"
                  style={{ zIndex: "99999" }}
                >
                  <div className="header-navheading">
                    <h4 className="main-notification-title text-capitalize">
                      {username}
                    </h4>
                    <p className="main-notification-text">{getRoleName()}</p>
                  </div>
                
                  <Link
                    className="dropdown-item fixed_bg"
                    to={`/admin/profile/edit/${"1"}`}
                  >
                   
                   <i className="fe fe-edit"></i> {t("btn_edit")} {t("label_profile")}
                  </Link>
                  
                       



                  <button className="dropdown-item fixed_bg"  onClick={() => {logout()}}>
                    <i className="fe fe-power"></i> {t("label_logout")}
                  </button> 
                </div>
               
              </div>
            </div>

            <button
              className="navbar-toggler navresponsive-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarSupportedContent-4"
              aria-controls="navbarSupportedContent-4"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <i className="fe fe-more-vertical header-icons navbar-toggler-icon"></i>
            </button>
            {/* <!-- Navresponsive closed --> */}
          </div>
        </div>
      </div>
      {/* <!-- End Main Header--> */}
    </>
  );
};

export default Header;
