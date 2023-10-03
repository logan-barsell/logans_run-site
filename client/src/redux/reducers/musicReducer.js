import { FETCH_PLAYERS } from "../actions/types";

export const musicReducer = (state=[], action) => {
    switch(action.type) {
        case FETCH_PLAYERS:
            return action.payload;
        default:
            return state;
    }
}