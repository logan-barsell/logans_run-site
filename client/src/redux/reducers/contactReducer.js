import { FETCH_CONTACT_INFO } from "../actions/types";

export const contactReducer = (state={}, action) => {
    switch (action.type) {
        case FETCH_CONTACT_INFO:
            return action.payload;
        default: 
        return state;
    };
 };