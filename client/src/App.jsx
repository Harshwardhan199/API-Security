import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./components/home.jsx";
import LoginSignUp from "./components/loginSignUp.jsx";

function App() {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<LoginSignUp />} />
                </Routes>
            </Router>
        </>
    )
}

export default App