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
} from './types';
import {
  getNewsletterSubscribers,
  getNewsletterStats,
  signupNewsletter,
  unsubscribeSubscriber,
} from '../../services/newsletterService';

// Fetch newsletter subscribers
export const fetchNewsletterSubscribers =
  (page = 1, limit = 20) =>
  async dispatch => {
    dispatch({ type: FETCH_NEWSLETTER_SUBSCRIBERS_LOADING });
    try {
      const data = await getNewsletterSubscribers(page, limit);
      dispatch({ type: FETCH_NEWSLETTER_SUBSCRIBERS, payload: data });
    } catch (errorData) {
      dispatch({
        type: FETCH_NEWSLETTER_SUBSCRIBERS_ERROR,
        payload: errorData,
      });
    }
  };

// Fetch newsletter stats
export const fetchNewsletterStats = () => async dispatch => {
  dispatch({ type: FETCH_NEWSLETTER_STATS_LOADING });
  try {
    const response = await getNewsletterStats();
    dispatch({ type: FETCH_NEWSLETTER_STATS, payload: response.data });
  } catch (errorData) {
    dispatch({ type: FETCH_NEWSLETTER_STATS_ERROR, payload: errorData });
  }
};

// Add newsletter subscriber
export const addNewsletterSubscriberAction = email => async dispatch => {
  dispatch({ type: ADD_NEWSLETTER_SUBSCRIBER_LOADING });
  try {
    const data = await signupNewsletter(email);
    dispatch({ type: ADD_NEWSLETTER_SUBSCRIBER, payload: data });
    return { success: true, data };
  } catch (errorData) {
    dispatch({ type: ADD_NEWSLETTER_SUBSCRIBER_ERROR, payload: errorData });
    return { success: false, error: errorData };
  }
};

// Remove newsletter subscriber
export const removeNewsletterSubscriberAction =
  subscriberId => async dispatch => {
    dispatch({ type: REMOVE_NEWSLETTER_SUBSCRIBER_LOADING });
    try {
      const data = await unsubscribeSubscriber(subscriberId);
      dispatch({ type: REMOVE_NEWSLETTER_SUBSCRIBER, payload: data });
      return { success: true, data };
    } catch (errorData) {
      dispatch({
        type: REMOVE_NEWSLETTER_SUBSCRIBER_ERROR,
        payload: errorData,
      });
      return { success: false, error: errorData };
    }
  };
