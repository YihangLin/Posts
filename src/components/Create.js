import React, { useState, useContext } from 'react'
import { Redirect } from 'react-router';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import TextareaAutosize from 'react-textarea-autosize';

const Create = () => {
  const [title, setTitle] = useState('');
  const [post, setPost] = useState('');
  const [message, setMessage] = useState('');
  const { id } = useContext(AuthContext);
  const [clicked, setClicked] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setClicked(true);
    const new_post = {
      p_title: title,
      p_post: post,
      p_author_id: id, 
    }
    
    axios.post(`https://us-central1-posts-40cc0.cloudfunctions.net/widgets/create`, { 
      new_post: new_post,
    }, { 
      withCredentials: true,
     })
    .then(res => {
      setResult(res.data.id);
    })
    .catch(err => {
      setMessage(err.response.data.message);
      setClicked(false);
    })
  }

  return (
    <div className='create-post'>
      { result && <Redirect to={'/post/' + result} /> }
      <form onSubmit={handleSubmit}>
        <h3 className='sort'>Title: </h3>
        <input className='create-title' type="text" value={title} onChange={(e) => setTitle(e.target.value)} required/>
        <h3 className='sort'>Post: </h3>
        <TextareaAutosize className='leave-comment' minRows={8} value={post} onChange={(e) => setPost(e.target.value)} required/>
        <div className='submit'>
          <button type='submit' className='comment-btn confirm-btn' disabled={clicked}>Submit</button>
        </div>
      </form>
      { message && <p>{message}</p> }
    </div>
  );
}
 
export default Create;