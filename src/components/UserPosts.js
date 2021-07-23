import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const UserPosts = () => {

  let history = useHistory();
  const [posts, setPosts] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const source = axios.CancelToken.source();
    axios.get('https://us-central1-posts-40cc0.cloudfunctions.net/widgets/userposts', {
      withCredentials: true,
      cancelToken: source.token,
    })
    .then((res) => {
      setPosts(res.data);
      setIsPending(false);
      setError(null);  
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
  }, [])

  return (
    <div className='content-container'>
      <h1 className='sort'>Your Posts</h1>
      { error && <h1>{ error }</h1> }
      { isPending && <h1>Loading...</h1> }
      { !posts && <h1>You have no posts.</h1> }
      { posts && posts.map((post) => (
        <div className='card' key={post.id}>
          <div className='cursor' onClick={() => history.push('/post/' + post.id)}>
            <h2 className='card-title'>{post.title}</h2>
            <p className='card-post'>{post.post}</p>
          </div>
          <div className='card-info'>
            <p className='card-author'>Author: {post.user_name}</p>
            <p className='card-date'>Date: {new Date(post.post_time).toUTCString()}</p>
          </div>
        </div>
      )) }
    </div>
  );
}
 
export default UserPosts;