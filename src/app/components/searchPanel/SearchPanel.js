import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

import {stockData as stD} from '../../../reducers/stockData/stockDataSlice';
import {currentStock as curStock, changeCurrentStock} from '../../../reducers/currentStock/currentStockSlice';

import styles from './searchPanel.module.scss';

export const SearchPanel = () => {
    const dispatch = useDispatch();
    const stockData = useSelector(stD);
    const currentStock = useSelector(curStock);

    const [optionIsOpen, setOptionIsOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [searchResult, setSearchResult] = useState([]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            (searchValue === '')
                ? setSearchResult([])
                : fetch(`https://finnhub.io/api/v1/search?q=${searchValue}&token=c38fa72ad3ichbrdtqs0`)
                    .then((response) => response.json())
                    .then((data) => setSearchResult([...data.result].map(elem => {
                        const {symbol, description} = elem;
                        return {
                            symbol,
                            description
                        };
                    })));
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchValue]);

    const getAutocomplete = (stock) => {
        const {description, symbol} = stock;
        return (
            <p onClick={() => {
                if (symbol !== currentStock?.symbol) dispatch(changeCurrentStock(stock));
            }}>
                <span>{description}</span>
                <span>{symbol}</span>
            </p>
        );
    };

    return (
        <div
            className={stockData === null ? styles.searchPanel : `${styles.searchPanel} ${styles.searchPanelAnimated}`}>
            <Autocomplete
                className={styles.searchInput}
                options={searchResult}
                getOptionLabel={(option) => option.symbol}
                renderOption={(option) => getAutocomplete(option)}
                style={{width: 300}}
                filterOptions={(x) => x}
                open={optionIsOpen}
                onOpen={() => setOptionIsOpen(true)}
                onClose={() => setOptionIsOpen(false)}
                loading={optionIsOpen && searchResult.length === 0 && searchValue !== ''}
                renderInput={(params) => <TextField
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    label="Поиск акций"
                    variant="outlined"
                    {...params}/>
                }
            />
        </div>);
};