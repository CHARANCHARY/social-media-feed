import { useContext, useState, useEffect } from "react";
import { AppContext } from "../Context/AppContextProvider";
import { doc, updateDoc, setDoc, getDoc } from "firebase/firestore";
import backArrow from "../Assests/backArrow.svg";
import pencil from "../Assests/pencil.svg";
import { db } from "../Services/Firebase";
import { useNavigate } from "react-router-dom";
import { fetchUserDetails} from "../ReduxSlicers/UserDetailsSlice";
import { useDispatch } from 'react-redux';







const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/du74u7bsh/image/upload";

const CLOUDINARY_PRESET = "fklju72c";

const EditProfile = () => {
    const context = useContext(AppContext);



    const dispatch = useDispatch();
    useEffect(() => {
      dispatch(fetchUserDetails());
    }, [dispatch]);
  

    const [userInput, setUserInput] = useState({
        name: '',
        bio: '',
        coverPhoto: '',
        profilePhoto: '',
    });
    const [profileUpdated, setProfileUpdated] = useState(false);
    const [errorProfileUpdated, setErrorProfileUpdated] = useState(false);
    const [coverPhotoFile, setCoverPhotoFile] = useState(null);
    const [profilePhotoFile, setProfilePhotoFile] = useState(null);
    const [coverPhotoPreview, setCoverPhotoPreview] = useState(null);
    const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    if (!context) {
        throw new Error("AppContext must be used within an AppContextProvider");
    }

    const { userInfo } = context;

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const userDocRef = doc(db, "users", userInfo.uid);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    setUserInput({
                        name: userData.Name || userInfo.displayName,
                        bio: userData.description || '',
                        coverPhoto: userData.coverPhotoURL || '',
                        profilePhoto: userData.photoURL || ''
                    });
                } else {
                    await setDoc(userDocRef, {
                        Name: userInfo.displayName,
                        description: '',
                        photoURL: userInfo.photoURL,
                        coverPhotoURL: ''
                    });
                    setUserInput({
                        name: userInfo.displayName,
                        bio: ''
                    });
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };

        fetchUserProfile();
    }, [userInfo.uid, userInfo.displayName]);

    const uploadImageToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", CLOUDINARY_PRESET);

        try {
            const response = await fetch(CLOUDINARY_URL, {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            return data.secure_url;
        } catch (error) {
            console.error("Cloudinary upload error:", error);
            throw error;
        }
    };

    const saveData = async () => {
        setIsLoading(true);
        try {
            const updatedData = {
                Name: userInput.name,
                description: userInput.bio,
            };

            // Handle profile photo upload
            if (profilePhotoFile) {
                try {
                    updatedData.photoURL = await uploadImageToCloudinary(profilePhotoFile);
                } catch (uploadError) {
                    console.error("Profile photo upload failed", uploadError);
                    alert("Failed to upload profile photo.");
                    return;
                }
            }

            // Handle cover photo upload
            if (coverPhotoFile) {
                try {
                    updatedData.coverPhotoURL = await uploadImageToCloudinary(coverPhotoFile);
                } catch (uploadError) {
                    console.error("Cover photo upload failed", uploadError);
                    alert("Failed to upload cover photo.");
                    return;
                }
            }

            // Update Firestore document
            const userRef = doc(db, "users", userInfo.uid);
            await updateDoc(userRef, updatedData);

            // Update local context
            context.updateUserInfo(updatedData);
            setProfileUpdated(true);
        } catch (error) {
            console.error("Error updating profile:", error);
            setErrorProfileUpdated(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            const fileURL = URL.createObjectURL(file);
            if (type === "cover") {
                setCoverPhotoFile(file);
                setCoverPhotoPreview(fileURL);
            } else if (type === "profile") {
                setProfilePhotoFile(file);
                setProfilePhotoPreview(fileURL);
            }
        }
    };

    setTimeout(() => {
        if (profileUpdated) {
            setProfileUpdated(false);
            navigate("/profile");
        }
        if (errorProfileUpdated) {
            setErrorProfileUpdated(false);
        }
    }, 2000);

    return (
        <>
        <div className="w-[50vh]">
            <div className="flex flex-col  ">
                {/* Cover Photo Section */}
                <div className="w-[100%] relative h-[12rem] rounded-b-[1.25rem]">
                    <img
                        src={coverPhotoPreview || userInput?.coverPhoto || userInfo.coverPhotoURL}
                        alt="coverPhoto"
                        className="w-full h-full object-cover"
                    />
                    <button
                        className="absolute top-[1.5rem] left-[1.4rem] flex"
                        onClick={() => navigate("/profile")}
                    >
                        <img src={backArrow} alt="backArrow" className="w-[1.6rem] h-auto" />
                        <p className="font-extrabold font-karla leading-[1.46rem] text-[1.25rem] text-white ml-[0.8rem]">
                            Edit Profile
                        </p>
                    </button>
                    <button
                        onClick={() => document.getElementById("coverPicInput").click()}
                        className="absolute flex justify-center items-center bottom-[0.5rem] right-[1rem] bg-[#f4f4f4] rounded-full w-[1.68rem] h-[1.68rem]"
                    >
                        <img src={pencil} alt="pencil" className="w-[0.81rem]" />
                    </button>
                    <input
                        type="file"
                        id="coverPicInput"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, "cover")}
                    />

                    {/* Profile Photo Section */}
                    <div className="absolute bottom-[-20.5%] z-[101] left-[1rem]">
                        <div className="relative">
                            <img
                                src={profilePhotoPreview || userInput?.profilePhoto || userInfo.photoURL}
                                referrerPolicy="no-referrer"
                                alt="userPic"
                                className="w-[7rem] h-[7rem] rounded-full"
                            />
                            <button
                                onClick={() => document.getElementById("profilePicInput").click()}
                                className="absolute bottom-[1rem] right-[-0.1rem] flex justify-center items-center bg-[#f4f4f4] rounded-full w-[1.68rem] h-[1.68rem]"
                            >
                                <img src={pencil} alt="pencil" className="w-[0.81rem]" />
                            </button>
                        </div>
                    </div>
                    <input
                        type="file"
                        id="profilePicInput"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, "profile")}
                    />
                </div>
            </div>

            {/* User Details Section */}
                <div className="flex flex-col w-[48vh] h-[40vh] justify-center items-start">
                    <p className="text-[0.87rem] leading-[1.24rem] font-kumbh">Name</p>
                    <input
                        type="text"
                        name="name"
                        value={userInput.name}
                        onChange={(e) => setUserInput({ ...userInput, name: e.target.value })}
                        className="border-b-[0.4px] w-full border-black text-[0.87rem] font-semibold leading-[1.24rem] font-kumbh"
                    />

                    <p className="mt-[1.05rem] text-[0.87rem] leading-[1.24rem] font-kumbh">Bio</p>
                    <input
                        type="text"
                        name="bio"
                        value={userInput.bio}
                        onChange={(e) => setUserInput({ ...userInput, bio: e.target.value })}
                        className="border-b-[0.4px] w-full border-black text-[0.87rem] leading-[1.24rem] font-semibold font-kumbh"
                    />
                </div>
         

            {/* Save Button */}
            <div className="absolute h-[40vh] top-[90%] left-0 right-0 flex justify-center items-center">
                <button
                    onClick={saveData}
                    disabled={isLoading}
                    className="bg-[#000] text-white px-[1rem] py-[0.31rem] font-karla h-[3rem] font-bold rounded-[2.25rem] w-[20.5rem]"
                >
                    {isLoading ? "Saving..." : "SAVE"}
                </button>
            </div>

            {
                profileUpdated &&
                <div className="absolute top-[5%] left-0 right-0 flex justify-center items-center">
                    <button className="bg-[#000] text-white px-[1rem] rounded-lg font-karla h-[1.5rem] font-bold  w-[20.5rem]">
                        Profile Updated Successfully
                    </button>
                </div>
            }
            {
                errorProfileUpdated &&
                <div className="absolute top-[5%] left-0 right-0 flex justify-center items-center">
                    <button className="bg-[#000] text-white px-[1rem] rounded-lg font-karla h-[1.5rem] font-bold  w-[20.5rem]">
                        Error Please retry
                    </button>
                </div>
            }

        </div>
        </>
    );
};

export default EditProfile;