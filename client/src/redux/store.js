import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { contactReducer } from './reducers/contactReducer';
import { bioReducer } from './reducers/bioReducer';
import { membersReducer } from './reducers/membersReducer';
import { showsReducer, showsSettingsReducer } from './reducers/showsReducer';
import { carouselReducer } from './reducers/carouselReducer';
import { mediaReducer } from './reducers/mediaReducer';
import { videosReducer } from './reducers/videosReducer';
import { musicReducer } from './reducers/musicReducer';
import thunk from 'redux-thunk';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { themeReducer } from './reducers/themeReducer';
import { merchConfigReducer } from './reducers/merchConfigReducer';
import { authReducer } from './reducers/authReducer';
import {
  featuredReleasesReducer,
  featuredVideosReducer,
} from './reducers/featuredContentReducer';

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['theme', 'merchConfig', 'shows'], // Don't persist auth state for security
};

const rootReducer = combineReducers({
  auth: authReducer,
  music: musicReducer,
  videos: videosReducer,
  media: mediaReducer,
  carouselImages: carouselReducer,
  contactInfo: contactReducer,
  currentBio: bioReducer,
  members: membersReducer,
  shows: showsReducer,
  theme: themeReducer,
  showsSettings: showsSettingsReducer,
  merchConfig: merchConfigReducer,
  featuredReleases: featuredReleasesReducer,
  featuredVideos: featuredVideosReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
      immutableCheck: false,
    }).concat(thunk),
});

export let persistor = persistStore(store);
