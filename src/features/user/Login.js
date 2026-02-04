import { useState,useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 
import LandingIntro from './LandingIntro';
import ErrorText from '../../components/Typography/ErrorText';
import InputText from '../../components/Input/InputText';
import api from '../../utils/api';

function Login() {
  const INITIAL_LOGIN_OBJ = {
    password: '',
    email: '', 
  };

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loginObj, setLoginObj] = useState(INITIAL_LOGIN_OBJ);
  const navigate = useNavigate(); 
  const [backgroundImage, setBackgroundImage] = useState(null);

    useEffect(() => {
  const fetchBackground = async () => {
    try {
      const res = await api.get(
        `gallery`
      );

      if (res.data.selectedBackground) {
        setBackgroundImage(res.data.selectedBackground);
      }
    } catch (err) {
      console.error("Failed to load background image", err);
    }
  };

  fetchBackground();
}, []);

  const submitForm = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (loginObj.email.trim() === '') return setErrorMessage('Email is required!');
    if (loginObj.password.trim() === '') return setErrorMessage('Password is required!');

    try {
        setLoading(true);
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}auth/login`, {
            email: loginObj.email,
            password: loginObj.password,
        });

        if (response.data.token) {
            // Remove previous role before setting a new one
            localStorage.removeItem('role');

            // Save token to localStorage
            localStorage.setItem('token', response.data.token);

            // Decode the token to get user details
            const decodedToken = jwtDecode(response.data.token);

            localStorage.setItem('userId', decodedToken.id);
            localStorage.setItem('fname', decodedToken.fname);
            localStorage.setItem('lname', decodedToken.lname);
            localStorage.setItem('role', decodedToken.role); 
            localStorage.setItem('email', decodedToken.email);
            localStorage.setItem('phone', decodedToken.phone);

            setLoading(false);
            window.location.href = "/app";  
        }
    } catch (error) {
        setLoading(false);
        if (error.response && error.response.data) {
            setErrorMessage(error.response.data.message || 'An error occurred, please try again.');
        } else {
            setErrorMessage('Network error. Please try again later.');
        }
    }
}
  
  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage('');
    setLoginObj({ ...loginObj, [updateType]: value });
  };

  return (
 <div
  className="min-h-screen flex justify-center items-center"
  style={
    backgroundImage
      ? {
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }
      : {
          background: 'linear-gradient(135deg, #0f172a, #1e3a8a)',
        }
  }
>

      <div className="card mx-auto w-full max-w-xl shadow-xl ">
        <div className="  rounded-xl border border-gray-300 bg-transparent">
          <div className="py-24 px-10">
            <h2 className="text-white font-bold mb-2 text-center">Login</h2>
            <form onSubmit={submitForm}>
              <div className="mb-4">
                <InputText
                  type="email"
                  defaultValue={loginObj.email}
                  updateType="email"
                  containerStyle="mt-4"
                  labelTitle="Email"
                  labelStyle={' font-bold text-white'}
                  InputTextStyle= "text-red-500"
                  updateFormValue={updateFormValue}
                />
                <InputText
                  defaultValue={loginObj.password}
                  type="password"
                  updateType="password"
                  containerStyle="mt-4"
                  labelTitle="Password"
                  labelStyle={' font-bold text-white'}
                  InputTextStyle= "text-red-500"
                  updateFormValue={updateFormValue}
                />
              </div>

              <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>

              <button
                type="submit"
                className={`btn mt-2 w-full flex items-center justify-center py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 
                  ${loading ? 'bg-blue-600 text-white cursor-not-allowed' : 'bg-primary text-white'}`}
                disabled={loading} 
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-t-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                ) : (
                  'Login'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
