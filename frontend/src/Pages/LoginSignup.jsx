import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate from react-router-dom
import SignUp from '../Components/SignUp/SignUp';
import Login from '../Components/Login/Login';

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);  // State to manage which component to show
  const navigate = useNavigate();  // Initialize useNavigate

  // Function to handle login success and redirect to /home
  const handleLoginSuccess = () => {
    navigate('/home');  // Redirect to /home upon successful login
  };

  // Functions to switch between Login and SignUp components
  const handleSwitchToLogin = () => setIsLogin(true);
  const handleSwitchToSignUp = () => setIsLogin(false);

  return (
    <div className='cart'>
      {/* Conditionally render Login or SignUp based on state */}
      {isLogin ? (
        <Login onLoginSuccess={handleLoginSuccess} />  // Pass the redirect handler as a prop
      ) : (
        <SignUp />
      )}

      {/* Switch buttons to toggle between Login and SignUp */}
      <p className="loginsignup-login">
        {isLogin ? (
          <>
            Don't have an account? <span onClick={handleSwitchToSignUp}>Sign up here</span>
          </>
        ) : (
          <>
            Already have an account? <span onClick={handleSwitchToLogin}>Login here</span>
          </>
        )}
      </p>
    </div>
  );
};

export default LoginSignup;
