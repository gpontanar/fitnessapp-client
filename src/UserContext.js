import React, { useState, useEffect } from 'react';

const UserContext = React.createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: null, // Default id value as null
    isAdmin: false, // Default value for isAdmin
  });

  // Load user data from localStorage on app initialization
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const unsetUser = () => {
    localStorage.clear();
    setUser({
      id: null,
      isAdmin: false,
    });
  };

  return (
    <UserContext.Provider value={{ user, setUser, unsetUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;