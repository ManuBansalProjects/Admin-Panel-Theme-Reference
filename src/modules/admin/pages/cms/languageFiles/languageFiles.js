import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import Breadcrums from "../../../common/breadcrumbs";

const LanguageFiles = () => {
  const loc = useLocation();
  const breadcrumbs = [
    { title: "Dashboard", url: "/admin/dashboard" },
    { title: "Language Files", url: "" },
  ];
  
  return (
    <>
     <Breadcrums data={breadcrumbs} />
      <div className="row row-sm">
        <div className="col-lg-12 col-md-12 animation_fade">
          <div className="card custom-card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h6 className="main-content-label">Language Files</h6>
              </div>
              <div className="tabs-wrap">
              <div className="profile-tab tab-menu-heading mb-4">
								<nav className="nav main-nav-line p-3 tabs-menu profile-nav-line bg-gray-100">
                <Link
                    className={"nav-link linkactive " + (loc.pathname === "/admin/cms/language-files/frontend"  ? " active" : "")}
                    aria-current="page"
                    to={"/admin/cms/language-files/frontend"}
                  >
                   Frontend Files
                  </Link>
                  <Link
                    className={"nav-link linkactive " + (loc.pathname === "/admin/cms/language-files/backend" ? " active" : "")}
                    to={"/admin/cms/language-files/backend"}
                  >
                   Backend Files
                  </Link>
								</nav>
							</div>
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default LanguageFiles;