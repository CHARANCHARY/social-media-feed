import { configureStore } from '@reduxjs/toolkit';
import postsReducer from './ReduxSlicers/postsSlice';
import userReducer from './ReduxSlicers/userSlice';
import userDetailsSlice from "./ReduxSlicers/UserDetailsSlice"

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    user: userReducer,
    userDetials : userDetailsSlice,

  },
});
