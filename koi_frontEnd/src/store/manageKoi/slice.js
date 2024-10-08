import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  kois: [],
};

const manageKoiSlice = createSlice({
  name: 'manageKoi',
  initialState,
  reducers: {
    updateKoi: (state, action) => {
      const updatedKoi = action.payload;
      const index = state.kois.findIndex(koi => koi.id === updatedKoi.id);
      if (index !== -1) {
        state.kois[index] = updatedKoi;
      }
    },
    addKoi: (state, action) => {
      state.kois.push(action.payload);
    },
  },
});

export const manageKoiActions = manageKoiSlice.actions;
export default manageKoiSlice.reducer;