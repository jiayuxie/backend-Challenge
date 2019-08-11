This app finish base on node.js.

You need to install:

npm install express jsonwebtoken

The data:

By the example data, I assume that the database have 3 tables: albums,photos and users.They have at least these columns:

photos{
	albumsId
	id
}

albums{
	userId
	id
}

users{
	id
}

Please create a local database included the correct format data, and change the code on the beginning of app.js to connect your own
test data.

Usage:

post http://localhost:3000/users  
To show all the users

post http://localhost:3000/login?id=
To log in by your userid as a params. I assume that all the user don't have a password, return
a Token.

post http://localhost:3000/albums  
Set the token as header{token : token} to check all your albums. 

post http://localhost:3000/albums?id= 
Set the token as header{token : token} to check the specific album if this album is belong to you.

post http://localhost:3000/photo
Set the token as header{token : token} to check all your photos. 

post http://localhost:3000/photo?id=
Set the token as header{token : token} to check the specific photo if this photo is belong to you. 