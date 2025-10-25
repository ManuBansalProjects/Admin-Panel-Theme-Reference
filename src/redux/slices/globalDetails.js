import { createSlice } from "@reduxjs/toolkit";

export const GlobalDetailsSlice = createSlice({
  name: "globalData",
  initialState: {
    data: null
  },
  reducers: {
    addData: (state, action) => {
        state.data = action.payload;
    },
}
});

export const { addData } = GlobalDetailsSlice.actions;
export default GlobalDetailsSlice.reducer;
