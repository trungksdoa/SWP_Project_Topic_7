import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    ponds: [],
};

const managePondSlice = createSlice({
    name: 'managePond',
    initialState,
    reducers: {
        setPonds: (state, action) => {
            state.ponds = action.payload;
        },
        updatePond: (state, action) => {
            const updatedPond = action.payload;
            const index = state.ponds.findIndex(pond => pond.id === updatedPond.id);
            if (index !== -1) {
                state.ponds[index] = updatedPond;
            }
        },
        addPond: (state, action) => {
            state.ponds.push(action.payload);
        },
    },
});

export const managePondActions = managePondSlice.actions;
export default managePondSlice.reducer;
