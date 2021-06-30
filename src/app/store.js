import {configureStore} from '@reduxjs/toolkit';
import dataReducer from '../reducers/stockData/stockDataSlice';
import walletReducer from '../reducers/wallet/walletSlice';
import currentStockReducer from '../reducers/currentStock/currentStockSlice';

export const store = configureStore({
    reducer: {
        stockData: dataReducer,
        wallet: walletReducer,
        currentStock: currentStockReducer
    },
});
