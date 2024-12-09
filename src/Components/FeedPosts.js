import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '../ReduxSlicers/postsSlice';
import filledHearIcon from '../Assests/filledHearIcon.svg';
import shareIcon from '../Assests/shareIcon.svg';
import SharePopup from './SharePopup';
import plusIcon from "../Assests/plus.svg"
import { useNavigate } from 'react-router-dom';

const FeedPosts = () => {
  const [showSharePopup, setShowSharePopup] = useState(false);
  const { posts, loading, hasMore, page } = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // console.log("for clarity", posts);
  const formatTimeAgo = (timestamp) => {
    const createdAt = new Date(timestamp);
    const now = new Date();
    const timeDiff = now - createdAt;
    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
    }
  };

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100 && hasMore && !loading) {
      dispatch(fetchPosts(page + 1));
    }
  };

  useEffect(() => {
    // Dispatch fetchPosts action on component load
    dispatch(fetchPosts(page));
  }, [dispatch, page]);

  const share = () => {
    setShowSharePopup(prestate => !prestate);
  };

  // Function to handle video play/pause based on visibility
  const handleVideoVisibility = (videoElement) => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            videoElement.play(); // Play video when it's in the viewport
          } else {
            videoElement.pause(); // Pause video when it's out of the viewport
          }
        });
      },
      { threshold: 0.5 } // Trigger when 50% of the video is in the viewport
    );

    if (videoElement) {
      observer.observe(videoElement);
    }

    return () => {
      if (videoElement) {
        observer.unobserve(videoElement);
      }
    };
  };


  const newPost = () => {
    navigate("/createpost")
}

  

return (
  <div>
    {posts
      .slice() // Create a shallow copy to avoid mutating the original array
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by newest first
      .map((post) => {
        return (
          <div key={post.id} className="feed-post-section border  mr-[1rem] relative px-[0.75rem]  mb-[10px] rounded-[1.6rem] bg-[#F7EBFF] flex flex-col">
            <div className="flex items-center h-[3.125rem] mt-[0.75rem]">
              <img src={post.photoURL} alt="dp" className="w-[3.125rem] h-[3.125rem] rounded-full" />
              <div className="ml-[0.625rem] flex flex-col">
                <p className="font-semibold font-karla text-[1rem] leading-[1.16rem] mb-[1px]">
                  {post.Name}
                </p>
                <p className="leading-[0.7rem] text-[0.6rem] text-[#00000054] font-kumbh">
                  {formatTimeAgo(post.createdAt)}
                </p>
              </div>
            </div>
            <div className="mt-[0.87rem]">
              <p className="text-[0.75rem] font-kumbh leading-[0.93rem]">{post.text}</p>
              <span className="text-[0.75rem] font-kumbh leading-[0.93rem] text-[#3C8DFF]">
                #NYC #Travel
              </span>
            </div>

            <div className="mt-[0.87rem] flex items-center justify-center">
              {post.fileType === "video" ? (
                <video
                  ref={(el) => handleVideoVisibility(el)}
                  className=" h-[10.5rem] rounded-[0.75rem]"
                  muted
                  autoPlay
                >
                  <source src={post.fileUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img src={post.fileUrl} alt="dp" className="h-[10.5rem] rounded-[0.75rem]" />
              )}
            </div>

            <div className="flex mt-[1.25rem] justify-between mb-[0.75rem]">
              <div className="flex items-center">
                <img src={filledHearIcon} alt="heart icon" className="w-[1rem] h-[1rem]" />
                <span className="ml-2 text-red-700 text-sm">
                  {Math.floor(Math.random() * 100) + 1}
                </span>
              </div>
              <div className="flex items-center share-btn cursor-pointer" onClick={share}>
                <img src={shareIcon} alt="share icon" className="w-[1rem] h-[1rem]" />
                <p>share</p>
              </div>
            </div>
          </div>
        );
      })}
    <div
      onClick={newPost}
      className="rounded-full cursor-pointer sticky bottom-[1.75rem] left-[55rem] shadow-lg shadow-[#c3b7b7] flex justify-center items-center  bg-black z-[100] h-[3.125rem] w-[3.125rem]"
    >
      <img src={plusIcon} alt="plusICon" className="w-[1rem] h-[1rem]" />
    </div>
    {showSharePopup && <SharePopup handlechangeShare={share} />}
  </div>
);

};

export default FeedPosts;
