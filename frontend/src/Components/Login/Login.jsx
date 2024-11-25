import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup'; // Import Yup for validation
import './Login.css';

const Login = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [redirectPath, setRedirectPath] = useState(null); // Path to redirect
  const navigate = useNavigate();

  // Yup validation schema
  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);

    try {
      const response = await axios.post('http://localhost:4000/api/auth/login', {
        email: values.email,
        password: values.password,
      });

      if (response.data.user && response.data.token) {
        setErrorMessage('');
        alert('Login successful');

        // Save user info and token in localStorage
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.token);

        // Determine redirect path based on user role
        if (response.data.user.role === 'admin') {
          setRedirectPath('/admin'); // Redirect to /admin for admins
        } else {
          setRedirectPath('/home'); // Redirect to /home for regular users
        }
      } else {
        setErrorMessage(response.data.message || 'Invalid login credentials');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'An error occurred. Please try again.';
      setErrorMessage(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (redirectPath) {
      const timer = setTimeout(() => {
        navigate(redirectPath); // Navigate to the determined path
      }, 1000); // Optional delay for feedback before redirect

      return () => clearTimeout(timer); // Cleanup timeout
    }
  }, [redirectPath, navigate]);

  return (
    <div className='login'>
      <div className="login-container">
        <h1>Login</h1>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema} // Use Yup schema for validation
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="login-fields">
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="field"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="error"
                />

                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="field"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="error"
                />
              </div>

              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
              {errorMessage && <p className="error">{errorMessage}</p>}
            </Form>
          )}
        </Formik>

        <div className="text-links">
          <Link to="/signup" className="text-link">
            Don't have an account? Register now!
          </Link>
        </div>

        <div className="login-agree">
          <input type="checkbox" name='' id='' />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
