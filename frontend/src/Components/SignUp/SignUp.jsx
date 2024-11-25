import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './SignUp.css';

const SignUp = () => {
  const navigate = useNavigate(); // For redirecting to login after successful signup

  // Yup validation schema
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    agree: Yup.bool().oneOf([true], 'You must agree to the terms and conditions'),
  });

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    const { name, email, password } = values;

    try {
      const response = await axios.post('http://localhost:4000/api/auth/register', {
        username: name,
        email,
        password,
      });

      if (response.data.message) {
        alert(response.data.message);
        navigate('/login'); // Redirect on success
      }
    } catch (error) {
      if (error.response) {
        setFieldError('general', error.response.data.message);
      } else {
        setFieldError('general', 'Signup failed. Please try again later.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='signup'>
      <div className="signup-container">
        <h1>Sign Up</h1>

        <Formik
          initialValues={{
            name: '',
            email: '',
            password: '',
            agree: false,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors }) => (
            <Form>
              {/* Display general error */}
              {errors.general && <div className="error-message">{errors.general}</div>}

              <div className="signup-fields">
                <Field
                  type="text"
                  name="name"
                  placeholder="Name"
                  className="field"
                />
                <ErrorMessage name="name" component="div" className="error" />

                <Field
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className="field"
                />
                <ErrorMessage name="email" component="div" className="error" />

                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="field"
                />
                <ErrorMessage name="password" component="div" className="error" />
              </div>

              <div className="signup-agree">
                <Field
                  type="checkbox"
                  name="agree"
                  id="agree"
                />
                <label htmlFor="agree">
                  By continuing, I agree to the terms of use & privacy policy.
                </label>
                <ErrorMessage name="agree" component="div" className="error" />
              </div>

              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Signing up...' : 'Continue'}
              </button>
            </Form>
          )}
        </Formik>

        <div className="text-links">
          <Link to="/login" className="text-link">
            Already have an account? Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
