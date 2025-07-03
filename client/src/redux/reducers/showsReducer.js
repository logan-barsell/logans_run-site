import {
  FETCH_SHOWS,
  FETCH_SHOWS_SETTINGS,
  UPDATE_SHOWS_SETTINGS,
} from '../actions/types';

export const showsReducer = (state = [], action) => {
  switch (action.type) {
    case FETCH_SHOWS:
      return action.payload;
    default:
      return state;
  }
};

const initialState = {
  showSystem: 'custom',
  bandsintownArtist: '',
};

export default function showsSettingsReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_SHOWS_SETTINGS:
    case UPDATE_SHOWS_SETTINGS:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
