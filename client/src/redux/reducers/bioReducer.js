import { FETCH_BIO } from '../actions/types';

export const bioReducer = (state = '', action) => {
    switch (action.type) {
        case FETCH_BIO:
            return action.payload;
        default:
            return state;
    }
};