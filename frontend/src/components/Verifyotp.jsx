import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const email = location.state?.email;
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);

 
  
  const handleVerify = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please register first to receive an OTP.");
      navigate('/register');
      return;
    }

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          otp
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert("OTP Verified Successfully!");
        login(data);
        navigate('/');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

   useEffect(() => {
    if (timer <= 0) return; 
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval)
    
  }, [timer]);

  const handleResendOtp = async ()=>{
        if(!email) return;

        setResendLoading(true);

        try {

          const res = await fetch("/api/auth/resend-otp",{
            method:"POST",
            headers:{
              "Content-Type":"application/json",
            },
            body: JSON.stringify({email}),
          })
          const data = await res.json();
          if(res.ok){
            alert("OTP sent successfully");
            setTimer(30)
          }else{
            alert(data.message)
          }
        } catch (error) {
          console.error(error)
          alert("Something went wrong")
        }

        setResendLoading(false);
  }
  return (
    <>
      <style>
        {`
          .otp-container {
  min-height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.otp-card {
  width: 100%;
  max-width: 400px;
  background: #09090b;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 16px 38px rgba(23, 32, 42, 0.12);
  text-align: center;
  border: 1px solid #eadfcb;
}

.otp-card h2 {
  margin-bottom: 1rem;
  color: #d4e3f6;
}

.otp-card p {
  color: #aebdcb;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.otp-input {
  width: 100%;
  padding: 12px;
  font-size: 20px;
  text-align: center;
  letter-spacing: 8px;
  background: #0e1317;
  color: #d4e3f6;
  border: 1px solid #d8ccb7;
  border-radius: 8px;
  outline: none;
  margin-bottom: 1rem;
  box-sizing: border-box;
  transition: all 0.3s ease;
}

.otp-input:hover {
  border-color: #007f73;
  box-shadow: 0 0 0 3px rgba(0, 127, 115, 0.12);
}

.otp-input:focus {
  border-color: #04a494;
  box-shadow: 0 0 0 3px rgba(6, 94, 85, 0.12);
}

.verify-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  box-shadow: 0 4px 14px rgba(234, 88, 12, 0.3);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: 0.3s;
}

.verify-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(234, 88, 12, 0.5);
  filter: brightness(1.1);
}
  .resend-btn {
  width: 100%;
  margin-top: 12px;
  padding: 12px;
  background: transparent;
  color: #04a494;
  border: 1px solid #04a494;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;
  font-size: 15px;
}

.resend-btn:hover:not(:disabled) {
  background: #04a494;
  color: white;
}

.resend-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
        `}
      </style>

      <div className="otp-container">
        <div className="otp-card">
          <h2>Verify OTP</h2>

          <p>
            Enter the OTP sent to
            <br />
            <strong>{email}</strong>
          </p>

          <form onSubmit={handleVerify}>
            <input
              type="text"
              maxLength="6"
              className="otp-input"
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />

            <button type="submit" className="verify-btn">
              Verify OTP
            </button>
            <button
  type="button"
  className="resend-btn"
  onClick={handleResendOtp}
  disabled={timer > 0 || resendLoading}
>
  {resendLoading
    ? "Sending..."
    : timer > 0
    ? `Resend OTP (${timer}s)`
    : "Resend OTP"}
</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default VerifyOtp;