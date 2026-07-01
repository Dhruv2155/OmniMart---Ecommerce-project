import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import '../styles/auth.css'
import Loader from "../components/Loader"

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword , setShowPassword] = useState(false)
    const [loading , setLoading] = useState(false)
    const { login } = useContext(AuthContext)
    const navigate = useNavigate()
    const handleSubmit = async (e) => {

        e.preventDefault();
        try {
            setLoading(true);
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            if (res.ok) {
                login(data)
                navigate('/');
            }
            else {
                alert(data.message);
                if (res.status === 403) {
                    navigate('/verify-otp', { state: { email } });
                }
            }
            
            
        } catch (error) {
            console.error(error)

        }
        finally{
            setLoading(false)
        }
    }


    return (
        <>{loading && <Loader/>}
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>Login</h2>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <div className="password-container">
                <input type={showPassword?"text":"password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="button" onClick={()=> setShowPassword(!showPassword)}>{showPassword ? "Show" : "Hide"} </button>
                </div>
                <button type="submit" className="btn">Login</button>
                <p>Don't have an account? <Link to="/register">Register</Link></p>
            </form>
        </div>
        </>
    )
}

export default Login