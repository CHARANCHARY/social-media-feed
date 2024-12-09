// import React, { useState } from "react";
// import Webcam from "react-webcam";

// const videoConstraints = {
//   width: 220,
//   height: 200,
//   facingMode: "user",
// };

// const WebcamCapture = () => {
//   const [image, setImage] = useState("");
//   const [preview, setPreview] = useState(false); // State to toggle preview modal
//   const webcamRef = React.useRef(null);

//   const capture = React.useCallback(() => {
//     const imageSrc = webcamRef.current.getScreenshot();
//     setImage(imageSrc);
//   } , []);

//   return (
//     <div className="webcam-container">
//       <div className="webcam-img">
//         {image === "" ? (
//           <Webcam
//             audio={false}
//             height={200}
//             ref={webcamRef}
//             screenshotFormat="image/jpeg"
//             width={220}
//             videoConstraints={videoConstraints}
//           />
//         ) : (
//           <img src={image} alt="Captured" />
//         )}
//       </div>
//       <div className="button-group">
//         {image !== "" ? (
//           <>
//             <button
//               onClick={(e) => {
//                 e.preventDefault();
//                 setImage("");
//                 setPreview(false); // Close preview if retaking the image
//               }}
//               className="webcam-btn"
//             >
//               Retake Image
//             </button>
//             <button
//               onClick={(e) => {
//                 e.preventDefault();
//                 setPreview(true); // Show preview
//               }}
//               className="webcam-btn"
//             >
//               Preview Image
//             </button>
//           </>
//         ) : (
//           <button
//             onClick={(e) => {
//               e.preventDefault();
//               capture();
//             }}
//             className="webcam-btn"
//           >
//             Capture
//           </button>
//         )}
//       </div>

//       {/* Preview Modal */}
//       {preview && (
//         <div className="preview-modal">
//           <div className="preview-content">
//             <h2>Preview Image</h2>
//             <img src={image} alt="Preview" className="preview-img" />
//             <button
//               onClick={() => setPreview(false)}
//               className="webcam-btn close-btn"
//             >
//               Close Preview
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default WebcamCapture;
