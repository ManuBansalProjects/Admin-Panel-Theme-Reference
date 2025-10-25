import { createSlice } from '@reduxjs/toolkit';

export const profileSlice = createSlice({
    name: 'userProfile',
    initialState: {
        file: null,
    },
    reducers: {
        addProfile: (state, action) => {
            state.file = action.payload;
        },
    }
})

export const { addProfile } = profileSlice.actions;
export default profileSlice.reducer;