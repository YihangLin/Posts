import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const AuthContextProvider = (props) => {

  // const name = JSON.parse(localStorage.getItem('username')) || null;
  const [username, setUsername] = useState(null);
  // const u_id = JSON.parse(localStorage.getItem('id')) || null;
  const [id, setId] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  // console.log('Auth Context');

  useEffect(() => {
    // console.log('effect');
    axios.get('https://us-central1-posts-40cc0.cloudfunctions.net/widgets/user', {
      withCredentials: true,
    })
    .then((res) => {
      // console.log('res,', res);
      setUsername(res.data.username);
      setId(res.data.id);
      setIsPending(false);
      setError(null);  
    })
    .catch((err) => {
      setError(err.response.data.message);
      setIsPending(false);
    })
  }, [])

  return ( 
    <AuthContext.Provider value={{ username, setUsername, id, setId, isPending, error }}>
      {props.children}
    </AuthContext.Provider>
  );
}
 
export default AuthContextProvider;