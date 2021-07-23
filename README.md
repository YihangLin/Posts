# Posts!
A website for users to create post and share comments.

The website is built with React, mysql and I use JSON Web Token(jwt) to authenticate users.

The backend uses Express js.

Here is the home page looks like:
![homepage](/images/posts_homepage.png)

### Database
This project uses mysql. There are 3 tables: users, posts and comments. 
![database](/images/post_mysql.png)

### Features
Users can register and log in with their emails.
Login page
![login](/images/posts_login.png)
Register page
![register](/images/posts_register.png)

After logged in, the navbar will look like this:
![loggedin](/images/posts_loggedin.png)

user can create a new post by clicking the post button in navbar:
![newpost](/images/posts_newpost.png)

users can click on their names from the navbar to view their own posts:
![userposts](images/posts_userposts.png)

The detail page of a post, logged in users can leave a comment under each post:
![detail](/images/posts_detail.png)

If you are the author of the post, you will have a edit button, and you can update the post:
![detail_edit](/images/posts_detailWithEdit.png)
![edit](images/posts_edit.png)

