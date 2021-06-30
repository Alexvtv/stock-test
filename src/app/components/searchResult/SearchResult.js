import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import Button from '@material-ui/core/Button';

import {addStock, removeStock, wallet as walletData} from '../../../reducers/wallet/walletSlice';
import {changeStockData, stockData as stD} from '../../../reducers/stockData/stockDataSlice';
import {changeCurrentStock} from '../../../reducers/currentStock/currentStockSlice';

import styles from './searchResult.module.scss';

export const SearchResult = () => {
    const [stockPurchaseQty, setStockPurchaseQty] = useState(1);
    const [stockSaleQty, setStockSaleQty] = useState(1);

    const dispatch = useDispatch();
    const stockData = useSelector(stD);
    const {list} = useSelector(walletData);

    if (stockData === null) return '';

    const {symbol, price, percent, description} = stockData;

    const canSell = () => {
        const inStock = list.find(e => e.symbol === symbol)?.qty;
        return (inStock && stockSaleQty) ? inStock >= stockSaleQty : false;
    };

    return <div className={styles.searchResult}>
        <div className={styles.searchClose} onClick={() => {
            dispatch(changeStockData(null));
            dispatch(changeCurrentStock(null));
        }}>&#10006;</div>
        <p>
            <span className={styles.symbol}>{symbol}</span>
            <span className={styles.description}>{description}</span>
            <span className={styles.price}>{price.toFixed(2)}$
                {percent > 0
                    ? <span className={styles.positive}>+{percent.toFixed(2)}%</span>
                    : <span className={styles.negative}>{percent.toFixed(2)}%</span>}</span>
        </p>
        <div className={styles.bargaining}>
            <div className={styles.buy}>
                <Button
                    onClick={() => setStockPurchaseQty(qty => qty === 0 ? qty : qty - 1)}
                    variant="outlined"
                    className={styles.button}>
                    &#8211;
                </Button>
                <input
                    value={stockPurchaseQty}
                    onChange={(e) => setStockPurchaseQty(Number(e.target.value.replace(/\D+/g, '')))}
                    className={styles.input}/>
                <Button
                    onClick={() => setStockPurchaseQty(qty => qty + 1)}
                    variant="outlined"
                    className={`${styles.button} ${styles.plus}`}>
                    +
                </Button>
                <Button
                    variant="outlined"
                    color="primary"
                    className={styles.primaryBtn}
                    onClick={() => {
                        dispatch(addStock({
                            symbol,
                            qty: stockPurchaseQty,
                            price,
                            percent,
                            description
                        }));
                    }}
                >
                    Добавить в кошелек
                </Button>
            </div>
            <div className={styles.sell}>
                <Button
                    onClick={() => setStockSaleQty(qty => qty === 0 ? qty : qty - 1)}
                    variant="outlined"
                    className={styles.button}>
                    &#8211;
                </Button>
                <input
                    value={stockSaleQty}
                    onChange={(e) => setStockSaleQty(Number(e.target.value.replace(/\D+/g, '')))}
                    className={styles.input}/>
                <Button
                    onClick={() => setStockSaleQty(qty => qty + 1)}
                    variant="outlined"
                    className={`${styles.button} ${styles.plus}`}>
                    +
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    className={styles.secondaryBtn}
                    disabled={!canSell()}
                    onClick={() => {
                        dispatch(removeStock({
                            symbol,
                            qty: stockSaleQty,
                            price
                        }));
                    }}>
                    Продать
                </Button>
            </div>
        </div>
    </div>;
};