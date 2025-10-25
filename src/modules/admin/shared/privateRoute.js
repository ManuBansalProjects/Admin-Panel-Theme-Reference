import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUser, setReturnURL} from '../../../utils/commonfunction';
import { ROLE } from "../../../utils/Constants";

const PrivateRoute = ({ component: Component }) => {
    
    const userData = getUser(ROLE.SUPER_ADMIN);
    return (
        <>
            {(function(){
                if(Object.keys(userData).length && userData.token){
                    return <Component/>
                }else{
                    setReturnURL(ROLE.SUPER_ADMIN);
                    return <Navigate to="/admin/login" />;
                }
            })()}
        </>
    )
}

export default PrivateRoute;