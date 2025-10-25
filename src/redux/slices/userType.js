import { createSlice } from '@reduxjs/toolkit';

export const userTypeSlice = createSlice({
    name: 'userType',
    initialState: "",
    reducers: {
        setUserType: (state, action) => {
            return state = action.payload;
        },
    }
})

export const { setUserType } = userTypeSlice.actions;
export default userTypeSlice.reducer;