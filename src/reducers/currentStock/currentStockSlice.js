import {createSlice} from '@reduxjs/toolkit';

const initialState = null;

export const currentStockSlice = createSlice({
    name: 'currentStock',
    initialState,
    reducers: {
        changeCurrentStock: (state, data) => data.payload
    }
});

export const {changeCurrentStock} = currentStockSlice.actions;

export const currentStock = (state) => state.currentStock;

export default currentStockSlice.reducer;
