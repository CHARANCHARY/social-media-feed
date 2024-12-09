import {  useContext} from "react";
import { useNavigate } from 'react-router-dom';
import FeedPosts from "./FeedPosts";
import { AppContext } from '../Context/AppContextProvider';

import { useSelector , useDispatch} from 'react-redux';


import { signOut } from "firebase/auth";
import { auth } from "../Services/Firebase";

const Feed = () => {


    const { useradmin } = useSelector((state) => state.userDetials);




    console.log("redux usr deials ",useradmin)





    const context = useContext(AppContext);
    const navigate = useNavigate()
    if (!context) {
        throw new Error("AppContext must be used within a AppContextProvider");
    }

    const { setUserInfo } = context;
    
    





    const handleLogout = async () => {
        try {
            console.log("Attempting to log out...");
    
            // Sign out from Firebase
            await signOut(auth);
    
            // Clear user data from localStorage
            window.localStorage.removeItem("user");
            window.localStorage.removeItem("lastLoginDate");
    
            window.sessionStorage.clear(); // Clears session data
    
         
            setUserInfo({}); // Assuming `setUserInfo` is a function from your context
    
            console.log("Successfully logged out");
    
            // Redirect to the login page (or home page)
            navigate("/"); // Make sure the route "/login" exists and is configured properly
        } catch (error) {
            console.error("Error during logout:", error.message);
        }
    };

    const { userInfo } = context;
    return (
        <>
           <div className="flex w-[50vh] h-[3.125rem]  mt-[1rem] ">
            {/* User Info */}
            <div onClick={() => { navigate("/profile") }} className="flex items-center">
                <img src={useradmin?.photoURL} alt="dp" className="w-[3.125rem] h-[3.125rem] rounded-full" />
                <div className="ml-[0.625rem] flex flex-col">
                    <p className="text-[0.625rem] leading-[0.77rem] font-kumbh text-[#00000054]">Welcome Back,</p>
                    <p className="leading-[1.24rem] text-[1rem] font-kumbh font-semibold">
                        {useradmin?.name?.charAt(0).toUpperCase() + useradmin?.name?.slice(1)}
                    </p>
                </div>
            </div>

            {/* Logout Button */}
            <button
            onClick={handleLogout}
            className="ml-auto bg-blue-100 hover:bg-blue-200 text-gray-800 px-4 py-2 rounded-3xl font-kumbh text-sm"
            >
             Logout
            </button>

        </div>
            <div className="ml-[1rem] mt-[1.9rem]">
                <p className="font-extrabold text-[1.5rem] font-karla leading-[1.75rem] mb-[1.18rem]">Feeds</p>
                <FeedPosts />
            </div>
        </>
    )

}

export default Feed