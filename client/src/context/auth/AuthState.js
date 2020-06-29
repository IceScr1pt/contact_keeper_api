import React, { useReducer } from 'react';
import AuthContext from './authContext';
import authReducer from './authReducer';
import axios from 'axios';
import setAuthToken from '../../utils/setAuthToken';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  CLEAR_ERRORS,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
} from '../types';

const AuthState = (props) => {
  const initialState = {
    //get token from localStorage
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    user: null,
    loading: true,
    error: null,
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  //Load User - check which user log in
  const loadUser = async () => {
    //TODO -> Load token into global headers
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    try {
      const res = await axios.get('/api/v1/auth');
      console.log(res);
      dispatch({ type: USER_LOADED, payload: res.data });
    } catch (error) {
      dispatch({ type: AUTH_ERROR });
    }
  };

  //Register user
  const register = async (formData) => {
    //define headers
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      //try to register the user to the api
      const res = await axios.post('/api/v1/users', formData, config);
      dispatch({ type: REGISTER_SUCCESS, payload: res.data });
      console.log(res.data);
      //load user
      loadUser();
    } catch (error) {
      console.log(error.response);
      //if there is an error from the api i get it from the error object
      dispatch({ type: REGISTER_FAIL, payload: error.response.data.msg });
      console.error(error.message);
    }
  };

  //Login user - log with token
  const login = async (formData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const res = await axios.post('/api/v1/auth', formData, config);
      dispatch({ type: LOGIN_SUCCESS, payload: res.data });
      loadUser();
    } catch (error) {
      dispatch({ type: LOGIN_FAIL, payload: error.response.data.msg });
    }
  };

  //Logout - destory the token
  const logout = () => {
    dispatch({ type: LOGOUT });
  };

  //Clear Errors
  const clearErrors = () => dispatch({ type: CLEAR_ERRORS });

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        loading: state.loading,
        error: state.error,
        register,
        loadUser,
        login,
        logout,
        clearErrors,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
