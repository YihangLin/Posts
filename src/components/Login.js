import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { username, setUsername, setId, isPending, error } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [clicked, setClicked] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    setClicked(true);

    // check passwrod length
    if (password.length < 6){
      setMessage('Password must be at least 6 characters.');
      setClicked(false);
      return;
    }

    const user = {
      email: email,
      password: password,
    }

    axios.post(`https://us-central1-posts-40cc0.cloudfunctions.net/widgets/login`, { 
      user: user,
    }, { withCredentials: true })
      .then(res => {
        setUsername(res.data.username)
        setId(res.data.id);
      })
      .catch(err => {
        setMessage(err.response.data.message);
        setClicked(false);
      })
  }

  //redirect if user is already logged in
  if (username !== null){
    return <Redirect to='/' />;
  }

  return (
    <div className='login-box'>
      {error && <h1>{error}</h1>}
      {isPending && <p>Loading...</p>}
      <h1>LOGIN</h1>
      <form onSubmit={handleSubmit}>
        <input type='email' id='email' onChange={(e) => setEmail(e.target.value)} placeholder='Email' required/>
        <input type='password' id='password' onChange={(e) => setPassword(e.target.value)} placeholder='Password' required/>
        <button className='btn' disabled={clicked}>Login</button>
      </form>
      <div className='message'>
        {message}
      </div>
    </div>
   );
}
 
export default Login;