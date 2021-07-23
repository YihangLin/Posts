const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({ 
  origin: true, 
  credentials: true,
}));

const db = mysql.createPool({
  host: process.env.HOSTNAME,
  user: process.env.USER,
  password: process.env.PASSWARD,
  database: process.env.DATABASE,
  multipleStatements: true,
});

const maxAge = 3 * 24 * 60 * 60;
const mySecret = process.env.SECRET;

const createToken = (id) => {
  return jwt.sign({ id: id }, mySecret, {
    expiresIn: maxAge
  });
}

const requireAuth = (req, res, next) => {
  const token = req.cookies.__session;
  if (token){
    jwt.verify(token, mySecret, (error, decodedToken) => {
      if (error){
        console.log(error.message);
        next();
      }else{
        req.user_id = decodedToken.id;
        next();
      }
    })
  }else{
    next();
  }
}

app.post('/register', (req, res) => {
  const {name, email, password} = req.body.user;
  db.query('SELECT user_email FROM users WHERE user_email = ?', [email], async (error, results) => {
    if (error) {
      console.log(error);
      return res.status(500).send({ message: 'Trouble registering.' });
    }

    if (results.length > 0) {
      return res.status(409).send({ message: 'This email is already registered.' });
    }

    const salt = await bcrypt.genSalt();
    const hashed_password = await bcrypt.hash(password, salt);

    db.query('INSERT INTO users SET ?', {user_name: name, user_email: email, user_password: hashed_password}, (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).send({ message: 'Trouble registering.' });
      }
      const token = createToken(results.insertId); 
      res.cookie('__session', token, { httpOnly: true, maxAge: maxAge * 1000 });
      return res.status(200).send({username: name, id: results.insertId});
    })
  })
});

app.post('/login', (req, res) => {
  const { email, password } = req.body.user;

  db.query('SELECT * FROM users WHERE user_email = ?', [email], async(error, results) => {

    if (error) {
      console.log('Login error: ', error);
      return res.status(500).send({ message: 'Trouble finding user.' });
    }

    if (!results[0]) {
      return res.status(422).send({ message: 'Email is incorrect.' });
    }
    
    if (!(await bcrypt.compare(password, results[0].user_password))){
      return res.status(422).send({ message: 'Password is incorrect.' });
    }
    const token = createToken(results[0].id);
    res.cookie('__session', token, { httpOnly: true, maxAge: maxAge * 1000 });
    return res.status(200).send({ username: results[0].user_name, id: results[0].id });
  })
  
})

app.get('/posts', (req, res) => {
  db.query('SELECT posts.id, posts.title, posts.post, posts.author_id, users.user_name, posts.post_time FROM posts INNER JOIN users ON posts.author_id = users.id ORDER BY post_time DESC LIMIT 10', (error, results) => {

    if (error) {
      console.log('Error getting posts: ', error);
      return res.status(500).send({ message: 'Trouble retrieving posts.' });
    }

    if (results.length === 0) {
      return res.status(200).send(null);
    }
    return res.status(200).send(results);
  })
})

app.post('/post', (req, res) => {
  const { post_detail } = req.body;
  db.query('SELECT posts.id, posts.title, posts.post, posts.author_id, posts.post_time, users.user_name FROM posts, users WHERE posts.author_id = users.id AND posts.id = ?; SELECT comments.comment, comments.comment_time, users.user_name FROM comments JOIN users ON comments.commenter_id = users.id and comments.post_id = ?', [post_detail, post_detail], (error, results) => {
    if (error) {
      console.log('Error getting post and comments: ', error);
      return res.status(500).send({ message: 'Trouble retrieving post detail and comments. ' })
    }
    return res.status(200).send(results);
  })
})

app.post('/comment', requireAuth, (req, res) => {
  const { comment, c_id, p_id } = req.body.new_comment;

  if (req.user_id !== c_id) {
    return res.status(409).send({ message: 'User ID is different with the token id.' })
  }

  db.query('INSERT INTO comments SET ?', {comment: comment, commenter_id: c_id, post_id: p_id}, (error, results) => {
    if (error) {
      console.log('Error adding new comment: ', error);
      return res.status(500).send({ message: 'Trouble adding comment.' });
    }

    return res.status(200).send({ message: 'Comment successful!' });
  })
})

app.post('/create', requireAuth, (req, res) => {
  const { p_title, p_post, p_author_id } = req.body.new_post;

  if (req.user_id !== p_author_id) {
    return res.status(409).send({ message: 'User ID is different with the token id.' });
  }

  db.query('INSERT INTO posts SET ?', {title: p_title, post: p_post, author_id: p_author_id}, (error, results) => {
    if (error) {
      console.log('Error adding new post: ', error);
      return res.status(500).send({ message: 'Trouble adding new post.' });
    }

    return res.status(200).send({ id: results.insertId });
  })
})

app.post('/update', requireAuth, (req, res) => {
  const { title, post, id, author_id } = req.body.updated_post;

  if (req.user_id !== author_id) {
    return res.status(409).send({ message: 'User ID is different with the token id.' });
  }

  db.query('UPDATE posts SET title = ?, post = ?, post_time = now() WHERE id = ?', [title, post, id], (error, result) => {
    if (error) {
      console.log('Error updating post.');
      return res.status(500).send({ message: 'Trouble updating post.' });
    }

    return res.status(200).send({ message: 'Update successful.' });
  })
})

app.get('/userposts', requireAuth, (req, res) => {
  db.query('SELECT posts.id, posts.title, posts.post, posts.author_id, posts.post_time, users.user_name FROM posts, users WHERE posts.author_id = users.id AND posts.author_id = ?', [req.user_id], (error, results) => {
    if (error) {
      console.log('Error gettting user posts.');
      return res.status(500).send({ message: 'Trouble retrieving user posts.' });
    }
    if (results.length === 0) {
      return res.status(200).send(null);
    }
    return res.status(200).send(results);
  })
})

app.get('/user', requireAuth, (req, res) => {
  const { user_id } = req;

  if (user_id) {
    db.query('SELECT user_name, id FROM users WHERE id = ?', [user_id], (error, results) => {
      if (error) {
        console.log('Error finding user.');
        return res.status(500).send({ message: 'Trouble finding user.' })
      }

      return res.status(200).send({ username: results[0].user_name, id: results[0].id })
    })
  } else {
    return res.status(200).send({ username: null, id: null });
  }
})

app.get('/logout', (req, res) => {
  res.cookie('__session', '', { maxAge: 1 });
  return res.sendStatus(200);
})

app.listen(5000, () => {
  console.log('Server is running!');
});