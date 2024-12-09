import coverPhoto from "../Assests/userDummyCoverPhoto.svg";
import backArrow from "../Assests/backArrow.svg";
import { useContext, useState } from "react";
import { AppContext } from "../Context/AppContextProvider";
import PostsSection from "./PostsSection";
import plusIcon from "../Assests/plus.svg"
import { useNavigate } from 'react-router-dom';
import { useSelector , useDispatch} from 'react-redux';





const UserProfile = () => {
    const { useradmin } = useSelector((state) => state.userDetials);
    const navigate = useNavigate()

    const edit = () => {
        navigate('/editProfile');
    }
    const newPost = () => {
        navigate("/createpost")
    }
    // console.log("sakchkk",useradmin.uid);

    return (
        <>
        <div className="flex items-center relative justify-center flex-col  w-[50vh] ">
            <div className="flex flex-col ">
                <div className="w-[100%] relative h-[30%] rounded-b-[1.25rem]">
                    <img src={useradmin.coverPhotoURL || coverPhoto} alt="coverPhoto" className="h-[30%] w-[100%]" />
                    <button className="absolute top-[1.5rem] left-[1.4rem] flex" onClick={() => navigate("/feed")}>
                        <img src={backArrow} alt="backArrow" className="w-[1.6rem] h-auto" />
                    </button>
                    <div className="absolute bottom-[-20.5%] z-[101] left-[1rem]">
                        <div className="relative">
                            <img src={useradmin.photoURL} referrerPolicy="no-referrer" alt="userPic" className="w-[7rem] h-[7rem] rounded-full" />
                        </div>
                    </div>
                    <input type="file" id="profilePicInput" className="hidden" />
                </div>
            </div>
            <div onClick={edit}
                className="flex justify-center rounded-[2.25rem] h-[2rem] mt-[1rem] mr-[1rem] ml-[8.5rem] py-[0.3rem] px-[1rem] cursor-pointer border border-[#00000057]">
                <p className="leading-[0.87rem] font-karla text-[0.75rem] font-bold flex justify-center items-center ">Edit Profile</p>
            </div>
            <div className="mt-[1.5rem] ml-[0.93rem] mr-[1rem] ">
                <p className="text-[1.5rem] leading-[1.75rem] font-extrabold font-karla">{useradmin?.name}</p>
                <p className="leading-[1.08rem] mt-[0.62rem] text-[0.875rem] font-kumbh">{useradmin.description}</p>
                {/* My Posts */}
                <div className="mt-[1.5rem]">
                    <p className="font-karla font-semibold text-[1.125rem] leading-[1.3rem] text-[#000] mb-8">My Posts</p>
                    <PostsSection  value={useradmin.uid}/>
                    <div onClick={newPost}
                        className="rounded-full cursor-pointer sticky bottom-[1.75rem] left-[55rem] shadow-lg shadow-[#c3b7b7] flex justify-center items-center  bg-black z-[100] h-[3.125rem] w-[3.125rem]">
                        <img src={plusIcon} alt="plusICon" className="w-[1rem] h-[1rem] " />
                    </div>
                </div>
            </div>
            </div>
        </>
    )
}
export default UserProfile