import React, { useEffect, useState } from 'react';
import ReactJson from 'react-json-view';
import * as languageFilesService from '../../../services/languagefiles.services';
import { useLocation, useNavigate } from 'react-router-dom';
import { handleServerValidations } from '../../../../../utils/commonfunction';
import Swal from 'sweetalert2';
import { SWAL_SETTINGS } from '../../../../../utils/Constants';


const EditLanguageFiles = (props) => {
  const [showdefault, setShowDefault] = useState({});
  const [updatedData, setUpdatedData] = useState({});
  const location = useLocation();
  const navigate = useNavigate()


  const queryParams = new URLSearchParams(location.search);

  useEffect(() => {
    languageFilesService
      .Details(queryParams.get('type'), queryParams.get('file_name'))
      .then((response) => {
        setShowDefault(response && response.data && response.data.json ? response.data.json : {});
        setUpdatedData(response && response.data && response.data.json ? response.data.json : {});
      })
      .catch((error) => {
        console.log("error=====>", error);
      });
  }, []);


  const handleAdd = (e) => {
    setUpdatedData(e.updated_src);
  };

  const handleEdit = (e) => {
    setUpdatedData(e.updated_src);
  };

  const handleClick = () => {
    languageFilesService.Edit({ type: queryParams.get('type'), file_name: queryParams.get('file_name'), json: updatedData }).then(response => {
      if (response.success) {
        Swal.fire({
          icon: 'success',
          text: response.message,
          ...SWAL_SETTINGS
        })
        setTimeout(() => {
          const type = queryParams.get('type');
        
          if (type === "frontend") {
            navigate(`/admin/cms/language-files/frontend`);
          } else {
            navigate(`/admin/cms/language-files/backend`);
          }
        }, 1000);
      } else {
        Swal.fire({
          icon: 'error',
          text: handleServerValidations(response),
          ...SWAL_SETTINGS
        })
      }
    }).catch(error => {
      console.log("error ====> ", error);
    })
  };

  return (
    <>
      <div className="language_files">
        <ReactJson
          displayDataTypes={false}
          displayObjectSize={false}
          theme={'monokai'}
          src={showdefault} name={false} onAdd={handleAdd} onEdit={handleEdit} />
        <div className="">
          <button className="btn btn-main-primary signbtn mr-2 mt-4" type="button" onClick={handleClick}>
            <i className="ace-icon fa fa-check bigger-110 mx-1"></i>
            Submit
          </button>
          <button className="btn ripple btn-secondary mt-4" type='button' onClick={() => navigate(-1)}>
            <i className="ace-icon fa fa-times bigger-110 mx-1"></i>
            Cancel
          </button>
        </div>
      </div>
    </>
  )
};

export default EditLanguageFiles;
