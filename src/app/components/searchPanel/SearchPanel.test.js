import reducer, {changeCurrentStock} from '../../../reducers/currentStock/currentStockSlice';

test('initial state', () => {
    expect(reducer(undefined, {})).toEqual(null);
});

test('changeCurrentStock', () => {
    expect(reducer(null, changeCurrentStock({
        ab: 1, cd: 2
    }))).toEqual({
        ab: 1, cd: 2
    });
});