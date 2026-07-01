import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Loader from '../components/Loader';

const OrderSuccess = () => {
  const location = useLocation();
  const [showLoader, setShowLoader] = useState(Boolean(location.state?.showLoader));

  useEffect(() => {
    if (!showLoader) return;

    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [showLoader]);

  const containerStyle = {
    maxWidth: '600px',
    margin: '50px auto',
    padding: '50px 30px',
    background: '#18181b',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
    textAlign: 'center'
  };

  if (showLoader) {
    return <Loader />;
  }

  return (
    <div style={containerStyle}>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '20px', color: '#10b981' }}>Payment Successful!</h2>
      <p style={{ color: '#a1a1aa', fontSize: '1.2rem', marginBottom: '40px' }}>
        Thank you for your order. We have securely received your payment and will process your shipment shortly.
      </p>
      <Link to="/shop" className="btn">Continue Shopping</Link>
    </div>
  );
};

export default OrderSuccess;