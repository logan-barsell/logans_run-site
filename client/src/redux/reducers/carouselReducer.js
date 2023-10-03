import { FETCH_HOME_IMAGES } from '../actions/types';

export const carouselReducer = (state = [], action) => {
    switch (action.type) {
        case FETCH_HOME_IMAGES:
            return action.payload;
        default:
            return state;
    }
};