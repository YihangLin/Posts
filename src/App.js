import React from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Navbar from './components/Navbar';
import AuthContextProvider from './context/AuthContext';
import NotFound from './components/NotFound';
import Post from './components/Post';
import Create from './components/Create';
import UserPosts from './components/UserPosts';
import PrivateRoute from './components/PrivateRoute';
import BackToTop from './components/BackToTop';

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <div className="container">
          <Navbar />
          <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/register' component={Register} />
            <Route path='/login' component={Login} />
            <Route path='/post/:id' component={Post} />
            <PrivateRoute path='/createapost' component={Create} />
            <PrivateRoute path='/:id/posts' component={UserPosts} />
            <Route path='' component={NotFound} />
          </Switch>
          <BackToTop />
        </div>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
