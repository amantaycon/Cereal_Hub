import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './css/login.css';
import logo from './assets/logo_main.png';
import axios from "axios";
import UseMeta from "./useMate";
const baseUrl = import.meta.env.VITE_API_URL;
import { getCSRFToken } from "./csrf";

axios.defaults.withCredentials = true;

const Login = () => {
    UseMeta('Login | Cereal Hub',"This is a Login page");
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
    axios.get(`${baseUrl}/user/csrf/`, { withCredentials: true });
  }, []);

    const submitLogin = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            alert("Please fill in all fields.");
            return;
        }

        try {
            const csrfToken = getCSRFToken();
            const response = await axios.post(
                `${baseUrl}/user/login/`,
                { username, password },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        "X-CSRFToken": csrfToken,
                    },
                }
            );
            const data = response.data;
            localStorage.setItem('user', JSON.stringify({ 'user_id': data.user_id, 'username': data.username }));
                navigate('/');
                setUsername('');
                setPassword('');
        } catch (error) {
            alert("Login failed: " + err.response?.data?.error);
        }
    };

    return (
        <div className='login-background'>
            <div className="login-container">
                <form className="login-form">
                    {/* <!-- Logo --> */}
                    <div className="logo">
                        <Link to={"/"}>
                            <img src={logo} alt="Website Logo" />
                        </Link>
                    </div>

                    <h2>Login</h2>
                    <input type="text" placeholder="Username or Email" value={username} required onChange={e => (setUsername(e.target.value))} />
                    <input type="password" placeholder="Password" value={password} required onChange={e => setPassword(e.target.value)} />
                    <button type="submit" onClick={e => submitLogin(e)}>Login</button>

                    <div className="links">
                        <Link to="/user/forgot_password">Forgot Password?</Link>
                        <Link to="/user/ragister">Register</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};


const Ragister = () => {
    UseMeta('Ragistration | Cereal Hub',"This is a Ragistration page");
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const navigate = useNavigate();

    const submitUser = () => {

        if (password !== password2) {
            alert("Passwords do not match!");
            return;
        }
        if (!fullName || !email || !username || !password) {
            alert("Please fill in all fields.");
            return;
        }
        // Simulate sending data to backend

        fetch(`${baseUrl}/user/register/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fullName,
                email,
                username,
                password,
            }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                alert(data.message);
                navigate('/user/login');
                setFullName('');
                setEmail('');
                setUsername('');
                setPassword('');
                setPassword2('');
            })
            .catch(error => {
                console.error('There was a problem with the registration:', error);
                alert("Registration failed. Please try again.");
            });
    };

    return (
        <div className='login-background'>
            <div className="login-container">
                <div className="login-form">
                    <div className="logo">
                        <Link to={"/"}>
                            <img src={logo} alt="Website Logo" />
                        </Link>
                    </div>
                    <h2>Register</h2>
                    <input type="text" value={fullName} placeholder="Full Name" onChange={e => setFullName(e.target.value)} required />
                    <input type="email" value={email} placeholder="Email" onChange={e => setEmail(e.target.value)} required />
                    <input type="text" value={username} placeholder="Username" onChange={e => setUsername(e.target.value)} required />
                    <input type="password" value={password} placeholder="Password" onChange={e => setPassword(e.target.value)} required />
                    <input type="password" value={password2} placeholder="Confirm Password" onChange={e => setPassword2(e.target.value)} required />
                    <button type="submit" onClick={submitUser}>Register</button>
                    <div className="links">
                        <Link to="/user/login">Already have an account?</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ForgotPassword = () => {
    UseMeta('ForgotPassword | Cereal Hub',"This is a ForgotPassword page");
    return (
        <div className='login-background'>
            <div className="login-container">
                <form className="login-form">
                    <div className="logo">
                        <Link to={"/"}>
                            <img src={logo} alt="Website Logo" />
                        </Link>
                    </div>
                    <h2>Forgot Password</h2>
                    <p style={{ marginBottom: '10px', color: '#555', fontSize: '14px' }}>
                        Enter your email to receive reset instructions.
                    </p>
                    <input type="email" placeholder="Email Address" required />
                    <button type="submit">Send Reset Link</button>
                    <div className="links">
                        <Link to="/user/login">Back to Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Logout = () => {
    const navigate = useNavigate();
    localStorage.removeItem('user'); // Clear user data from local storage
    fetch(`${baseUrl}/user/logout/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "X-CSRFToken": getCSRFToken(), // Include CSRF token for security
        },
        credentials: 'include', // Include cookies in the request
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
        .then(data => {
            navigate('/user/login'); // Optional: log the logout message
        })
        .catch(error => {
            console.error('There was a problem with the logout:', error);
            navigate('/user/login');
        });
};


export { Login, Ragister, ForgotPassword, Logout };