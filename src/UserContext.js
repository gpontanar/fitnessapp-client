import React, { useState, useEffect } from 'react';

const UserContext = React.createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({
        id: null,
        token: null, // Add token to user state
    });
    const [loading, setLoading] = useState(true); // Add loading state

    // Load user data from localStorage on app initialization
    useEffect(() => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
          setUser(JSON.parse(storedUser));
      }
  }, []);

    const loginUser = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData)); // Save user data to localStorage
        setUser(userData); // Update user state
    };

    const logoutUser = () => {
        localStorage.clear(); // Clear all localStorage data
        setUser({
            id: null,
            token: null,
        });
    };

    return (
        <UserContext.Provider value={{ user, setUser, loginUser, logoutUser, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;