import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// import AppNavbar from './components/AppNavbar';
import Login from './pages/Login';
import { UserProvider } from './UserContext';
// import Home from './pages/Home';


function App() {

    const [user, setUser] = useState({
        id: null,
        isAdmin: null
    });

    const unsetUser = () => {
      localStorage.clear();
    };

    useEffect(() => {

        fetch(``, {
            headers: {
                Authorization: `Bearer ${ localStorage.getItem('token') }`
            }
        })
        .then(res => res.json())
        .then(data => {
          
            if (typeof data.user !== "undefined") {

                setUser({
                  id: data.user._id,
                  isAdmin: data.user.isAdmin
                });

            } else {

                setUser({
                  id: null,
                  isAdmin: null
                });
            }
        })
    }, []);

    return (
        <UserProvider value={{user, setUser, unsetUser}}>
            <Router>
                {/* <AppNavbar /> */}
                <Routes>
                    {/* <Route path="/" element={<Home />} /> */}
                    <Route path="/login" element={<Login />} />
                </Routes>
            </Router>
        </UserProvider>
    );
}

export default App;
