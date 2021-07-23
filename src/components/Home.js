import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  let history = useHistory();

  const [result, setResult] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const source = axios.CancelToken.source();
    axios.get('https://us-central1-posts-40cc0.cloudfunctions.net/widgets/posts', {
      withCredentials: true,
      cancelToken: source.token,
    })
    .then((res) => {
      setResult(res.data);
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
      <h1 className='sort'>Latest Posts</h1>
      { error && <h1>{ error }</h1> }
      { isPending && <h1>Loading...</h1> }
      { !result && <h1>THERE ARE NO POSTS.</h1> }
      { result && result.map((res) => (
        <div className='card' key={res.id}>
          <div className='cursor' onClick={() => history.push('/post/' + res.id)}>
            <h2 className='card-title'>{res.title}</h2>
            <p className='card-post'>{res.post}</p>
          </div>
          <div className='card-info'>
            <p className='card-author'>Posted by: {res.user_name}</p>
            <p>Date: {new Date(res.post_time).toUTCString()}</p>
          </div>
        </div>
      )) }
    </div>
  );
}
 
export default Home;