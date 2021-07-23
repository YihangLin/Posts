import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import TextareaAutosize from 'react-textarea-autosize';
import { useHistory } from 'react-router-dom';

const Post = () => {
  const post_id = useParams().id;
  let history = useHistory();
  const [comm, setComm] = useState('');
  const { id } = useContext(AuthContext);
  const [message, setMessage] = useState('');
  const [clicked, setClicked] = useState(true);
  const [newComment, setNewComment] = useState(true);
  const [comments, setComments] = useState(null);
  const [post, setPost] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);
  const [update, setUpdate] = useState(false);
  const [updatePost, setUpdatePost] = useState(null);

  useEffect(() => {
    //Update the comments if there is a new comment
    if (newComment) {
      const source = axios.CancelToken.source();
      axios.post('https://us-central1-posts-40cc0.cloudfunctions.net/widgets/post', {
        post_detail: post_id,
      },{
        withCredentials: true,
        cancelToken: source.token,
      })
      .then((res) => {
        // check if there post exists
        if (res.data[0].length === 0) {
          setError('Post does not exist.');
          setIsPending(false);
        } else {
          setPost(res.data[0][0]);
          setUpdatePost(res.data[0][0]);
          setComments(res.data[1]);
          setIsPending(false);
          setError(null);
          setClicked(false);
          setNewComment(false);
        }
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log('Axios aborted.')
        } else {
          setError(err.response.data.message);
          setIsPending(false);
        }
      })
      return () => {
        source.cancel();
      }
  }
  }, [post_id, newComment])
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setClicked(true);
    const new_comment = {
      comment: comm,
      c_id: id,
      p_id: post_id,
    }

    axios.post(`https://us-central1-posts-40cc0.cloudfunctions.net/widgets/comment`, { 
      new_comment: new_comment,
    }, { 
      withCredentials: true,
    })
    .then(res => {
      setMessage(res.data.message);
      setClicked(false);
      setComm('');
      setNewComment(true);
    })
    .catch(err => {
      setMessage(err.response.data.message);
      setClicked(false);
    })
  }

  const handleUpdate = (e) => {
    e.preventDefault();
    setClicked(true);

    axios.post(`https://us-central1-posts-40cc0.cloudfunctions.net/widgets/update`, { 
      updated_post: post,
    }, { 
      withCredentials: true,
    })
    .then(res => {
      setMessage(res.data.message);
      setClicked(false);
      setNewComment(true);
      setUpdate(false);
    })
    .catch(err => {
      setMessage(err.response.data.message);
      setClicked(false);
    })

  }

  const handleCancel = () => {
    setUpdate(false);
    setPost(updatePost);
  }

  return (
    <div className='content-container post-container'>
      { error && <h1>{ error }</h1> }
      { isPending && <h1>Loading...</h1> }
      { post && <div className='post-section'>
        <form onSubmit={handleUpdate}>
          
          <input className={update ? 'post-title-border' : 'post-title'} disabled={!update} type="text" value={post.title} onChange={(e) => setPost({...post, title: e.target.value})} required/>
        
          <TextareaAutosize className={update ? 'post-detail-border' : 'post-detail'} disabled={!update} value={post.post} onChange={(e) => setPost({...post, post: e.target.value})} required/>
          <div className='btn-area'>
            { update && <button className='post-btn cancel-btn' onClick={handleCancel} disabled={clicked}>Cancel</button> }
            { update && <button className='post-btn confirm-btn' disabled={clicked} type='submit'>Update</button> }
          </div>
        </form>
        
        <div className='edit'>
          { post.author_id === id && !update && <button className='edit-btn' onClick={() => setUpdate(true)}>Edit</button> }
        </div>
        <div className='post-card-info'>
          <p className='card-author'>Posted by: {post.user_name}</p>
          <p>Date: {new Date(post.post_time).toUTCString()}</p>
        </div>
        
        
      </div>
      }
      
     
      { comments && <h2 className='sort'>Comments:</h2> }
      { comments && comments.map((comment, index) => (
        <div className='card' key={index}>
          <div className='comment-info'>
            <p className='card-author'>Posted by: {comment.user_name}</p>
            <p>Date: {new Date(comment.comment_time).toUTCString()}</p>
          </div>
          <p className='comments'>{comment.comment}</p>
        </div>
      )) }

      { post && <form onSubmit={handleSubmit}>
        <h3 className='sort'>Leave a comment:</h3>
        
        <TextareaAutosize className='leave-comment' minRows={6} value={comm} onChange={(e) => setComm(e.target.value)} required/>
        <div className='submit'>
          { id ? <button className='comment-btn confirm-btn' type='submit' disabled={clicked}>Submit</button> : <button className='comment-btn confirm-btn' onClick={() => history.push('/login')}>Login to comment</button>}
        </div>
      </form>
      }

      { message && <p>{message}</p> }
    </div>
  );
}
 
export default Post;