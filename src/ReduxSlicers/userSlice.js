import { createSlice } from '@reduxjs/toolkit';
import { db } from '../Services/Firebase';
import { doc, getDoc } from 'firebase/firestore';

const initialState = {
  userInfo: {},  // You can use this if you need to store general user information
  postUserInfo: null,  // This stores the specific post-related user info
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    setPostUserInfo: (state, action) => {
      state.postUserInfo = action.payload;
    },
  },
});

export const { setUserInfo, setPostUserInfo } = userSlice.actions;

// Thunk to fetch user info by user ID
export const fetchUserInfo = (userId) => async (dispatch) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      dispatch(setPostUserInfo({
        name: userData.Name,
        profilePic: userData.photoURL,
      }));
    } else {
      // Document does not exist, set postUserInfo to null
      dispatch(setPostUserInfo(null));
      console.warn(`No user found with ID: ${userId}`);
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    dispatch(setPostUserInfo(null));
  }
};

export default userSlice.reducer;
