import React from 'react';
import {render} from '@testing-library/react';
import {App} from './App';
import {Provider} from 'react-redux';
import {store} from '../../store';
import reducer, {renewalData} from '../../../reducers/wallet/walletSlice';

test('renders learn react link', () => {
    const {getByText} = render(<Provider store={store}><App/></Provider>);
    const linkElement = getByText(/Стоимость/i);
    expect(linkElement).toBeInTheDocument();
});

test('changeCurrentStock', () => {
    expect(reducer({
        cost: 200,
        percent: null,
        list: [{
            symbol: 'BA',
            qty: 2,
            price: 100,
            percent: 20,
            description: 'some description'
        }]
    }, renewalData({
        cost: 260,
        stockList: [{
            symbol: 'BA',
            c: 130,
            pc: 80
        }],
        prevCost: 200
    }))).toEqual({
        cost: 260,
        percent: 60,
        list: [{
            symbol: 'BA',
            qty: 2,
            price: 130,
            percent: 38.46153846153847,
            description: 'some description'
        }]
    });
});