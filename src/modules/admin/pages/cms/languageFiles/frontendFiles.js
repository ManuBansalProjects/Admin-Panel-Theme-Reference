import React from "react";
import { Link } from "react-router-dom";
import { hasPermission } from "../../../../../utils/commonfunction";
import { getLangName } from "../../../../../utils/Constants";

const FrontendFiles = () => {

  return (
    <>
      <div className="animation_fade">
        <div className="card custom-card">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-4">
            </div>
            <div className="table-responsive">
              <table className="table table-bordered border-t0 key-buttons text-nowrap w-100">
                <thead>
                  <tr>
                    <th>Files</th>
                    {hasPermission('/admin/cms/language-files/action') ?
                    <th className="action_head">Actions</th>
                    :null}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{getLangName('en.json')}</td>
                    {hasPermission('/admin/cms/language-files/button') ?
                    <td>
                      <div className="d-flex">
                        <Link className="btn ripple btn-success mlAction" to={"/admin/cms/language-files/edit?type=frontend&file_name=en.json"}>Edit</Link>
                      </div>
                    </td>
                    :null}
                  </tr>
                  <tr>
                    <td>{getLangName('de.json')}</td>
                    {hasPermission('/admin/cms/language-files/button') ?
                    <td>
                      <div className="d-flex">
                        <Link className="btn ripple btn-success mlAction" to={"/admin/cms/language-files/edit?type=frontend&file_name=de.json"}>Edit</Link>
                      </div>
                    </td>
                    :null}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FrontendFiles;
