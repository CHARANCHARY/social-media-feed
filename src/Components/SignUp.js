import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../Services/Firebase';
import { useContext, useEffect } from 'react';
import { AppContext } from '../Context/AppContextProvider';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../Services/Firebase';  // Import Firestore instance
import { FcGoogle } from "react-icons/fc";




import c1p1 from "../Assests/c1p1.png";
import c1p2 from "../Assests/c1p2.png";
import c1p3 from "../Assests/c1p3.png";
import c2p1 from "../Assests/c2p1.png";
import c2p2 from "../Assests/c2p2.png";
import c2p3 from "../Assests/c2p3.png";
import c3p1 from "../Assests/c3p1.png";
import c3p2 from "../Assests/c3p2.png";
import c3p3 from "../Assests/c3p3.png";
import Logo from "../Assests/logo-vibe.png";






const SignUp = () => {
    const context = useContext(AppContext);

    if (!context) {
        throw new Error("AppContext must be used within an AppContextProvider");
    }

    const { setUserInfo } = context;

    const handleSignUp = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            if (user) {
                // Set user data in sessionStorage
                window.sessionStorage.setItem("user", JSON.stringify(user));
                setUserInfo(user);

                // Create a profile document for the user in Firestore
                const userRef = doc(db, 'users', user.uid);

                // Check if user already exists in Firestore
                const userDoc = await getDoc(userRef);
                if (!userDoc.exists()) {
                    // Create a new user profile document if not exists
                    await setDoc(userRef, {
                        name: user.displayName || 'Anonymous',
                        email: user.email || 'N/A',
                        profilePic: user.photoURL || '',
                        coverPic: '',
                        description: '',
                    });
                    console.log('Profile created for user:', user.uid);
                } else {
                    console.log('User profile already exists');
                }

                const currentDate = new Date().getTime();
                window.sessionStorage.setItem("lastLoginDate", currentDate);
            }
        } catch (error) {
            console.error("Error during sign-in:", error);
        }
    };

    useEffect(() => {
        const lastLoginDate = window.sessionStorage.getItem("lastLoginDate");

        if (lastLoginDate) {
            const currentDate = new Date().getTime();
            const sevenDaysInMilliseconds = 7 * 24 * 60 * 60 * 1000;

            if (currentDate - lastLoginDate > sevenDaysInMilliseconds) {
                window.sessionStorage.clear();
            }
        }
    }, []);

    return (
        <>
            {/* <div className="h-[100vh] lex flex-col justify-center items-center">
                <div className="h-[63%] "><img src={background} className='w-full' /></div>
                <div className="h-[37%] z-[100] relative  rounded-t-[3.9rem] bg-[white] flex flex-col items-center ">
                    <div className='flex flex-col justify-center items-center mt-[2.1rem] mx-[2.3rem]'>
                        <div className='flex'>
                            <img src={vibeSnapLogo} alt="vibeSnapLogo" className='w-[2.8rem] h-auto' />
                            <p className=' leading-[2rem] font-semibold text-[1.75rem] font-karla'>Vibesnap</p>
                        </div>
                        <p className=' mt-[0.5rem] leading-[1.2rem] font-normal text-[1rem] font-kumbh'>Moments That Matter, Shared Forever.</p>
                    </div>

                    <div className='flex flex-col bg-[#292929] mt-[1.8rem]  rounded-[1.6rem]'>
                        <button className='flex items-center' onClick={handleSignUp}>
                            <img src={googleLogo} alt="googleLogo" className='w-[1.1rem] h-[auto] my-[1rem] ml-[1rem]' />
                            <p className=' ml-[0.87rem] leading-[1.4rem] font-bold text-[1rem] text-white font-karla mr-[1.18rem]'>Continue with Google</p>
                        </button>
                    </div>
                </div>
            </div> */}





















            <div className="flex items-center relative justify-center flex-col border border-black">
      <div className="flex flex-col h-[800px]">
        <div className="columns-3 w-[360px] relative">
          <img src={c1p1} className="mb-3" alt="login-page" />
          <img src={c1p2} className="mb-3" alt="login-page" />
          <img src={c1p3} className="mb-3" alt="login-page" />
          <img src={c2p1} className="mb-3" alt="login-page" />
          <img src={c2p2} className="mb-3" alt="login-page" />
          <img src={c2p3} className="mb-3" alt="login-page" />
          <img src={c3p1} className="mb-3" alt="login-page" />
          <img src={c3p2} className="mb-3" alt="login-page" />
          <img src={c3p3} className="mb-3" alt="login-page" />
        </div>
        <div className="absolute rounded-[60px] bg-white w-[360px] h-[250px] bottom-[80px] z-10 flex flex-col items-center gap-4">
          <div className="flex mt-10">
            <img src={Logo} alt="Logo" />
            <div className="font-semibold text-lg">Vibesnap</div>
          </div>
          <div>Moments That Matter, Shared Forever.</div>
          <button
            onClick={handleSignUp}
            className="border border-black w-[200px] bg-[#292929] text-white p-3 rounded-[26px] flex items-center justify-around"
          >
            <FcGoogle fontSize={18} />
            <div className="text-sm">Continue with Google</div>
          </button>
        </div>
      </div>
    </div>






        </>





    );
}

export default SignUp;
