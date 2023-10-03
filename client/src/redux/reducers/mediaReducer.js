import { FETCH_MEDIA_IMAGES } from '../actions/types';

export const mediaReducer = (state = [], action) => {
    switch (action.type) {
        case FETCH_MEDIA_IMAGES:
            return action.payload;
        default:
            return state;
    }
};