import './App.css';
import SignUp from './Components/SignUp';
import EditProfile from './Components/EditProfile';
import UserProfile from './Components/UserProfile';
import { useContext, useEffect } from 'react';
import { AppContext } from './Context/AppContextProvider';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Feed from './Components/Feed';
import CreatePost from './Components/CreatePost';
import { fetchUserDetails} from "./ReduxSlicers/UserDetailsSlice";
import { useDispatch } from 'react-redux';
import WebcamCapture from './Components/uploadByCemara';

function App() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext must be used within an AppContextProvider");
  }
  const location = useLocation();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUserDetails());
  }, [location]);


  const { userInfo, setUserInfo } = context;
  const navigate = useNavigate();

  console.log( " user information " + userInfo);
  console.log(userInfo)

  const isUserLoggedIn = Object.keys(userInfo).length > 0;

  useEffect(() => {
    const storedUser = window.sessionStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserInfo(user);
    }

    const lastLoginDate = window.sessionStorage.getItem("lastLoginDate");
    if (lastLoginDate) {
      const currentDate = new Date().getTime();
      const sevenDaysInMilliseconds = 7 * 24 * 60 * 60 * 1000;
      if (currentDate - lastLoginDate > sevenDaysInMilliseconds) {
        window.sessionStorage.clear();
        setUserInfo({});
      }
    }
  }, [setUserInfo]);

  useEffect(() => {
    if (isUserLoggedIn && location.pathname === '/') {
      navigate('/feed');
    }
  }, [isUserLoggedIn, location.pathname, navigate]);

  return (
    <div className="flex items-center relative justify-center flex-col  border border-[#00000057]">
   
        <Routes>
          <Route path="/pic" element={!isUserLoggedIn ? <SignUp /> : <WebcamCapture />} />
          <Route path="/" element={!isUserLoggedIn ? <SignUp /> : <EditProfile />} />
          <Route path="/profile" element={isUserLoggedIn ? <UserProfile /> : <SignUp />} />
          <Route path="/editprofile" element={isUserLoggedIn ? <EditProfile /> : <SignUp />} />
          <Route path="/feed" element={isUserLoggedIn ? <Feed /> : <SignUp />} />
          <Route path="/createpost" element={isUserLoggedIn ? <CreatePost /> : <SignUp />} />
        </Routes>
    </div>
  );
}

export default App;
