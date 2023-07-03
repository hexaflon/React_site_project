import { Route, Routes, Navigate } from "react-router-dom"
import Main from "./components/Main"
import Signup from "./components/Signup"
import Login from "./components/Login"
import Profile from "./components/Profile"
function App() {
    const user = localStorage.getItem("token")
    return (
        <Routes>
            {user && <Route path="/" exact element={<Main />} />}
            {user && <Route path="/profile" exact element={<Profile />} />}
            <Route path="/signup" exact element={<Signup />} />
            <Route path="/login" exact element={<Login />} />
            <Route path="/" element={<Navigate replace to="/login" />} />
            <Route path="/profile"  element={<Navigate replace to ="/login"/>} />
        </Routes>
    )
}
export default App