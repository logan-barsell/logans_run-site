import {
  FETCH_NEWSLETTER_SUBSCRIBERS,
  FETCH_NEWSLETTER_SUBSCRIBERS_LOADING,
  FETCH_NEWSLETTER_SUBSCRIBERS_ERROR,
  FETCH_NEWSLETTER_STATS,
  FETCH_NEWSLETTER_STATS_LOADING,
  FETCH_NEWSLETTER_STATS_ERROR,
  ADD_NEWSLETTER_SUBSCRIBER,
  ADD_NEWSLETTER_SUBSCRIBER_LOADING,
  ADD_NEWSLETTER_SUBSCRIBER_ERROR,
  REMOVE_NEWSLETTER_SUBSCRIBER,
  REMOVE_NEWSLETTER_SUBSCRIBER_LOADING,
  REMOVE_NEWSLETTER_SUBSCRIBER_ERROR,
} from '../actions/types';

const initialState = {
  data: [],
  loading: false,
  error: null,
  stats: null,
  statsLoading: false,
  statsError: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalSubscribers: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
  addLoading: false,
  addError: null,
  removeLoading: false,
  removeError: null,
};

export const newsletterReducer = (state = initialState, action) => {
  switch (action.type) {
    // Fetch subscribers
    case FETCH_NEWSLETTER_SUBSCRIBERS_LOADING:
      return { ...state, loading: true, error: null };
    case FETCH_NEWSLETTER_SUBSCRIBERS:
      return {
        ...state,
        data: action.payload.data || action.payload,
        pagination: action.payload.pagination || state.pagination,
        loading: false,
        error: null,
      };
    case FETCH_NEWSLETTER_SUBSCRIBERS_ERROR:
      return { ...state, loading: false, error: action.payload };

    // Fetch stats
    case FETCH_NEWSLETTER_STATS_LOADING:
      return { ...state, statsLoading: true, statsError: null };
    case FETCH_NEWSLETTER_STATS:
      return {
        ...state,
        stats: action.payload,
        statsLoading: false,
        statsError: null,
      };
    case FETCH_NEWSLETTER_STATS_ERROR:
      return { ...state, statsLoading: false, statsError: action.payload };

    // Add subscriber
    case ADD_NEWSLETTER_SUBSCRIBER_LOADING:
      return { ...state, addLoading: true, addError: null };
    case ADD_NEWSLETTER_SUBSCRIBER:
      return {
        ...state,
        data: [...state.data, action.payload],
        addLoading: false,
        addError: null,
      };
    case ADD_NEWSLETTER_SUBSCRIBER_ERROR:
      return { ...state, addLoading: false, addError: action.payload };

    // Remove subscriber
    case REMOVE_NEWSLETTER_SUBSCRIBER_LOADING:
      return { ...state, removeLoading: true, removeError: null };
    case REMOVE_NEWSLETTER_SUBSCRIBER:
      return {
        ...state,
        data: state.data.filter(sub => sub._id !== action.payload._id),
        removeLoading: false,
        removeError: null,
      };
    case REMOVE_NEWSLETTER_SUBSCRIBER_ERROR:
      return { ...state, removeLoading: false, removeError: action.payload };

    default:
      return state;
  }
};
