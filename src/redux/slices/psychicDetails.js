import { createSlice } from "@reduxjs/toolkit";

export const psychicDetailsSlice = createSlice({
  name: "psychicData",
  initialState: {
    data: null
  },
  reducers: {
    addPsychicData: (state, action) => {
        state.data = action.payload;
    },
}
});

export const { addPsychicData } = psychicDetailsSlice.actions;
export default psychicDetailsSlice.reducer;