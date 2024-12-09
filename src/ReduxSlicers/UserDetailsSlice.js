import { createSlice } from '@reduxjs/toolkit';
import { onAuthStateChanged } from "firebase/auth";



import { auth, db } from '../Services/Firebase'; // Import auth and db from your firebase file
import { doc, getDoc } from "firebase/firestore"; // Import Firestore methods

const initialState = {
  useradmin: null,  // Holds user details
  loading: true, // Indicates whether user details are being fetched
};

const userDetailsSlice = createSlice({
  name: 'user-details',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.useradmin = action.payload;
      state.loading = false;
    },
    clearUser: (state) => {
      state.user = null;
      state.loading = false;
    },
  },
});

export const { setUser, clearUser } = userDetailsSlice.actions;



export const fetchUserDetails = () => async (dispatch) => {
  onAuthStateChanged(auth, async (useradmin) => {
    if (useradmin) {
      // Fetch the user details from Firestore based on the UID
      try {
        const userDocRef = doc(db, "users", useradmin.uid); // Reference to the user's document in Firestore
        const userDocSnap = await getDoc(userDocRef); // Get user document

        if (userDocSnap.exists()) {
          // Firestore user data exists
          const userData = userDocSnap.data();

          // Dispatch both Firebase Auth details and Firestore details to Redux store
          dispatch(setUser({
            uid: useradmin.uid,
            email: useradmin.uid,
            displayName: userData.displayName || useradmin.displayName,
            photoURL: userData.photoURL || useradmin.photoURL, // Use Firestore photoURL if available, otherwise default to Firebase
            coverPhotoURL: userData.coverPhotoURL,
            description: userData.description,
            name: userData.Name,
          }));
        } else {
          // No user document found in Firestore
          dispatch(clearUser());
        }
      } catch (error) {
        console.error("Error fetching user data from Firestore: ", error);
        dispatch(clearUser());
      }
    } else {
      // If no user is logged in, clear the user state
      dispatch(clearUser());
    }
  });
};




export default userDetailsSlice.reducer;
