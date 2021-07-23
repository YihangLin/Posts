import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [clicked, setClicked] = useState(false);
  const { username, setUsername, setId, error, isPending } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    setClicked(true);

    if (password !== confirm){
      setMessage('Passwords do not match.');
      setPassword('');
      setConfirm('');
      setClicked(false);
      return;
    }

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters.');
      setPassword('');
      setConfirm('');
      setClicked(false);
      return;
    }

    const user = {
      name: name,
      email: email,
      password: password,
      confirmpassword: confirm,
    }

    axios.post(`https://us-central1-posts-40cc0.cloudfunctions.net/widgets/register`, { 
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

  // redirect if user is already logged in
  if (username !== null) {
    return <Redirect to='/' />;
  }
  
  return ( 
    <div className='login-box'>
      {error && <h1>{error}</h1>}
      {isPending && <p>Loading...</p>}
      <h1>REGISTER</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" id='name' onChange={(e) => setName(e.target.value)} placeholder='Name' required/>
        <input type='email' id='email' onChange={(e) => setEmail(e.target.value)} placeholder='Email' required/>
        <input type='password' id='password' onChange={(e) => setPassword(e.target.value)} placeholder='Password' value={password} required/>
        <input type='password' id='confirmpassword' onChange={(e) => setConfirm(e.target.value)} placeholder='Comfirm Password' value={confirm} required/>
        <button className='btn' disabled={clicked}>Register</button>
      </form>
      <div className='message'>
        {message}
      </div>
    </div>
   );
}
 
export default Register;