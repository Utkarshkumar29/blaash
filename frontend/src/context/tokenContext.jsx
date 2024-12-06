import React, { createContext, useState } from "react";


const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || "")
    const [userId, setUserId] = useState(localStorage.getItem('userId') || "")


    return (
        <UserContext.Provider value={{ token, setToken, userId, setUserId }}>
            {children}
        </UserContext.Provider>
    );
};

export { UserContext, UserProvider };
