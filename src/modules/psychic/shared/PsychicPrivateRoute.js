import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUser, setReturnURL} from '../../../utils/commonfunction';
import { ROLE } from "../../../utils/Constants";

const PsychicPrivateRoute = ({ component: Component }) => {
    const userData = getUser(ROLE.PSYCHIC)
    return (
        <>
            {(function(){
                if(Object.keys(userData).length && userData.token){
                    return <Component/>
                }else{
                    setReturnURL(ROLE.PSYCHIC);
                    return <Navigate to="/psychic/login" />;
                }
            })()}
        </>
    )
}

export default PsychicPrivateRoute;
