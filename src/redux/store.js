import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './slices/profileslice';
import globalLoaderSlice from './slices/globalLoader';
import userTypeSlice from './slices/userType';
import DesignPortalSlice from './slices/designportal';
import GlobalDetailsSlice from './slices/globalDetails';
import psychicDetailsSlice from './slices/psychicDetails';
import meetingDetailsSlice from './slices/meetingDetailsSlice';
import notificationCountSlice from './slices/notificationCount';

const store = configureStore({
    reducer: {
        profile: profileReducer,
        user:userTypeSlice,
        globalLoader: globalLoaderSlice,
        designportal: DesignPortalSlice,
        globalData: GlobalDetailsSlice,
        psychicData: psychicDetailsSlice,
        meetingDetailsSlice : meetingDetailsSlice,
        notificationCount: notificationCountSlice
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }),
});

export default store;

