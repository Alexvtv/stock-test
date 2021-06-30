import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    cost: 0,
    percent: null,
    list: []
};

export const walletSlice = createSlice({
    name: 'wallet',
    initialState,
    reducers: {
        addStock: (state, props) => {
            const {symbol, qty, price, percent, description} = props.payload;
            if (!symbol || !qty || !percent || !price || !description) return state;
            let increasingStock = [...state.list].find(stock => stock.symbol === symbol);
            if (!increasingStock) return ({
                cost: state.cost + (price * qty),
                percent: null,
                list: [...state.list, {
                    symbol,
                    qty,
                    price,
                    percent,
                    description
                }]
            });

            return ({
                cost: state.cost + (price * qty),
                percent: null,
                list: [...state.list].map(stock => (stock.symbol === symbol)
                    ? {...stock, qty: stock.qty + qty}
                    : stock)
            });
        },
        removeStock: (state, props) => {
            const {symbol, qty, price} = props.payload;
            const increasingStock = state.list.find(stock => stock.symbol === symbol);
            if (!increasingStock) return state;

            if (increasingStock.qty === qty) {

                return ({
                    cost: state.cost - (price * qty),
                    percent: null,
                    list: [...state.list].filter(e => e.symbol !== symbol)
                });
            } else {

                return ({
                    cost: state.cost - (price * qty),
                    percent: null,
                    list: [...state.list].map(stock => (stock.symbol === symbol)
                        ? {...stock, qty: stock.qty - qty}
                        : stock)
                });
            }
        },
        renewalData: (state, props) => {
            const {cost, stockList, prevCost} = props.payload;

            return ({
                cost: cost,
                percent: cost - prevCost,
                list: [...state.list.map(stock => {
                    const newStock = stockList.find(e => e.symbol === stock.symbol);

                    return {...stock, price: newStock.c, percent: ((newStock.c - newStock.pc) / newStock.c * 100)};
                })]
            });
        }
    }
});

export const {addStock, removeStock, renewalData} = walletSlice.actions;

export const wallet = (state) => state.wallet;

export default walletSlice.reducer;
