import {createSlice} from '@reduxjs/toolkit';

const initialState = null;

export const stockDataSlice = createSlice({
    name: 'stockData',
    initialState,
    reducers: {
        changeStockData: (state, data) => data.payload
    }
});

export const {changeStockData} = stockDataSlice.actions;

export const stockData = (state) => state.stockData;

export default stockDataSlice.reducer;
