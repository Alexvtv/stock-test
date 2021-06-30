import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import Snackbar from '@material-ui/core/Snackbar';

import {wallet as walletData, renewalData} from '../../../reducers/wallet/walletSlice';
import {changeStockData} from '../../../reducers/stockData/stockDataSlice';
import {changeCurrentStock, currentStock as curStock} from '../../../reducers/currentStock/currentStockSlice';

import {SearchPanel, SearchResult, Wallet} from '../';

import styles from './app.module.scss';

export function App() {
    const wallet = useSelector(walletData);
    const currentStock = useSelector(curStock);
    const dispatch = useDispatch();

    const [alertIsOpen, setAlertIsOpen] = useState({open: false, vertical: 'top', horizontal: 'center'});

    useEffect(() => {
        const intervalFn = setInterval(() => {
            let newCost = null;
            let stockList = [];
            const {list, cost} = wallet;

            if (list.length > 0) {
                Promise.all(list.map(el => fetch(`https://finnhub.io/api/v1/quote?symbol=${el.symbol}&token=c38fa72ad3ichbrdtqs0`)))
                    .then(responses => Promise.all(responses.map(res => res.json()))
                    ).then((fetchData) => {
                    if (!!fetchData) {
                        const data = [...fetchData].map((e, i) => ({...e, symbol: list[i].symbol, qty: list[i].qty}));

                        data.forEach(el => {
                            const {c, pc, symbol, qty} = el;
                            if (!data.error) stockList.push({c, pc, symbol, qty});
                        });
                    } else {
                        console.error('Ошибка запроса', fetchData);
                    }
                }).then(() => {
                    if (list.length > 0 && stockList.length === list.length) {
                        newCost = stockList.map(stock => stock.c * stock.qty).reduce((a, b) => a + b) || null;
                        dispatch(renewalData({cost: newCost, prevCost: cost, stockList}));
                    }
                });
            }
        }, 20000);
        return () => clearInterval(intervalFn);
    }, [wallet, dispatch]);

    useEffect(() => {
        if (currentStock !== null) {
            const fetchCurrentStock = () => {
                const {symbol, description} = currentStock;
                fetch(`https://finnhub.io/api/v1/quote?symbol=${currentStock.symbol}&token=c38fa72ad3ichbrdtqs0`)
                    .then((response) => response.json())
                    .then((data) => {
                        if (!!data) {
                            const {c, pc, error} = data;

                            if (error) {
                                setAlertIsOpen(prev => ({...prev, open: true}));
                                dispatch(changeCurrentStock(null));
                                return console.error(error);
                            }

                            dispatch(changeStockData({
                                description, symbol, price: c, percent: ((c - pc) / c * 100)
                            }));
                        } else {
                            console.error('Ошибка загрузки данных', data);
                        }
                    });
            };
            fetchCurrentStock();

            const intervalFn = setInterval(() => {
                fetchCurrentStock()
            }, 15000);
            return () => clearInterval(intervalFn);
        }
    }, [currentStock, dispatch]);

    return (
        <div className={styles.app}>
            <Snackbar
                anchorOrigin={{vertical: alertIsOpen.vertical, horizontal: alertIsOpen.horizontal}}
                open={alertIsOpen.open}
                onClose={() => setAlertIsOpen(prev => ({...prev, open: false}))}
                message="Акция недоступна для просмотра"
                autoHideDuration={1000}
            />
            <div className={styles.search}>
                <SearchPanel/>
                <SearchResult/>
            </div>
            <Wallet/>
        </div>
    );
}
