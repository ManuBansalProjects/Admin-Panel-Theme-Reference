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

          {/* Psychic section start */}
          {/* <li className={
            `nav-item ` +
            (loc.pathname.includes("/admin/psychic-management")
              ? "show active"
              : "")
          } >
            <Link className="nav-link" to="/admin/psychic-management/psychic/list/1">
              <span className="shape1"></span>
              <span className="shape2"></span>
              <i className="fas fa-user-astronaut sidemenu-icon"></i>
              <span className="sidemenu-label">
                {t("sidebar_link_psychic")}
              </span>
            </Link>
          </li> */}
          {/* Psychic section end */}

          {/* Transaction section start */}
          {/* <li className={
            `nav-item ` +
            (loc.pathname.includes("/admin/transaction")
              ? "show active"
              : "")
          } >
            <Link className="nav-link" to="/admin/transaction/list/1">
              <span className="shape1"></span>
              <span className="shape2"></span>
              <i className="fas fa-exchange-alt sidemenu-icon"></i>
              <span className="sidemenu-label">
                {t("Transaction")}
              </span>
            </Link>
          </li> */}

          {/* <li
            className={
              `nav-item ` +
              (loc.pathname.includes("/payable-transaction") || loc.pathname.includes("/payout-transaction")
                ? "show active"
                : "")
            }
          >
            <a
              className="nav-link with-sub submenu"
              onClick={toggleDropdown}
              href={"/"}
            >
              <span className="shape1"></span>
              <span className="shape2"></span>
              <i className="fa fa-money-bill-wave sidemenu-icon"></i>
              <span className="sidemenu-label">{t("Transaction")}</span>
              <i className="angle fe fe-chevron-right"></i>
            </a>
            <ul className="nav-sub">
              <li
                className={`nav-sub-item ${loc.pathname.includes("/payable-transaction") ? "active" : ""
                  }`}
              >
                <Link
                  className="nav-sub-link"
                  to={`/admin/payable-transaction/list/1`}
                >
                  Payable transaction
                </Link>
              </li>
              <li
                className={`nav-sub-item ${loc.pathname.includes("/payout-transaction") ? "active" : ""
                  }`}
              >
                <Link
                  className="nav-sub-link"
                  to={`/admin/payout-transaction/list/1`}
                >
                  Payout Transaction
                </Link>
              </li>
            </ul>
          </li> */}

          {/* Transaction section end */}

          {/* Cms section start */}
          {/* {hasPermission("/admin/cms") ? ( */}
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
              <li
                className={`nav-sub-item ${loc.pathname.includes("/cms/question") ? " active" : ""
                  }`}
              >
                <Link
                  className="nav-sub-link"
                  to={`/admin/cms/question/list/${1}`}
                >
                  {t("Questions")}
                </Link>
              </li>
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
              <li
                className={`nav-sub-item ${loc.pathname.includes("/cms/services") ? " active" : ""
                  }`}
              >
                <Link
                  className="nav-sub-link"
                  to={`cms/services/list/1`}
                >
                  Services
                </Link>
              </li>
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
                  (loc.pathname.includes("/cms/web-home") ? " active" : "")
                }
              >
                <Link className="nav-sub-link" to={`/admin/cms/web-home`}>
                  {t("Website Home")}
                </Link>
              </li>

              <li
                className={
                  "nav-sub-item" +
                  (loc.pathname.includes("/cms/about-us") ? " active" : "")
                }
              >
                <Link className="nav-sub-link" to={`/admin/cms/about-us`}>
                  {t("About Us")}
                </Link>
              </li>

              <li
                className={
                  "nav-sub-item" +
                  (loc.pathname.includes("/cms/settings") ? " active" : "")
                }
              >
                <Link className="nav-sub-link" to={`/admin/cms/settings`}>
                  {t("sidebar_link_global_settings")}
                </Link>
              </li>
            </ul>
          </li>
          {/* // ) : null} */}
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
              {/* <li
                className={`nav-sub-item ${loc.pathname.includes("/subscription/subscription-feature") ? " active" : ""
                  }`}
              >
                <Link
                  className="nav-sub-link"
                  to={`subscription/subscription-feature`}
                >
                  Subscription Features
                </Link>
              </li>
              <li
                className={`nav-sub-item ${loc.pathname.includes("/subscription/subscription-benefit") ? " active" : ""
                  }`}
              >
                <Link
                  className="nav-sub-link"
                  to={`subscription/subscription-benefit`}
                >
                  Subscription Benefits
                </Link>
              </li> */}
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

          {/* testimonial management section end */}
          {/* <li
              className={
                `nav-item ` +
                (loc.pathname.includes("/testimonial-management")
                  ? "show active"
                  : "")
              }
            >
              <Link
                className="nav-link"
                to={`/admin/testimonial-management/testimonial/list/${1}`}
              >
                <span className="shape1"></span>
                <span className="shape2"></span>
                <i className="fa fa-comment-dots sidemenu-icon"></i>
                <span className="sidemenu-label">
                {t("sidebar_link_testimonials")}
                </span>
              </Link>
            </li> */}
          {/* testimonial management section end */}

          {/* <li
            className={
              `nav-item ` +
              (loc.pathname.includes("/inquiry")
                ? "show active"
                : "")
            }
          >
            <Link
              className="nav-link"
              to={`/admin/inquiry/list/${1}`}
            >
              <span className="shape1"></span>
              <span className="shape2"></span>
              <i className="fas fa-question-circle sidemenu-icon"></i>
              <span className="sidemenu-label">
                {t("Advisor Inquiry")}
              </span>
            </Link>
          </li> */}

          {/*  Contact Us section  */}
          {/* <li
            className={
              `nav-item ` +
              (loc.pathname.includes("/contact-us")
                ? "show active"
                : "")
            }
          >
            <Link
              className="nav-link"
              to={`/admin/contact-us/list/${1}`}
            >
              <span className="shape1"></span>
              <span className="shape2"></span>
              <i className="fas fa-address-card sidemenu-icon"></i>
              <span className="sidemenu-label">
                {t("sidebar_link_contact_us")}
              </span>
            </Link>
          </li> */}
          {/*  Contact Us section end */}

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
                {/* {t("sidebar_link_contact_us")} */}
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


           {/*  Questionnaire stats sart  */}
          {/* <li
            className={
              `nav-item ` +
              (loc.pathname.includes("/questionnaire-stats")
                ? "show active"
                : "")
            }
          >
            <Link
              className="nav-link"
              to={`/admin/questionnaire-stats`}
            >
              <span className="shape1"></span>
              <span className="shape2"></span>
              <i class="fas fa-chart-bar sidemenu-icon"></i>
              <span className="sidemenu-label">
                {t("Questionnaire stats")}
              </span>
            </Link>
          </li> */}
          {/*  Questionnaire stats end */}

        </ul>
      </div>
    </div>
  );
};

export default SideBar;
