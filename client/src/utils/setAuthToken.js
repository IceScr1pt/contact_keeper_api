import axios from 'axios';

const setAuthToken = (token) => {
  if (token) {
    //if token is provided, we set a default x-auth-token header to be equal to the token
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
  }
};

export default setAuthToken;
