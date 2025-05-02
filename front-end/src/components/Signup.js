import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Signup.css";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
import API_BASE_URL from "../api";

function Signup({ setUser }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
    
        setErrorMessage(""); // reset any old error
    
        if (!name || !email || !password || !confirmPassword) {
            setErrorMessage("Please fill in all fields!");
            return;
        }
    
        if (password.length < 6) { // password too short
            setErrorMessage("Password must be at least 6 characters.");
            return;
        }
    
        if (password !== confirmPassword) { // password mismatch
            setErrorMessage("Passwords do not match!");
            return;
        }
    
        try {
            // Clear any existing token first
            localStorage.removeItem("token");

            const res = await axios.post(`${API_BASE_URL}/signup`, {
                name,
                email,
                password
            });
            
            localStorage.setItem("token", res.data.token);
            // 🔥 manually dispatch tokenChanged event
            window.dispatchEvent(new Event("tokenChanged"));
            
            const profileRes = await axios.get(`${API_BASE_URL}/profile`, {
                headers: {
                    Authorization: `Bearer ${res.data.token}`
                }
            });
    
            if (profileRes.status === 200) {
                if (setUser) {
                    setUser(profileRes.data.user);
                }
                navigate("/home");
            } else {
                setErrorMessage("Token verification failed.");
                localStorage.removeItem("token");
            }
        } catch (err) {
            console.error("Signup error:", err);
    
            if (err.response) {
                const { status, data } = err.response;
                if (status === 409) {
                    setErrorMessage(data.error || "Email already registered.");
                } else if (status === 400) {
                    setErrorMessage(data.error || "All fields are required.");
                } else {
                    setErrorMessage(data.error || "Unexpected error. Please try again.");
                }
            } else {
                setErrorMessage("Network error. Please check your connection.");
            }
        }
    };
    

    return (
        <motion.div 
            className="signup-container"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }} 
            transition={{ duration: 0.3, ease: "easeOut" }}
        >
            <div className="back-button" onClick={() => navigate("/")}>
               <FaArrowLeft /> Back
            </div>

            <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                Smart Fridge System
            </motion.h1>

            <motion.h2 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                Sign Up
            </motion.h2>

            <motion.form 
                onSubmit={handleSignup}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                <label htmlFor="name">Enter your username:</label>
                <motion.input 
                    type="text" 
                    id="name" 
                    placeholder="Name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required
                    whileFocus={{ scale: 1.05 }}
                />

                <label htmlFor="email">Enter your email:</label>
                <motion.input 
                    type="email" 
                    id="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    whileFocus={{ scale: 1.05 }}
                />

                <label htmlFor="password">Enter your password:</label>
                <div className="password-input-wrapper">
                    <motion.input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required
                        whileFocus={{ scale: 1.05 }}
                        className="password-input"
                    />
                    <span className="password-toggle-icon" onClick={() => setShowPassword(prev => !prev)}>
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>

                <label htmlFor="confirmPassword">Confirm your password:</label> {/* 🔥 NEW FIELD */}
                <div className="password-input-wrapper">
                    <motion.input 
                        type={showConfirmPassword ? "text" : "password"} 
                        placeholder="Confirm Password" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        required
                        whileFocus={{ scale: 1.05 }}
                        className="password-input"
                    />
                    <span className="password-toggle-icon" onClick={() => setShowConfirmPassword(prev => !prev)}>
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>

                {errorMessage && (
                    <motion.div 
                        className="error-message"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        {errorMessage}
                    </motion.div>
                )}

                <motion.button 
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95, backgroundColor: "#6ca461" }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                    Sign Up
                </motion.button>
            </motion.form>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }}>
                Already have an account?{" "}
                <motion.span 
                    className="link" 
                    onClick={() => navigate("/login")}
                    whileHover={{ scale: 1.1, textDecoration: "underline"}}
                >
                    Login here
                </motion.span>
            </motion.p>
        </motion.div>
    );
}

export default Signup;
