import reducer, {addStock, removeStock} from '../../../reducers/wallet/walletSlice';

test('initial state', () => {
    expect(reducer(undefined, {})).toEqual({
        cost: 0,
        percent: null,
        list: []
    });
});

test('changeCurrentStock', () => {
    expect(reducer({
        cost: 0,
        percent: null,
        list: []
    }, addStock({
        symbol: 'BA',
        qty: 2,
        price: 100,
        percent: 20,
        description: 'some description'
    }))).toEqual({
        cost: 200,
        percent: null,
        list: [{
            symbol: 'BA',
            qty: 2,
            price: 100,
            percent: 20,
            description: 'some description'
        }]
    });
});

test('changeCurrentStock', () => {
    expect(reducer({
        cost: 0,
        percent: null,
        list: []
    }, addStock({
        symbol: 'BA',
        price: 100,
        percent: 20,
        description: 'some description'
    }))).toEqual({
        cost: 0,
        percent: null,
        list: []
    });
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
    }, removeStock({
        symbol: 'BA',
        qty: 1,
        price: 100,
    }))).toEqual({
        cost: 100,
            percent: null,
            list: [{
            symbol: 'BA',
            qty: 1,
            price: 100,
            percent: 20,
            description: 'some description'
        }]
    });
});