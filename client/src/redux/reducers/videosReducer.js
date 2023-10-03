import { FETCH_VIDEOS } from '../actions/types';

export const videosReducer = (state = [], action) => {
    switch (action.type) {
        case FETCH_VIDEOS:
            return action.payload;
        default:
            return state;
    }
};