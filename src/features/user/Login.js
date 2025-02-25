import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate hook for redirect
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Use named import
import LandingIntro from './LandingIntro';
import ErrorText from '../../components/Typography/ErrorText';
import InputText from '../../components/Input/InputText';

function Login() {
  const INITIAL_LOGIN_OBJ = {
    password: '',
    email: '', // Changed to match the API
  };

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loginObj, setLoginObj] = useState(INITIAL_LOGIN_OBJ);
  const navigate = useNavigate(); // for redirecting after successful login

  const submitForm = async (e) => {
    e.preventDefault();
    setErrorMessage('');
  
    if (loginObj.email.trim() === '') return setErrorMessage('Email is required!');
    if (loginObj.password.trim() === '') return setErrorMessage('Password is required!');
  
    try {
      setLoading(true);
      // Make the POST request to the login API using axios
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}auth/login`, {
        email: loginObj.email,
        password: loginObj.password,
      });
  
      if (response.data.token) {
        // Save token to localStorage
        localStorage.setItem('token', response.data.token);
        
        const decodedToken = jwtDecode(response.data.token);
        
        localStorage.setItem('userId', decodedToken.id);
        localStorage.setItem('fname', decodedToken.fname);
        localStorage.setItem('lname', decodedToken.lname);
        localStorage.setItem('role', decodedToken.role);
        localStorage.setItem('email', decodedToken.email);
        localStorage.setItem('phone', decodedToken.phone);

        setLoading(false);
        // Redirect to the welcome page or dashboard
        navigate('/app');  // Redirects to the app/dashboard route
      }
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.data) {
        // Handle errors returned from the API
        setErrorMessage(error.response.data.message || 'An error occurred, please try again.');
      } else {
        // Handle network or other errors
        setErrorMessage('Network error. Please try again later.');
      }
    }
  };
  

  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage('');
    setLoginObj({ ...loginObj, [updateType]: value });
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center">
      <div className="card mx-auto w-full max-w-xl shadow-xl">
        <div className=" bg-base-100 rounded-xl">
          {/* <div>
            <LandingIntro />
          </div> */}
          <div className="py-24 px-10">
            <h2 className="text-2xl font-semibold mb-2 text-center">Login</h2>
            <form onSubmit={submitForm}>
              <div className="mb-4">
                <InputText
                  type="email"
                  defaultValue={loginObj.email}
                  updateType="email"
                  containerStyle="mt-4"
                  labelTitle="Email"
                  updateFormValue={updateFormValue}
                />
                <InputText
                  defaultValue={loginObj.password}
                  type="password"
                  updateType="password"
                  containerStyle="mt-4"
                  labelTitle="Password"
                  updateFormValue={updateFormValue}
                />
              </div>

              {/* <div className="text-right text-primary">
                <Link to="/forgot-password">
                  <span className="text-sm inline-block hover:text-primary hover:underline hover:cursor-pointer transition duration-200">
                    Forgot Password?
                  </span>
                </Link>
              </div> */}

              <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>
              <button
                type="submit"
                className={`btn mt-2 w-full btn-primary ${loading ? 'loading' : ''}`}
              >
                Login
              </button>

              {/* <div className="text-center mt-4">
                Don't have an account yet?{' '}
                <Link to="/register">
                  <span className="inline-block hover:text-primary hover:underline hover:cursor-pointer transition duration-200">
                    Register
                  </span>
                </Link>
              </div> */}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;