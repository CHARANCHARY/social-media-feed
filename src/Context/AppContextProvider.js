import { createContext, useState } from "react"

export const AppContext = createContext()

export const AppContextProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState({})
    const updateUserInfo = (updatedData) => {
        setUserInfo((prevState) => ({ ...prevState, ...updatedData }));
    };
    return (
        <AppContext.Provider value={{ userInfo, setUserInfo, updateUserInfo }}>
            {children}
        </AppContext.Provider>
    )

}