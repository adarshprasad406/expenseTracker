// Signup.js
import React, {useState, useEffect} from 'react';
import '../assets/Signup.css';
import { Link, useNavigate} from 'react-router-dom';
import Header from './Header';
import axios from 'axios';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [userId, setusername] = useState('');
    const [password, setPassword] = useState('');
    const [cPassword, setCPassword] = useState('');
    const navigate = useNavigate(); // Use the useNavigate hook
    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
          navigate('/');
        }
      }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_SERVERURL}registration/signup`, {
                email: email,
                userId: userId,
                password: password
            });
            if (response.data.auth) {
                localStorage.setItem('authToken', response.data.token);
                navigate('/'); // Redirect to the home page
            } else {
                console.log('Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    };
    return (
        <div>
            <Header />
            <div className="signup">
                <div className="form">
                    <h1>Sign Up for Expense Tracker</h1>
                    <form onSubmit={handleSubmit}>
                        <input type="text" placeholder="Username" value={userId}
                            onChange={(e) => setusername(e.target.value)} />
                        <input type="email" placeholder="Email" value={email}
                            onChange={(e) => setEmail(e.target.value)} />
                        <input type="password" placeholder="Password" value={password}
                            onChange={(e) => setPassword(e.target.value)} />
                        <input type="password" placeholder="Confirm Password" value={cPassword}
                            onChange={(e) => setCPassword(e.target.value)} />
                        <button type='submit' className="button signup-button">Sign Up</button>
                    </form>
                    <p>Already have an account? <Link to="/login">Log in</Link></p>
                </div>

                <div className="footer">
                    <p>&copy; Vishal Maharathy 2023</p>
                </div>
            </div>

        </div>
    );
};

export default Signup;
