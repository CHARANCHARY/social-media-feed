import { createSlice } from '@reduxjs/toolkit';
import { db } from '../Services/Firebase';
import { collection, query, getDocs, orderBy, startAfter, limit } from 'firebase/firestore';

const initialState = {
  posts: [],
  loading: false,
  hasMore: true,
  page: 1,
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    addPosts: (state, action) => {
      state.posts = [...state.posts, ...action.payload];
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setHasMore: (state, action) => {
      state.hasMore = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
  },
});

export const { setPosts, addPosts, setLoading, setHasMore, setPage } = postsSlice.actions;

// Thunk to fetch posts with pagination and include userId for each post
export const fetchPosts = (pageNum) => async (dispatch, getState) => {
  const { loading, posts } = getState().posts;
  if (loading) return;

  dispatch(setLoading(true));

  try {
    const postsCollection = collection(db, 'posts');
    let postsQuery;

    if (pageNum === 1) {
      postsQuery = query(postsCollection, orderBy('createdAt'), limit(20));
    } else {
      const lastPost = posts[posts.length - 1];
      postsQuery = query(
        postsCollection,
        orderBy('createdAt'),
        startAfter(lastPost.createdAt),
        limit(20)
      );
    }

    const querySnapshot = await getDocs(postsQuery);
    const postsData = querySnapshot.docs.map((doc) => {
      const postData = doc.data();
      // Assuming userId is stored within the post data, ensure it's included
      return { ...postData, userId: postData.userId || 'Unknown' }; // Fallback to 'Unknown' if no userId
    });

    if (postsData.length === 0) {
      dispatch(setHasMore(false));
    } else {
      dispatch(pageNum === 1 ? setPosts(postsData) : addPosts(postsData));
    }
  } catch (error) {
    console.error('Error fetching posts:', error);
  } finally {
    dispatch(setLoading(false));
  }
};

export default postsSlice.reducer;
