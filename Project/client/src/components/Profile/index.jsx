import styles from "./styles.module.css";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; 


const UserProfile = () => {
    const [firstName, setFirstName] = useState(localStorage.getItem('firstname'));
    const [lastName, setLastName] = useState(localStorage.getItem('lastname'));
    const [editing, setEditing] = useState(false);
    const [currentTime, setCurrentTime] = useState(localStorage.getItem('time') || '');
    useEffect(() => {
        
        const interval = setInterval(() => {
            localStorage.setItem('time', new Date().toLocaleString());
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    useEffect(() => {
        const handleStorageChange = () => {
            setCurrentTime(localStorage.getItem('time'));
        };
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);
    const handleEditProfile = () => {
        setEditing(true);
    };

    const handleCancelEdit = () => {
        setEditing(false);
        setFirstName(localStorage.getItem('firstname'));
        setLastName(localStorage.getItem('lastname'));
    };

    const handleSaveProfile = async () => {
        try {
            
            await axios.put("http://localhost:8080/api/users/updateProfile", {
                email: localStorage.getItem('email'),
                firstName,
                lastName,

            });

            localStorage.setItem('firstname', firstName);
            localStorage.setItem('lastname', lastName);

            setEditing(false);
        } catch (error) {
            console.error("Error during updating profile:", error);
        }
    };
    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    };

    return (
        <div className={styles.profile_container}>
            <nav className={styles.navbar}>
                <div>
                    <h1>
                        Witaj <Link to="/" className={styles.nameLink}>{localStorage.getItem('firstname')} {localStorage.getItem('lastname')}</Link>
                    </h1>
                </div>
                <div id="xd">
                    {currentTime}
                </div>
                <div>
                    <button className={styles.white_btn} onClick={handleLogout}>Logout</button>
                </div>
            </nav>
            <div className={styles.profile_info}>
                {editing ? (
                    <div>
                        <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First name" />
                        <br></br><input type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last name" />
                        <br></br><button onClick={handleSaveProfile}>Save</button>
                        <button onClick={handleCancelEdit}>Cancel</button>
                    </div>
                ) : (
                    <div>
                        <p><b>First Name:</b> {firstName}</p>
                        <p><b>Last Name:</b> {lastName}</p>
                        <button onClick={handleEditProfile}>Edit Profile</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
