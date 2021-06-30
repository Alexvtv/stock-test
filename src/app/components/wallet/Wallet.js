import React from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {wallet as walletData} from '../../../reducers/wallet/walletSlice';
import {currentStock as curStock, changeCurrentStock} from '../../../reducers/currentStock/currentStockSlice';

import styles from './wallet.module.scss';


export const Wallet = () => {
    const dispatch = useDispatch();
    const currentStock = useSelector(curStock);
    const {percent, cost, list} = useSelector(walletData);

    return (
        <div className={styles.test}>
            <p className={styles.walletCost}>Стоимость акций:
                <span>{cost?.toFixed(2)}$</span>
                {percent
                    ? percent > 0
                        ? <span>+{percent?.toFixed(2)}%</span>
                        : <span>{percent?.toFixed(2)}%</span>
                    : ''}
            </p>
            {list.map((stock, index) => {
                const {percent, symbol, description, price, qty} = stock;

                return (
                    <div
                        key={index}
                        className={styles.stock}
                        onClick={() => symbol !== currentStock.symbol ? dispatch(changeCurrentStock(stock)) : {}}>
                        <p>
                            <span className={styles.symbol}>{symbol}</span>
                            <span className={styles.description}>{description}</span>
                            <span className={styles.price}>{price.toFixed(2)}$
                                {percent > 0
                                    ? <span className={styles.positive}>+{percent.toFixed(2)}%</span>
                                    : <span className={styles.negative}>{percent.toFixed(2)}%</span>}
                        </span>
                            <span className={styles.cost}>Стоимость:
                                <span>{qty * price.toFixed(2)}$</span>
                            </span>
                            <span className={styles.qty}>В портфеле: <span>{qty}</span></span>
                        </p>
                    </div>
                );
            })}
        </div>
    );
};