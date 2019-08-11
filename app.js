const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

var mysql = require('mysql');

//change code to setup your database connection here
var con = mysql.createConnection({
    host: "localhost",
    user: "gary",
    password: "930412",
      database: "testDB"
  });

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to mysql server");
  });
//====================================
app.get('/',(req,res)=>{
    res.json({
        message: "get Success"
    });
});

app.post('/post',(req,res)=>{
    res.json({
        message: "Post Success"
    });
});

// get all users
app.post('/users',(req,res)=>{
    con.query("SELECT * FROM users", function (err, result, fields) {
        res.end(JSON.stringify(result)); 
    });
    
});
// log in 
app.post('/login',(req,res)=>{
    const userid = req.query.userid;
    con.query("SELECT * FROM users where id='"+userid+"'", function (err, result, fields) {
        const user = JSON.parse(JSON.stringify(result));
        jwt.sign(user[0],'secretkey',(err,token)=>{
            res.json({
                token
            });
        });        
    });
});
//verify token is valid 
function verifyToken(req,res,next){
    const Token = req.headers['token'];
    if(typeof Token !== 'undefined'){
        req.token = Token;
        next();
    }
    else{
        res.sendStatus(403);
    }
}
// get albums

app.post('/albums',verifyToken,(req,res)=>{
    jwt.verify(req.token, 'secretkey', (err, user)=>{
        if(err){
            res.sendStatus(403);
        } 
        else{
            if(req.query.id){ //handle /albums/:id
                con.query("SELECT * FROM albums where Id='"+req.query.id+"' AND userId='"+ user.id+"'", function (err, result, fields){
                    if(result.length==0){ 
                        res.json({
                            message: "The albums does not exist or you don't have Permission to access it."
                        });
                    }
                    else{
                        res.json(
                            result
                        )
                    }
                });

            }

            else{ //handle /albums
            con.query("SELECT * FROM albums where userId='"+user.id+"'", function (err, result, fields) {

                res.json(
                   result
                )
            });
        }   
        }
    });
});

//get photo

app.post('/photos',verifyToken,(req,res)=>{
    jwt.verify(req.token, 'secretkey', (err, user)=>{
        if(err){
            res.sendStatus(403);
        } 

        else{
            if(req.query.id){ //handle /photos/:id

                //verify if this photo belong to current user
                con.query("SELECT albumId FROM photos where id='"+req.query.id+"'", function (err, targetAlbum, fields) {
                    if(targetAlbum.length==0){
                        res.json({
                            message: "The photo does not exist."
                        });
                    }
                    else{
                        con.query("SELECT * FROM albums where id='"+targetAlbum[0].albumId+"' AND userId='"+ user.id+"'",function(err,result,fields){
                            if(result.length==0){
                                res.json({
                                    message: "You don't have Permission to access this photo."
                                });
                            }
                            else{
                                // return to photo
                                con.query("SELECT * FROM photos where id='"+req.query.id+"'",function(err,targetPhoto,fields){
                                    res.json(
                                        targetPhoto
                                    )
                                })
                                
                            }
                        })

                    }
                   
                });
            }
            else{  //handle /photos
                var photoList = [];
                con.query("SELECT id FROM albums where userId='"+user.id+"'", function (err, result, fields) {
                    for(i=0;i<result.length;i++){
                        con.query("SELECT * FROM photos where albumId='"+result[i].id+"'",function(err,subResult,fields){
                             for(j=0;j<subResult.length;j++){
                                photoList.push(subResult[j]);
                            }
                            if(i==result.length-1){
                                finish=1;
                            }
                        })
                    }
                })
                setTimeout(function(){ // a simple delay function, waiting the database and deal with Asynchronous problem
                    res.json(
                        photoList
                    )
                },2000);

            }
        }

    })
});

app.listen(3000);

