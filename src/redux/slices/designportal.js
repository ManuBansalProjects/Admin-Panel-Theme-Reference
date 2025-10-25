import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { portalDesign } from "../../modules/admin/services/newcommon.services";

export const fetchApiData = createAsyncThunk("data/fetchApiData", async () => {
  let res = await portalDesign();
  return res?.data;
});

export const DesignPortalSlice = createSlice({
  name: "designportal",
  initialState: {
    loading: false,
    data: null,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApiData.pending, (state) => {
        state.loading = true;
        state.data = null;
        state.error = null;
      })
      .addCase(fetchApiData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchApiData.rejected, (state, action) => {
        state.loading = false;
        state.data = null;
        state.error = action.error.message;
      });
  },
});

export default DesignPortalSlice.reducer;
