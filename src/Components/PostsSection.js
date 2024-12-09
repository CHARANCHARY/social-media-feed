import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';  // Import Redux hooks
import { fetchPosts } from '../ReduxSlicers/postsSlice'; // Import the fetchPosts action
import { getAuth } from 'firebase/auth';  // Import Firebase auth

const PostsSection = ({value}) => {
  const dispatch = useDispatch();
  const { posts, loading } = useSelector((state) => state.posts);
  const [ userUID, setUserUID ]  = useState(value);




  useEffect(() => {
    dispatch(fetchPosts(1));
  }, []);





  const filteredPosts = posts.filter((post) => post.userId === userUID);

  console.log("filter data" , filteredPosts)

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {filteredPosts.length === 0 ? (
        <div>No posts available for this user.</div>
      ) : (
        filteredPosts.map((post, index) => (
          <div key={index} className="bg-white h-auto rounded-lg shadow-md overflow-hidden post-section">
            {(
              <div className="relative">
                <div >
                    {post.fileType == "video"? (
                        <video

                    
                        className="w-auto h-[14.5rem] post-video"
                        muted
                        autoPlay
                        >
                        <source src={post.fileUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                        </video>
                    ) : (
                        <img src={post.fileUrl} alt="dp" className="h-auto post-image" />
                    )}
                </div>

                <div className="font-medium absolute bottom-0 left-0 right-0 bg-none p-3 bg-opacity-50 text-white text-left">
                  <p className="text-lg text-sm font-medium truncate">{post.text}</p>
                  <span className="text-red-500 text-sm ">❤️</span>
                  <span className="ml-2 text-gray-600 text-sm">
                    {Math.floor(Math.random() * 100) + 1} likes
                  </span>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default PostsSection;
