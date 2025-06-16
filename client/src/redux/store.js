import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { contactReducer } from './reducers/contactReducer';
import { bioReducer } from './reducers/bioReducer';
import { membersReducer } from './reducers/membersReducer';
import { productsReducer } from './reducers/productsReducer';
import { shippingReducer } from './reducers/shippingReducer';
import { showsReducer } from './reducers/showsReducer';
import { carouselReducer } from './reducers/carouselReducer';
import { mediaReducer } from './reducers/mediaReducer';
import { videosReducer } from './reducers/videosReducer';
import { musicReducer } from './reducers/musicReducer';
import cartReducer from './cartRedux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
};

const rootReducer = combineReducers({
  music: musicReducer,
  videos: videosReducer,
  media: mediaReducer,
  carouselImages: carouselReducer,
  contactInfo: contactReducer,
  currentBio: bioReducer,
  members: membersReducer,
  shows: showsReducer,
  products: productsReducer,
  shipping: shippingReducer,
  cart: cartReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat(thunk),
});

export let persistor = persistStore(store);
