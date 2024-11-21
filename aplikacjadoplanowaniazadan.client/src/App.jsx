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


function App() {
    const [token, setToken] = React.useState(
        () => {
            var item = sessionStorage.getItem("token");
            return item ? JSON.parse(item) : null;
        }
    );

    React.useEffect(() => {
        sessionStorage.setItem("token", JSON.stringify(token));
    }, [token]);

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