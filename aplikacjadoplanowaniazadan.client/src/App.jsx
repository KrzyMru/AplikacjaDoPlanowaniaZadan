import React from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { Box } from "@mui/material";
import Home from "./pages/Home.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import NavigationBar from "./components/NavigationBar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocationCityIcon from '@mui/icons-material/LocationCity';

function App() {
    return (
        <React.Fragment>
            <MainComponent />
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme={"light"}
                transition: Bounce
            />
        </React.Fragment>
    );
}

function MainComponent() {
    const [token, setToken] = React.useState(
        () => {
            var item = sessionStorage.getItem("token");
            return item ? JSON.parse(item) : null;
        }
    );
    const [settings, setSettings] = React.useState(
        () => {
            var item = sessionStorage.getItem("settings");
            return item ? JSON.parse(item) :
                [
                    {
                        name: "Dark mode",
                        description: "Enable dark mode to reduce eye strain and enjoy a sleek, low-light interface.",
                        value: false
                    },
                ]
            ;
        }    
    );
    const icons = {
        internal:
            [
                { name: "Dark mode", icon: <DarkModeIcon fontSize='large' /> }
            ],
        user:
            [
                { name: "Task", icon: <TaskAltIcon /> },
                { name: "Clock", icon: <AccessAlarmIcon /> },
                { name: "Wallet", icon: <AccountBalanceWalletIcon /> },
                { name: "Building", icon: <AccountBalanceIcon /> },
                { name: "Cold", icon: <AcUnitIcon /> },
                { name: "Location", icon: <LocationOnIcon /> },
                { name: "City", icon: <LocationCityIcon /> },
            ]
    };

    React.useEffect(() => {
        sessionStorage.setItem("token", JSON.stringify(token));
    }, [token]);
    React.useEffect(() => {
        sessionStorage.setItem("settings", JSON.stringify(settings));
    }, [settings]);

    const LogoutWrapper = ({ children }) => {
        React.useEffect(() => {
            setToken(null);
        }, []);
        return children;
    };

    return (
        <BrowserRouter>
            <Box sx={{ display: "flex", flexDirection: 'column', flexWrap: 'no-wrap', height: "100vh", width: "100vw" }}>	
                <NavigationBar
                    token={token}
                />
                <Routes>
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute allowed={token !== null} redirectPath="/signIn">
                                <Home
                                    token={token}
                                    settings={settings}
                                    setSettings={setSettings}
                                    icons={icons}
                                /> 
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/signUp"
                        element={
                            <ProtectedRoute allowed={token == null}>
                                <SignUp />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/signIn"
                        element={
                            <ProtectedRoute allowed={token == null}>
                                <SignIn
                                    setToken={setToken}
                                />
                            </ProtectedRoute>
                        }
                    />   
                    <Route
                        path="/signOut"
                        element={
                            <ProtectedRoute allowed={token !== null}>
                                <LogoutWrapper>
                                    <Navigate to="/" replace />
                                </LogoutWrapper>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Box>
        </BrowserRouter>
        
    );
}

export default App;