import { useLocation } from "react-router-dom";
import $ from "jquery";
import { Link } from "react-router-dom";
// import { hasPermission } from "../../../utils/commonfunction";
import logo from "../../../../src/assets/admin/img/logos/logo-light@1x.png";
import { useTranslation } from "react-i18next";

const SideBar = () => {
  const loc = useLocation();
  const { t } = useTranslation();

  const toggleDropdown = (e) => {
    e.preventDefault();
    const dropDown = e.target.parentElement;
    if (dropDown.classList.contains("show")) {
      dropDown.classList.remove("show");
    } else {
      dropDown.classList.add("show");
    }
  };

  const hoverSidebar = (e) => {
    if ($("body").hasClass("main-sidebar-hide")) {
      $("body").addClass("main-sidebar-open");
    } else {
      $("body").removeClass("main-sidebar-open");
    }
  };

  const removeHoverSidebar = (e) => {
    $("body").removeClass("main-sidebar-open");
  };

  return (
    <div
      className="main-sidebar main-sidebar-sticky side-menu ps ps--active-y"
      id="app_sidebar"
      onMouseEnter={hoverSidebar}
      onMouseLeave={removeHoverSidebar}
    >
      <div className="sidemenu-logo">
        <a className="main-logo" href="/admin/dashboard">
          <img
            src={logo}
            className="header-brand-img icon-logo admin-logo"
            alt="logo"
            style={{ height: "1.6rem" }}
            id="logo_short"
          />
          <img
            src={logo}
            className="header-brand-img desktop-logo admin-logo rounded"
            style={{ height: "2.3rem" }}
            alt="logo"
            id="logo_full"
          />
        </a>
      </div>
      {/* Dashboard section start */}
      <div className="main-sidebar-body">
        <ul className="nav">

          {/* Dashboard section start */}
          <li
            className={
              "nav-item" +
              (loc.pathname === "/admin/dashboard" ? " active" : "")
            }
          >
            <Link className="nav-link" to="/admin/dashboard">
              <span className="shape1"></span>
              <span className="shape2"></span>
              <i className="fa fa-home sidemenu-icon"></i>
              <span className="sidemenu-label">
                {t("sidebar_link_dashboard")}
              </span>
            </Link>
          </li>
          {/* Dashboard section end */}

          {/* User section start */}
          <li className={
            `nav-item ` +
            (loc.pathname.includes("/admin/user-management")
              ? "show active"
              : "")
          } >
            <Link className="nav-link" to="/admin/user-management/user/list/1">
              <span className="shape1"></span>
              <span className="shape2"></span>
              <i className="fa fa-user-tie sidemenu-icon"></i>
              <span className="sidemenu-label">
                {t("Users")}
              </span>
            </Link>
          </li>
          {/* user section end */}

          {/* Cms section starts */}
          <li
            className={
              `nav-item ` +
              (loc.pathname.includes("/cms") ? "show active" : "")
            }
          >
            <a
              className="nav-link with-sub submenu"
              onClick={toggleDropdown}
              href={"/"}
            >
              <span className="shape1"></span>
              <span className="shape2"></span>
              <i className="fa fa-edit sidemenu-icon"></i>
              <span className="sidemenu-label">{t("sidebar_link_cms")}</span>
              <i className="angle fe fe-chevron-right"></i>
            </a>
            <ul className="nav-sub">

              <li
                className={`nav-sub-item ${loc.pathname.includes("/cms/pages") ? " active" : ""
                  }`}
              >
                <Link
                  className="nav-sub-link"
                  to={`/admin/cms/pages/list/${1}`}
                >
                  {t("sidebar_link_pages")}
                </Link>
              </li>
              
              {/* <li
                className={`nav-sub-item ${loc.pathname.includes("/cms/question") ? " active" : ""
                  }`}
              >
                <Link
                  className="nav-sub-link"
                  to={`/admin/cms/question/list/${1}`}
                >
                  {t("Questions")}
                </Link>
              </li> */}

              <li
                className={`nav-sub-item ${loc.pathname.includes("/cms/faq") ? " active" : ""
                  }`}
              >
                <Link
                  className="nav-sub-link"
                  to={`/admin/cms/faq/list/${1}`}
                >
                  FAQ
                </Link>
              </li>

              {/* <li
                className={`nav-sub-item ${loc.pathname.includes("/cms/services") ? " active" : ""
                  }`}
              >
                <Link
                  className="nav-sub-link"
                  to={`cms/services/list/1`}
                >
                  Services
                </Link>
              </li> */}

              <li
                className={
                  "nav-sub-item" +
                  (loc.pathname.includes("/cms/default-email-template")
                    ? " active"
                    : "")
                }
              >
                <Link
                  className="nav-sub-link"
                  to={`/admin/cms/default-email-template/list/${1}`}
                >
                  {t("sidebar_link_email_template")}
                </Link>
              </li>

              <li
                className={
                  "nav-sub-item" +
                  (loc.pathname.includes("/cms/promotions")
                    ? " active"
                    : "")
                }
              >
                <Link
                  className="nav-sub-link"
                  to={`/admin/cms/promotions/list/${1}`}
                >
                  Promotions
                </Link>
              </li>

               <li
                className={
                  "nav-sub-item" +
                  (loc.pathname.includes("/cms/blogs")
                    ? " active"
                    : "")
                }
              >
                <Link
                  className="nav-sub-link"
                  to={`/admin/cms/blogs/list/${1}`}
                >
                  Blogs
                </Link>
              </li>

              <li
                className={
                  "nav-sub-item" +
                  (loc.pathname.includes("/cms/testimonials")
                    ? " active"
                    : "")
                }
              >
                <Link
                  className="nav-sub-link"
                  to={`/admin/cms/testimonials/list/${1}`}
                >
                  Testimonials
                </Link>
              </li>  
              {/* <li
                className={
                  "nav-sub-item" +
                  (loc.pathname.includes("/cms/web-home") ? " active" : "")
                }
              >
                <Link className="nav-sub-link" to={`/admin/cms/web-home`}>
                  {t("Website Home")}
                </Link>
              </li> */}

              {/* <li
                className={
                  "nav-sub-item" +
                  (loc.pathname.includes("/cms/about-us") ? " active" : "")
                }
              >
                <Link className="nav-sub-link" to={`/admin/cms/about-us`}>
                  {t("About Us")}
                </Link>
              </li> */}

            </ul>
          </li>
          {/* Cms section end */}

          {/* subscription section start */}
          <li
            className={
              `nav-item ` +
              (loc.pathname.includes("/admin/subscription") ? "show active" : "")
            }
          >
            <a
              className="nav-link with-sub submenu"
              onClick={toggleDropdown}
              href={"/"}
            >
              <span className="shape1"></span>
              <span className="shape2"></span>
              <i className="fa fa-credit-card sidemenu-icon"></i>
              <span className="sidemenu-label">{t("sidebar_link_subscription")}</span>
              <i className="angle fe fe-chevron-right"></i>
            </a>
            <ul className="nav-sub">
             
              <li
                className={`nav-sub-item ${loc.pathname.includes("/subscription/subscription-plan") ? " active" : ""
                  }`}
              >
                <Link
                  className="nav-sub-link"
                  to={`subscription/subscription-plan/list/1`}
                >
                  Subscription Plan
                </Link>
              </li>

              <li
                className={`nav-sub-item ${loc.pathname.includes("/subscription/history") ? " active" : ""
                  }`}
              >
                <Link
                  className="nav-sub-link"
                  to={`subscription/history/list/1`}
                >
                  Subscription History
                </Link>
              </li>

              <li
                className={`nav-sub-item ${loc.pathname.includes("/subscription/transaction") ? " active" : ""
                  }`}
              >
                <Link
                  className="nav-sub-link"
                  to={`subscription/transaction/list/1`}
                >
                  Transaction
                </Link>
              </li>

            </ul>
          </li>
          {/* subscription section end */}


          {/* Coupon */}
           <li
            className={
              `nav-item ` +
              (loc.pathname.includes("/coupon")
                ? "show active"
                : "")
            }
          >
            <Link
              className="nav-link"
              to={`/admin/coupon/list/${1}`}
            >
              <span className="shape1"></span>
              <span className="shape2"></span>
              <i className="fas fa-address-card sidemenu-icon"></i>
              <span className="sidemenu-label">
                Coupons
              </span>
            </Link>
          </li> 

          {/* Referrals */}
          <li
            className={
              `nav-item ` +
              (loc.pathname.includes("/admin/referrals") ? "show active" : "")
            }
          >
            <a
              className="nav-link with-sub submenu"
              onClick={toggleDropdown}
              href={"/"}
            >
              <span className="shape1"></span>
              <span className="shape2"></span>
              <i className="fa fa-credit-card sidemenu-icon"></i>
              <span className="sidemenu-label">Referrals</span>
              <i className="angle fe fe-chevron-right"></i>
            </a>

            <ul className="nav-sub">
              <li
                className={`nav-sub-item ${loc.pathname.includes("/referrals/settings") ? " active" : ""
                  }`}
              >
                <Link
                  className="nav-sub-link"
                  to={`referrals/settings`}
                >
                  Settings
                </Link>
              </li>

              <li
                className={`nav-sub-item ${loc.pathname.includes("/referrals/history") ? " active" : ""
                  }`}
              >
                <Link
                  className="nav-sub-link"
                  to={`referrals/history/list/1`}
                >
                   History
                </Link>
              </li>

            </ul>
          </li>

          {/* Global setings start */}
          <li className={
            `nav-item ` +
            (loc.pathname.includes("/admin/global-settings")
              ? "show active"
              : "")
          } >
            <Link className="nav-link" to="/admin/global-settings">
              <span className="shape1"></span>
              <span className="shape2"></span>
              <i className="fa fa-user-tie sidemenu-icon"></i>
              <span className="sidemenu-label">
                Global Settings
              </span>
            </Link>
          </li>
          {/* Global settings end */}

          {/* dummy astroGPT START*/}
          {/* <li className={
            `nav-item ` +
            (loc.pathname.includes("/admin/astrogpt")
              ? "show active"
              : "")
          } >
            <Link className="nav-link" to="/admin/astrogpt">
              <span className="shape1"></span>
              <span className="shape2"></span>
              <i className="fa fa-user-tie sidemenu-icon"></i>
              <span className="sidemenu-label">
                AstroGPT Testing
              </span>
            </Link>
          </li> */}
          {/* dummy astroGPT END */}

          {/* Personalization categories Start*/}
          {/* <li className={
            `nav-item ` +
            (loc.pathname.includes("/admin/personalization-categories")
              ? "show active"
              : "")
          } >
            <Link className="nav-link" to="/admin/personalization-categories/list/1">
              <span className="shape1"></span>
              <span className="shape2"></span>
              <i className="fa fa-user-tie sidemenu-icon"></i>
              <span className="sidemenu-label">
                Personalization Feeds
              </span>
            </Link>
          </li> */}
          {/* Personalization categories Start*/}

        </ul>
      </div>
    </div>
  );
};

export default SideBar;
