import React from 'react';
import { Navigate } from 'react-router-dom';
import { getLocalKey } from '../../../utils/commonfunction';
import { useSelector } from 'react-redux';
import GlobalLoader from './globalLoader';
import {ROLE} from './../../../utils/Constants'

const PublicRoute = ({ component: Component }) => {
    const loaderState = useSelector((state) => state.globalLoader);
    const userData = getLocalKey(ROLE.SUPER_ADMIN) ? JSON.parse(getLocalKey(ROLE.SUPER_ADMIN)) : {};


    return (
        <>
            {
                userData?.token ?
                    <Navigate to={{ pathname: "/admin/dashboard" }} />
                    :
                    loaderState ?
                        <GlobalLoader /> :
                        <Component />
            }
        </>
    )

}

export default PublicRoute;