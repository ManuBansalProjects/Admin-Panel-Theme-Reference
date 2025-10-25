import { createSlice } from '@reduxjs/toolkit';

export const globalLoaderSlice = createSlice({
    name: 'globalLoader',
    initialState: true,
    reducers: {
        setGlobalLoader: (state, action) => {
            return state = action.payload;
        },
    }
})

export const { setGlobalLoader } = globalLoaderSlice.actions;
export default globalLoaderSlice.reducer;