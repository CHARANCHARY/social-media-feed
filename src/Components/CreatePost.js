import React, { useState, useRef } from "react";
import backArrow from "../Assests/blackBackArrow.svg";
import camera from "../Assests/camera.svg";
import fileupload from "../Assests/file-upload.svg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app, db, auth } from '../Services/Firebase'; 
import { doc, getDoc } from "firebase/firestore";
import Webcam from "react-webcam";
import captureIcon from "../Assests/aperture.svg"

const CreatePost = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [text, setText] = useState("");
  const [isCameraActive, setIsCameraActive] = useState(false); // To toggle camera view
  const [isLoading, setIsLoading] = useState(false); // Define loading state
  const webcamRef = useRef(null); // Webcam reference

  const navigate = useNavigate();

  const handleFileChange = (event) => {
    let files = Array.from(event.target.files);
    console.log("Files selected by user", files);
    setSelectedFiles(files);
    setIsCameraActive(false); // Disable camera view when files are selected
  };

 


  const capture = () => {
    // Capture the image from the webcam
    let imageSrc = webcamRef.current.getScreenshot();

    console.log();
    let file = dataURLtoFile(imageSrc, 'captured-image.jpg');

    // Set the captured image to the selectedFiles state
    setSelectedFiles([file]);
    setIsCameraActive(false); // Turn off the camera view after capturing
  };


  // Convert base64 data URL to a file object
  const dataURLtoFile = (dataUrl, filename) => {
    let arr = dataUrl.split(',');
    let mime = arr[0].match(/:(.*?);/)[1];
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while(n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, {type: mime});
  };



  // Function to check if the file is a video
  const isVideo = (file) => {
    return file.type.startsWith("video/");
  };

  // Upload file to Cloudinary
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "fklju72c");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/du74u7bsh/upload",
        formData
      );
      return response.data.secure_url;
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      throw error;
    }
  };

  // Handle post creation
  const handleCreatePost = async () => {
    if (selectedFiles.length === 0 || !text.trim()) {
      alert("Please add an image/video and some text.");
      return;
    }

    setIsLoading(true); // Set loading state to true

    try {
      const user = auth.currentUser;

      if (!user) {
        alert("You must be logged in to create a post.");
        return;
      }

      const userId = user.uid;
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        alert("User details not found. Please update your profile.");
        return;
      }

      const userData = userDoc.data();
      const Name = userData.Name || "Unknown";
      const photoURL = userData.photoURL || "";

      // Upload the first file (image/video) to Cloudinary
      const fileUrl = await uploadToCloudinary(selectedFiles[0]);

      // Determine file type
      const fileType = isVideo(selectedFiles[0]) ? "video" : "image";

      // Save post data to Firestore
      const postData = {
        fileUrl,
        text,
        userId,
        Name,
        photoURL,
        fileType,
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, "posts"), postData);

      alert("Post created successfully!");
      setSelectedFiles([]);
      setText("");
      navigate("/feed");
    } catch (error) {
      console.error("Post Creation Error:", error);
      alert("Failed to create the post.");
    } finally {
      setIsLoading(false); // Reset loading state after post is created
    }
  };

  return (
    <div className="w-[50vh] h-[90vh]">
      <div>
        <button
          className="absolute top-[1.5rem] flex"
          onClick={() => navigate("/profile")}
        >
            <img src={backArrow} alt="backArrow" className="w-[1.6rem] h-auto" />

          <p className="font-extrabold font-karla leading-[1.46rem] text-[1.25rem] ml-[0.8rem]">
            New Post
          </p>
        </button>

        <div className="flex items-center justify-center mt-[6rem]">
          <div className="mx-[2.6rem] w-full flex items-center justify-center aspect-square rounded-[0.75rem] bg-[#d3d3d3] relative overflow-hidden">
            {isCameraActive ? (
              // Show the webcam when the camera is active
              <>
                <Webcam
                  audio={false}
                  height={350}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  width={320}
                  videoConstraints={{
                    width: 460,
                    height: 460,
                    facingMode: "user",
                  }}
                />
                <button
                  onClick={capture}
                  className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-white text-black p-2 rounded-full"
                >
                  <img 
                    src={captureIcon}
                    alt="capture"
                    className="capture"
                  />
                </button>
              </>
            ) : selectedFiles.length > 0 ? (
              isVideo(selectedFiles[0]) ? (
                <video
                  src={URL.createObjectURL(selectedFiles[0])}
                  className="w-full h-full object-cover rounded-[0.75rem]"
                  autoPlay
                  muted={false}
                  controls
                />
              ) : (
                <img
                  src={URL.createObjectURL(selectedFiles[0])}
                  alt="Selected"
                  className="w-full h-full object-cover rounded-[0.75rem]"
                />
              )
            ) : (
              <div className="flex justify-center gap-4">
                {/* Camera icon triggers webcam capture */}
                <label htmlFor="file-input">
                  <img
                    src={camera}
                    alt="file-upload"
                    className="w-[5rem] h-auto cursor-pointer"
                    onClick={() => setIsCameraActive(true)} // Show webcam on click
                  />

                  <img
                    src={fileupload}
                    alt="file-upload"
                    className="w-[6rem] h-auto cursor-pointer"
                  />
                </label>
              </div>
            )}

            {/* Hidden file input element */}
            <input
              id="file-input"
              type="file"
              accept="image/*, video/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>

        <div className="mt-[1.8rem] flex justify-center">
          <div className="flex flex-col justify-center items-start">
            <textarea
              type="text"
              name="NewPost"
              placeholder="What's on your mind"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="text-[0.87rem] leading-[1.24rem] h-[20vh] font-semibold font-kumbh"
            />
          </div>
        </div>

        <div className="absolute left-0 right-0 flex justify-center items-center">
          <button
            onClick={handleCreatePost}
            className={`bg-[#000] text-white px-[1rem] py-[0.31rem] font-karla h-[3rem] font-bold rounded-[2.25rem] w-[20.5rem] ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={isLoading} // Disable button when loading
          >
            {isLoading ? "Posting..." : "Create Post"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
