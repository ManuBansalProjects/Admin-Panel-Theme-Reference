import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { ROLE } from "../../../utils/Constants";
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { getLocalKey } from '../../../utils/commonfunction';
import GlobalLoader from '../../admin/shared/globalLoader';
import { setGlobalLoader } from '../../../redux/slices/globalLoader';

const PsychicPublicRoute = ({ component: Component }) => {
    const dispatch = useDispatch();
    const loaderState = useSelector((state) => state.globalLoader);
    const psychicData = getLocalKey(ROLE.PSYCHIC) ? JSON.parse(getLocalKey(ROLE.PSYCHIC)) : {};

    useEffect(() => {
        dispatch(setGlobalLoader(false));
    }, []);

    return (
        <>
            {
                (psychicData && psychicData.token) ?
                    <Navigate to={{ pathname: "/psychic" }} />
                    : loaderState ?
                        <GlobalLoader />
                        : <Component />
            }
        </>
    )
}

export default PsychicPublicRoute;
