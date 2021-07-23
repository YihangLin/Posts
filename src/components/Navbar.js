import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Navbar = () => {
  const { username, id, error, setUsername, setId } = useContext(AuthContext);
  
  const Logout = () => {
    axios.get(`https://us-central1-posts-40cc0.cloudfunctions.net/widgets/logout`, {
      withCredentials: true 
    })
    .then(res => {
      console.log('Log out.');
      setUsername(null);
      setId(null);
    })
    .catch(err => {
      console.log(err);
    })
  }

  const Showlink = () => {
    if (username !== null){
      return <ul>
        <li><NavLink to={'/' + id + '/posts'} className='name'>HELLO, {username}</NavLink></li>
        <li><NavLink className='post' to='/createapost'>POST</NavLink></li>
        <li onClick={Logout} className='logout'>LOGOUT</li>
      </ul>
    }
    else{
      return <ul>
        <li><NavLink to='/login'>LOGIN</NavLink></li>
        <li><NavLink to='/register'>REGISTER</NavLink></li>
    </ul>
    }
  }
  
  return (
    <div className='nav'>
      <h1><NavLink to='/' className='logo'>POST</NavLink></h1>
      {error && <p>{error}</p>}
      <Showlink />
    </div>
  );
}
 
export default Navbar;