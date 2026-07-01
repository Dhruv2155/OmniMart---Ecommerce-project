import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import '../styles/auth.css'
import Loader from "../components/Loader";


const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true)
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            const data = await res.json();
            if (res.ok) {
                alert('Please check your email for the OTP.');

                navigate('/verify-otp', {
                    state: {
                        email
                    }
                });
            } else {

                alert(data.message);
            }

        } catch (error) {
            console.error(error);
        }
        finally {
            setLoading(false)
        }
    };

    return (<>{loading && <Loader />}
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>Register</h2>
                <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <div className="password-container">
                    <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "🙈" : "👁️"} </button>
                </div>                <button type="submit" className="btn">Register</button>
                <p>Already have an account? <Link to="/login" >Login</Link></p>
            </form>
        </div>
    </>
    )
}

export default Register