import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";
import { Box } from "@mui/material";
import Home from "./pages/Home.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import NavigationBar from "./components/NavigationBar.jsx";


function App() {

    return (
        <BrowserRouter>
            <Box sx={{ display: "flex", flexDirection: 'column', flexWrap: 'no-wrap', height: "100vh", width: "100vw" }}>	
                <NavigationBar />
                <Routes>
                    <Route
                        path="/"
                        element={
                            <Home />
                        }
                    />
                    <Route
                        path="/signUp"
                        element={
                            <SignUp />
                        }
                    />
                    <Route
                        path="/signIn"
                        element={
                            <SignIn />
                        }
                    />   
                </Routes>
            </Box>
        </BrowserRouter>
        
    );
}

export default App;